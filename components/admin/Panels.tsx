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
  const load = useCallback(() => api<Doc[]>('/api/messages').then(setItems), []);
  useEffect(() => {
    load();
  }, [load]);

  if (!items) return <p className="a-muted">Loading…</p>;
  if (!items.length) return <p className="a-empty">No messages yet. Messages from your contact form appear here.</p>;

  return (
    <ul className="rows">
      {items.map((m) => (
        <li key={m.id} className={`row msg${m.read ? '' : ' unread'}`}>
          <div className="row-main">
            <strong>
              {m.name} <a href={`mailto:${m.email}`}>{m.email}</a>
            </strong>
            <span className="a-muted">{new Date(m.createdAt).toLocaleString()}</span>
            <p>{m.message}</p>
          </div>
          <div className="row-actions">
            <button className="pencil" onClick={async () => { await api(`/api/messages/${m.id}`, 'PUT', { read: !m.read }); load(); }} aria-label={m.read ? 'Mark unread' : 'Mark read'}>
              <Icon name="check" size={16} />
            </button>
            <button className="pencil danger" onClick={async () => { if (confirm('Delete this message?')) { await api(`/api/messages/${m.id}`, 'DELETE'); load(); } }} aria-label="Delete">
              <Icon name="trash" size={16} />
            </button>
          </div>
        </li>
      ))}
    </ul>
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
