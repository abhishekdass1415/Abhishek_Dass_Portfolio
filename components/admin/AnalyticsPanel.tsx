'use client';

import { useEffect, useState, useCallback } from 'react';
import { api } from './FieldInput';
import { Icon } from '@/components/site/Icon';

interface RecentVisit {
  id: string;
  timestamp: string;
  path: string;
  referrer: string;
  device: string;
}

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  todayDate: string;
  todayViews: number;
  todayUniques: number;
  devices: { desktop: number; mobile: number };
  referrers: Record<string, number>;
  topPages: Record<string, number>;
  recentVisitors: RecentVisit[];
}

function timeAgo(dateString: string): string {
  try {
    const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  } catch {
    return dateString;
  }
}

export default function AnalyticsPanel() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const res = await api('/api/admin/analytics');
      setData(res);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleReset() {
    if (!confirm('Are you sure you want to reset all portfolio visitor analytics?')) return;
    try {
      await api('/api/admin/analytics', 'DELETE');
      await loadData();
    } catch (err: any) {
      alert('Error resetting: ' + err.message);
    }
  }

  if (loading && !data) return <p className="a-muted">Loading analytics data…</p>;
  if (error && !data) return <p className="a-error">{error}</p>;

  const stats = data || {
    totalViews: 0,
    uniqueVisitors: 0,
    todayDate: '',
    todayViews: 0,
    todayUniques: 0,
    devices: { desktop: 0, mobile: 0 },
    referrers: {},
    topPages: {},
    recentVisitors: [],
  };

  const totalDevices = (stats.devices.desktop || 0) + (stats.devices.mobile || 0);
  const desktopPct = totalDevices ? Math.round((stats.devices.desktop / totalDevices) * 100) : 0;
  const mobilePct = totalDevices ? Math.round((stats.devices.mobile / totalDevices) * 100) : 0;

  const topReferrers = Object.entries(stats.referrers || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  const topPagesList = Object.entries(stats.topPages || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  return (
    <div className="stack">
      {/* Top GA4 Banner */}
      <section className="a-card ga-banner">
        <div className="ga-banner-content">
          <div className="ga-badge-row">
            <span className="live-dot" />
            <span className="ga-tag">Google Analytics 4 Active</span>
            <code className="ga-id">G-HXDTTFVD9H</code>
          </div>
          <p className="ga-desc">
            GA4 is tracking real-time events, user sessions, geographic locations, and audience demographics.
          </p>
        </div>
        <div className="ga-banner-actions">
          <a
            href="https://analytics.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="a-btn a-btn-primary"
          >
            Open GA4 Console <Icon name="arrowUpRight" size={16} />
          </a>
          <button
            onClick={loadData}
            disabled={isRefreshing}
            className="a-btn a-btn-ghost"
            title="Refresh local stats"
          >
            <Icon name="refresh" size={16} /> {isRefreshing ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </section>

      {/* KPI Cards */}
      <div className="analytics-kpis">
        <div className="kpi-card">
          <div className="kpi-head">
            <span className="kpi-label">TOTAL PAGE VIEWS</span>
            <Icon name="eye" size={18} />
          </div>
          <div className="kpi-value">{stats.totalViews.toLocaleString()}</div>
          <div className="kpi-sub">Lifetime page impressions</div>
        </div>

        <div className="kpi-card highlight">
          <div className="kpi-head">
            <span className="kpi-label">UNIQUE VISITORS</span>
            <Icon name="users" size={18} />
          </div>
          <div className="kpi-value">{stats.uniqueVisitors.toLocaleString()}</div>
          <div className="kpi-sub">Individual people visited</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-head">
            <span className="kpi-label">TODAY&apos;S TRAFFIC</span>
            <Icon name="barChart" size={18} />
          </div>
          <div className="kpi-value">{stats.todayViews.toLocaleString()}</div>
          <div className="kpi-sub">
            <strong>{stats.todayUniques}</strong> unique {stats.todayUniques === 1 ? 'visitor' : 'visitors'} today
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-head">
            <span className="kpi-label">DEVICES</span>
            <Icon name="monitor" size={18} />
          </div>
          <div className="kpi-value">{desktopPct}% / {mobilePct}%</div>
          <div className="kpi-sub">
            <span title="Desktop">💻 {stats.devices.desktop || 0}</span> ·{' '}
            <span title="Mobile">📱 {stats.devices.mobile || 0}</span>
          </div>
        </div>
      </div>

      {/* Two-column layout: Top Referrers & Top Pages */}
      <div className="analytics-grid">
        <section className="a-card">
          <header className="a-card-head">
            <div>
              <h2>Traffic Sources (Referrers)</h2>
              <p className="a-muted">Where your visitors are finding you</p>
            </div>
            <Icon name="globe" size={18} />
          </header>
          {topReferrers.length === 0 ? (
            <p className="a-muted">No referrer data recorded yet.</p>
          ) : (
            <div className="analytics-list">
              {topReferrers.map(([ref, count]) => {
                const pct = stats.totalViews ? Math.round((count / stats.totalViews) * 100) : 0;
                return (
                  <div key={ref} className="stat-row">
                    <div className="stat-info">
                      <span className="stat-name" title={ref}>{ref}</span>
                      <span className="stat-count">
                        <strong>{count}</strong> ({pct}%)
                      </span>
                    </div>
                    <div className="stat-bar-track">
                      <div className="stat-bar-fill" style={{ width: `${Math.min(100, Math.max(8, pct))}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="a-card">
          <header className="a-card-head">
            <div>
              <h2>Top Visited Pages</h2>
              <p className="a-muted">Most popular pages on your portfolio</p>
            </div>
            <Icon name="pin" size={18} />
          </header>
          {topPagesList.length === 0 ? (
            <p className="a-muted">No page view data recorded yet.</p>
          ) : (
            <div className="analytics-list">
              {topPagesList.map(([page, count]) => {
                const pct = stats.totalViews ? Math.round((count / stats.totalViews) * 100) : 0;
                return (
                  <div key={page} className="stat-row">
                    <div className="stat-info">
                      <code className="stat-name" title={page}>{page}</code>
                      <span className="stat-count">
                        <strong>{count}</strong> ({pct}%)
                      </span>
                    </div>
                    <div className="stat-bar-track">
                      <div className="stat-bar-fill accent" style={{ width: `${Math.min(100, Math.max(8, pct))}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Recent Activity Log */}
      <section className="a-card">
        <header className="a-card-head">
          <div>
            <h2>Recent Visitor Stream</h2>
            <p className="a-muted">Live activity log of visitors browsing your site</p>
          </div>
          <button onClick={handleReset} className="pencil danger" title="Reset all analytics data">
            <Icon name="trash" size={16} />
          </button>
        </header>

        {(!stats.recentVisitors || stats.recentVisitors.length === 0) ? (
          <p className="a-muted">Waiting for visitors... visits will appear here in real-time.</p>
        ) : (
          <div className="visitors-stream">
            {stats.recentVisitors.map((visit) => (
              <div key={visit.id} className="visitor-row">
                <div className="visitor-device">
                  {visit.device === 'Mobile' ? (
                    <span className="dev-tag mobile" title="Mobile Phone">
                      <Icon name="smartphone" size={14} /> Mobile
                    </span>
                  ) : (
                    <span className="dev-tag desktop" title="Desktop / Laptop">
                      <Icon name="monitor" size={14} /> Desktop
                    </span>
                  )}
                </div>
                <div className="visitor-path" title={visit.path}>
                  <code>{visit.path}</code>
                </div>
                <div className="visitor-referrer" title={visit.referrer}>
                  <span className="a-muted">via</span> {visit.referrer}
                </div>
                <div className="visitor-time a-muted">
                  {timeAgo(visit.timestamp)}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
