'use client';

import { useRef, useState } from 'react';
import type { FieldDef } from '@/lib/schema';
import { Icon } from '@/components/site/Icon';

export async function api<T = any>(path: string, method = 'GET', body?: unknown): Promise<T> {
  const res = await fetch(path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401 && !path.startsWith('/api/auth')) {
    window.location.href = '/Maihehuadmin';
    throw new Error('Session expired');
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) throw new Error(json.error || 'Request failed');
  return json.data as T;
}

function isVideoUrl(url: string) {
  return /\.(mp4|webm|mov|ogg)$/i.test(url) || url.includes('/api/media/');
}

function MultiImageUpload({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const list = Array.isArray(value) ? value : [];

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBusy(true);
    setErr('');
    try {
      const urls: string[] = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/media', { method: 'POST', body: fd });
        const json = await res.json();
        if (json.success && json.data?.url) {
          urls.push(json.data.url);
        }
      }
      onChange([...list, ...urls]);
    } catch (x) {
      setErr(x instanceof Error ? x.message : 'Upload failed');
    } finally {
      setBusy(false);
      if (input.current) input.current.value = '';
    }
  }

  function remove(idx: number) {
    onChange(list.filter((_, i) => i !== idx));
  }

  return (
    <div className="multi-image-upload" style={{ display: 'grid', gap: '10px' }}>
      {list.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {list.map((url, i) => {
            const isVid = /\.(mp4|webm|mov|ogg)$/i.test(url);
            return (
              <div
                key={i}
                style={{
                  position: 'relative',
                  width: '96px',
                  height: '72px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  border: '1px solid var(--a-line)',
                  background: '#0c0d10',
                }}
              >
                {isVid ? (
                  <video
                    src={url}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    muted
                    playsInline
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={url}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      // Fallback if media is a video without an extension
                      const target = e.currentTarget;
                      const videoEl = document.createElement('video');
                      videoEl.src = url;
                      videoEl.muted = true;
                      videoEl.style.width = '100%';
                      videoEl.style.height = '100%';
                      videoEl.style.objectFit = 'cover';
                      target.parentNode?.replaceChild(videoEl, target);
                    }}
                  />
                )}
                <button
                  type="button"
                  onClick={() => remove(i)}
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    background: 'rgba(0,0,0,0.8)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    fontSize: '11px',
                    lineHeight: '1',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                  }}
                  title="Remove media"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          type="button"
          className="a-btn"
          onClick={() => input.current?.click()}
          disabled={busy}
        >
          <Icon name="upload" size={16} /> {busy ? 'Uploading files…' : 'Upload Photos / Videos'}
        </button>
        <span style={{ fontSize: '12px', color: 'var(--a-muted)' }}>
          {list.length} item{list.length === 1 ? '' : 's'} added (Images &amp; MP4/WebM videos)
        </span>
      </div>

      <input
        ref={input}
        type="file"
        multiple
        hidden
        onChange={onFiles}
        accept="image/*,video/mp4,video/webm"
      />
      {err && <p className="a-error">{err}</p>}
    </div>
  );
}

function Upload({ f, value, onChange }: { f: FieldDef; value: string; onChange: (v: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/media', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Upload failed');
      onChange(json.data.url);
    } catch (x) {
      setErr(x instanceof Error ? x.message : 'Upload failed');
    } finally {
      setBusy(false);
      if (input.current) input.current.value = '';
    }
  }

  return (
    <div className="upload">
      {f.type === 'image' && value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="upload-preview" />
      )}
      <div className="upload-row">
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Paste a URL or upload" />
        <button type="button" className="a-btn" onClick={() => input.current?.click()} disabled={busy}>
          <Icon name="upload" size={16} /> {busy ? 'Uploading…' : 'Upload'}
        </button>
        {value && (
          <button type="button" className="a-btn a-btn-ghost" onClick={() => onChange('')}>
            Remove
          </button>
        )}
      </div>
      <input ref={input} type="file" hidden onChange={onFile} accept={f.accept || (f.type === 'image' ? 'image/*' : undefined)} />
      {err && <p className="a-error">{err}</p>}
    </div>
  );
}

