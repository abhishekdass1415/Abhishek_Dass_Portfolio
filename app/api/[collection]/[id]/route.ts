import { NextRequest } from 'next/server';
import { fail, ok, readJson, refreshSite, requireAdmin } from '@/lib/api';
import { COLLECTIONS, sanitize } from '@/lib/schema';
import * as store from '@/lib/store';

type Ctx = { params: Promise<{ collection: string; id: string }> };

export async function PUT(req: NextRequest, { params }: Ctx) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { collection, id } = await params;
  const def = COLLECTIONS[collection];
  if (!def) return fail('Unknown collection', 404);

  const body = await readJson(req);
  if (!body) return fail('Invalid JSON body');
  const result = sanitize(def.fields, body, true);
  if (!result.ok) return fail(result.error);

  const doc = await store.update(collection, id, result.data);
  if (!doc) return fail('Not found', 404);
  refreshSite();
  return ok(doc);
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { collection, id } = await params;
  if (!COLLECTIONS[collection]) return fail('Unknown collection', 404);
  const removed = await store.remove(collection, id);
  if (!removed) return fail('Not found', 404);
  refreshSite();
  return ok({ id });
}
