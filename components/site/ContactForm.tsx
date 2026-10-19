'use client';

import { useState } from 'react';
import { Icon } from './Icon';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json.error || 'Something went wrong. Please try again.');
      form.reset();
      setStatus('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setStatus('error');
    }
  }

  return (
    <form className="contact-form card" onSubmit={onSubmit} noValidate={false}>
      <div className="field">
        <label htmlFor="cf-name">Name</label>
        <input id="cf-name" name="name" type="text" autoComplete="name" required maxLength={100} placeholder="Your name" />
      </div>
      <div className="field">
        <label htmlFor="cf-email">Email</label>
        <input id="cf-email" name="email" type="email" autoComplete="email" required maxLength={160} placeholder="you@example.com" />
      </div>
      <div className="field">
        <label htmlFor="cf-message">Message</label>
        <textarea id="cf-message" name="message" rows={5} required minLength={5} maxLength={4000} placeholder="What are we building?" />
      </div>

      {/* Honeypot for bots: hidden from people and assistive tech */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send message'} <Icon name="arrowRight" />
      </button>

      <p className={`form-status ${status}`} role="status" aria-live="polite">
        {status === 'sent' && 'Message sent. Thank you, I will get back to you soon.'}
        {status === 'error' && error}
      </p>
    </form>
  );
}
