'use client';

import { useEffect, useState } from 'react';

/** Cycles through short role titles. The first role is rendered on the server, so no-JS visitors still see one. */
export default function RoleRotator({ roles }: { roles: string[] }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (roles.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % roles.length), 2600);
    return () => clearInterval(t);
  }, [roles.length]);

  if (!roles.length) return null;
  return (
    <span className="rotator" aria-live="off">
      <span key={i} className="rotator-item">
        {roles[i]}
      </span>
    </span>
  );
}
