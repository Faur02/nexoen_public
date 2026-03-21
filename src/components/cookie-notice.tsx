'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ANALYTICS_CONSENT_KEY, setAnalyticsConsent } from '@/lib/analytics';

const DISMISSED_KEY = 'nexo_cookie_notice_dismissed';

export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const alreadyDecided = localStorage.getItem(ANALYTICS_CONSENT_KEY) !== null;
      const oldDismissed = localStorage.getItem(DISMISSED_KEY);
      if (!alreadyDecided && !oldDismissed) setVisible(true);
    } catch {
      // localStorage not available
    }
  }, []);

  function accept() {
    setAnalyticsConsent(true);
    setVisible(false);
  }

  function decline() {
    setAnalyticsConsent(false);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-4 px-6 py-4 flex-wrap"
      style={{
        backgroundColor: 'var(--nexo-card-bg, #FFFFFF)',
        borderTop: '1px solid var(--nexo-border, #E5E7EB)',
        boxShadow: '0 -2px 12px rgba(0,0,0,0.06)',
      }}
    >
      <p className="font-body text-sm flex-1 min-w-0" style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.5' }}>
        Wir verwenden Cookies für den Login sowie optionale Analyse-Cookies (Google Analytics), um die Website zu verbessern.{' '}
        <Link href="/datenschutz" className="underline hover:no-underline" style={{ color: 'var(--nexo-cta, #1D7874)' }}>
          Mehr erfahren
        </Link>
      </p>

      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={decline}
          className="font-body font-medium text-sm px-4 py-2 cursor-pointer"
          style={{
            backgroundColor: 'transparent',
            color: 'var(--nexo-text-secondary, #6B7280)',
            borderRadius: '4px',
            border: '1px solid var(--nexo-border, #E5E7EB)',
          }}
        >
          Nur notwendige
        </button>
        <button
          onClick={accept}
          className="font-body font-medium text-sm px-5 py-2 cursor-pointer"
          style={{
            backgroundColor: 'var(--nexo-cta, #1D7874)',
            color: '#FFFFFF',
            borderRadius: '4px',
            border: 'none',
          }}
        >
          Akzeptieren
        </button>
      </div>
    </div>
  );
}
