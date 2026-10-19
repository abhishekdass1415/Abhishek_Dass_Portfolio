'use client';

import { useEffect, useRef } from 'react';
import { Icon } from './Icon';

const COLS = 12;
const ROWS = 8;
const CW = 40;
const CH = 36;

/** Black & white chequered flag. Each column ripples with a phase delay, producing a travelling wave. */
export function Flag() {
  return (
    <svg className="flag" viewBox="-14 -12 520 320" role="img" aria-label="Waving black and white chequered flag">
      <defs>
        <linearGradient id="pole" x1="0" x2="1">
          <stop offset="0" stopColor="#8d8f98" />
          <stop offset=".5" stopColor="#f4f4ee" />
          <stop offset="1" stopColor="#6a6d78" />
        </linearGradient>
      </defs>
      {Array.from({ length: COLS }, (_, c) => (
        <g key={c} className="fcol" style={{ ['--i' as string]: c, ['--amp' as string]: `${2 + c * 0.95}px` }}>
          {Array.from({ length: ROWS }, (_, r) => (
            <rect key={r} x={c * CW + 8} y={r * CH} width={CW + 0.6} height={CH + 0.6} fill={(c + r) % 2 ? '#0b0b0d' : '#fafaf5'} />
          ))}
          <rect className="fshade" x={c * CW + 8} y="0" width={CW + 0.6} height={ROWS * CH} fill="#000" />
        </g>
      ))}
      <rect x="-6" y="-12" width="14" height="320" rx="3" fill="url(#pole)" />
      <circle cx="1" cy="-12" r="8" fill="#FFD500" stroke="#0b0b0d" strokeWidth="2" />
    </svg>
  );
}

export default function FinishFlag({ onClose }: { onClose: () => void }) {
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    btn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const auto = setTimeout(onClose, 7000);
    return () => {
      window.removeEventListener('keydown', onKey);
      clearTimeout(auto);
      prev?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="finish" role="dialog" aria-modal="true" aria-labelledby="finish-title" onClick={onClose}>
      <div className="finish-card" onClick={(e) => e.stopPropagation()}>
        <Flag />
        <h2 id="finish-title" className="finish-title">
          Chequered flag!
        </h2>
        <p>You have completed the full lap. Thanks for riding along.</p>
        <div className="finish-actions">
          <a
            href="#contact"
            className="btn btn-primary"
            onClick={onClose}
          >
            Say hello <Icon name="arrowRight" />
          </a>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              onClose();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <Icon name="arrowUp" /> Lap again
          </button>
          <button ref={btn} type="button" className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
