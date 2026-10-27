'use client';

import { useCallback, useEffect, useState } from 'react';
import { COLLECTIONS, PROFILE_FIELDS, ABOUT_FIELDS, CONTACT_FIELDS, SEO_FIELDS, type FieldDef } from '@/lib/schema';
import { byOrder, byRecency, formatMonth } from '@/lib/sort';
import { api } from './FieldInput';
import EditModal from './EditModal';
import { Icon } from '@/components/site/Icon';

type Doc = Record<string, any> & { id: string };

/* ───────────── Profile: one card per section, each with a pencil ───────────── */

const PROFILE_SECTIONS: { title: string; hint: string; fields: FieldDef[] }[] = [
  { title: 'Intro (hero)', hint: 'Name, headline, tagline, rotating roles and photo', fields: PROFILE_FIELDS },
  { title: 'About', hint: 'Bio and quick facts', fields: ABOUT_FIELDS },
  { title: 'Contact & social links', hint: 'Email, resume, LinkedIn, GitHub…', fields: CONTACT_FIELDS },
  { title: 'SEO & footer', hint: 'Google title/description, footer note', fields: SEO_FIELDS },
];

export function ProfilePanel() {
  const [profile, setProfile] = useState<Doc | null>(null);
  const [editing, setEditing] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/api/profile').then(setProfile).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="a-error">{error}</p>;
  if (!profile) return <p className="a-muted">Loading…</p>;

  const show = (f: FieldDef) => {
    const v = profile[f.key];
    const text = Array.isArray(v) ? v.join(' · ') : String(v ?? '');
    return text || <em>empty</em>;
  };

  return (
    <div className="stack">
      {PROFILE_SECTIONS.map((s, i) => (
        <section key={s.title} className="a-card">
          <header className="a-card-head">
            <div>
              <h2>{s.title}</h2>
              <p className="a-muted">{s.hint}</p>
            </div>
            <button className="pencil" onClick={() => setEditing(i)} aria-label={`Edit ${s.title}`}>
              <Icon name="pencil" size={18} />
            </button>
          </header>
          <dl className="summary">
            {s.fields.map((f) => (
              <div key={f.key}>
                <dt>{f.label}</dt>
                <dd>{f.type === 'image' && profile[f.key] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile[f.key]} alt="" className="thumb" />
                ) : show(f)}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}

      {editing !== null && (
        <EditModal
          title={`Edit ${PROFILE_SECTIONS[editing].title}`}
          fields={PROFILE_SECTIONS[editing].fields}
          initial={profile}
          onClose={() => setEditing(null)}
          onSave={async (v) => setProfile(await api('/api/profile', 'PUT', v))}
        />
      )}
    </div>
  );
}

/* ───────────── Collections: list + add / edit / delete / reorder ───────────── */

function label(name: string, d: Doc): { title: string; sub: string } {
  switch (name) {
    case 'stats':
      return { title: `${d.value} · ${d.label}`, sub: '' };
    case 'projects':
      return { title: d.title, sub: [d.category, d.year, d.featured ? 'Featured' : ''].filter(Boolean).join(' · ') };
    case 'experience':
      return { title: d.role, sub: `${d.company} · ${formatMonth(d.start)} – ${d.current || !d.end ? 'Present' : formatMonth(d.end)}` };
    case 'education':
      return { title: d.degree, sub: d.school };
    case 'skills':
      return { title: d.name, sub: `${d.category} · ${d.level}` };
    case 'goals':
      return { title: d.title, sub: d.type };
    case 'posts':
      return { title: d.title, sub: [d.topic, d.published ? 'Published' : 'Draft', d.createdAt ? new Date(d.createdAt).toLocaleDateString() : ''].filter(Boolean).join(' · ') };
    default:
      return { title: d.title, sub: [d.kind, d.year].filter(Boolean).join(' · ') };
  }
}

export function CollectionPanel({ name }: { name: string }) {
  const def = COLLECTIONS[name];
  const [items, setItems] = useState<Doc[] | null>(null);
  const [editing, setEditing] = useState<Doc | 'new' | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const data: Doc[] = await api(`/api/${name}`);
      setItems(data.sort((def.manualOrder ? byOrder : byRecency) as (a: Doc, b: Doc) => number));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    }
  }, [name, def.manualOrder]);

  useEffect(() => {
    setItems(null);
    setEditing(null);
    load();
  }, [load]);

  async function remove(d: Doc) {
    if (!confirm(`Delete "${label(name, d).title}"? This cannot be undone.`)) return;
    try {
      await api(`/api/${name}/${d.id}`, 'DELETE');
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  }

  async function move(i: number, dir: -1 | 1) {
    if (!items) return;
    const next = [...items];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
    try {
      await api(`/api/${name}/reorder`, 'POST', { ids: next.map((d) => d.id) });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Reorder failed');
      load();
    }
  }

  return (
    <div>
      <div className="panel-head">
        <p className="a-muted">
          {def.manualOrder ? 'Use the arrows to change the order shown on your site.' : 'Sorted automatically, newest first.'}
        </p>
        <button className="a-btn a-btn-primary" onClick={() => setEditing('new')}>
          <Icon name="plus" size={16} /> Add {def.singular}
        </button>
      </div>
      {error && <p className="a-error">{error}</p>}
      {!items ? (
        <p className="a-muted">Loading…</p>
      ) : items.length === 0 ? (
        <p className="a-empty">Nothing here yet. Add your first {def.singular}.</p>
      ) : (
        <ul className="rows">
          {items.map((d, i) => {
            const l = label(name, d);
            return (
              <li key={d.id} className="row">
                <div className="row-main">
                  <strong>{l.title}</strong>
                  {l.sub && <span className="a-muted">{l.sub}</span>}
                </div>
                <div className="row-actions">
                  {def.manualOrder && (
                    <>
                      <button className="pencil" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                        <Icon name="up" size={16} />
                      </button>
                      <button className="pencil" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down">
                        <Icon name="down" size={16} />
                      </button>
                    </>
                  )}
                  <button className="pencil" onClick={() => setEditing(d)} aria-label="Edit">
                    <Icon name="pencil" size={16} />
                  </button>
                  <button className="pencil danger" onClick={() => remove(d)} aria-label="Delete">
                    <Icon name="trash" size={16} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {editing && (
        <EditModal
          title={editing === 'new' ? `Add ${def.singular}` : `Edit ${def.singular}`}
          fields={def.fields}
          initial={editing === 'new' ? {} : editing}
          onClose={() => setEditing(null)}
          onSave={async (v) => {
            if (editing === 'new') await api(`/api/${name}`, 'POST', v);
            else await api(`/api/${name}/${editing.id}`, 'PUT', v);
            await load();
          }}
        />
      )}
    </div>
  );
}

/* ───────────── Messages ───────────── */

export function MessagesPanel() {
  const [items, setItems] = useState<Doc[] | null>(null);
  const [replyingTo, setReplyingTo] = useState<Doc | null>(null);
  const [replySubject, setReplySubject] = useState('');
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [replyError, setReplyError] = useState('');
  const [toast, setToast] = useState('');

  const load = useCallback(() => api<Doc[]>('/api/messages').then(setItems), []);
  useEffect(() => {
    load();
  }, [load]);

  // Handle escape key to close reply modal
  useEffect(() => {
    if (!replyingTo) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !sending) setReplyingTo(null);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [replyingTo, sending]);

  function openReply(m: Doc) {
    setReplyingTo(m);
    setReplySubject(`Re: Message from ${m.name} - Abhishek Dass`);
    setReplyText('');
    setReplyError('');
  }

  async function handleSendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyingTo) return;
    if (!replyText.trim()) {
      setReplyError('Please enter your reply.');
      return;
    }
    setSending(true);
    setReplyError('');
    try {
      await api(`/api/messages/${replyingTo.id}/reply`, 'POST', {
        subject: replySubject,
        message: replyText,
      });
      const recipient = replyingTo.email;
      setReplyingTo(null);
      setToast(`Email reply successfully sent to ${recipient}!`);
      setTimeout(() => setToast(''), 5000);
      await load();
    } catch (err: any) {
      setReplyError(err?.message || 'Failed to send reply email.');
    } finally {
      setSending(false);
    }
  }

  async function handleOpenInGmail() {
    if (!replyingTo || !replyText.trim()) {
      setReplyError('Please enter your reply first.');
      return;
    }
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      replyingTo.email
    )}&su=${encodeURIComponent(replySubject)}&body=${encodeURIComponent(replyText)}`;
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');

    try {
      await api(`/api/messages/${replyingTo.id}/reply`, 'POST', {
        subject: replySubject,
        message: replyText,
        recordOnly: true,
      });
      const recipient = replyingTo.email;
      setReplyingTo(null);
      setToast(`Reply recorded & opened in Gmail for ${recipient}!`);
      setTimeout(() => setToast(''), 5000);
      await load();
    } catch {
      // opened in Gmail
    }
  }

  if (!items) return <p className="a-muted">Loading…</p>;
  if (!items.length) return <p className="a-empty">No messages yet. Messages from your contact form appear here.</p>;

  return (
    <div>
      {toast && (
        <div className="a-toast-banner" role="status">
          <Icon name="check" size={16} /> {toast}
        </div>
      )}

      <ul className="rows">
        {items.map((m) => {
          const replies: Array<{ id: string; subject: string; message: string; sentAt: string }> =
            Array.isArray(m.replies) ? m.replies : [];

          return (
            <li key={m.id} className={`row msg${m.read ? '' : ' unread'}`}>
              <div className="row-main">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <strong>
                    {m.name} <a href={`mailto:${m.email}`}>{m.email}</a>
                  </strong>
                  {replies.length > 0 && (
                    <span className="msg-badge replied" title={`${replies.length} reply sent`}>
                      <Icon name="check" size={12} /> Replied ({replies.length})
                    </span>
                  )}
                  {!m.read && (
                    <span className="msg-badge" style={{ background: '#ffd500', color: '#111216' }}>
                      New
                    </span>
                  )}
                </div>
                <span className="a-muted">{new Date(m.createdAt).toLocaleString()}</span>
                <p>{m.message}</p>

                {replies.length > 0 && (
                  <div className="msg-replies">
                    <div className="msg-replies-head">
                      <strong style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Replies Sent via Email ({replies.length}):
                      </strong>
                    </div>
                    {replies.map((r, idx) => (
                      <div key={r.id || idx} className="msg-reply-item">
                        <div className="msg-reply-meta">
                          <strong style={{ color: 'var(--a-ink)' }}>{r.subject || 'Reply'}</strong>
                          <span className="a-muted">{new Date(r.sentAt).toLocaleString()}</span>
                        </div>
                        <p className="msg-reply-body">{r.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="row-actions">
                <button
                  type="button"
                  className="a-btn a-btn-primary a-btn-sm"
                  onClick={() => openReply(m)}
                  title={`Reply to ${m.name} via email`}
                >
                  <Icon name="reply" size={14} /> Reply
                </button>
                <button
                  className="pencil"
                  onClick={async () => {
                    await api(`/api/messages/${m.id}`, 'PUT', { read: !m.read });
                    load();
                  }}
                  aria-label={m.read ? 'Mark unread' : 'Mark read'}
                  title={m.read ? 'Mark unread' : 'Mark read'}
                >
                  <Icon name="check" size={16} />
                </button>
                <button
                  className="pencil danger"
                  onClick={async () => {
                    if (confirm('Delete this message?')) {
                      await api(`/api/messages/${m.id}`, 'DELETE');
                      load();
                    }
                  }}
                  aria-label="Delete"
                  title="Delete message"
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Reply Modal */}
      {replyingTo && (
        <div className="modal-back" onMouseDown={() => !sending && setReplyingTo(null)}>
          <form
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Reply to ${replyingTo.name}`}
            onMouseDown={(e) => e.stopPropagation()}
            onSubmit={handleSendReply}
          >
            <header className="modal-head">
              <h2>Reply to {replyingTo.name}</h2>
              <button
                type="button"
                className="x"
                onClick={() => !sending && setReplyingTo(null)}
                aria-label="Close"
              >
                ×
              </button>
            </header>

            <div className="modal-body" style={{ display: 'grid', gap: '1rem' }}>
              <div className="reply-recipient-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <strong>To:</strong> {replyingTo.name} &lt;{replyingTo.email}&gt;
                  </div>
                  <span className="a-muted">{new Date(replyingTo.createdAt).toLocaleString()}</span>
                </div>
                <div className="reply-original-quote">
                  <span className="quote-label">Original Message:</span>
                  <p>{replyingTo.message}</p>
                </div>
              </div>

              <div className="a-field">
                <label htmlFor="reply-subject">Subject</label>
                <input
                  id="reply-subject"
                  type="text"
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  placeholder="Subject of email reply..."
                  required
                />
              </div>

              <div className="a-field">
                <label htmlFor="reply-text">Your Email Reply</label>
                <textarea
                  id="reply-text"
                  rows={6}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Hi ${replyingTo.name},\n\nThank you for reaching out...`}
                  required
                  autoFocus
                />
                <small>
                  This reply will be sent directly as an email to <strong>{replyingTo.email}</strong>.
                </small>
              </div>

              {replyError && <p className="a-error">{replyError}</p>}
            </div>

            <footer className="modal-foot" style={{ flexWrap: 'wrap', gap: '0.6rem' }}>
              <button
                type="button"
                className="a-btn a-btn-ghost"
                onClick={() => setReplyingTo(null)}
                disabled={sending}
              >
                Cancel
              </button>
              <button
                type="button"
                className="a-btn a-btn-ghost"
                onClick={handleOpenInGmail}
                disabled={sending || !replyText.trim()}
                title="Open directly in Gmail with this reply and mark replied"
              >
                <Icon name="mail" size={15} /> Send via Gmail
              </button>
              <button
                type="submit"
                className="a-btn a-btn-primary"
                disabled={sending || !replyText.trim()}
              >
                <Icon name="send" size={16} /> {sending ? 'Sending email…' : 'Send via Resend API'}
              </button>
            </footer>
          </form>
        </div>
      )}
    </div>
  );
}

/* ───────────── Media library ───────────── */

export function MediaPanel() {
  const [items, setItems] = useState<Doc[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const load = useCallback(() => api<Doc[]>('/api/media').then(setItems), []);
  useEffect(() => {
    load();
  }, [load]);

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError('');
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/media', { method: 'POST', body: fd });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) setError(json.error || 'Upload failed');
    setBusy(false);
    e.target.value = '';
    load();
  }

  return (
    <div>
      <div className="panel-head">
        <p className="a-muted">Images, videos (≤12 MB) and PDFs. Copy a link and paste it into any field, or upload straight from a form.</p>
        <label className="a-btn a-btn-primary">
          <Icon name="upload" size={16} /> {busy ? 'Uploading…' : 'Upload file'}
          <input type="file" hidden onChange={upload} />
        </label>
      </div>
      {error && <p className="a-error">{error}</p>}
      {!items ? (
        <p className="a-muted">Loading…</p>
      ) : !items.length ? (
        <p className="a-empty">No uploads yet.</p>
      ) : (
        <ul className="media-grid">
          {items.map((m) => {
            const url = `/api/media/${m.id}`;
            return (
              <li key={m.id} className="a-card media">
                <div className="media-thumb">
                  {m.type.startsWith('image/') ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={url} alt="" />
                  ) : (
                    <span className="mono">{m.type.split('/')[1].toUpperCase()}</span>
                  )}
                </div>
                <p className="media-name">{m.name}</p>
                <div className="row-actions">
                  <button className="a-btn a-btn-ghost" onClick={() => navigator.clipboard.writeText(url)}>
                    Copy link
                  </button>
                  <button className="pencil danger" aria-label="Delete" onClick={async () => { if (confirm('Delete this file? Any page using it will lose it.')) { await api(`/api/media/${m.id}`, 'DELETE'); load(); } }}>
                    <Icon name="trash" size={16} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ───────────── Comments Panel (Moderation) ───────────── */

export function CommentsPanel() {
  const [items, setItems] = useState<Doc[] | null>(null);
  const [error, setError] = useState('');
  const load = useCallback(() => api<Doc[]>('/api/comments').then(setItems).catch((e) => setError(e.message)), []);
  useEffect(() => {
    load();
  }, [load]);

  if (error) return <p className="a-error">{error}</p>;
  if (!items) return <p className="a-muted">Loading…</p>;
  if (!items.length) return <p className="a-empty">No comments yet. Reader comments from your blogs will appear here.</p>;

  return (
    <ul className="rows">
      {items.map((c) => (
        <li key={c.id} className="row">
          <div className="row-main">
            <strong>
              {c.name} <span className="a-muted">on &quot;{c.postTitle}&quot;</span>
            </strong>
            <span className="a-muted">{new Date(c.createdAt).toLocaleString()}</span>
            <p style={{ marginTop: '4px', whiteSpace: 'pre-wrap' }}>{c.text}</p>
          </div>
          <div className="row-actions">
            <button
              className="pencil danger"
              aria-label="Delete comment"
              onClick={async () => {
                if (confirm('Delete this comment?')) {
                  await api(`/api/comments/${c.id}`, 'DELETE');
                  load();
                }
              }}
            >
              <Icon name="trash" size={16} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
