import nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  from?: string;
}

export interface SendResult {
  ok: boolean;
  error?: string;
  messageId?: string;
}

const DEFAULT_NOTIFICATION_EMAIL = 'abhishekdass024@gmail.com';

export function getEmailConfig() {
  const notificationEmail =
    process.env.NOTIFICATION_EMAIL || process.env.CONTACT_TO_EMAIL || DEFAULT_NOTIFICATION_EMAIL;
  const smtpUser = process.env.SMTP_USER || DEFAULT_NOTIFICATION_EMAIL;
  const smtpPass = (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || '').trim();
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT || 465);
  const smtpSecure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : smtpPort === 465;
  const fromName = process.env.EMAIL_FROM_NAME || 'Abhishek Dass';
  const fromEmail = process.env.CONTACT_FROM_EMAIL || `"${fromName}" <${smtpUser}>`;
  const resendApiKey = (process.env.RESEND_API_KEY || '').trim();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const isConfigured = Boolean(smtpPass || resendApiKey);

  return {
    notificationEmail,
    smtpUser,
    smtpPass,
    smtpHost,
    smtpPort,
    smtpSecure,
    fromEmail,
    resendApiKey,
    siteUrl,
    isConfigured,
  };
}

/**
 * Sends an email using Nodemailer (SMTP/Gmail) as primary,
 * or Resend API if configured and SMTP is missing.
 */
export async function sendEmail(opts: EmailOptions): Promise<SendResult> {
  const cfg = getEmailConfig();

  // 1. Try Nodemailer SMTP (recommended for Gmail App Password)
  if (cfg.smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: cfg.smtpHost,
        port: cfg.smtpPort,
        secure: cfg.smtpSecure,
        auth: {
          user: cfg.smtpUser,
          pass: cfg.smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: opts.from || cfg.fromEmail,
        to: opts.to,
        subject: opts.subject,
        text: opts.text,
        html: opts.html,
        replyTo: opts.replyTo,
      });

      return { ok: true, messageId: info.messageId };
    } catch (err: any) {
      console.error('[email:smtp] Failed to send email:', err);
      return { ok: false, error: err?.message || 'SMTP delivery failed' };
    }
  }

  // 2. Fallback to Resend API if key is present
  if (cfg.resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cfg.resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: opts.from || process.env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>',
          to: Array.isArray(opts.to) ? opts.to : [opts.to],
          reply_to: opts.replyTo,
          subject: opts.subject,
          text: opts.text,
          html: opts.html,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errorMsg = json?.message || `Resend error (${res.status})`;
        console.error('[email:resend] Failed to send email:', errorMsg);
        return { ok: false, error: errorMsg };
      }

      return { ok: true, messageId: json.id };
    } catch (err: any) {
      console.error('[email:resend] Request error:', err);
      return { ok: false, error: err?.message || 'Resend request failed' };
    }
  }

  // 3. Neither configured
  const msg =
    'Email credentials missing. Please set SMTP_PASS (Gmail 16-character App Password) or RESEND_API_KEY in .env.local.';
  console.warn(`[email] ${msg}`);
  return { ok: false, error: msg };
}

/**
 * Sends a notification email to Abhishek (abhishekdass024@gmail.com)
 * whenever a new contact message is received.
 */
