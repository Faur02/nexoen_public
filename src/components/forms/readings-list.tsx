'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteReading, updateReading } from '@/lib/actions/readings';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
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
  const router = useRouter();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editDate, setEditDate] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startEdit = (reading: Reading) => {
    setEditingId(reading.id);
    setEditValue(reading.value.toString());
    setEditDate(reading.reading_date);
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setError(null);
  };

  const handleSave = async (id: string) => {
    setSavingId(id);
    setError(null);
    try {
      const parsed = parseFloat(editValue);
      if (!isFinite(parsed) || isNaN(parsed)) throw new Error('Ungültiger Zählerstand');
      await updateReading(id, { value: parsed, readingDate: editDate });
      setEditingId(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern');
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError(null);
    try {
      await deleteReading(id, meterId);
      router.refresh();
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

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-0">
      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Zählerstand löschen?"
        description="Dieser Zählerstand wird unwiderruflich gelöscht."
        confirmLabel="Löschen"
        onConfirm={() => { const id = confirmDeleteId!; setConfirmDeleteId(null); handleDelete(id); }}
        onCancel={() => setConfirmDeleteId(null)}
      />
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
              {/* Datum */}
              <div style={{ fontWeight: 500 }}>
                {editingId === reading.id ? (
                  <input
                    type="date"
                    value={editDate}
                    max={today}
                    onChange={(e) => setEditDate(e.target.value)}
                    style={{
                      border: '1px solid var(--nexo-border)',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      fontSize: '13px',
                      width: '100%',
                      background: 'var(--nexo-card-bg)',
                      color: 'var(--nexo-text-primary)',
                    }}
                  />
                ) : (
                  new Date(reading.reading_date).toLocaleDateString('de-DE')
                )}
              </div>

              {/* Zählerstand */}
              <div className="text-right" style={{ fontFamily: 'monospace', fontWeight: 500 }}>
                {editingId === reading.id ? (
                  <input
                    type="number"
                    step="0.01"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    style={{
                      border: '1px solid var(--nexo-border)',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      fontSize: '13px',
                      width: '100%',
                      textAlign: 'right',
                      background: 'var(--nexo-card-bg)',
                      color: 'var(--nexo-text-primary)',
                    }}
                  />
                ) : (
                  `${formatNumber(reading.value)} ${unit}`
                )}
              </div>

              {/* Verbrauch */}
              <div className="text-right" style={{ fontFamily: 'monospace' }}>
                {reading.consumption !== null
                  ? `${formatNumber(reading.consumption)} ${unit}`
                  : '-'}
              </div>

              {/* Tage */}
              <div className="text-right hidden sm:block" style={{ color: 'var(--nexo-text-secondary)' }}>
                {reading.days !== null ? `${reading.days} Tage` : '-'}
              </div>

              {/* Actions */}
              <div className="text-right flex gap-1 justify-end">
                {editingId === reading.id ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={cancelEdit}
                      disabled={savingId === reading.id}
                      style={{ borderRadius: '4px', fontSize: '13px', color: 'var(--nexo-text-muted)' }}
                    >
                      ✕
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSave(reading.id)}
                      disabled={savingId === reading.id}
                      style={{ borderRadius: '4px', fontSize: '13px', color: 'var(--nexo-guthaben-text)' }}
                    >
                      {savingId === reading.id ? '...' : '✓'}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(reading)}
                      disabled={!!deletingId}
                      style={{ borderRadius: '4px', fontSize: '13px', color: 'var(--nexo-text-secondary)' }}
                    >
                      ✎
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfirmDeleteId(reading.id)}
                      disabled={deletingId === reading.id}
                      style={{
                        borderRadius: '4px',
                        color: deletingId === reading.id ? 'var(--nexo-text-muted)' : '#EF4444',
                        fontSize: '13px',
                      }}
                    >
                      {deletingId === reading.id ? '...' : 'Löschen'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
