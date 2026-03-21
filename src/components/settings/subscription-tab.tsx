'use client';

import { useState } from 'react';
import * as Sentry from '@sentry/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BillingPortalButton } from './billing-portal-button';
import { SubscriptionTier } from '@/types/database';

interface SubscriptionTabProps {
  currentTier: SubscriptionTier;
  trialEndsAt: string | null;
  userId: string;
  hasStripeSubscription: boolean;
}

const allFeatures = [
  'Heizung, Warmwasser & Kaltwasser tracken',
  'Nebenkosten-Prognose (Nachzahlung / Guthaben)',
  'Heizungsanalyse & Verbrauchstrend',
  'Sparempfehlung & Abschlags-Anpassung',
  'Monatliche Erinnerungs-E-Mail',
  'Strom & Gas Zähler hinzufügen',
  'Heizkostenrechner — simuliere deine Ersparnisse',
  'Geschätzte Kosten pro Monat (aus Monatsdaten)',
  'PDF-Bericht exportieren',
];

function getDaysRemaining(trialEndsAt: string | null): number {
  if (!trialEndsAt) return 0;
  const diff = new Date(trialEndsAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function SubscriptionTab({
  currentTier,
  trialEndsAt,
  userId,
  hasStripeSubscription,
}: SubscriptionTabProps) {
  const [loading, setLoading] = useState(false);

  // Lazy expiry check
  const effectiveTier: SubscriptionTier =
    currentTier === 'trial' && trialEndsAt && new Date(trialEndsAt) < new Date()
      ? 'expired'
      : currentTier;

  const daysRemaining = getDaysRemaining(trialEndsAt);

  const handleActivate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const text = await response.text();
        try { const err = JSON.parse(text); throw new Error(err.error); } catch { throw new Error('Server-Fehler beim Checkout'); }
      }
      const data = await response.json();
      if (data.url && data.url.startsWith('https://checkout.stripe.com')) window.location.href = data.url;
    } catch (error) {
      Sentry.captureException(error);
      alert('Fehler beim Starten des Checkouts. Bitte versuchen Sie es erneut.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status card */}
      <Card style={{ borderRadius: '4px', boxShadow: 'var(--nexo-card-shadow)' }}>
        <CardContent className="py-6">
          {effectiveTier === 'trial' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span
                  className="font-body"
                  style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#2FAE8E' }}
                >
                  Testphase aktiv
                </span>
              </div>
              <p className="font-heading" style={{ fontSize: '22px', fontWeight: 400, color: 'var(--nexo-text-primary)', margin: '0 0 4px' }}>
                Noch {daysRemaining} {daysRemaining === 1 ? 'Tag' : 'Tage'} verbleibend
              </p>
              <p className="font-body" style={{ fontSize: '13px', color: 'var(--nexo-text-secondary)', margin: '0 0 20px' }}>
                Du hast Zugriff auf alle Funktionen.
              </p>
              <button
                onClick={handleActivate}
                disabled={loading}
                style={{
                  backgroundColor: 'var(--nexo-cta)',
                  color: '#fff',
                  borderRadius: '4px',
                  padding: '11px 24px',
                  fontSize: '14px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'Wird geladen...' : 'Jetzt für 19,99 €/Jahr sichern →'}
              </button>
            </div>
          )}

          {effectiveTier === 'active' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span
                  className="font-body"
                  style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#2FAE8E' }}
                >
                  Aktiv
                </span>
              </div>
              <p className="font-heading" style={{ fontSize: '22px', fontWeight: 400, color: 'var(--nexo-text-primary)', margin: '0 0 4px' }}>
                nexoen Jahresabo
              </p>
              <p className="font-body" style={{ fontSize: '13px', color: 'var(--nexo-text-secondary)', margin: '0 0 20px' }}>
                Du hast Zugriff auf alle Funktionen.
              </p>
              {hasStripeSubscription && <BillingPortalButton />}
            </div>
          )}

          {effectiveTier === 'expired' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span
                  className="font-body"
                  style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--nexo-nachzahlung-text)' }}
                >
                  Testphase abgelaufen
                </span>
              </div>
              <p className="font-heading" style={{ fontSize: '22px', fontWeight: 400, color: 'var(--nexo-text-primary)', margin: '0 0 4px' }}>
                Jahresabo aktivieren
              </p>
              <p className="font-body" style={{ fontSize: '13px', color: 'var(--nexo-text-secondary)', margin: '0 0 20px' }}>
                Aktiviere dein Abo für weiteren Zugriff auf alle Funktionen.
              </p>
              <button
                onClick={handleActivate}
                disabled={loading}
                style={{
                  backgroundColor: 'var(--nexo-cta)',
                  color: '#fff',
                  borderRadius: '4px',
                  padding: '11px 24px',
                  fontSize: '14px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'Wird geladen...' : 'Für 19,99 €/Jahr aktivieren →'}
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feature list (single column, all included) */}
      <Card style={{ borderRadius: '4px', boxShadow: 'var(--nexo-card-shadow)' }}>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 400, color: 'var(--nexo-text-primary)' }}>
            Im Jahresabo enthalten
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {allFeatures.map((text) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: '#2FAE8E', fontSize: '14px', flexShrink: 0 }}>✓</span>
                <span className="font-body" style={{ fontSize: '13px', color: 'var(--nexo-text-primary)' }}>{text}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card style={{ borderRadius: '4px', boxShadow: 'var(--nexo-card-shadow)' }}>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 400, color: 'var(--nexo-text-primary)' }}>
            Häufig gestellte Fragen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <h4 className="font-medium" style={{ color: 'var(--nexo-text-primary)' }}>Kann ich jederzeit kündigen?</h4>
            <p className="text-sm mt-1" style={{ color: 'var(--nexo-text-secondary)' }}>
              Ja, du kannst dein Abo jederzeit kündigen. Du behältst den Zugang bis zum Ende des Abrechnungsjahres.
            </p>
          </div>
          <div>
            <h4 className="font-medium" style={{ color: 'var(--nexo-text-primary)' }}>Welche Zahlungsmethoden werden akzeptiert?</h4>
            <p className="text-sm mt-1" style={{ color: 'var(--nexo-text-secondary)' }}>
              Kreditkarte (Visa, Mastercard) und SEPA-Lastschrift.
            </p>
          </div>
          <div>
            <h4 className="font-medium" style={{ color: 'var(--nexo-text-primary)' }}>Was passiert mit meinen Daten nach dem Abo?</h4>
            <p className="text-sm mt-1" style={{ color: 'var(--nexo-text-secondary)' }}>
              Deine Daten bleiben erhalten. Du kannst sie jederzeit reaktivieren, sobald du ein Abo abschließt.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
