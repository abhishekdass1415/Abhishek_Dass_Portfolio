import { NextRequest } from 'next/server';
import { fail, ok, requireAdmin } from '@/lib/api';
import * as store from '@/lib/store';

const MAX_BYTES = 100 * 1024 * 1024; // 100 MB max for videos, images, and documents

/** Checks the file's real signature so a renamed script cannot be uploaded as an image. */
function sniff(buf: Buffer): string | null {
  const h = buf.subarray(0, 16);
  const ascii = (s: number, e: number) => h.subarray(s, e).toString('latin1');
  if (h[0] === 0xff && h[1] === 0xd8) return 'image/jpeg';
  if (ascii(1, 4) === 'PNG') return 'image/png';
  if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return 'image/webp';
  if (ascii(0, 3) === 'GIF') return 'image/gif';
  if (ascii(0, 4) === '%PDF') return 'application/pdf';
  if (ascii(4, 8) === 'ftyp') return 'video/mp4';
  if (h[0] === 0x1a && h[1] === 0x45 && h[2] === 0xdf && h[3] === 0xa3) return 'video/webm';
  return null;
}

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const items = await store.list('media');
  items.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  return ok(items);
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return fail('Upload failed');
  }
  const file = form.get('file');
  if (!(file instanceof File)) return fail('No file received');
  if (file.size > MAX_BYTES) return fail('File is too large (max 100 MB). For even larger videos, paste a YouTube/Vimeo link instead.');

  const buf = Buffer.from(await file.arrayBuffer());
  const type = sniff(buf);
  if (!type) return fail('Unsupported file. Use JPG, PNG, WebP, GIF, PDF, MP4 or WebM.');

  const doc = await store.insert('media', { name: file.name.slice(0, 120), type, size: buf.length }, 'file');
  await store.putBlob(doc.id, buf);
  return ok({ ...doc, url: `/api/media/${doc.id}` }, 201);
}
