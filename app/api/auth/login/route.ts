import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { clientIp, rateLimit, sessionCookie, signSession, verifyCredentials } from '@/lib/utils/auth';
import { fail, readJson } from '@/lib/api';

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const limit = rateLimit('login:' + ip, 8, 15 * 60 * 1000);
  if (!limit.ok) return fail('Too many attempts. Try again later.', 429, { retryAfter: limit.retryAfter });

  const body = await readJson(req);
  const username = String(body?.username ?? '');
  const password = String(body?.password ?? '');

  if (!verifyCredentials(username, password)) {
    await new Promise((r) => setTimeout(r, 600)); // slow down guessing
    return fail('Invalid username or password', 401);
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(sessionCookie(signSession()));
  return res;
}
