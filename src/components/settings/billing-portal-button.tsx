'use client';

import { useState } from 'react';
import * as Sentry from '@sentry/nextjs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function BillingPortalButton() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/billing-portal', { method: 'POST' });
      if (!response.ok) {
        const text = await response.text();
        let message = 'Server-Fehler beim Öffnen des Kundenportals';
        try { const err = JSON.parse(text); if (err.error) message = err.error; } catch { /* not JSON */ }
        throw new Error(message);
      }
      const data = await response.json();
      if (data.url && data.url.startsWith('https://billing.stripe.com')) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Fehler beim Öffnen des Kundenportals');
      }
    } catch (error) {
      Sentry.captureException(error);
      setErrorMsg('Fehler beim Öffnen des Kundenportals. Bitte versuchen Sie es erneut.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {errorMsg && (
        <Alert variant="destructive" style={{ borderRadius: '4px', marginBottom: '8px' }}>
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
      )}
      <Button
        onClick={handleClick}
        disabled={loading}
        variant="outline"
        style={{ borderRadius: '4px' }}
      >
        {loading ? 'Wird geladen...' : 'Abonnement verwalten'}
      </Button>
    </>
  );
}
