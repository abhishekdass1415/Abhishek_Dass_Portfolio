import { NextRequest } from 'next/server';
import { fail, ok, readJson, refreshSite, requireAdmin } from '@/lib/api';
import { COLLECTIONS, sanitize } from '@/lib/schema';
import * as store from '@/lib/store';
import { isAuthenticated } from '@/lib/utils/auth';

type Ctx = { params: Promise<{ collection: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { collection } = await params;
  if (!COLLECTIONS[collection]) return fail('Unknown collection', 404);
  let items = await store.list(collection);
  if (collection === 'posts' && !(await isAuthenticated())) items = items.filter((p) => p.published);
  items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return ok(items);
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { collection } = await params;
  const def = COLLECTIONS[collection];
  if (!def) return fail('Unknown collection', 404);

  const body = await readJson(req);
  if (!body) return fail('Invalid JSON body');
  const result = sanitize(def.fields, body);
  if (!result.ok) return fail(result.error);

  const hint = String(result.data.title ?? result.data.name ?? result.data.role ?? '');
  const doc = await store.insert(collection, result.data, hint);
  refreshSite();
  return ok(doc, 201);
}
