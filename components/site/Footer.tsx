import type { Profile } from '@/lib/types';
import Socials from './Socials';

const links = ['About', 'Projects', 'Experience', 'Skills', 'Goals', 'Contact'];

export default function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="site-footer on-dark">
      <div className="container footer-inner">
        <div>
          <p className="footer-name">{profile.name}</p>
          <p className="footer-note">{profile.footerNote}</p>
          <Socials profile={profile} />
        </div>
        <nav aria-label="Footer">
          {links.map((l) => (
            <a key={l} href={`/#${l.toLowerCase()}`}>
              {l}
            </a>
          ))}
        </nav>
      </div>
      <div className="container footer-bottom mono">
        <span>
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </span>
        <span>Built with Next.js</span>
      </div>
    </footer>
  );
}
