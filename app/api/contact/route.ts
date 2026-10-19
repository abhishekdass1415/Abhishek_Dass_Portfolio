import { NextRequest } from 'next/server';
import { clientIp, rateLimit } from '@/lib/utils/auth';
import { fail, ok, readJson } from '@/lib/api';
import * as store from '@/lib/store';

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

  await store.insert('messages', { name, email, message, read: false });

  // Optional email notification through Resend (no extra dependency needed).
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (key && to) {
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>',
        to: [to],
        reply_to: email,
        subject: `New portfolio message from ${name}`,
        text: `${message}\n\nFrom: ${name} <${email}>`,
      }),
    }).catch((e) => console.error('[contact] email notification failed', e));
  }

  return ok({ sent: true });
}
