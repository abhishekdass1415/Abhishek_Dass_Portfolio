/** Pure sorting helpers shared by the public site (server) and the admin panel (client). */

export const byOrder = <T extends { order?: number; createdAt?: string }>(a: T, b: T) =>
  (a.order ?? 0) - (b.order ?? 0) || String(a.createdAt ?? '').localeCompare(String(b.createdAt ?? ''));

/** Newest first: ongoing roles on top, then by end date, then start date. */
export const byRecency = <T extends { start?: string; end?: string; current?: boolean }>(a: T, b: T) => {
  const key = (x: T) => (x.current || !x.end ? '9999-99' : x.end);
  return key(b).localeCompare(key(a)) || String(b.start ?? '').localeCompare(String(a.start ?? ''));
};

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
