import { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';
import { fail, ok, readJson, requireAdmin } from '@/lib/api';
import * as store from '@/lib/store';
import { sendUserReplyEmail } from '@/lib/email';

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Ctx) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  const msg = await store.get('messages', id);
  if (!msg) return fail('Message not found', 404);

  const body = await readJson(req);
  if (!body) return fail('Invalid request body');

  const replyText = String(body.message ?? '').trim();
  const subject = String(body.subject ?? '').trim();

  if (!replyText || replyText.length < 2) {
    return fail('Please enter a reply message.');
  }

  const recordOnly = Boolean(body.recordOnly);

  // Attempt sending the email to the user if not recordOnly
  if (!recordOnly) {
    const sendResult = await sendUserReplyEmail({
      toEmail: msg.email,
      toName: msg.name,
      subject: subject || undefined,
      replyText,
      originalMessage: msg.message,
      originalDate: msg.createdAt,
    });

    if (!sendResult.ok) {
      return fail(
        sendResult.error || 'Failed to send email. Check API settings.',
        502
      );
    }
  }

  // Record the reply in the message document
  const replyEntry = {
    id: randomUUID(),
    subject: subject || `Re: Your message to Abhishek Dass`,
    message: replyText,
    sentAt: new Date().toISOString(),
  };

  const existingReplies = Array.isArray(msg.replies) ? msg.replies : [];
  const updatedDoc = await store.update('messages', id, {
    read: true,
    replies: [...existingReplies, replyEntry],
    lastRepliedAt: replyEntry.sentAt,
  });

  return ok(updatedDoc);
}
