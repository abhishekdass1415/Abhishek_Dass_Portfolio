import type { Skill } from '@/lib/types';

/** Decorative scrolling strip of the tools and skills pulled from the Skills section. */
export default function Ticker({ skills }: { skills: Skill[] }) {
  // Use exact names of skills added in the Skills section
  const skillNames = Array.from(
    new Set(
      skills
        .map((s) => s.name?.trim())
        .filter((name): name is string => Boolean(name))
    )
  );

  if (skillNames.length === 0) return null;

  // Ensure enough items to smoothly fill wide viewports and loop continuously
  let displayList = skillNames;
  while (displayList.length < 12) {
    displayList = [...displayList, ...skillNames];
  }

  const row = displayList.map((name, i) => (
    <span key={i} className="ticker-item">
      {name.toUpperCase()}
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
