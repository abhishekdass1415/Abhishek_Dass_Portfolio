'use client';

import { useState } from 'react';
import ThemeToggleAdmin from './ThemeToggleAdmin';

export default function LoginForm() {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Login failed');
      window.location.href = '/Maihehuadmin/dashboard';
    } catch (x) {
      setError(x instanceof Error ? x.message : 'Login failed');
      setBusy(false);
    }
  }

  return (
    <div className="login-box-wrap">
      <div className="login-top-bar">
        <ThemeToggleAdmin />
      </div>
      <form className="login" onSubmit={submit}>
        <h1>Admin login</h1>
        <p className="a-muted">Only the site owner can sign in.</p>
        <div className="a-field">
          <label htmlFor="u">Username</label>
          <input id="u" name="username" autoComplete="username" required autoFocus />
        </div>
        <div className="a-field">
          <label htmlFor="p">Password</label>
          <input id="p" name="password" type="password" autoComplete="current-password" required />
        </div>
        {error && <p className="a-error" role="alert">{error}</p>}
        <button className="a-btn a-btn-primary" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
