import { NextRequest } from 'next/server';
import { fail, ok, requireAdmin } from '@/lib/api';
import * as store from '@/lib/store';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const { id } = await params;
  if (!(await store.remove('comments', id))) return fail('Not found', 404);
  return ok({ id });
}
