'use client';

import { useState } from 'react';
import { Icon } from '@/components/site/Icon';
import type { Engagement } from '@/lib/blog';

export default function BlogInteractions({ postId, initial }: { postId: string; initial: Engagement }) {
  const [data, setData] = useState<Engagement>(initial);
  const [reacting, setReacting] = useState(false);
  const [name, setName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);

  async function handleReaction(val: 'like' | 'dislike') {
    if (reacting) return;
    setReacting(true);
    const newVal = data.mine === val ? 'none' : val;
    try {
      const res = await fetch(`/api/blog/${postId}/engage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'react', value: newVal }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      }
    } catch {
      // ignore network errors
    } finally {
      setReacting(false);
    }
  }

  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setCommentError('');
    setCommentSuccess(false);

    if (!name.trim()) {
      setCommentError('Please enter your name.');
      return;
    }
    if (!commentText.trim()) {
      setCommentError('Please enter your thoughts or feedback.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/blog/${postId}/engage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'comment',
          name: name.trim(),
          text: commentText.trim(),
          website: '', // honeypot
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
        setCommentText('');
        setCommentSuccess(true);
        setTimeout(() => setCommentSuccess(false), 4000);
      } else {
        setCommentError(json.error || 'Failed to post comment.');
      }
    } catch {
      setCommentError('Failed to post comment. Check your connection.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="blog-engagement card" style={{ marginTop: '48px', padding: '32px' }}>
      {/* Reaction Bar */}
      <div className="engagement-reactions" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '24px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Was this read insightful?</h3>
          <p className="a-muted" style={{ margin: '4px 0 0', fontSize: '0.9rem' }}>
            Leave a reaction or join the discussion below.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            className={`btn ${data.mine === 'like' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleReaction('like')}
            disabled={reacting}
            aria-label="Like this article"
          >
            <Icon name="thumbsUp" size={18} />
            <span style={{ fontWeight: 600 }}>{data.likes}</span>
          </button>
          <button
            type="button"
            className={`btn ${data.mine === 'dislike' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleReaction('dislike')}
            disabled={reacting}
            aria-label="Dislike this article"
          >
            <Icon name="thumbsDown" size={18} />
            <span style={{ fontWeight: 600 }}>{data.dislikes}</span>
          </button>
        </div>
      </div>

      {/* Comment Form */}
      <div className="engagement-comments" style={{ paddingTop: '28px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', marginBottom: '16px' }}>
          <Icon name="messageSquare" size={20} />
          <span>Comments & Discussion ({data.comments.length})</span>
        </h3>

        <form onSubmit={handleCommentSubmit} style={{ marginBottom: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '12px' }}>
            <input
              type="text"
              placeholder="Your name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={60}
              className="a-input"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--bg-elevated)',
                color: 'var(--fg)',
                fontFamily: 'inherit',
                fontSize: '14px',
              }}
            />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <textarea
              rows={4}
              placeholder="Share your feedback, question, or counterpoint..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
              maxLength={1500}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--bg-elevated)',
                color: 'var(--fg)',
                fontFamily: 'inherit',
                fontSize: '14px',
                resize: 'vertical',
              }}
            />
          </div>

          {commentError && <p style={{ color: '#ef4444', fontSize: '14px', margin: '0 0 12px' }}>{commentError}</p>}
          {commentSuccess && <p style={{ color: 'var(--electric-green, #10b981)', fontSize: '14px', margin: '0 0 12px', fontWeight: 600 }}>Comment posted successfully!</p>}

          <button type="submit" className="btn btn-primary" disabled={submitting} style={{ cursor: 'pointer' }}>
            {submitting ? 'Posting…' : 'Post Comment'}
          </button>
        </form>

        {/* Existing Comments List */}
        {data.comments.length === 0 ? (
          <p className="a-muted" style={{ fontStyle: 'italic', fontSize: '14px' }}>
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {data.comments.map((c) => (
              <div
                key={c.id}
                style={{
                  padding: '16px 20px',
                  borderRadius: '10px',
                  background: 'var(--bg-subtle, rgba(255, 255, 255, 0.03))',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '15px' }}>{c.name}</strong>
                  <span className="mono" style={{ fontSize: '12px', color: 'var(--muted)' }}>
                    {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, whiteSpace: 'pre-wrap', color: 'var(--fg-muted)' }}>
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
