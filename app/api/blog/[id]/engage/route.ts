import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';
import { fail, readJson } from '@/lib/api';
import { addComment, getEngagement, getPost, setReaction } from '@/lib/blog';
import { clientIp, rateLimit } from '@/lib/utils/auth';

type Ctx = { params: Promise<{ id: string }> };

const VOTER_COOKIE = 'voter';

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  if (!(await getPost(id))) return fail('Post not found', 404);
  const voter = (await cookies()).get(VOTER_COOKIE)?.value;
  return NextResponse.json({ success: true, data: await getEngagement(id, voter) }, { headers: { 'Cache-Control': 'no-store' } });
}

/** Public endpoint: { action: 'react', value } or { action: 'comment', name, text, website(honeypot) } */
export async function POST(req: NextRequest, { params }: Ctx) {
  const origin = req.headers.get('origin');
  if (origin) {
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
    try {
      if (new URL(origin).host !== host) return fail('Cross-origin request blocked', 403);
    } catch {
      return fail('Bad origin', 403);
    }
  }

  const { id } = await params;
  if (!(await getPost(id))) return fail('Post not found', 404);
  const body = await readJson(req);
  if (!body) return fail('Invalid request');

  const jar = await cookies();
  let voter = jar.get(VOTER_COOKIE)?.value;
  const isNew = !voter || !/^[0-9a-f-]{36}$/.test(voter);
  if (isNew) voter = randomUUID();

  const limited = rateLimit(`blog:${body.action}:${clientIp(req)}`, body.action === 'comment' ? 5 : 40, 10 * 60 * 1000);
  if (!limited.ok) return fail('Too many requests. Please try again in a few minutes.', 429);

  if (body.action === 'react') {
    if (!['like', 'dislike', 'none'].includes(String(body.value))) return fail('Invalid reaction');
    await setReaction(id, voter!, body.value as 'like' | 'dislike' | 'none');
  } else if (body.action === 'comment') {
    if (body.website) return NextResponse.json({ success: true }); // honeypot: pretend it worked
    const name = String(body.name ?? '').trim().slice(0, 60);
    const text = String(body.text ?? '').trim();
    if (!name) return fail('Please enter your name');
    if (text.length < 2) return fail('Please write a comment');
    if (text.length > 1500) return fail('Comments are limited to 1500 characters');
    await addComment(id, name, text);
  } else {
    return fail('Unknown action');
  }

  const res = NextResponse.json({ success: true, data: await getEngagement(id, voter) });
  if (isNew) res.cookies.set(VOTER_COOKIE, voter!, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 365 });
  return res;
}
