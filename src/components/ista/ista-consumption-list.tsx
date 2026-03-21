'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { updateIstaConsumption, deleteIstaConsumption } from '@/lib/actions/ista-consumption';
import type { IstaConsumption } from '@/types/database';

const monthNames: Record<string, string> = {
  '01': 'Januar', '02': 'Februar', '03': 'März', '04': 'April',
  '05': 'Mai', '06': 'Juni', '07': 'Juli', '08': 'August',
  '09': 'September', '10': 'Oktober', '11': 'November', '12': 'Dezember',
};

function formatMonth(month: string): string {
  const [year, m] = month.split('-');
  return `${monthNames[m] || m} ${year}`;
}

interface IstaConsumptionListProps {
  data: IstaConsumption[];
  categorySlug: string;
}

export function IstaConsumptionList({ data, categorySlug }: IstaConsumptionListProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUnits, setEditUnits] = useState('');
  const [editKwh, setEditKwh] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isHeizung = categorySlug === 'heizung';
  const unitsHeader = isHeizung ? 'Einheiten (HKV)' : 'Verbrauch (m\u00B3)';

  const startEdit = (item: IstaConsumption) => {
    setEditingId(item.id);
    setEditUnits(item.units.toString());
    setEditKwh(item.kwh?.toString() ?? '');
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setError(null);
  };

  const handleUpdate = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const parsedUnits = parseFloat(editUnits);
      if (isNaN(parsedUnits) || parsedUnits < 0) throw new Error('Ungültige Einheiten');

      const parsedKwh = editKwh ? parseFloat(editKwh) : null;
      if (parsedKwh !== null && isNaN(parsedKwh)) throw new Error('Ungültige kWh');

      await updateIstaConsumption(id, { units: parsedUnits, kwh: parsedKwh });
      setEditingId(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Aktualisieren');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteIstaConsumption(id);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Löschen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ borderRadius: '4px' }}>
      <CardHeader>
        <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 400 }}>Verlauf</CardTitle>
        <CardDescription className="font-body">Alle eingetragenen Monatsdaten</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {data.length === 0 ? (
          <p
            className="font-body"
            style={{ fontSize: '14px', color: 'var(--nexo-text-muted)', textAlign: 'center', padding: '24px 0' }}
          >
            Noch keine Monatsdaten vorhanden. Tragen Sie Ihre monatlichen Verbrauchswerte ein.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--nexo-border)' }}>
                  <th className="font-body" style={{ textAlign: 'left', padding: '8px 12px', fontSize: '13px', fontWeight: 600, color: 'var(--nexo-text-secondary)' }}>
                    Monat
                  </th>
                  <th className="font-body" style={{ textAlign: 'right', padding: '8px 12px', fontSize: '13px', fontWeight: 600, color: 'var(--nexo-text-secondary)' }}>
                    {unitsHeader}
                  </th>
                  <th className="font-body hidden sm:table-cell" style={{ textAlign: 'right', padding: '8px 12px', fontSize: '13px', fontWeight: 600, color: 'var(--nexo-text-secondary)' }}>
                    kWh
                  </th>
                  <th className="font-body" style={{ textAlign: 'right', padding: '8px 12px', fontSize: '13px', fontWeight: 600, color: 'var(--nexo-text-secondary)' }}>
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--nexo-border)' }}>
                    <td className="font-body" style={{ padding: '10px 12px', fontSize: '14px', color: 'var(--nexo-text-primary)' }}>
                      {formatMonth(item.month)}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                      {editingId === item.id ? (
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editUnits}
                          onChange={(e) => setEditUnits(e.target.value)}
                          style={{ width: '100px', marginLeft: 'auto' }}
                        />
                      ) : (
                        <span className="font-body" style={{ fontSize: '14px', color: 'var(--nexo-text-primary)' }}>
                          {item.units}
                        </span>
                      )}
                    </td>
                    <td className="hidden sm:table-cell" style={{ padding: '10px 12px', textAlign: 'right' }}>
                      {editingId === item.id ? (
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editKwh}
                          onChange={(e) => setEditKwh(e.target.value)}
                          style={{ width: '100px', marginLeft: 'auto' }}
                        />
                      ) : (
                        <span className="font-body" style={{ fontSize: '14px', color: 'var(--nexo-text-muted)' }}>
                          {item.kwh ?? '–'}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                      {editingId === item.id ? (
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelEdit}
                            disabled={loading}
                          >
                            Abbrechen
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleUpdate(item.id)}
                            disabled={loading}
                          >
                            {loading ? '...' : 'Speichern'}
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-row gap-1 sm:gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEdit(item)}
                            disabled={loading}
                          >
                            <span className="sm:hidden">✎</span>
                            <span className="hidden sm:inline">Bearbeiten</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(item.id)}
                            disabled={loading}
                          >
                            <span className="sm:hidden">{loading ? '…' : '✕'}</span>
                            <span className="hidden sm:inline">{loading ? '...' : 'Löschen'}</span>
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
