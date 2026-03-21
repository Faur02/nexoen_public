'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createIstaConsumption } from '@/lib/actions/ista-consumption';

const monthNames = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
];

function getYearOptions() {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let y = currentYear; y >= currentYear - 3; y--) {
    years.push(y);
  }
  return years;
}

interface IstaConsumptionFormProps {
  categoryId: string;
  categorySlug: string; // 'heizung' or 'warmwasser'
}

export function IstaConsumptionForm({ categoryId, categorySlug }: IstaConsumptionFormProps) {
  const router = useRouter();
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(String(now.getMonth() + 1));
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()));
  const [units, setUnits] = useState('');
  const [kwh, setKwh] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isHeizung = categorySlug === 'heizung';
  const unitsLabel = isHeizung ? 'Einheiten (HKV)' : 'Verbrauch (m\u00B3)';
  const unitsPlaceholder = isHeizung ? 'z.B. 144' : 'z.B. 2.5';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const parsedUnits = parseFloat(units);
      if (isNaN(parsedUnits) || parsedUnits < 0) {
        throw new Error('Bitte gültige Einheiten eingeben');
      }

      const parsedKwh = kwh ? parseFloat(kwh) : null;
      if (parsedKwh !== null && isNaN(parsedKwh)) {
        throw new Error('Bitte gültige kWh eingeben');
      }

      // Format as YYYY-MM for the server action
      const month = `${selectedYear}-${selectedMonth.padStart(2, '0')}`;

      await createIstaConsumption({
        categoryId,
        month,
        units: parsedUnits,
        kwh: parsedKwh,
      });

      setSuccess('Verbrauch gespeichert!');
      setUnits('');
      setKwh('');
      setTimeout(() => setSuccess(null), 3000);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern');
    } finally {
      setLoading(false);
    }
  };

  const selectStyle = {
    height: '36px',
    borderRadius: '4px',
    border: '1px solid var(--input)',
    backgroundColor: 'transparent',
    color: 'var(--foreground)',
    fontSize: '14px',
    fontFamily: 'var(--font-body)',
    padding: '0 8px',
    width: '100%',
  };

  return (
    <Card style={{ borderRadius: '4px' }}>
      <CardHeader>
        <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 400 }}>Monatsdaten eintragen</CardTitle>
        <CardDescription className="font-body">
          Monatliche Verbrauchsdaten aus der App Ihres Anbieters (z.B. ista EcoTrend, Techem SmartBridge)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ista-month">Monat</Label>
              <select
                id="ista-month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={selectStyle}
                required
              >
                {monthNames.map((name, i) => (
                  <option key={i + 1} value={String(i + 1)}>{name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ista-year">Jahr</Label>
              <select
                id="ista-year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                style={selectStyle}
                required
              >
                {getYearOptions().map((y) => (
                  <option key={y} value={String(y)}>{y}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ista-units">{unitsLabel}</Label>
              <Input
                id="ista-units"
                type="number"
                step="0.01"
                min="0"
                placeholder={unitsPlaceholder}
                value={units}
                onChange={(e) => setUnits(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ista-kwh">kWh (optional)</Label>
              <Input
                id="ista-kwh"
                type="number"
                step="0.01"
                min="0"
                placeholder="z.B. 156.1"
                value={kwh}
                onChange={(e) => setKwh(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={loading} style={{ backgroundColor: 'var(--nexo-cta)', borderRadius: '4px' }}>
            {loading ? 'Speichern...' : 'Hinzufügen'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
