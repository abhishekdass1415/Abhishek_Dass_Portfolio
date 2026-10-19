import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPortfolio, getProject } from '@/lib/data';
import ProjectArt from '@/components/site/ProjectArt';
import PostBody from '@/components/blog/PostBody';
import { Icon } from '@/components/site/Icon';

export const revalidate = 60;

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const { projects } = await getPortfolio();
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProject((await params).id);
  if (!p) return { title: 'Project not found' };
  return { title: p.title, description: p.summary, alternates: { canonical: `/projects/${p.id}` } };
}

import Image from 'next/image';
import VideoFacade from '@/components/site/VideoFacade';
import { InteractiveGallery } from '@/components/site/InteractiveGallery';

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const [{ projects }, p] = await Promise.all([getPortfolio(), getProject(id)]);
  if (!p) notFound();

  const i = projects.findIndex((x) => x.id === p.id);
  const prev = i > 0 ? projects[i - 1] : projects[projects.length - 1];
  const next = projects[(i + 1) % projects.length];
  const paragraphs = (p.details || p.summary).split(/\n\s*\n/).filter(Boolean);

  return (
    <article className="project-page">
      <header className="project-hero on-dark">
        <div className="container">
          <a href="/#projects" className="back-link mono">
            <Icon name="arrowRight" size={16} style={{ transform: 'rotate(180deg)' }} /> ALL PROJECTS
          </a>
          <p className="project-kicker mono">
            {p.category}
            {p.year ? ` · ${p.year}` : ''}
          </p>
          <h1>{p.title}</h1>
          <p className="project-lead">{p.summary}</p>
          <div className="project-actions">
            {p.demoLink && (
              <a href={p.demoLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Live demo <Icon name="arrowUpRight" />
              </a>
            )}
            {p.codeLink && (
              <a href={p.codeLink} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                <Icon name="github" /> View code
              </a>
            )}
          </div>
        </div>
      </header>

      <div className="container project-layout">
        <div className="project-main">
          <div className="project-visual card">
            {p.video ? (
              <div className="video-wrap">
                <VideoFacade url={p.video} title={`${p.title} Video`} poster={p.image} />
              </div>
            ) : p.image ? (
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9' }}>
                <Image
                  src={p.image}
                  alt={`${p.title} preview`}
                  fill
                  priority
                  sizes="(max-width: 960px) 100vw, 840px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ) : (
              <ProjectArt category={p.category} seed={p.id} />
            )}
          </div>

          {p.details ? (
            <PostBody body={p.details} />
          ) : (
            paragraphs.map((t, k) => (
              <p key={k} className="project-text">
                {t}
              </p>
            ))
          )}

          {p.images && p.images.length > 0 && (
            <div className="media-gallery" style={{ marginTop: '2.5rem' }}>
              <h2 className="mono" style={{ fontSize: '1rem', marginBottom: '1.2rem', color: 'var(--y)' }}>
                // PROJECT GALLERY · CLICK TO ENLARGE
              </h2>
              <InteractiveGallery images={p.images} title={p.title} />
            </div>
          )}
        </div>

        <aside className="project-side">
          {p.highlights.length > 0 && (
            <section className="card side-card">
              <h2 className="mono">HIGHLIGHTS</h2>
              <ul className="bullets">
                {p.highlights.map((h, k) => (
                  <li key={k}>{h}</li>
                ))}
              </ul>
            </section>
          )}
          {p.tags.length > 0 && (
            <section className="card side-card">
              <h2 className="mono">STACK</h2>
              <ul className="tags">
                {p.tags.map((t) => (
                  <li key={t} className="tag">
                    {t}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>

      {projects.length > 1 && (
        <div className="container">
          <nav className="item-nav-grid" aria-label="Project navigation">
            {prev && prev.id !== p.id ? (
              <a href={`/projects/${prev.id}`} className="nav-box nav-box-prev card">
                <span className="mono nav-box-kicker">
                  <Icon name="arrowRight" size={14} style={{ transform: 'rotate(180deg)' }} /> PREVIOUS PROJECT
                </span>
                <strong className="nav-box-title">{prev.title}</strong>
                <span className="nav-box-sub">{prev.category}</span>
              </a>
            ) : <div />}

            {next && next.id !== p.id ? (
              <a href={`/projects/${next.id}`} className="nav-box nav-box-next card">
                <span className="mono nav-box-kicker">
                  NEXT PROJECT <Icon name="arrowRight" size={14} />
                </span>
                <strong className="nav-box-title">{next.title}</strong>
                <span className="nav-box-sub">{next.category}</span>
              </a>
            ) : <div />}
          </nav>
        </div>
      )}
    </article>
  );
}
