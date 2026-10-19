'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#0a0b0e', color: '#f4f4ee', fontFamily: 'system-ui, sans-serif' }}>
        <main
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
            gap: '1.2rem',
          }}
        >
          <p style={{ fontFamily: 'monospace', color: '#facc15', margin: 0, fontSize: '0.9rem', letterSpacing: '0.08em' }}>
            ENGINE STALLED · PIT STOP REQUIRED
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.8rem)', margin: 0, fontWeight: 800 }}>
            Mechanical Issue Detected
          </h1>
          <p style={{ maxWidth: '32rem', color: '#a1a1aa', margin: 0, lineHeight: 1.6 }}>
            Something unexpected occurred on the track. Our telemetry logged the error so we can fix it.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => reset()}
              style={{
                background: '#facc15',
                color: '#111216',
                border: 'none',
                fontWeight: 700,
                padding: '0.75rem 1.4rem',
                cursor: 'pointer',
                fontSize: '0.95rem',
              }}
            >
              Restart Engine (Try Again)
            </button>
            <Link
              href="/"
              style={{
                background: 'transparent',
                color: '#f4f4ee',
                border: '1px solid #3f3f46',
                padding: '0.75rem 1.4rem',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
              }}
            >
              Back to Paddock (Home)
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
