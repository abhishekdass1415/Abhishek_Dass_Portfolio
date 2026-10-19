import type { Profile } from '@/lib/types';
import { Icon, type IconName } from './Icon';

export function socialLinks(p: Profile): { key: IconName; label: string; href: string }[] {
  return [
    { key: 'linkedin' as const, label: 'LinkedIn', href: p.linkedin },
    { key: 'github' as const, label: 'GitHub', href: p.github },
    { key: 'x' as const, label: 'Twitter / X', href: p.twitter },
    { key: 'instagram' as const, label: 'Instagram', href: p.instagram },
    { key: 'mail' as const, label: 'Email', href: p.email ? `mailto:${p.email}` : '' },
  ].filter((s) => s.href);
}

export default function Socials({ profile, className = '' }: { profile: Profile; className?: string }) {
  const links = socialLinks(profile);
  return (
    <ul className={`socials ${className}`} aria-label="Social links">
      {links.map((s) => (
        <li key={s.key}>
          <a
            href={s.href}
            className="icon-btn"
            aria-label={s.label}
            title={s.label}
            {...(s.key !== 'mail' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            <Icon name={s.key} />
          </a>
        </li>
      ))}
    </ul>
  );
}
