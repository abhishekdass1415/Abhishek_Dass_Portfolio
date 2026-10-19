import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { seedPortfolio } from './seed';
import { COLLECTIONS } from './schema';

/**
 * Tiny document store with two interchangeable drivers:
 *  - JSON file  (data/db.json)  : used when MONGODB_URI is empty. Zero setup.
 *  - MongoDB / Atlas            : used when MONGODB_URI is set. Use this on Vercel.
 */

export type Doc = Record<string, any> & { id: string };

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
const MONGO_URI = (process.env.MONGODB_URI || '').trim();

export const usingMongo = () => !!MONGO_URI;

interface FileShape {
  collections: Record<string, Doc[]>;
  singletons: Record<string, Record<string, any>>;
}

/* ───────────────────────── file driver ───────────────────────── */

let writeQueue: Promise<unknown> = Promise.resolve();

async function readFileDb(): Promise<FileShape> {
  try {
    const raw = await fs.readFile(DB_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return { collections: parsed.collections ?? {}, singletons: parsed.singletons ?? {} };
  } catch (e: any) {
    if (e.code === 'ENOENT') return { collections: {}, singletons: {} };
    throw e;
  }
}

/** Serialises read-modify-write cycles and swaps the file atomically. */
function mutateFileDb<T>(fn: (db: FileShape) => T | Promise<T>): Promise<T> {
  const run = async () => {
    const db = await readFileDb();
    const result = await fn(db);
    await fs.mkdir(DATA_DIR, { recursive: true });
    const tmp = DB_FILE + '.' + process.pid + '.tmp';
    await fs.writeFile(tmp, JSON.stringify(db, null, 2), 'utf8');
    await fs.rename(tmp, DB_FILE);
    return result;
  };
  const next = writeQueue.then(run, run);
  writeQueue = next.catch(() => undefined);
  return next;
}

/* ───────────────────────── mongo driver ───────────────────────── */

async function mongoDb() {
  const g = globalThis as any;
  if (!g.__mongoPromise) {
    const mongoose = (await import('mongoose')).default;
    g.__mongoPromise = mongoose
      .connect(MONGO_URI, { serverSelectionTimeoutMS: 5000, bufferCommands: false })
      .then((m) => m.connection.db!)
      .catch((e) => {
        g.__mongoPromise = null;
        throw e;
      });
  }
  return g.__mongoPromise as Promise<import('mongodb').Db>;
}

const strip = <T extends Record<string, any>>(d: T | null): T | null => {
  if (!d) return d;
  const { _id, ...rest } = d as any;
  return rest;
};

/* ───────────────────────── public API ───────────────────────── */

export function newId(hint?: string) {
  const slug = (hint || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  const rand = randomUUID().slice(0, 6);
  return slug ? `${slug}-${rand}` : randomUUID();
}

export async function list(col: string): Promise<Doc[]> {
  await ensureSeeded();
  if (usingMongo()) {
    const db = await mongoDb();
    const docs = await db.collection('c_' + col).find({}).toArray();
    return docs.map((d) => strip(d) as unknown as Doc);
  }
  const db = await readFileDb();
  return db.collections[col] ?? [];
}

export async function get(col: string, id: string): Promise<Doc | null> {
  const docs = await list(col);
  return docs.find((d) => d.id === id) ?? null;
}

export async function insert(col: string, data: Record<string, any>, idHint?: string): Promise<Doc> {
  await ensureSeeded();
  const existing = await list(col);
  const maxOrder = existing.reduce((m, d) => Math.max(m, typeof d.order === 'number' ? d.order : 0), 0);
  const doc: Doc = {
    ...data,
    id: newId(idHint),
    order: COLLECTIONS[col]?.manualOrder ? maxOrder + 1 : (data.order ?? 0),
    createdAt: new Date().toISOString(),
  };
  if (usingMongo()) {
    const db = await mongoDb();
    await db.collection('c_' + col).insertOne({ ...doc });
    return doc;
  }
  return mutateFileDb((db) => {
    (db.collections[col] ||= []).push(doc);
    return doc;
  });
}

export async function update(col: string, id: string, patch: Record<string, any>): Promise<Doc | null> {
  await ensureSeeded();
  if (usingMongo()) {
    const db = await mongoDb();
    const res = await db.collection('c_' + col).findOneAndUpdate({ id }, { $set: patch }, { returnDocument: 'after' });
    return strip(res as any) as Doc | null;
  }
  return mutateFileDb((db) => {
    const arr = db.collections[col] ?? [];
    const i = arr.findIndex((d) => d.id === id);
    if (i < 0) return null;
    arr[i] = { ...arr[i], ...patch, id };
    return arr[i];
  });
}

export async function remove(col: string, id: string): Promise<boolean> {
  await ensureSeeded();
  if (usingMongo()) {
    const db = await mongoDb();
    const r = await db.collection('c_' + col).deleteOne({ id });
    return r.deletedCount > 0;
  }
  return mutateFileDb((db) => {
    const arr = db.collections[col] ?? [];
    const next = arr.filter((d) => d.id !== id);
    db.collections[col] = next;
    return next.length !== arr.length;
  });
}

export async function reorder(col: string, ids: string[]): Promise<void> {
  await ensureSeeded();
  if (usingMongo()) {
    const db = await mongoDb();
    await Promise.all(ids.map((id, i) => db.collection('c_' + col).updateOne({ id }, { $set: { order: i + 1 } })));
    return;
  }
  await mutateFileDb((db) => {
    const arr = db.collections[col] ?? [];
    ids.forEach((id, i) => {
      const d = arr.find((x) => x.id === id);
      if (d) d.order = i + 1;
    });
  });
}

export async function getSingleton<T = Record<string, any>>(name: string): Promise<T | null> {
  await ensureSeeded();
  if (usingMongo()) {
    const db = await mongoDb();
    const d = await db.collection('singletons').findOne({ _id: name as any });
    return strip(d as any) as T | null;
  }
  const db = await readFileDb();
  return (db.singletons[name] as T) ?? null;
}

export async function setSingleton(name: string, data: Record<string, any>): Promise<void> {
  await ensureSeeded();
  if (usingMongo()) {
    const db = await mongoDb();
    await db.collection('singletons').updateOne({ _id: name as any }, { $set: data }, { upsert: true });
    return;
  }
  await mutateFileDb((db) => {
    db.singletons[name] = { ...(db.singletons[name] ?? {}), ...data };
  });
}

/* ───────────────────────── binary uploads ───────────────────────── */

export async function putBlob(id: string, buf: Buffer): Promise<void> {
  if (usingMongo()) {
    const db = await mongoDb();
    const { Binary } = await import('mongodb');
    await db.collection('media_blobs').replaceOne({ _id: id as any }, { _id: id as any, data: new Binary(buf) }, { upsert: true });
    return;
  }
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, id), buf);
}

