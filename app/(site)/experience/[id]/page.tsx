import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPortfolio, getExperience } from '@/lib/data';
import PostBody from '@/components/blog/PostBody';
import { Icon } from '@/components/site/Icon';

export const revalidate = 60;

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const { experience } = await getPortfolio();
  return experience.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = await getExperience((await params).id);
  if (!e) return { title: 'Experience not found' };
  return {
    title: `${e.role} at ${e.company} | Abhishek Dass`,
    description: e.summary || `${e.role} at ${e.company}`,
    alternates: { canonical: `/experience/${e.id}` },
  };
}

import Image from 'next/image';
import VideoFacade from '@/components/site/VideoFacade';
import { InteractiveGallery } from '@/components/site/InteractiveGallery';

export default async function ExperiencePage({ params }: Props) {
  const { id } = await params;
  const [{ experience }, e] = await Promise.all([getPortfolio(), getExperience(id)]);
  if (!e) notFound();

  const i = experience.findIndex((x) => x.id === e.id);
  const prev = i > 0 ? experience[i - 1] : experience[experience.length - 1];
  const next = experience[(i + 1) % experience.length];

  const dateRange = `${e.start}${e.end ? ` – ${e.end}` : e.current ? ' – Present' : ''}`;

  return (
    <article className="experience-page project-page">
      <header className="project-hero on-dark">
        <div className="container">
          <a href="/#experience" className="back-link mono">
            <Icon name="arrowRight" size={16} style={{ transform: 'rotate(180deg)' }} /> ALL EXPERIENCE
          </a>
          <p className="project-kicker mono">
            {e.company}
            {e.type ? ` · ${e.type}` : ''}
            {e.location ? ` · ${e.location}` : ''}
          </p>
          <h1>{e.role}</h1>
          <p className="project-lead">{e.summary}</p>
          <div className="project-actions">
            {e.website && (
              <a href={e.website} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Company Website <Icon name="arrowUpRight" />
              </a>
            )}
            <a href="/#experience" className="btn btn-ghost">
              <Icon name="arrowRight" size={16} style={{ transform: 'rotate(180deg)' }} /> Back to Timeline
            </a>
          </div>
        </div>
      </header>

      <div className="container project-layout">
        <div className="project-main">
          {(e.video || e.image) && (
            <div className="project-visual card">
              {e.video ? (
                <div className="video-wrap">
                  <VideoFacade url={e.video} title={`${e.role} at ${e.company}`} poster={e.image} />
                </div>
              ) : (
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9' }}>
                  <Image
                    src={e.image!}
                    alt={`${e.role} at ${e.company}`}
                    fill
                    priority
                    sizes="(max-width: 960px) 100vw, 840px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>
          )}

          {e.details ? (
            <PostBody body={e.details} />
          ) : e.bullets.length > 0 ? (
            <div className="card side-card" style={{ padding: '1.8rem', marginBottom: '2rem' }}>
              <h2 className="mono" style={{ color: 'var(--y)', marginBottom: '1rem' }}>
                // KEY RESPONSIBILITIES &amp; DELIVERABLES
              </h2>
              <ul className="bullets" style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                {e.bullets.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {e.images && e.images.length > 0 && (
            <div className="media-gallery" style={{ marginTop: '2.5rem' }}>
              <h2 className="mono" style={{ fontSize: '1rem', marginBottom: '1.2rem', color: 'var(--y)' }}>
                // WORK &amp; EVENT GALLERY · CLICK TO ENLARGE
              </h2>
              <InteractiveGallery images={e.images} title={`${e.role} at ${e.company}`} />
            </div>
          )}
        </div>

        <aside className="project-side">
          <section className="card side-card">
            <h2 className="mono">ROLE OVERVIEW</h2>
            <div style={{ display: 'grid', gap: '0.9rem', fontSize: '0.92rem' }}>
              <div>
                <span className="mono" style={{ color: 'var(--muted)', display: 'block', fontSize: '0.76rem' }}>
                  COMPANY
                </span>
                <strong>{e.company}</strong>
              </div>
              <div>
                <span className="mono" style={{ color: 'var(--muted)', display: 'block', fontSize: '0.76rem' }}>
                  EMPLOYMENT TYPE
                </span>
                <span>{e.type || 'Full-time'}</span>
              </div>
              <div>
                <span className="mono" style={{ color: 'var(--muted)', display: 'block', fontSize: '0.76rem' }}>
                  DURATION
                </span>
                <span>{dateRange}</span>
              </div>
              {e.location && (
                <div>
                  <span className="mono" style={{ color: 'var(--muted)', display: 'block', fontSize: '0.76rem' }}>
                    LOCATION
                  </span>
                  <span>{e.location}</span>
                </div>
              )}
            </div>
          </section>

          {e.bullets.length > 0 && e.details && (
            <section className="card side-card">
              <h2 className="mono">CORE HIGHLIGHTS</h2>
              <ul className="bullets">
                {e.bullets.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>

      {experience.length > 1 && (
        <div className="container">
          <nav className="item-nav-grid" aria-label="Experience navigation">
            {prev && prev.id !== e.id ? (
              <a href={`/experience/${prev.id}`} className="nav-box nav-box-prev card">
                <span className="mono nav-box-kicker">
                  <Icon name="arrowRight" size={14} style={{ transform: 'rotate(180deg)' }} /> PREVIOUS EXPERIENCE
                </span>
                <strong className="nav-box-title">{prev.role}</strong>
                <span className="nav-box-sub">{prev.company}</span>
              </a>
            ) : <div />}

            {next && next.id !== e.id ? (
              <a href={`/experience/${next.id}`} className="nav-box nav-box-next card">
                <span className="mono nav-box-kicker">
                  NEXT EXPERIENCE <Icon name="arrowRight" size={14} />
                </span>
                <strong className="nav-box-title">{next.role}</strong>
                <span className="nav-box-sub">{next.company}</span>
              </a>
            ) : <div />}
          </nav>
        </div>
      )}
    </article>
  );
}
