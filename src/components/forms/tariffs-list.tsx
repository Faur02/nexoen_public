'use client';

import { useState } from 'react';
import { deleteTariff } from '@/lib/actions/tariffs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tariff } from '@/types/database';
import { formatCurrency } from '@/lib/calculations/costs';

interface TariffsListProps {
  tariffs: Tariff[];
  meterId: string;
  meterUnit?: string;
}

export function TariffsList({ tariffs, meterId, meterUnit = 'kWh' }: TariffsListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Möchten Sie diesen Tarif wirklich löschen?')) {
      return;
    }

    setDeletingId(id);
    setError(null);
    try {
      await deleteTariff(id, meterId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Löschen des Tarifs');
    } finally {
      setDeletingId(null);
    }
  };

  const isActive = (tariff: Tariff) => {
    const today = new Date().toISOString().split('T')[0];
    return (
      tariff.valid_from <= today &&
      (!tariff.valid_until || tariff.valid_until >= today)
    );
  };

  if (tariffs.length === 0) {
    return (
      <p style={{ color: 'var(--nexo-text-secondary)', textAlign: 'center', padding: '32px 0', fontSize: '15px' }}>
        Noch keine Tarife hinterlegt.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive" style={{ borderRadius: '4px' }}>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {tariffs.map((tariff) => {
        const active = isActive(tariff);
        return (
          <div
            key={tariff.id}
            style={{
              padding: '20px',
              borderRadius: '4px',
              border: active ? '2px solid var(--nexo-cta)' : '1px solid var(--nexo-border)',
              backgroundColor: active ? 'rgba(29, 120, 116, 0.03)' : 'var(--nexo-card-bg)',
            }}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '17px', fontWeight: 600 }}>
                    {tariff.name || 'Unbenannter Tarif'}
                  </span>
                  {active && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '2px 10px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 600,
                        backgroundColor: 'var(--nexo-badge-active-bg)',
                        color: 'var(--nexo-badge-active-text)',
                      }}
                    >
                      Aktiv
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '13px', color: 'var(--nexo-text-secondary)' }}>
                  Gültig ab {new Date(tariff.valid_from).toLocaleDateString('de-DE')}
                  {tariff.valid_until && (
                    <span>
                      {' '}
                      bis {new Date(tariff.valid_until).toLocaleDateString('de-DE')}
                    </span>
                  )}
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(tariff.id)}
                disabled={deletingId === tariff.id}
                style={{
                  borderRadius: '4px',
                  color: deletingId === tariff.id ? 'var(--nexo-text-muted)' : '#EF4444',
                  fontSize: '13px',
                }}
              >
                {deletingId === tariff.id ? '...' : 'Löschen'}
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4" style={{ fontSize: '14px' }}>
              <div>
                <span style={{ color: 'var(--nexo-text-secondary)', fontSize: '12px', fontWeight: 500 }}>Arbeitspreis</span>
                <br />
                <span style={{ fontFamily: 'monospace', fontWeight: 500, fontSize: '15px' }}>
                  {tariff.arbeitspreis} €/{meterUnit}
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--nexo-text-secondary)', fontSize: '12px', fontWeight: 500 }}>Grundpreis</span>
                <br />
                <span style={{ fontFamily: 'monospace', fontWeight: 500, fontSize: '15px' }}>
                  {formatCurrency(tariff.grundpreis)}/Monat
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--nexo-text-secondary)', fontSize: '12px', fontWeight: 500 }}>Abschlag</span>
                <br />
                <span style={{ fontFamily: 'monospace', fontWeight: 500, fontSize: '15px' }}>
                  {tariff.abschlag ? `${formatCurrency(tariff.abschlag)}/Monat` : '-'}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
