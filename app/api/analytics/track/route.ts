import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import * as store from '@/lib/store';

const COOKIE_VISITOR = '_pv_uid';
const COOKIE_DAY = '_pv_day';

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

const DEFAULT_ANALYTICS: AnalyticsData = {
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

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    const text = await req.text();
    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        // Ignore JSON parse errors
      }
    }

    const path = typeof body.path === 'string' && body.path ? body.path.slice(0, 80) : '/';
    const referrer = typeof body.referrer === 'string' && body.referrer ? body.referrer.slice(0, 60) : 'Direct';
    const device = body.device === 'Mobile' ? 'Mobile' : 'Desktop';

    // Ignore admin visits
    if (path.startsWith('/Maihehuadmin') || path.startsWith('/api')) {
      return NextResponse.json({ ok: true });
    }

    const today = new Date().toISOString().slice(0, 10);
    const existingUid = req.cookies.get(COOKIE_VISITOR)?.value;
    const existingDay = req.cookies.get(COOKIE_DAY)?.value;

    const isNewUnique = !existingUid;
    const isNewToday = existingDay !== today;
    const visitorUid = existingUid || randomUUID();

    const current = (await store.getSingleton<AnalyticsData>('analytics_summary')) || DEFAULT_ANALYTICS;

    const isNewDayRoll = current.todayDate !== today;
    const todayViews = isNewDayRoll ? 1 : (current.todayViews || 0) + 1;
    const todayUniques = isNewDayRoll
      ? (isNewToday ? 1 : 0)
      : (current.todayUniques || 0) + (isNewToday ? 1 : 0);

    const devices = {
      desktop: (current.devices?.desktop || 0) + (device === 'Desktop' ? 1 : 0),
      mobile: (current.devices?.mobile || 0) + (device === 'Mobile' ? 1 : 0),
    };

    const referrers = { ...(current.referrers || {}) };
    referrers[referrer] = (referrers[referrer] || 0) + 1;

    const topPages = { ...(current.topPages || {}) };
    topPages[path] = (topPages[path] || 0) + 1;

    const recentVisitors = [
      {
        id: randomUUID().slice(0, 8),
        timestamp: new Date().toISOString(),
        path,
        referrer,
        device,
      },
      ...(current.recentVisitors || []),
    ].slice(0, 40);

    const updated: AnalyticsData = {
      totalViews: (current.totalViews || 0) + 1,
      uniqueVisitors: (current.uniqueVisitors || 0) + (isNewUnique ? 1 : 0),
      todayDate: today,
      todayViews,
      todayUniques,
      devices,
      referrers,
      topPages,
      recentVisitors,
    };

    await store.setSingleton('analytics_summary', updated);

    const res = NextResponse.json({ ok: true });

    // Set 1-year visitor cookie and 1-day session cookie
    if (isNewUnique) {
      res.cookies.set(COOKIE_VISITOR, visitorUid, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
        httpOnly: true,
      });
    }

    if (isNewToday) {
      res.cookies.set(COOKIE_DAY, today, {
        path: '/',
        maxAge: 60 * 60 * 24,
        sameSite: 'lax',
        httpOnly: true,
      });
    }

    return res;
  } catch (err) {
    console.error('[analytics] tracking error:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
