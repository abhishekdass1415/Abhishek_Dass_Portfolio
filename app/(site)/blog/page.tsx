import type { Metadata } from 'next';
import { listPosts, formatDate, readingMinutes } from '@/lib/blog';
import { Icon } from '@/components/site/Icon';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Engineering Notes & Telemetry Blog | Abhishek Dass',
  description: 'Articles, technical insights, and thoughts on Formula 1 motorsport telemetry, AI, deep learning, systems engineering, and business.',
  alternates: { canonical: '/blog' },
};

export default async function BlogIndexPage() {
  const posts = await listPosts();
  const topics = Array.from(new Set(posts.map((p) => p.topic).filter(Boolean)));
  const featured = posts[0];
  const regular = posts.slice(1);

  return (
    <div className="blog-index-page" style={{ paddingTop: '80px', paddingBottom: '120px' }}>
      {/* Editorial Pit-Wall Header */}
      <header className="page-hero on-dark" style={{ borderBottom: '2px solid var(--line-soft)', padding: '70px 0 50px', position: 'relative' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span
              className="mono"
              style={{
                background: 'var(--y)',
                color: '#111216',
                padding: '3px 10px',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
              }}
            >
              TECHNICAL JOURNAL
            </span>
            <span className="mono" style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>
              // {posts.length} {posts.length === 1 ? 'Article' : 'Articles'} Published
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.025em', lineHeight: 1.15 }}>
            Engineering, Telemetry &amp; Notes
          </h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '720px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
            Deep dives across Formula 1 aerodynamics &amp; sensor telemetry, neural networks, flight software, and high-performance engineering.
          </p>

          {/* Quick Filter Pill Row */}
          {topics.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '28px' }}>
              <span className="mono" style={{ color: 'var(--muted)', fontSize: '0.8rem', alignSelf: 'center', marginRight: '6px' }}>
                Topics:
              </span>
              {topics.map((t) => (
                <span
                  key={t}
                  className="mono"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--line-soft)',
                    padding: '4px 12px',
                    fontSize: '0.78rem',
                    color: 'var(--ink-2)',
                    fontWeight: 600,
                  }}
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="container" style={{ marginTop: '48px' }}>
        {posts.length === 0 ? (
          <div className="card" style={{ padding: '60px 20px', textAlign: 'center', maxWidth: '640px', margin: '40px auto' }}>
            <p className="mono" style={{ fontSize: '18px', color: 'var(--muted)' }}>No articles published yet.</p>
            <p style={{ color: 'var(--fg-muted)', marginTop: '8px' }}>
              Head over to the <a href="/Maihehuadmin" style={{ color: 'var(--racing-yellow, #FFD500)', textDecoration: 'underline' }}>Admin Dashboard</a> to write and publish your first article!
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '48px' }}>
            {/* Featured Lead Post */}
            {featured && (
              <article
                className="card"
                style={{
                  display: 'grid',
                  gridTemplateColumns: featured.cover ? 'repeat(auto-fit, minmax(320px, 1fr))' : '1fr',
                  gap: '0',
                  overflow: 'hidden',
                  border: '3px solid var(--line)',
                  boxShadow: '8px 8px 0 var(--shadow)',
                }}
              >
                {featured.cover && (
                  <div style={{ position: 'relative', minHeight: '300px', background: '#0d0f14' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={featured.cover}
                      alt={featured.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div
                      className="mono"
                      style={{
                        position: 'absolute',
                        top: '14px',
                        left: '14px',
                        background: 'var(--y)',
                        color: '#111216',
                        padding: '4px 10px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                      }}
                    >
                      FEATURED ARTICLE
                    </div>
                  </div>
                )}

                <div style={{ padding: '36px clamp(24px, 4vw, 44px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', fontSize: '13px' }}>
                    <span
                      className="mono"
                      style={{
                        background: 'var(--bg-alt)',
                        padding: '4px 10px',
                        border: '1px solid var(--line-soft)',
                        color: 'var(--y)',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                      }}
                    >
                      {featured.topic}
                    </span>
                    <span className="mono" style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                      {readingMinutes(featured.body)} min read
                    </span>
                  </div>

                  <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.3rem)', fontWeight: 800, margin: '0 0 16px', lineHeight: 1.25, letterSpacing: '-0.02em' }}>
                    <a href={`/blog/${featured.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {featured.title}
                    </a>
                  </h2>

                  <p style={{ color: 'var(--ink-2)', fontSize: '1.05rem', lineHeight: 1.65, margin: '0 0 28px' }}>
                    {featured.excerpt}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '2px solid var(--line-soft)', paddingTop: '20px', marginTop: 'auto' }}>
                    <time className="mono" style={{ fontSize: '0.88rem', color: 'var(--muted)' }}>
                      {formatDate(featured.createdAt)}
                    </time>
                    <a
                      href={`/blog/${featured.id}`}
                      className="btn btn-primary"
                      style={{ padding: '8px 20px', fontSize: '0.92rem' }}
                    >
                      Read Full Article <Icon name="arrowRight" size={16} />
                    </a>
                  </div>
                </div>
              </article>
            )}

            {/* Grid of Other Articles */}
            {regular.length > 0 && (
              <div>
                <h3 className="mono" style={{ fontSize: '1.1rem', marginBottom: '24px', letterSpacing: '0.04em', color: 'var(--muted)' }}>
                  // RECENT PUBLICATIONS ({regular.length})
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px' }}>
                  {regular.map((post) => {
                    const readTime = readingMinutes(post.body);
                    return (
                      <article
                        key={post.id}
                        className="card"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          overflow: 'hidden',
                          border: '2px solid var(--line)',
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        }}
                      >
                        {post.cover && (
                          <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden', background: '#111' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={post.cover}
                              alt={post.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                            />
                          </div>
                        )}

                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', fontSize: '12px' }}>
                            <span className="mono" style={{ background: 'var(--bg-alt)', padding: '3px 8px', border: '1px solid var(--line-soft)', color: 'var(--y)', fontWeight: 600 }}>
                              {post.topic}
                            </span>
                            <span className="mono" style={{ color: 'var(--muted)' }}>
                              {readTime} min read
                            </span>
                          </div>

                          <h4 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0 0 10px', lineHeight: 1.35 }}>
                            <a href={`/blog/${post.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                              {post.title}
                            </a>
                          </h4>

                          <p style={{ color: 'var(--ink-2)', fontSize: '14px', lineHeight: 1.6, margin: '0 0 20px', flex: 1 }}>
                            {post.excerpt}
                          </p>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--line-soft)', paddingTop: '16px', marginTop: 'auto' }}>
                            <time className="mono" style={{ fontSize: '12px', color: 'var(--muted)' }}>
                              {formatDate(post.createdAt)}
                            </time>
                            <a href={`/blog/${post.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: 'var(--y)' }}>
                              Read Article <Icon name="arrowRight" size={14} />
                            </a>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
