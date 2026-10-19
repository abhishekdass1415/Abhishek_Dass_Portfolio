import { NextRequest } from 'next/server';
import { fail, ok, readJson, requireAdmin } from '@/lib/api';
import * as store from '@/lib/store';

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const items = await store.list('messages');
  items.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  return ok(items);
}
