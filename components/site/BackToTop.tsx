'use client';

import { useEffect, useState } from 'react';
import { Icon } from './Icon';

export default function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let prev = false;
    const on = () => {
      const next = window.scrollY > 700;
      if (next !== prev) {
        prev = next;
        setShow(next);
      }
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <button
      type="button"
      className={`to-top${show ? ' is-visible' : ''}`}
      aria-label="Back to top"
      tabIndex={show ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <Icon name="arrowUp" />
    </button>
  );
}
