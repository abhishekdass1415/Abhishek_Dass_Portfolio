import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAuthenticated } from './utils/auth';

export const fail = (error: string, status = 400, extra?: Record<string, unknown>) =>
  NextResponse.json({ success: false, error, ...extra }, { status });

export const ok = (data?: unknown, status = 200) => NextResponse.json({ success: true, data }, { status });

/** Returns an error response unless the request is a same-origin call from the logged-in admin. */
export async function requireAdmin(req: Request): Promise<NextResponse | null> {
  const origin = req.headers.get('origin');
  if (origin && req.method !== 'GET') {
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
    try {
      if (new URL(origin).host !== host) return fail('Cross-origin request blocked', 403);
    } catch {
      return fail('Bad origin', 403);
    }
  }
  if (!(await isAuthenticated())) return fail('Unauthorized', 401);
  return null;
}

export async function readJson(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await req.json();
    return body && typeof body === 'object' && !Array.isArray(body) ? body : null;
  } catch {
    return null;
  }
}

/** Re-render the public site after content changes. */
export function refreshSite() {
  revalidatePath('/', 'layout');
}
