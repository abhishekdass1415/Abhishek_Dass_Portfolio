import { NextRequest } from 'next/server';
import { fail, ok, readJson, refreshSite, requireAdmin } from '@/lib/api';
import { getPortfolio } from '@/lib/data';
import { PROFILE_ALL_FIELDS, sanitize } from '@/lib/schema';
import { setSingleton } from '@/lib/store';

export async function GET() {
  const { profile } = await getPortfolio();
  return ok(profile);
}

export async function PUT(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const body = await readJson(req);
  if (!body) return fail('Invalid JSON body');

  const result = sanitize(PROFILE_ALL_FIELDS, body, true);
  if (!result.ok) return fail(result.error);

  await setSingleton('profile', result.data);
  refreshSite();
  const { profile } = await getPortfolio();
  return ok({ ...profile, ...result.data });
}
