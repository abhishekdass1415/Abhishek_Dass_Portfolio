import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { createHash, timingSafeEqual } from 'crypto';

/**
 * Single fixed admin account, configured only through environment variables
 * (ADMIN_USERNAME / ADMIN_PASSWORD). There is no registration endpoint.
 */

export const COOKIE_NAME = 'auth-token';
const SESSION_SECONDS = 60 * 60 * 2; // 2 hours max session

function secret(): string {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 16) throw new Error('JWT_SECRET must be set (16+ characters) in the environment.');
  return s;
}

const digest = (s: string) => createHash('sha256').update(s).digest();
const safeEqual = (a: string, b: string) => timingSafeEqual(digest(a), digest(b));

/** Tolerates markdown-style underscores around the username (e.g. "__Abhishek_Dass__"). */
const normalizeUser = (u: string) => u.trim().replace(/^_+|_+$/g, '').toLowerCase();

export function verifyCredentials(username: string, password: string): boolean {
  const u = process.env.ADMIN_USERNAME;
  let p = process.env.ADMIN_PASSWORD;
  if (!u || !p) return false;
  // If the .env file wrapped the password in double/single quotes, unwrap them
  if ((p.startsWith('"') && p.endsWith('"')) || (p.startsWith("'") && p.endsWith("'"))) {
    p = p.slice(1, -1);
  }
  // Evaluate both so timing does not reveal which one was wrong.
  const userOk = safeEqual(normalizeUser(username), normalizeUser(u));
  const passOk = safeEqual(password, p);
  return userOk && passOk;
}

export function signSession(): string {
  return jwt.sign({ role: 'admin' }, secret(), { expiresIn: SESSION_SECONDS });
}

export const sessionCookie = (token: string) => ({
  name: COOKIE_NAME,
  value: token,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
});

export async function isAuthenticated(): Promise<boolean> {
  try {
    const token = (await cookies()).get(COOKIE_NAME)?.value;
    if (!token) return false;
    const payload = jwt.verify(token, secret()) as { role?: string };
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

/* ───────── tiny in-memory rate limiter (per server instance) ───────── */

const hits = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string, max: number, windowMs: number): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const rec = hits.get(key);
  if (!rec || rec.reset < now) {
    hits.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }
  rec.count++;
  if (hits.size > 5000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
  return rec.count > max ? { ok: false, retryAfter: Math.ceil((rec.reset - now) / 1000) } : { ok: true, retryAfter: 0 };
}

export function clientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || 'local';
}
