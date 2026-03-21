'use client';

import { useState } from 'react';
import { deleteReading } from '@/lib/actions/readings';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Reading, MeterUnit } from '@/types/database';
import { formatNumber } from '@/lib/calculations/costs';

interface ReadingsListProps {
  readings: Reading[];
  meterId: string;
  unit: MeterUnit;
}

export function ReadingsList({ readings, meterId, unit }: ReadingsListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Möchten Sie diesen Zählerstand wirklich löschen?')) {
      return;
    }

    setDeletingId(id);
    setError(null);
    try {
      await deleteReading(id, meterId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Löschen des Zählerstands');
    } finally {
      setDeletingId(null);
    }
  };

  if (readings.length === 0) {
    return (
      <p style={{ color: 'var(--nexo-text-secondary)', textAlign: 'center', padding: '32px 0', fontSize: '15px' }}>
        Noch keine Zählerstände erfasst.
      </p>
    );
  }

  // Calculate consumption between readings
  const readingsWithConsumption = readings.map((reading, index) => {
    const nextReading = readings[index + 1];
    const consumption = nextReading
      ? reading.value - nextReading.value
      : null;
    const days = nextReading
      ? Math.round(
          (new Date(reading.reading_date).getTime() -
            new Date(nextReading.reading_date).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : null;

    return { ...reading, consumption, days };
  });

  return (
    <div className="space-y-0">
      {error && (
        <Alert variant="destructive" style={{ borderRadius: '4px', marginBottom: '12px' }}>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="overflow-x-auto">
        <div style={{ minWidth: '480px' }}>
          {/* Table Header */}
          <div
            className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-4 text-sm"
            style={{
              padding: '12px 16px',
              borderBottom: '2px solid var(--nexo-border)',
              color: 'var(--nexo-text-secondary)',
              fontWeight: 600,
              fontFamily: 'var(--font-heading)',
            }}
          >
            <div>Datum</div>
            <div className="text-right">Zählerstand</div>
            <div className="text-right">Verbrauch</div>
            <div className="text-right hidden sm:block">Tage</div>
            <div></div>
          </div>

          {/* Table Rows */}
          {readingsWithConsumption.map((reading, index) => (
            <div
              key={reading.id}
              className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-4 items-center"
              style={{
                padding: '14px 16px',
                borderBottom: index < readingsWithConsumption.length - 1 ? '1px solid var(--nexo-border-light)' : 'none',
                fontSize: '14px',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--nexo-hover-bg)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <div style={{ fontWeight: 500 }}>
                {new Date(reading.reading_date).toLocaleDateString('de-DE')}
              </div>
              <div className="text-right" style={{ fontFamily: 'monospace', fontWeight: 500 }}>
                {formatNumber(reading.value)} {unit}
              </div>
              <div className="text-right" style={{ fontFamily: 'monospace' }}>
                {reading.consumption !== null
                  ? `${formatNumber(reading.consumption)} ${unit}`
                  : '-'}
              </div>
              <div className="text-right hidden sm:block" style={{ color: 'var(--nexo-text-secondary)' }}>
                {reading.days !== null ? `${reading.days} Tage` : '-'}
              </div>
              <div className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(reading.id)}
                  disabled={deletingId === reading.id}
                  style={{
                    borderRadius: '4px',
                    color: deletingId === reading.id ? 'var(--nexo-text-muted)' : '#EF4444',
                    fontSize: '13px',
                  }}
                >
                  {deletingId === reading.id ? '...' : 'Löschen'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
