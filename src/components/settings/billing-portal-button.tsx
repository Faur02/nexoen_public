'use client';

import { useState } from 'react';
import * as Sentry from '@sentry/nextjs';
import { Button } from '@/components/ui/button';

export function BillingPortalButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/billing-portal', { method: 'POST' });
      if (!response.ok) {
        const text = await response.text();
        try { const err = JSON.parse(text); throw new Error(err.error); } catch { throw new Error('Server-Fehler beim Öffnen des Kundenportals'); }
      }
      const data = await response.json();
      if (data.url && data.url.startsWith('https://billing.stripe.com')) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Fehler beim Öffnen des Kundenportals');
      }
    } catch (error) {
      Sentry.captureException(error);
      alert('Fehler beim Öffnen des Kundenportals. Bitte versuchen Sie es erneut.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      variant="outline"
      style={{ borderRadius: '4px' }}
    >
      {loading ? 'Wird geladen...' : 'Abonnement verwalten'}
    </Button>
  );
}
