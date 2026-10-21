'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    // Skip tracking for admin and API endpoints
    if (!pathname || pathname.startsWith('/Maihehuadmin') || pathname.startsWith('/api')) {
      return;
    }

    // Prevent duplicate rapid logs on re-renders
    const key = `${pathname}-${new Date().getMinutes()}`;
    if (lastTracked.current === key) return;
    lastTracked.current = key;

    try {
      const payload = {
        path: pathname,
        referrer: document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, '') : 'Direct',
        device: /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
      };

      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      if (typeof navigator.sendBeacon === 'function') {
        navigator.sendBeacon('/api/analytics/track', blob);
      } else {
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Ignore client analytics errors silently
    }
  }, [pathname]);

  return null;
}
