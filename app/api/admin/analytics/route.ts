import { NextRequest } from 'next/server';
import { fail, ok, requireAdmin } from '@/lib/api';
import * as store from '@/lib/store';

const DEFAULT_ANALYTICS = {
  totalViews: 0,
  uniqueVisitors: 0,
  todayDate: new Date().toISOString().slice(0, 10),
  todayViews: 0,
  todayUniques: 0,
  devices: { desktop: 0, mobile: 0 },
  referrers: {},
  topPages: {},
  recentVisitors: [],
};

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const data = (await store.getSingleton('analytics_summary')) || DEFAULT_ANALYTICS;
  return ok(data);
}

export async function DELETE(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  await store.setSingleton('analytics_summary', DEFAULT_ANALYTICS);
  return ok({ message: 'Analytics reset successfully' });
}
