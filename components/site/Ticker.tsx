import type { Skill } from '@/lib/types';

/** Decorative scrolling strip of the tools and skills pulled from the Skills section. */
export default function Ticker({ skills }: { skills: Skill[] }) {
  const words = Array.from(new Set(skills.map((s) => s.name.split(' ')[0].replace(/[&,]/g, '')))).filter(Boolean).slice(0, 18);
  if (words.length < 3) return null;
  const row = words.map((w, i) => (
    <span key={i} className="ticker-item">
      {w.toUpperCase()}
      <i aria-hidden="true">◆</i>
    </span>
  ));
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        <div className="ticker-row">{row}</div>
        <div className="ticker-row">{row}</div>
      </div>
    </div>
  );
}
