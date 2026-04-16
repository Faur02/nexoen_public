'use client';

import { useEffect } from 'react';
import { updateForecastSnapshot } from '@/lib/actions/abrechnung';

interface ForecastWarningProps {
  currentAmount: number;         // current Nachzahlung forecast in €
  snapshotAmount: number;        // previously stored snapshot
  snapshotDate: string;          // ISO date string of the snapshot
  mobile?: boolean;
}

export function ForecastWarning({ currentAmount, snapshotAmount, snapshotDate, mobile }: ForecastWarningProps) {
  // Fire-and-forget: update snapshot in DB only when change is meaningful (> 10€)
  useEffect(() => {
    if (Math.abs(currentAmount - snapshotAmount) > 10) {
      updateForecastSnapshot(currentAmount).catch((err) => {
        if (process.env.NODE_ENV !== 'production') {
          console.error('ForecastWarning: snapshot update failed', err);
        }
      });
    }
  }, [currentAmount, snapshotAmount]);

  const delta = currentAmount - snapshotAmount;
  const fmt = (n: number) =>
    new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

  const snapshotDateFormatted = (() => {
    const d = new Date(snapshotDate);
    return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
  })();

  if (mobile) {
    return (
      <div
        className="font-body rounded-[4px] px-3 py-2"
        style={{ backgroundColor: 'var(--nexo-nachzahlung-bg)', fontSize: '11px', color: 'var(--nexo-nachzahlung-text)', fontWeight: 500 }}
      >
        ⚠ Prognose verschlechtert seit {snapshotDateFormatted}: +{fmt(delta)} Nachzahlung
      </div>
    );
  }

  return (
    <div
      className="absolute font-body rounded-[4px] px-3 py-2"
      style={{
        top: 'calc(6% - 44px)',
        left: '4%',
        backgroundColor: 'var(--nexo-nachzahlung-bg)',
        fontSize: '11px',
        color: 'var(--nexo-nachzahlung-text)',
        fontWeight: 500,
      }}
    >
      ⚠ Prognose verschlechtert seit {snapshotDateFormatted}: +{fmt(delta)} Nachzahlung
    </div>
  );
}
