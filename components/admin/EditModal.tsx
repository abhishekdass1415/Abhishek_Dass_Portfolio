'use client';

import { useEffect, useState } from 'react';
import type { FieldDef } from '@/lib/schema';
import { FieldInput } from './FieldInput';

/** LinkedIn-style edit dialog: opens from a pencil button, saves, and the live site updates. */
export default function EditModal({
  title,
  fields,
  initial,
  onSave,
  onClose,
}: {
  title: string;
  fields: FieldDef[];
  initial: Record<string, any>;
  onSave: (values: Record<string, any>) => Promise<void>;
  onClose: () => void;
}) {
  const [values, setValues] = useState<Record<string, any>>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    document.body.classList.add('admin-modal-open');
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      document.body.classList.remove('admin-modal-open');
    };
  }, [onClose]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const out: Record<string, any> = {};
      fields.forEach((f) => (out[f.key] = values[f.key]));
      await onSave(out);
      onClose();
    } catch (x) {
      setError(x instanceof Error ? x.message : 'Could not save');
      setSaving(false);
    }
  }

  const isWide = fields.some((f) => f.type === 'article');

  return (
    <div className="modal-back" onMouseDown={onClose}>
      <form className={`modal${isWide ? ' modal-wide' : ''}`} role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => e.stopPropagation()} onSubmit={submit}>
        <header className="modal-head">
          <h2>{title}</h2>
          <button type="button" className="x" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>
        <div className="modal-body">
          <div className="a-grid">
            {fields.map((f) => (
              <FieldInput key={f.key} f={f} value={values[f.key]} onChange={(v) => setValues((s) => ({ ...s, [f.key]: v }))} />
            ))}
          </div>
        </div>
        <footer className="modal-foot">
          {error && <p className="a-error">{error}</p>}
          <button type="button" className="a-btn a-btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="a-btn a-btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </footer>
      </form>
    </div>
  );
}
