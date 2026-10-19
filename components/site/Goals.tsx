import type { Goal } from '@/lib/types';
import SectionHead from './SectionHead';

export default function Goals({ goals }: { goals: Goal[] }) {
  const short = goals.filter((g) => g.type === 'Short-term');
  const long = goals.filter((g) => g.type !== 'Short-term');

  const col = (title: string, sub: string, items: Goal[], variant: string) =>
    items.length > 0 && (
      <div className={`goal-col ${variant}`}>
        <h3 className="goal-col-head reveal">
          <span>{title}</span>
          <small className="mono">{sub}</small>
        </h3>
        <ol className="goal-list">
          {items.map((g, i) => (
            <li key={g.id} className="goal card reveal" style={{ ['--d' as string]: `${i * 80}ms` }}>
              <span className="goal-n mono" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h4>{g.title}</h4>
                <p>{g.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    );

  return (
    <section id="goals" className="section" aria-labelledby="goals-title">
      <div className="container">
        <SectionHead index="06" title="Goals & Mission" id="goals-title" kicker="// the race plan" />
        <div className="goal-grid">
          {col('Short-term', 'NEXT PIT STOP', short, 'is-short')}
          {col('Long-term', 'THE CHAMPIONSHIP', long, 'is-long')}
        </div>
      </div>
    </section>
  );
}