export async function getBlob(id: string): Promise<Buffer | null> {
  if (!/^[a-z0-9-]+$/i.test(id)) return null;
  if (usingMongo()) {
    const db = await mongoDb();
    const d: any = await db.collection('media_blobs').findOne({ _id: id as any });
    return d ? Buffer.from(d.data.buffer) : null;
  }
  try {
    return await fs.readFile(path.join(UPLOAD_DIR, id));
  } catch {
    return null;
  }
}

export async function deleteBlob(id: string): Promise<void> {
  if (!/^[a-z0-9-]+$/i.test(id)) return;
  if (usingMongo()) {
    const db = await mongoDb();
    await db.collection('media_blobs').deleteOne({ _id: id as any });
    return;
  }
  await fs.rm(path.join(UPLOAD_DIR, id), { force: true });
}

/* ───────────────────────── first-run seeding ───────────────────────── */

let seeding: Promise<void> | null = null;

export function ensureSeeded(): Promise<void> {
  if (!seeding) {
    seeding = doSeed().catch((e) => {
      seeding = null;
      throw e;
    });
  }
  return seeding;
}

async function doSeed() {
  const { profile, ...collections } = seedPortfolio;
  const stamp = new Date().toISOString();
  const withStamp = (arr: any[]) => arr.map((d) => ({ ...d, createdAt: stamp }));

  if (usingMongo()) {
    const db = await mongoDb();
    const meta = db.collection('singletons');
    if (await meta.findOne({ _id: '_meta' as any })) return;
    for (const [name, items] of Object.entries(collections)) {
      if (items.length) await db.collection('c_' + name).insertMany(withStamp(items as any[]));
    }
    await meta.updateOne({ _id: 'profile' as any }, { $set: profile }, { upsert: true });
    await meta.insertOne({ _id: '_meta' as any, seededAt: stamp });
    return;
  }

  const db = await readFileDb();
  if (db.singletons._meta) return;
  await mutateFileDb((d) => {
    if (d.singletons._meta) return;
    for (const [name, items] of Object.entries(collections)) d.collections[name] = withStamp(items as any[]);
    d.singletons.profile = { ...profile };
    d.singletons._meta = { seededAt: stamp };
  });
}
