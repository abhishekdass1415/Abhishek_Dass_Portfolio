import type { Post } from '@/lib/blog';
import { formatDate, readingMinutes } from '@/lib/blog';
import SectionHead from './SectionHead';
import { Icon } from './Icon';

export default function BlogSection({ posts }: { posts: Post[] }) {
  if (!posts || posts.length === 0) return null;

  return (
    <section id="blog" className="section section-alt" aria-labelledby="blog-title">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: 1, minWidth: '260px' }}>
            <SectionHead index="03" title="Blog & Insights" id="blog-title" kicker="// thoughts & telemetry" />
            <p className="section-intro reveal" style={{ marginBottom: 0 }}>
              Technical writings, race telemetry analyses, neural network research, and engineering notes.
            </p>
          </div>
          <div className="reveal" style={{ marginBottom: '1.2rem' }}>
            <a
              href="/blog"
              className="btn btn-ghost"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              Open Full Blog <Icon name="arrowRight" size={16} />
            </a>
          </div>
        </div>

        <div
          className="blog-preview-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px',
            marginTop: '32px',
          }}
        >
          {posts.slice(0, 3).map((post, i) => {
            const readTime = readingMinutes(post.body);
            return (
              <article
                key={post.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                  ['--d' as string]: `${(i % 3) * 80}ms`,
                }}
              >
                {post.cover && (
                  <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden', background: '#0d0f14' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.cover}
                      alt={post.title}
                      loading="lazy"
                      decoding="async"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}

                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', fontSize: '12px' }}>
                    <span
                      className="mono"
                      style={{
                        background: 'var(--bg-elevated)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        border: '1px solid var(--border)',
                        color: 'var(--racing-yellow, #FFD500)',
                        fontWeight: 600,
                      }}
                    >
                      {post.topic}
                    </span>
                    <span className="mono" style={{ color: 'var(--muted)' }}>
                      {readTime} min read
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 10px', lineHeight: 1.35 }}>
                    <a href={`/blog/${post.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {post.title}
                    </a>
                  </h3>

                  <p style={{ color: 'var(--fg-muted)', fontSize: '14px', lineHeight: 1.6, margin: '0 0 20px', flex: 1 }}>
                    {post.excerpt}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: 'auto' }}>
                    <time className="mono" style={{ fontSize: '12px', color: 'var(--muted)' }}>
                      {formatDate(post.createdAt)}
                    </time>
                    <a
                      href={`/blog/${post.id}`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--racing-yellow, #FFD500)' }}
                    >
                      Read article <Icon name="arrowRight" size={14} />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
