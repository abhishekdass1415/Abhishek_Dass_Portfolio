import { NextRequest } from 'next/server';
import { fail, ok, readJson, refreshSite, requireAdmin } from '@/lib/api';
import { COLLECTIONS } from '@/lib/schema';
import * as store from '@/lib/store';

type Ctx = { params: Promise<{ collection: string }> };

export async function POST(req: NextRequest, { params }: Ctx) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { collection } = await params;
  if (!COLLECTIONS[collection]) return fail('Unknown collection', 404);

  const body = await readJson(req);
  const ids = body?.ids;
  if (!Array.isArray(ids) || ids.some((i) => typeof i !== 'string')) return fail('ids must be an array of strings');

  await store.reorder(collection, ids as string[]);
  refreshSite();
  return ok({ ids });
}
