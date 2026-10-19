import type { Profile } from '@/lib/types';
import SectionHead from './SectionHead';
import Socials from './Socials';

export default function About({ profile }: { profile: Profile }) {
  const paragraphs = profile.about.split(/\n\s*\n/).filter(Boolean);
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container">
        <SectionHead index="01" title="About" id="about-title" kicker="// the driver" />

        <div className="about-grid">
          <div className="about-copy">
            <p className="about-lead reveal">{profile.tagline}</p>
            {paragraphs.map((p, i) => (
              <p key={i} className="reveal">
                {p}
              </p>
            ))}
          </div>

          <aside className="spec card reveal" aria-label="Quick facts">
            <h3 className="spec-title mono">SPEC SHEET</h3>
            <dl className="spec-list">
              <div>
                <dt>NAME</dt>
                <dd>{profile.name}</dd>
              </div>
              {profile.location && (
                <div>
                  <dt>BASE</dt>
                  <dd>{profile.location}</dd>
                </div>
              )}
              {profile.email && (
                <div>
                  <dt>EMAIL</dt>
                  <dd>
                    <a href={`mailto:${profile.email}`}>{profile.email}</a>
                  </dd>
                </div>
              )}
              {profile.phone && (
                <div>
                  <dt>PHONE</dt>
                  <dd>
                    <a href={`tel:${profile.phone.replace(/\s/g, '')}`}>{profile.phone}</a>
                  </dd>
                </div>
              )}
            </dl>
            {profile.facts.length > 0 && (
              <ul className="facts">
                {profile.facts.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            )}
            <Socials profile={profile} />
          </aside>
        </div>
      </div>
    </section>
  );
}
