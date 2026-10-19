import type { Portfolio } from '@/lib/types';
import CircuitBackdrop from './CircuitBackdrop';
import RoleRotator from './RoleRotator';
import Socials from './Socials';
import { Icon } from './Icon';

export default function Hero({ data }: { data: Portfolio }) {
  const { profile, stats } = data;
  const [first, ...rest] = profile.name.split(' ');

  return (
    <section id="home" className="hero on-dark" aria-labelledby="hero-name">
      <div className="hero-grid-bg" aria-hidden="true" />
      <CircuitBackdrop />

      <div className="container hero-inner">
        <div className="hero-copy">
          {profile.availability && (
            <p className="badge reveal">
              <i className="dot" aria-hidden="true" />
              {profile.availability}
            </p>
          )}

          <h1 id="hero-name" className="hero-name">
            <span className="hero-name-a">{first}</span>
            {rest.length > 0 && <span className="hero-name-b">{rest.join(' ')}</span>}
          </h1>

          <p className="hero-title">{profile.title}</p>

          {profile.roles.length > 0 && (
            <p className="hero-roles mono" aria-label="Roles">
              <span className="prompt" aria-hidden="true">
                &gt;
              </span>
              <RoleRotator roles={profile.roles} />
              <span className="caret" aria-hidden="true" />
            </p>
          )}

          <p className="hero-tagline">{profile.tagline}</p>

          <div className="hero-cta">
            <a href="#projects" className="btn btn-primary">
              See My Work <Icon name="arrowRight" />
            </a>
            {profile.resume && (
              <a href={profile.resume} className="btn btn-ghost" download target="_blank" rel="noopener">
                <Icon name="download" /> Download Resume
              </a>
            )}
            <a href="#contact" className="btn btn-ghost">
              Get in touch
            </a>
          </div>

          <Socials profile={profile} className="hero-socials" />
        </div>

        <figure className="portrait" aria-label="Portrait">
          <div className="portrait-block" aria-hidden="true" />
          <div className="portrait-frame">
            {profile.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.photo} alt={profile.photoAlt || profile.name} width={900} height={900} fetchPriority="high" decoding="async" />
            ) : (
              <span className="portrait-fallback" aria-hidden="true">
                {profile.name.slice(0, 1)}
              </span>
            )}
            <span className="tick tl" aria-hidden="true" />
            <span className="tick tr" aria-hidden="true" />
            <span className="tick bl" aria-hidden="true" />
            <span className="tick br" aria-hidden="true" />
          </div>
          <figcaption className="portrait-caption mono">
            <span>
              <b>DRIVER</b> {profile.name.toUpperCase()}
            </span>
            {profile.location && (
              <span>
                <b>BASE</b> {profile.location.split(',')[0].toUpperCase()}
              </span>
            )}
          </figcaption>
          <span className="car-number mono" aria-hidden="true">
            #{first.slice(0, 1)}
            {rest[0]?.slice(0, 1) ?? ''}
          </span>
        </figure>
      </div>

      {stats.length > 0 && (
        <div className="container">
          <dl className="stats">
            {stats.map((s, i) => (
              <div key={s.id} className="stat reveal" style={{ ['--d' as string]: `${i * 80}ms` }}>
                <dt className="stat-value">{s.value}</dt>
                <dd className="stat-label">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <a href="#about" className="scroll-cue mono" aria-label="Scroll to About">
        <span>SCROLL</span>
        <i aria-hidden="true" />
      </a>
    </section>
  );
}
