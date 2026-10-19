'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Track error:', error);
  }, [error]);

  return (
    <main className="notfound on-dark" style={{ minHeight: '85vh' }}>
      <p className="mono" style={{ color: 'var(--y)' }}>
        PIT STOP · RUNTIME RECOVERY
      </p>
      <h1 style={{ margin: '0.4rem 0' }}>Engine Stalled</h1>
      <p style={{ maxWidth: '34rem', color: 'var(--muted)' }}>
        The vehicle encountered a temporary glitch while executing this lap. You can restart or return to the main paddock.
      </p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button type="button" onClick={() => reset()} className="btn btn-primary">
          Restart Lap (Try Again)
        </button>
        <Link href="/" className="btn btn-ghost">
          Back to Paddock
        </Link>
      </div>
    </main>
  );
}
