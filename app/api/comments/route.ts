import { NextRequest } from 'next/server';
import { ok, requireAdmin } from '@/lib/api';
import * as store from '@/lib/store';

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const [comments, posts] = await Promise.all([store.list('comments'), store.list('posts')]);
  const titles = new Map(posts.map((p) => [p.id, p.title as string]));
  comments.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  return ok(comments.map((c) => ({ ...c, postTitle: titles.get(c.postId) ?? '(deleted post)' })));
}
