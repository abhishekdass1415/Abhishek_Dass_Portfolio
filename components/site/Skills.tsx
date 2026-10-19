import type { Skill } from '@/lib/types';
import { SKILL_LEVELS } from '@/lib/schema';
import SectionHead from './SectionHead';

export default function Skills({ skills }: { skills: Skill[] }) {
  const groups = new Map<string, Skill[]>();
  skills.forEach((s) => groups.set(s.category, [...(groups.get(s.category) ?? []), s]));

  return (
    <section id="skills" className="section section-alt" aria-labelledby="skills-title">
      <div className="container">
        <SectionHead index="05" title="Skills" id="skills-title" kicker="// the toolkit" />
        <p className="section-intro reveal">
          Grouped by area. The meters show how deep I am in each tool: <b>Learning</b>, <b>Working</b>, <b>Strong</b> or <b>Expert</b>. No fake 10/10 scores.
        </p>

        <div className="skill-grid">
          {Array.from(groups).map(([cat, items], gi) => (
            <article key={cat} className="card module reveal" style={{ ['--d' as string]: `${(gi % 3) * 80}ms` }}>
              <header className="module-head">
                <span className="mono">MOD-{String(gi + 1).padStart(2, '0')}</span>
                <h3>{cat}</h3>
              </header>
              <ul className="skill-list">
                {items.map((s) => {
                  const lvl = Math.max(0, SKILL_LEVELS.indexOf(s.level)) + 1;
                  return (
                    <li key={s.id} className="skill">
                      <span className="skill-name">{s.name}</span>
                      <span className="meter" role="img" aria-label={`${s.name}: ${s.level}`}>
                        {SKILL_LEVELS.map((_, i) => (
                          <i key={i} className={i < lvl ? 'on' : ''} style={{ ['--i' as string]: i }} />
                        ))}
                        <em className="mono">{s.level}</em>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
