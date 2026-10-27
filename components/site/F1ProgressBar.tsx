'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import FinishFlag from './FinishFlag';

/**
 * Scroll progress as a race: the car travels along the track as you scroll,
 * and when it reaches the finish line a chequered flag waves on screen.
 * Uses 100% GPU transforms (translate3d / scaleX) to completely eliminate layout reflow during scroll.
 */
export default function F1ProgressBar() {
  const bar = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const armed = useRef(true);
  const [finished, setFinished] = useState(false);
  const close = useCallback(() => setFinished(false), []);

  useEffect(() => {
    let raf = 0;
    try {
      localStorage.removeItem('flagShown');
      if (sessionStorage.getItem('flagShown')) armed.current = false;
    } catch {}

    let maxScroll = 1;
    let trackWidth = 0;
    const carWidth = 62;
    const finishWidth = 22;

    const measure = () => {
      maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (trackRef.current) {
        trackWidth = trackRef.current.clientWidth;
      }
    };

    let lastPct = -1;

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const p = maxScroll > 240 ? Math.min(1, Math.max(0, y / maxScroll)) : 0;

      // Pure GPU composited transforms - ZERO layout or reflow
      const availableTravel = Math.max(0, trackWidth - carWidth - finishWidth);
      const carX = p * availableTravel;

      if (carRef.current) {
        carRef.current.style.transform = `translate3d(${carX}px, 0, 0)`;
      }
      if (fillRef.current) {
        // scale fill bar horizontally on GPU
        const fillScale = trackWidth > 0 ? (carX + carWidth * 0.5) / trackWidth : p;
        fillRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, fillScale))})`;
      }

      const pct = Math.round(p * 100);
      if (pct !== lastPct) {
        lastPct = pct;
        if (label.current) label.current.textContent = `${pct}%`;
      }

      if (p >= 0.995 && armed.current) {
        armed.current = false;
        try {
          sessionStorage.setItem('flagShown', '1');
        } catch {}
        setFinished(true);
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    measure();
    update();

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', () => {
      measure();
      schedule();
    }, { passive: true });

    return () => {
      window.removeEventListener('scroll', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="f1-bar" ref={bar} aria-hidden="true">
        <span className="f1-label mono">LAP</span>
        <div className="f1-track" ref={trackRef}>
          <div className="f1-fill" ref={fillRef} />
          <div className="f1-car" ref={carRef}>
            <svg width="62" height="30" viewBox="0 0 50 24">
              <path d="M10 17 L42 17 L40 19 L12 19 Z" fill="#121620" />
              <path d="M2 5 L7 5 L8 12 L4 12 Z" fill="#161a24" />
              <path d="M1 7 L6 6 L6 9 L1 9 Z" fill="#e01e37" />
              <rect x="0.5" y="5" width="2" height="9" rx="0.5" fill="#161a24" />
              <path d="M8 13 L12 10 L20 8 L32 9 L42 12 L47 13 L47 15 L40 16 L28 17 L14 17 L8 15 Z" fill="#1d2230" />
              <path d="M16 13 L28 12 L35 14 L32 16 L16 16 Z" fill="#e01e37" opacity="0.9" />
              <path d="M22 9 C22 7, 27 7, 27 9 L28 11 L21 11 Z" fill="#161a24" />
              <ellipse cx="24.5" cy="10.5" rx="3.5" ry="1.5" fill="#ffffff" />
              <polygon points="20,8 22,6 24,6 23,8" fill="#161a24" />
              <rect x="21" y="5" width="3" height="1.5" fill="#FFD500" />
              <path d="M43 12.5 L46 13 L46 14 L42 13.5 Z" fill="#FFD500" />
              <path d="M42 13 L49 13 L50 15 L44 16 Z" fill="#161a24" />
              <path d="M45 12 L49 12 L48 13 L44 13 Z" fill="#e01e37" />
              <rect x="48.5" y="11" width="1.5" height="4" fill="#161a24" />
              <circle cx="13" cy="16" r="5" fill="#0d0f14" />
              <circle cx="13" cy="16" r="3" fill="#2a2f3d" />
              <circle cx="13" cy="16" r="1" fill="#FFD500" />
              <circle cx="39" cy="16" r="5" fill="#0d0f14" />
              <circle cx="39" cy="16" r="3" fill="#2a2f3d" />
              <circle cx="39" cy="16" r="1" fill="#FFD500" />
              <ellipse cx="28" cy="10.5" rx="4" ry="2.2" fill="#FFD500" />
              <circle cx="28" cy="10.5" r="1.5" fill="#e01e37" />
            </svg>
          </div>
          <div className="f1-finish" />
        </div>
        <span className="f1-label mono" ref={label}>
          0%
        </span>
      </div>
      {finished && <FinishFlag onClose={close} />}
    </>
  );
}
