import * as store from './store';

export interface Post {
  id: string;
  title: string;
  topic: string;
  tags: string[];
  excerpt: string;
  cover: string;
  body: string;
  published: boolean;
  createdAt: string;
}

export interface BlogComment {
  id: string;
  postId: string;
  name: string;
  text: string;
  createdAt: string;
}

export interface Engagement {
  likes: number;
  dislikes: number;
  mine: 'like' | 'dislike' | null;
  comments: BlogComment[];
}

const newestFirst = (a: Post, b: Post) => String(b.createdAt).localeCompare(String(a.createdAt));

export async function listPosts(): Promise<Post[]> {
  const all = (await store.list('posts')) as unknown as Post[];
  return all.filter((p) => p.published).sort(newestFirst);
}

export async function getPost(id: string): Promise<Post | null> {
  const p = (await store.get('posts', id)) as unknown as Post | null;
  return p && p.published ? p : null;
}

export const readingMinutes = (body: string) => Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 200));

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

export async function getEngagement(postId: string, voter?: string): Promise<Engagement> {
  const [reactions, comments] = await Promise.all([store.list('reactions'), store.list('comments')]);
  const mine = reactions.filter((r) => r.postId === postId);
  return {
    likes: mine.filter((r) => r.value === 'like').length,
    dislikes: mine.filter((r) => r.value === 'dislike').length,
    mine: (voter && (mine.find((r) => r.voter === voter)?.value as 'like' | 'dislike')) || null,
    comments: (comments as unknown as BlogComment[])
      .filter((c) => c.postId === postId)
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
      .map(({ id, postId: p, name, text, createdAt }) => ({ id, postId: p, name, text, createdAt })),
  };
}

/** One reaction per visitor per post; sending the same value again (or 'none') removes it. */
export async function setReaction(postId: string, voter: string, value: 'like' | 'dislike' | 'none') {
  const reactions = await store.list('reactions');
  const existing = reactions.find((r) => r.postId === postId && r.voter === voter);
  if (value === 'none' || (existing && existing.value === value)) {
    if (existing) await store.remove('reactions', existing.id);
  } else if (existing) {
    await store.update('reactions', existing.id, { value });
  } else {
    await store.insert('reactions', { postId, voter, value });
  }
}

export async function addComment(postId: string, name: string, text: string) {
  return store.insert('comments', { postId, name, text }, 'comment');
}
