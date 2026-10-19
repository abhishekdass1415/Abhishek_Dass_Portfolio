import { cache } from 'react';
import * as store from './store';
import { seedPortfolio } from './seed';
import type { Portfolio, Experience, Education, Project } from './types';

const byOrder = <T extends { order?: number; createdAt?: string }>(a: T, b: T) =>
  (a.order ?? 0) - (b.order ?? 0) || String(a.createdAt ?? '').localeCompare(String(b.createdAt ?? ''));

/** Newest first: ongoing roles on top, then by end date, then start date. */
const byRecency = <T extends { start?: string; end?: string; current?: boolean }>(a: T, b: T) => {
  const key = (x: T) => (x.current || !x.end ? '9999-99' : x.end);
  return key(b).localeCompare(key(a)) || String(b.start ?? '').localeCompare(String(a.start ?? ''));
};

export const getPortfolio = cache(async (): Promise<Portfolio> => {
  try {
    const [profile, stats, projects, experience, education, skills, goals, achievements] = await Promise.all([
      store.getSingleton('profile'),
      store.list('stats'),
      store.list('projects'),
      store.list('experience'),
      store.list('education'),
      store.list('skills'),
      store.list('goals'),
      store.list('achievements'),
    ]);
    return {
      profile: { ...seedPortfolio.profile, ...(profile ?? {}) },
      stats: (stats as any[]).sort(byOrder),
      projects: (projects as any[]).sort(byOrder),
      experience: (experience as Experience[]).sort(byRecency),
      education: (education as Education[]).sort(byRecency),
      skills: (skills as any[]).sort(byOrder),
      goals: (goals as any[]).sort(byOrder),
      achievements: (achievements as any[]).sort(byOrder),
    };
  } catch (err) {
    console.error('[portfolio] Data store unavailable, showing built-in content:', err);
    return seedPortfolio;
  }
});

export async function getProject(id: string): Promise<Project | null> {
  const { projects } = await getPortfolio();
  return projects.find((p) => p.id === id) ?? null;
}

export async function getExperience(id: string): Promise<Experience | null> {
  const { experience } = await getPortfolio();
  return experience.find((e) => e.id === id) ?? null;
}

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
}

/** "2023-05" → "May 2023" */
export function formatMonth(m?: string) {
  if (!m) return '';
  const [y, mo] = m.split('-').map(Number);
  if (!y || !mo) return '';
  return new Date(Date.UTC(y, mo - 1, 1)).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

/** "5 mos" / "2 yrs 10 mos" between two months (end defaults to now). */
export function duration(start?: string, end?: string, current?: boolean) {
  if (!start) return '';
  const [sy, sm] = start.split('-').map(Number);
  const now = new Date();
  const [ey, em] = end && !current ? end.split('-').map(Number) : [now.getUTCFullYear(), now.getUTCMonth() + 1];
  let months = (ey - sy) * 12 + (em - sm) + 1;
  if (months < 1) months = 1;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y ? `${y} yr${y > 1 ? 's' : ''}` : '', m ? `${m} mo${m > 1 ? 's' : ''}` : ''].filter(Boolean).join(' ');
}
