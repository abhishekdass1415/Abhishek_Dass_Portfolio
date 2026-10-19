import type { Achievement, Education, Experience as Exp } from '@/lib/types';
import { duration, formatMonth } from '@/lib/data';
import SectionHead from './SectionHead';
import { Icon } from './Icon';

function Logo({ src, label }: { src?: string; label: string }) {
  return (
    <span className="logo-box" aria-hidden="true">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" loading="lazy" decoding="async" width={48} height={48} />
      ) : (
        label.trim().slice(0, 1).toUpperCase()
      )}
    </span>
  );
}

const range = (start?: string, end?: string, current?: boolean) =>
  `${formatMonth(start)}${start ? ' – ' : ''}${current || !end ? (start ? 'Present' : '') : formatMonth(end)}`;

export default function Experience({
  experience,
  education,
  achievements,
}: {
  experience: Exp[];
  education: Education[];
  achievements: Achievement[];
}) {
  return (
    <section id="experience" className="section" aria-labelledby="experience-title">
      <div className="container">
        <SectionHead index="04" title="Experience" id="experience-title" kicker="// the laps" />

        <ol className="timeline">
          {experience.map((e) => (
            <li key={e.id} className="timeline-item reveal">
              <span className="timeline-node" aria-hidden="true" />
              <article className="card exp-card">
                <header className="exp-head">
                  <Logo src={e.logo} label={e.company} />
                  <div className="exp-id">
                    <h3>
                      <a href={`/experience/${e.id}`} className="exp-title-link">
                        {e.role}
                      </a>
                    </h3>
                    <p className="exp-company">
                      {e.company}
                      {e.type && <span className="tag tag-soft">{e.type}</span>}
                    </p>
                  </div>
                  <p className="exp-when mono">
                    <time>{range(e.start, e.end, e.current)}</time>
                    <span>
                      {duration(e.start, e.end, e.current)}
                      {e.location ? ` · ${e.location}` : ''}
                    </span>
                  </p>
                </header>
                {e.summary && <p className="exp-summary">{e.summary}</p>}
                {e.bullets.length > 0 && (
                  <ul className="bullets">
                    {e.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
                <div style={{ marginTop: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <a href={`/experience/${e.id}`} className="read-more" style={{ textDecoration: 'none' }}>
                    View details &amp; media <Icon name="arrowRight" size={16} />
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ol>

        <div className="edu-ach">
          <div>
            <h3 className="sub-head mono reveal">EDUCATION &amp; LEARNING</h3>
            <div className="edu-list">
              {education.map((ed) => (
                <article key={ed.id} className="card edu-card reveal">
                  <Logo src={ed.logo} label={ed.school} />
                  <div>
                    <h4>{ed.degree}</h4>
                    <p className="edu-school">{ed.school}</p>
                    <p className="edu-meta mono">
                      {range(ed.start, ed.end, !ed.end)}
                      {ed.grade ? ` · ${ed.grade}` : ''}
                    </p>
                    {ed.details && <p className="edu-details">{ed.details}</p>}
                  </div>
                </article>
              ))}
            </div>
          </div>

          {achievements.length > 0 && (
            <div>
              <h3 className="sub-head mono reveal">ACHIEVEMENTS, PAPERS &amp; CERTIFICATIONS</h3>
              <ul className="ach-list">
                {achievements.map((a) => (
                  <li key={a.id} className={`ach reveal ach-${a.kind.toLowerCase()}`}>
                    <span className="ach-kind mono">{a.kind}</span>
                    <span className="ach-title">{a.title}</span>
                    {(a.detail || a.year) && <span className="ach-detail">{[a.detail, a.year].filter(Boolean).join(' · ')}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
