'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import { Icon } from './Icon';

const links = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'blog', label: 'Blog' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'goals', label: 'Goals' },
  { id: 'contact', label: 'Contact' },
];

export default function Header({ name }: { name: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  const isBlogRoute = pathname?.startsWith('/blog');

  useEffect(() => {
    let prev = false;
    const onScroll = () => {
      const next = window.scrollY > 24;
      if (next !== prev) {
        prev = next;
        setScrolled(next);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-spy: highlight the section currently in the middle of the viewport.
  useEffect(() => {
    const els = links.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (isBlogRoute) {
    return (
      <header className={`site-header${scrolled ? ' is-solid' : ''}`}>
        <div className="container header-inner">
          <a href="/blog" className="brand" aria-label="Abhishek Dass Blog">
            <span className="brand-mark">{initials}</span>
            <span className="brand-name" style={{ display: 'inline', fontWeight: 800 }}>
              {name} <span style={{ color: 'var(--y)', fontWeight: 600, fontSize: '0.9rem', marginLeft: '4px' }}>// Blog</span>
            </span>
          </a>

          <div className="header-actions" style={{ alignItems: 'center', gap: '12px' }}>
            <a
              href="/#blog"
              onClick={(e) => {
                if (window.history.length > 1 && document.referrer.includes(window.location.host)) {
                  e.preventDefault();
                  window.history.back();
                }
              }}
              className="btn btn-ghost"
              style={{ padding: '6px 14px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Icon name="arrowRight" size={14} style={{ transform: 'rotate(180deg)' }} /> Back to Portfolio
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={`site-header${scrolled || open ? ' is-solid' : ''}`}>
      <div className="container header-inner">
        <a href="/" className="brand" aria-label={`${name}, home`}>
          <span className="brand-mark">{initials}</span>
          <span className="brand-name">{name}</span>
        </a>

        <nav aria-label="Primary" className="nav-desktop">
          {links.map((l) => {
            const href = `/#${l.id}`;
            return (
              <a
                key={l.id}
                href={href}
                className={active === l.id ? 'is-active' : ''}
                aria-current={active === l.id ? 'true' : undefined}
              >
                {l.label}
              </a>
            );
          })}
        </nav>

        <div className="header-actions">
          <ThemeToggle />
          <button
            type="button"
            className="icon-btn nav-burger"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>

      <nav id="mobile-nav" aria-label="Mobile" className={`nav-mobile${open ? ' is-open' : ''}`} hidden={!open}>
        {links.map((l, i) => {
          const href = `/#${l.id}`;
          return (
            <a
              key={l.id}
              href={href}
              onClick={() => setOpen(false)}
              style={{ ['--i' as string]: i }}
            >
              <span className="mono">0{i + 1}</span>
              {l.label}
            </a>
          );
        })}
      </nav>
    </header>
  );
}
