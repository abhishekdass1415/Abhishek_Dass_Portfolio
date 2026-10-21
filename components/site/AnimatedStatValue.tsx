'use client';

import { useEffect, useRef, useState } from 'react';

export default function AnimatedStatValue({ value }: { value: string }) {
  // Extract number, prefix and suffix: e.g. "AIR 8" -> prefix "AIR ", num 8, suffix ""
  // "10K+" -> prefix "", num 10, suffix "K+"
  // "2+ yrs" -> prefix "", num 2, suffix "+ yrs"
  const match = value.match(/^(.*?)(\d+(?:\.\d+)?)(.*?)$/);

  const [displayNum, setDisplayNum] = useState<number | null>(null);
  const containerRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!match) return;
    const target = parseFloat(match[2]);

    const el = containerRef.current;
    if (!el) return;

    const runAnimation = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      const duration = 1200; // ms
      const startTime = performance.now();

      const step = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        // Easing: easeOutExpo
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = Math.round(target * ease);
        setDisplayNum(current);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setDisplayNum(target);
        }
      };

      requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            runAnimation();
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    } else {
      runAnimation();
    }
  }, [match]);

  if (!match) {
    return <span className="stat-num">{value}</span>;
  }

  const prefix = match[1];
  const suffix = match[3];

  return (
    <span ref={containerRef} className="stat-num">
      {prefix}
      <span className="stat-counter">{displayNum !== null ? displayNum : match[2]}</span>
      {suffix}
    </span>
  );
}
