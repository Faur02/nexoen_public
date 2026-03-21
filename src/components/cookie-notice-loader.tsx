'use client';

import dynamic from 'next/dynamic';

// Loaded client-side only — prevents SSR tree mismatch with Radix useId() counters
const CookieNotice = dynamic(
  () => import('./cookie-notice').then((m) => m.CookieNotice),
  { ssr: false }
);

export function CookieNoticeLoader() {
  return <CookieNotice />;
}
