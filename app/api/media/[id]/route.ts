import { NextRequest, NextResponse } from 'next/server';
import { fail, ok, requireAdmin } from '@/lib/api';
import * as store from '@/lib/store';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const meta = await store.get('media', id);
  const buf = meta ? await store.getBlob(id) : null;
  if (!meta || !buf) return new NextResponse('Not found', { status: 404 });

  const headers: Record<string, string> = {
    'Content-Type': meta.type,
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'public, max-age=31536000, immutable',
    'X-Content-Type-Options': 'nosniff',
    'Content-Disposition': `inline; filename="${encodeURIComponent(meta.name)}"`,
  };

  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.get('range') || '');
  if (range && (range[1] || range[2])) {
    const size = buf.length;
    let start = range[1] ? parseInt(range[1], 10) : size - parseInt(range[2], 10);
    let end = range[1] && range[2] ? parseInt(range[2], 10) : size - 1;
    start = Math.max(0, start);
    end = Math.min(size - 1, end);
    if (start > end) return new NextResponse(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
    return new NextResponse(new Uint8Array(buf.subarray(start, end + 1)), {
      status: 206,
      headers: { ...headers, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': String(end - start + 1) },
    });
  }

  return new NextResponse(new Uint8Array(buf), { headers: { ...headers, 'Content-Length': String(buf.length) } });
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const { id } = await params;
  if (!(await store.remove('media', id))) return fail('Not found', 404);
  await store.deleteBlob(id);
  return ok({ id });
}
