'use client';

import { useState, useEffect } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';
import { getAnalyticsConsent } from '@/lib/analytics';

export function AnalyticsProvider() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    setConsented(getAnalyticsConsent() === true);

    function onConsentChange() {
      setConsented(getAnalyticsConsent() === true);
    }
    window.addEventListener('nexo_consent_change', onConsentChange);
    return () => window.removeEventListener('nexo_consent_change', onConsentChange);
  }, []);

  if (!consented) return null;
  return <GoogleAnalytics gaId="G-EDSX1PP36Z" />;
}
