'use client';

import { useState } from 'react';
import { COLLECTIONS } from '@/lib/schema';
import { CollectionPanel, CommentsPanel, MediaPanel, MessagesPanel, ProfilePanel } from './Panels';
import AnalyticsPanel from './AnalyticsPanel';
import ThemeToggleAdmin from './ThemeToggleAdmin';
import { Icon } from '@/components/site/Icon';

const TABS = [
  { id: 'profile', label: 'Profile & About' },
  { id: 'analytics', label: 'Analytics & Traffic' },
  ...Object.values(COLLECTIONS).map((c) => ({ id: c.name, label: c.label })),
  { id: 'comments', label: 'Blog Comments' },
  { id: 'messages', label: 'Messages' },
  { id: 'media', label: 'Media library' },
];

export default function Dashboard() {
  const [tab, setTab] = useState('profile');
  const current = TABS.find((t) => t.id === tab)!;

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/Maihehuadmin';
  }

  return (
    <div className="admin-root">
      <header className="admin-top">
        <strong className="admin-brand">Portfolio Admin</strong>
        <div className="admin-top-actions">
          <ThemeToggleAdmin />
          <a className="a-btn a-btn-ghost" href="/" target="_blank" rel="noopener noreferrer" title="View live site">
            <Icon name="eye" size={16} /> <span className="a-btn-text">View site</span>
          </a>
          <button className="a-btn a-btn-ghost" onClick={logout} title="Log out">
            <Icon name="logout" size={16} /> <span className="a-btn-text">Log out</span>
          </button>
        </div>
      </header>

      <div className="admin-body">
        <nav className="admin-nav" aria-label="Sections">
          {TABS.map((t) => (
            <button key={t.id} className={tab === t.id ? 'on' : ''} aria-current={tab === t.id} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </nav>
        <main className="admin-main">
          <h1>{current.label}</h1>
          {tab === 'profile' && <ProfilePanel />}
          {tab === 'analytics' && <AnalyticsPanel />}
          {tab === 'messages' && <MessagesPanel />}
          {tab === 'comments' && <CommentsPanel />}
          {tab === 'media' && <MediaPanel />}
          {COLLECTIONS[tab] && <CollectionPanel name={tab} />}
        </main>
      </div>
    </div>
  );
}