export function FieldInput({ f, value, onChange }: { f: FieldDef; value: any; onChange: (v: any) => void }) {
  const id = 'f-' + f.key;
  const common = { id, required: f.required, maxLength: f.type === 'textarea' || f.type === 'lines' ? undefined : f.max, placeholder: f.placeholder };

  let control: React.ReactNode;
  switch (f.type) {
    case 'textarea':
      control = <textarea {...common} rows={f.key === 'about' || f.key === 'details' ? 9 : 4} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
      break;
    case 'lines':
      control = <textarea {...common} rows={5} value={Array.isArray(value) ? value.join('\n') : value ?? ''} onChange={(e) => onChange(e.target.value.split('\n'))} />;
      break;
    case 'tags':
      control = <input {...common} type="text" value={Array.isArray(value) ? value.join(', ') : value ?? ''} onChange={(e) => onChange(e.target.value.split(','))} />;
      break;
    case 'bool':
      control = (
        <label className="check">
          <input id={id} type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} /> Yes
        </label>
      );
      break;
    case 'select':
      control = (
        <select id={id} required={f.required} value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
          <option value="">Select…</option>
          {f.options?.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      );
      break;
    case 'select_custom': {
      const isKnown = f.options?.includes(value);
      const isOther = value !== undefined && value !== '' && !isKnown;
      control = (
        <div style={{ display: 'grid', gap: '8px' }}>
          <select
            id={id}
            required={f.required && !isOther}
            value={isKnown ? value : value ? '__custom__' : ''}
            onChange={(e) => {
              if (e.target.value === '__custom__') {
                onChange(' '); // initiate custom entry
              } else {
                onChange(e.target.value);
              }
            }}
          >
            <option value="">Select…</option>
            {f.options?.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
            <option value="__custom__">Other (type custom topic)…</option>
          </select>
          {(!isKnown && value !== '') && (
            <input
              type="text"
              placeholder="Enter custom topic name..."
              value={value === ' ' ? '' : value}
              required={f.required}
              autoFocus
              maxLength={60}
              onChange={(e) => onChange(e.target.value)}
              style={{ borderColor: 'var(--a-line)' }}
            />
          )}
        </div>
      );
      break;
    }
    case 'image_list':
      control = <MultiImageUpload value={Array.isArray(value) ? value : []} onChange={onChange} />;
      break;
    case 'image':
    case 'file':
      control = <Upload f={f} value={value ?? ''} onChange={onChange} />;
      break;
    case 'article': {
      const insertSnippet = (snippet: string) => {
        const cur = value ?? '';
        onChange(cur ? cur + '\n\n' + snippet : snippet);
      };
      return (
        <div className="a-article-editor">
          <div className="a-editor-toolbar" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
            <button type="button" className="a-btn a-btn-ghost" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => insertSnippet('## Section Heading')}>
              H2
            </button>
            <button type="button" className="a-btn a-btn-ghost" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => insertSnippet('### Subsection')}>
              H3
            </button>
            <button type="button" className="a-btn a-btn-ghost" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => insertSnippet('**bold text**')}>
              Bold
            </button>
            <button type="button" className="a-btn a-btn-ghost" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => insertSnippet('> Key insight or quote')}>
              Quote
            </button>
            <button type="button" className="a-btn a-btn-ghost" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => insertSnippet('- First point\n- Second point\n- Third point')}>
              List
            </button>
            <button type="button" className="a-btn a-btn-ghost" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => insertSnippet('```python\n# your code or data snippet\nprint("F1 Telemetry")\n```')}>
              Code
            </button>
            <label className="a-btn a-btn-ghost" style={{ padding: '4px 8px', fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Icon name="image" size={14} /> Insert Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const fd = new FormData();
                  fd.append('file', file);
                  try {
                    const res = await fetch('/api/media', { method: 'POST', body: fd });
                    const json = await res.json();
                    if (json.success && json.data?.url) {
                      insertSnippet(`![${file.name.replace(/\.[^.]+$/, '')}](${json.data.url})`);
                    } else {
                      alert(json.error || 'Upload failed');
                    }
                  } catch {
                    alert('Upload failed');
                  }
                  e.target.value = '';
                }}
              />
            </label>
            <label className="a-btn a-btn-ghost" style={{ padding: '4px 8px', fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Icon name="video" size={14} /> Insert Video
              <input
                type="file"
                hidden
                accept="video/mp4,video/webm"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const fd = new FormData();
                  fd.append('file', file);
                  try {
                    const res = await fetch('/api/media', { method: 'POST', body: fd });
                    const json = await res.json();
                    if (json.success && json.data?.url) {
                      insertSnippet(`@[${file.name.replace(/\.[^.]+$/, '')}](${json.data.url})`);
                    } else {
                      alert(json.error || 'Upload failed (max 100MB)');
                    }
                  } catch {
                    alert('Upload failed');
                  }
                  e.target.value = '';
                }}
              />
            </label>
            <button
              type="button"
              className="a-btn a-btn-ghost"
              style={{ padding: '4px 8px', fontSize: '12px' }}
              onClick={() => {
                const u = prompt('Enter YouTube, Vimeo, or MP4 URL:');
                if (u) insertSnippet(`@[video](${u.trim()})`);
              }}
            >
              Embed Video Link
            </button>
          </div>
          <textarea
            {...common}
            rows={22}
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '14px',
              lineHeight: '1.7',
              minHeight: '440px',
              resize: 'vertical',
              padding: '16px',
            }}
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write your article here... You can use headings (##), bold (**text**), lists (- item), quotes (> text), code blocks (```), images, and videos."
          />
        </div>
      );
    }
    default:
      control = (
        <>
          <input {...common} type={f.type === 'url' ? 'url' : f.type === 'email' ? 'email' : f.type === 'month' ? 'month' : 'text'} list={f.suggestions ? id + '-l' : undefined} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
          {f.suggestions && (
            <datalist id={id + '-l'}>
              {f.suggestions.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          )}
        </>
      );
  }

  return (
    <div className={`a-field${f.half ? ' half' : ''}`}>
      <label htmlFor={id}>
        {f.label}
        {f.required && <b aria-hidden="true"> *</b>}
      </label>
      {control}
      {f.help && <small>{f.help}</small>}
    </div>
  );
}
