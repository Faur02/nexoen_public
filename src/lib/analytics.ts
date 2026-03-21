export const ANALYTICS_CONSENT_KEY = 'nexo_analytics_consent';

export function getAnalyticsConsent(): boolean | null {
  if (typeof window === 'undefined') return null;
  try {
    const val = localStorage.getItem(ANALYTICS_CONSENT_KEY);
    if (val === null) return null;
    return val === 'true';
  } catch {
    return null;
  }
}

export function setAnalyticsConsent(accepted: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ANALYTICS_CONSENT_KEY, accepted ? 'true' : 'false');
    window.dispatchEvent(new Event('nexo_consent_change'));
  } catch {
    // ignore
  }
}

export function sendAnalyticsEvent(name: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  if (getAnalyticsConsent() !== true) return;
  if (typeof (window as Window & { gtag?: Function }).gtag !== 'function') return;
  (window as Window & { gtag?: Function }).gtag!('event', name, params);
}
