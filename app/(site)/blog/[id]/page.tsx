import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { getPost, listPosts, getEngagement, formatDate, readingMinutes } from '@/lib/blog';
import PostBody from '@/components/blog/PostBody';
import BlogInteractions from '@/components/blog/BlogInteractions';
import { Icon } from '@/components/site/Icon';

export const revalidate = 60;

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const posts = await listPosts();
  return posts.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return { title: 'Post Not Found | Abhishek Dass' };

  return {
    title: `${post.title} | Abhishek Dass Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.cover ? [post.cover] : undefined,
    },
    alternates: { canonical: `/blog/${post.id}` },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  const jar = await cookies();
  const voter = jar.get('voter')?.value;
  const engagement = await getEngagement(id, voter);
  const readTime = readingMinutes(post.body);

  return (
    <article className="blog-post-page" style={{ paddingTop: '80px', paddingBottom: '120px' }}>
      {/* Hero Header */}
      <header className="page-hero on-dark" style={{ borderBottom: '1px solid var(--border)', padding: '50px 0 40px' }}>
        <div className="container" style={{ maxWidth: '840px' }}>
          <a
            href="/blog"
            className="mono"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--muted)',
              fontSize: '13px',
              textDecoration: 'none',
              marginBottom: '20px',
            }}
          >
            <Icon name="arrowRight" size={14} style={{ transform: 'rotate(180deg)' }} /> BACK TO ALL BLOGS
          </a>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <span
              className="mono"
              style={{
                background: 'var(--bg-elevated)',
                padding: '4px 10px',
                borderRadius: '4px',
                border: '1px solid var(--border)',
                color: 'var(--racing-yellow, #FFD500)',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              {post.topic}
            </span>
            <span className="mono" style={{ fontSize: '13px', color: 'var(--muted)' }}>
              {readTime} min read
            </span>
            <span className="mono" style={{ fontSize: '13px', color: 'var(--muted)' }}>
              · {formatDate(post.createdAt)}
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
              fontWeight: 800,
              margin: '0 0 16px',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
            }}
          >
            {post.title}
          </h1>

          <p style={{ fontSize: '1.2rem', color: 'var(--fg-muted)', lineHeight: 1.6, margin: 0 }}>
            {post.excerpt}
          </p>

          {post.tags && post.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '20px' }}>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="tag"
                  style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '4px' }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="container" style={{ maxWidth: '840px', marginTop: '40px' }}>
        {post.cover && (
          <div
            className="card"
            style={{
              overflow: 'hidden',
              marginBottom: '40px',
              maxHeight: '480px',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover}
              alt={post.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        <div className="blog-content-body" style={{ fontSize: '16px', lineHeight: 1.8 }}>
          <PostBody body={post.body} />
        </div>

        {/* Like, Dislike & Comment Section */}
        <BlogInteractions postId={post.id} initial={engagement} />
      </div>
    </article>
  );
}
