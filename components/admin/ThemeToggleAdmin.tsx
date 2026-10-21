'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/site/Icon';

export default function ThemeToggleAdmin() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const active = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
    setTheme(active);

    const observer = new MutationObserver(() => {
      const current = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
      setTheme(current);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {}
    setTheme(next);
  };

  if (!mounted) {
    return (
      <button type="button" className="a-btn a-btn-ghost theme-toggle-btn" disabled aria-hidden="true">
        <Icon name="moon" size={16} /> Theme
      </button>
    );
  }

  return (
    <button
      type="button"
      className="a-btn a-btn-ghost theme-toggle-btn"
      onClick={toggle}
      title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
      aria-label={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
    >
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />
      <span className="a-btn-text">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
    </button>
  );
}
