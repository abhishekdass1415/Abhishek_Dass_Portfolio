import { NextRequest } from 'next/server';
import { clientIp, rateLimit } from '@/lib/utils/auth';
import { fail, ok, readJson } from '@/lib/api';
import * as store from '@/lib/store';

import { sendNewMessageNotification } from '@/lib/email';

const clean = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);

export async function POST(req: NextRequest) {
  const limit = rateLimit('contact:' + clientIp(req), 5, 60 * 60 * 1000);
  if (!limit.ok) return fail('You have sent a few messages already. Please try again later.', 429);

  const body = await readJson(req);
  if (!body) return fail('Invalid request');

  // Honeypot: real visitors never fill this hidden field.
  if (clean(body.website, 200)) return ok({ sent: true });

  const name = clean(body.name, 100);
  const email = clean(body.email, 160);
  const message = clean(body.message, 4000);

  if (!name) return fail('Please tell me your name.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('Please enter a valid email address.');
  if (message.length < 5) return fail('Your message is a bit short.');

  await store.insert('messages', { name, email, message, read: false, replies: [] });

  // Send notification email to abhishekdass024@gmail.com (non-blocking)
  sendNewMessageNotification({ name, email, message }).catch((err) => {
    console.error('[contact] email notification failed:', err);
  });

  return ok({ sent: true });
}