export async function sendNewMessageNotification(data: {
  name: string;
  email: string;
  message: string;
}): Promise<SendResult> {
  const cfg = getEmailConfig();
  const dateStr = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const subject = `New Portfolio Message from ${data.name}`;

  const text = [
    `You received a new message on your portfolio:`,
    ``,
    `From: ${data.name} <${data.email}>`,
    `Date: ${dateStr}`,
    ``,
    `Message:`,
    `${data.message}`,
    ``,
    `---`,
    `To reply, you can reply directly to this email or visit your admin dashboard:`,
    `${cfg.siteUrl}/Maihehuadmin`,
  ].join('\n');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0c0d10; color: #f4f4ee; margin: 0; padding: 24px; }
    .card { max-width: 580px; margin: 0 auto; background-color: #15171d; border: 2px solid #2e3440; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
    .header { background: #ffd500; color: #111216; padding: 18px 24px; font-weight: 800; font-size: 1.15rem; letter-spacing: 0.5px; }
    .content { padding: 24px; }
    .meta { margin-bottom: 20px; border-bottom: 1px solid #2e3440; padding-bottom: 16px; }
    .meta p { margin: 6px 0; font-size: 0.95rem; color: #959aa6; }
    .meta strong { color: #f4f4ee; }
    .meta a { color: #ffd500; text-decoration: none; }
    .bubble { background-color: #0c0d10; border-left: 4px solid #ffd500; padding: 16px; border-radius: 4px; font-size: 1rem; line-height: 1.6; white-space: pre-wrap; color: #f4f4ee; margin: 18px 0; }
    .cta-row { margin-top: 24px; display: flex; gap: 12px; }
    .btn { display: inline-block; background: #ffd500; color: #111216 !important; font-weight: 700; text-decoration: none; padding: 10px 18px; border-radius: 4px; font-size: 0.9rem; }
    .footer { padding: 16px 24px; font-size: 0.8rem; color: #666a75; border-top: 1px solid #222630; background: #111216; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">New Portfolio Message</div>
    <div class="content">
      <div class="meta">
        <p><strong>Sender:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>
        <p><strong>Received:</strong> ${escapeHtml(dateStr)}</p>
      </div>
      <p style="margin: 0; font-weight: 600; color: #ffd500; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 1px;">Message Content</p>
      <div class="bubble">${escapeHtml(data.message)}</div>
      <div class="cta-row">
        <a class="btn" href="${cfg.siteUrl}/Maihehuadmin">Open Admin Dashboard</a>
      </div>
    </div>
    <div class="footer">
      Tip: You can hit reply directly in your email client to write back to ${escapeHtml(data.name)} (${escapeHtml(data.email)}).
    </div>
  </div>
</body>
</html>
`;

  return sendEmail({
    to: cfg.notificationEmail,
    subject,
    text,
    html,
    replyTo: data.email,
  });
}

/**
 * Sends a reply email from Abhishek to the user.
 */
export async function sendUserReplyEmail(data: {
  toEmail: string;
  toName: string;
  subject?: string;
  replyText: string;
  originalMessage?: string;
  originalDate?: string;
}): Promise<SendResult> {
  const cfg = getEmailConfig();
  const subject =
    (data.subject || '').trim() || `Re: Your message to Abhishek Dass`;

  const formattedOriginalDate = data.originalDate
    ? new Date(data.originalDate).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : '';

  const textLines = [
    `Hi ${data.toName},`,
    ``,
    data.replyText,
    ``,
    `Best regards,`,
    `Abhishek Dass`,
    `${cfg.siteUrl}`,
  ];

  if (data.originalMessage) {
    textLines.push(
      ``,
      `----------------------------------------`,
      `Original Message${formattedOriginalDate ? ` (${formattedOriginalDate})` : ''}:`,
      data.originalMessage
        .split('\n')
        .map((l) => `> ${l}`)
        .join('\n')
    );
  }

  const text = textLines.join('\n');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4ee; color: #111216; margin: 0; padding: 24px; }
    .card { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 2px solid #111216; border-radius: 6px; overflow: hidden; box-shadow: 4px 4px 0 #111216; }
    .header { background: #ffd500; color: #111216; padding: 20px 24px; border-bottom: 2px solid #111216; }
    .header h1 { margin: 0; font-size: 1.25rem; font-weight: 800; letter-spacing: -0.3px; }
    .header p { margin: 4px 0 0; font-size: 0.85rem; font-weight: 600; opacity: 0.85; }
    .content { padding: 28px 24px; font-size: 1rem; line-height: 1.6; color: #111216; }
    .greeting { font-weight: 700; margin-bottom: 16px; font-size: 1.05rem; }
    .body-text { white-space: pre-wrap; margin-bottom: 24px; color: #1b1d22; }
    .signoff { margin-top: 24px; border-top: 1px solid #e0e0d8; padding-top: 16px; font-size: 0.95rem; }
    .quote-box { margin-top: 28px; background: #f8f8f4; border-left: 4px solid #959aa6; padding: 14px 16px; border-radius: 2px; }
    .quote-title { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; color: #666a75; margin-bottom: 8px; }
    .quote-body { font-size: 0.9rem; color: #494d58; white-space: pre-wrap; line-height: 1.5; font-style: italic; }
    .footer { padding: 14px 24px; font-size: 0.8rem; color: #767a85; background: #fafaf7; border-top: 1px solid #e5e5dc; text-align: center; }
    .footer a { color: #111216; font-weight: 600; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>Abhishek Dass</h1>
      <p>Motorsports &amp; Tech Portfolio</p>
    </div>
    <div class="content">
      <div class="greeting">Hi ${escapeHtml(data.toName)},</div>
      <div class="body-text">${escapeHtml(data.replyText)}</div>
      
      <div class="signoff">
        <strong>Best regards,</strong><br>
        Abhishek Dass<br>
        <a href="${cfg.siteUrl}" style="color: #111216; font-size: 0.88rem; text-decoration: underline;">${escapeHtml(cfg.siteUrl)}</a>
      </div>

      ${
        data.originalMessage
          ? `
      <div class="quote-box">
        <div class="quote-title">In reply to your message${formattedOriginalDate ? ` sent on ${escapeHtml(formattedOriginalDate)}` : ''}:</div>
        <div class="quote-body">${escapeHtml(data.originalMessage)}</div>
      </div>
      `
          : ''
      }
    </div>
    <div class="footer">
      Sent from <a href="${cfg.siteUrl}">${escapeHtml(cfg.siteUrl)}</a> • Reply directly to this email to continue the conversation.
    </div>
  </div>
</body>
</html>
`;

  return sendEmail({
    to: data.toEmail,
    subject,
    text,
    html,
    replyTo: cfg.smtpUser || DEFAULT_NOTIFICATION_EMAIL,
  });
}

function escapeHtml(str: string): string {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
