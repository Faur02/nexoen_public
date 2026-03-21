'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';


interface UpgradeButtonProps {
  userId: string;
}

export function UpgradeButton({ userId }: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const text = await response.text();
        try { const err = JSON.parse(text); throw new Error(err.error); } catch { throw new Error('Server-Fehler beim Checkout'); }
      }
      const data = await response.json();

      if (data.url && data.url.startsWith('https://checkout.stripe.com')) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Fehler beim Starten des Checkouts. Bitte versuchen Sie es erneut.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleUpgrade}
      disabled={loading}
      className="w-full"
      size="lg"
      style={{ backgroundColor: 'var(--nexo-cta)', borderRadius: '4px' }}
    >
      {loading ? 'Wird geladen...' : 'Jetzt upgraden'}
    </Button>
  );
}
