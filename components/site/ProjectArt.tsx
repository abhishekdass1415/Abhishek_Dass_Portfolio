import type { ReactNode } from 'react';

const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
};

/** A tiny seeded RNG so the same project always gets the same artwork. */
const rng = (seed: number) => () => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 4294967296;
};

const glyphs: Record<string, ReactNode> = {
  Motorsport: (
    <g fill="none" stroke="#FFD500" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
      <path d="M170 210h260l24-18 40-6v-14l-70-10-30-28h-60l-18 24h-96l-14-22-30 4 6 30z" />
      <circle cx="225" cy="218" r="26" fill="#0C0D10" />
      <circle cx="395" cy="218" r="26" fill="#0C0D10" />
      <path d="M280 156l20-26h50" />
    </g>
  ),
  'AI / Data Science': (
    <g stroke="#39FF14" strokeWidth="2">
      {[
        [170, 110, 300, 80], [170, 110, 300, 170], [170, 110, 300, 260], [170, 230, 300, 80], [170, 230, 300, 170], [170, 230, 300, 260],
        [300, 80, 430, 140], [300, 170, 430, 140], [300, 260, 430, 140], [300, 80, 430, 220], [300, 170, 430, 220], [300, 260, 430, 220],
      ].map(([a, b, c, d], i) => (
        <line key={i} x1={a} y1={b} x2={c} y2={d} opacity=".55" />
      ))}
      {[[170, 110], [170, 230], [300, 80], [300, 170], [300, 260], [430, 140], [430, 220]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="12" fill="#0C0D10" stroke="#FFD500" strokeWidth="3" />
      ))}
    </g>
  ),
  Software: (
    <g fill="none" stroke="#FFD500" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="150" y="90" width="300" height="170" />
      <path d="M150 122h300" />
      <circle cx="170" cy="106" r="4" fill="#FFD500" />
      <circle cx="188" cy="106" r="4" fill="#39FF14" stroke="none" />
      <path d="M235 170l-30 25 30 25M365 170l30 25-30 25M320 160l-40 70" />
    </g>
  ),
  Aerospace: (
    <g fill="none" stroke="#39FF14" strokeWidth="2.5">
      <ellipse cx="300" cy="175" rx="190" ry="70" transform="rotate(-18 300 175)" opacity=".6" strokeDasharray="6 8" />
      <circle cx="300" cy="175" r="34" stroke="#FFD500" strokeWidth="3" fill="#0C0D10" />
      <path d="M255 175h-40M345 175h40M300 130v-26M300 220v26" stroke="#FFD500" strokeWidth="3" />
      <rect x="196" y="160" width="26" height="30" stroke="#FFD500" strokeWidth="3" />
      <rect x="378" y="160" width="26" height="30" stroke="#FFD500" strokeWidth="3" />
    </g>
  ),
  Research: (
    <g fill="none" stroke="#FFD500" strokeWidth="3" strokeLinecap="round">
      <path d="M170 90v170h260" />
      <path d="M190 230l50-40 40 20 50-70 50 30 50-60" stroke="#39FF14" />
      {[[240, 190], [280, 210], [330, 140], [380, 170], [430, 110]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="6" fill="#0C0D10" />
      ))}
    </g>
  ),
  Startup: (
    <g fill="none" stroke="#FFD500" strokeWidth="3" strokeLinejoin="round">
      <path d="M300 80c40 30 56 80 40 140h-80c-16-60 0-110 40-140z" />
      <circle cx="300" cy="150" r="14" stroke="#39FF14" />
      <path d="M260 220l-32 36 44-8M340 220l32 36-44-8" />
      <path d="M284 236v34M300 240v50M316 236v34" stroke="#39FF14" />
    </g>
  ),
  Marketing: (
    <g fill="none" stroke="#FFD500" strokeWidth="3" strokeLinejoin="round">
      <path d="M170 250V190h50v60zM250 250V150h50v100zM330 250V110h50v140zM410 250V70h50v180z" />
      <path d="M170 150l80-40 80-30 130-30" stroke="#39FF14" />
    </g>
  ),
};

export default function ProjectArt({ category, seed }: { category: string; seed: string }) {
  const r = rng(hash(seed));
  const trace = Array.from({ length: 17 }, (_, i) => `${i * 37.5},${300 + Math.round((r() - 0.5) * 36)}`).join(' ');
  const glyph = glyphs[category] ?? glyphs.Software;
  return (
    <svg className="art" viewBox="0 0 600 340" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${category} project artwork`}>
      <rect width="600" height="340" fill="#14161B" />
      <g stroke="#2A2D35" strokeWidth="1">
        {Array.from({ length: 16 }, (_, i) => (
          <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="340" />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 40} x2="600" y2={i * 40} />
        ))}
      </g>
      <polyline points={trace} fill="none" stroke="#FFD500" strokeWidth="2" opacity=".45" />
      <rect x="0" y="0" width="14" height="340" fill="#FFD500" opacity=".9" />
      {glyph}
      <text x="30" y="36" fill="#9396A1" fontFamily="monospace" fontSize="13" letterSpacing="2">
        {category.toUpperCase()}
      </text>
    </svg>
  );
}
