'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import type { Project } from '@/lib/types';
import ProjectArt from './ProjectArt';
import SectionHead from './SectionHead';
import { Icon } from './Icon';

export function ProjectCard({ p, index }: { p: Project; index: number }) {
  return (
    <article className={`project card${p.featured ? ' is-featured' : ''}`} style={{ ['--d' as string]: `${(index % 6) * 70}ms` }}>
      <div className="project-media" style={{ position: 'relative', overflow: 'hidden' }}>
        {p.image ? (
          <Image
            src={p.image}
            alt={`${p.title} preview`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <ProjectArt category={p.category} seed={p.id} />
        )}
        {p.video && (
          <span className="play" aria-hidden="true">
            <Icon name="play" size={16} /> Video
          </span>
        )}
        <span className="project-cat mono">{p.category}</span>
      </div>

      <div className="project-body">
        <p className="project-meta mono">
          <span>{String(index + 1).padStart(2, '0')}</span>
          {p.year && <span>{p.year}</span>}
        </p>
        <h3 className="project-title">
          <a href={`/projects/${p.id}`} className="stretched">
            {p.title}
          </a>
        </h3>
        <p className="project-summary">{p.summary}</p>

        {p.tags.length > 0 && (
          <ul className="tags" aria-label="Technologies">
            {p.tags.slice(0, 6).map((t) => (
              <li key={t} className="tag">
                {t}
              </li>
            ))}
          </ul>
        )}

        <div className="project-links">
          {p.demoLink && (
            <a href={p.demoLink} target="_blank" rel="noopener noreferrer" className="link-btn">
              Live demo <Icon name="arrowUpRight" size={16} />
            </a>
          )}
          {p.codeLink && (
            <a href={p.codeLink} target="_blank" rel="noopener noreferrer" className="link-btn">
              Code <Icon name="github" size={16} />
            </a>
          )}
          <span className="read-more" aria-hidden="true">
            Read more <Icon name="arrowRight" size={16} />
          </span>
        </div>
      </div>
    </article>
  );
}

export default function Projects({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState('All');
  const categories = useMemo(() => ['All', ...Array.from(new Set(projects.map((p) => p.category)))], [projects]);
  const shown = filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="section section-alt" aria-labelledby="projects-title">
      <div className="container">
        <SectionHead index="02" title="Projects" id="projects-title" kicker="// the work" />
        <p className="section-intro reveal">Selected builds across motorsport telemetry, machine learning, flight software and full-stack products.</p>

        {categories.length > 2 && (
          <div className="filters reveal" role="group" aria-label="Filter projects by category">
            {categories.map((c) => (
              <button key={c} type="button" className={`chip${filter === c ? ' is-on' : ''}`} aria-pressed={filter === c} onClick={() => setFilter(c)}>
                {c}
              </button>
            ))}
          </div>
        )}

        <div className="project-grid" key={filter}>
          {shown.map((p, i) => (
            <ProjectCard key={p.id} p={p} index={i} />
          ))}
        </div>
        {shown.length === 0 && <p className="empty">No projects in this category yet.</p>}
      </div>
    </section>
  );
}
