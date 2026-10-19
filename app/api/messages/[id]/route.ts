import { NextRequest } from 'next/server';
import { fail, ok, readJson, requireAdmin } from '@/lib/api';
import * as store from '@/lib/store';

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Ctx) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const { id } = await params;
  const body = await readJson(req);
  const doc = await store.update('messages', id, { read: body?.read !== false });
  return doc ? ok(doc) : fail('Not found', 404);
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const { id } = await params;
  return (await store.remove('messages', id)) ? ok({ id }) : fail('Not found', 404);
}
