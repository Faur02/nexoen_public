'use client';

import { useState } from 'react';
import { createReading } from '@/lib/actions/readings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { HelpTooltip } from '@/components/ui/help-tooltip';
import { MeterUnit } from '@/types/database';

interface ReadingFormProps {
  meterId: string;
  unit: MeterUnit;
}

export function ReadingForm({ meterId, unit }: ReadingFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      await createReading({
        meterId,
        readingDate: date,
        value: parseFloat(value),
      });

      setSuccess(true);
      setValue('');
      setDate(new Date().toISOString().split('T')[0]);

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>Zählerstand erfolgreich gespeichert!</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="date" className="flex items-center">
            Datum
            <HelpTooltip text="Das Datum, an dem Sie den Zählerstand abgelesen haben. Sie können auch ältere Daten von früheren Rechnungen eintragen." />
          </Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="value" className="flex items-center">
            Zählerstand ({unit})
            <HelpTooltip text="Die Zahl, die auf Ihrem Stromzähler angezeigt wird. Lesen Sie alle Ziffern ab, auch die Nachkommastellen falls vorhanden." />
          </Label>
          <Input
            id="value"
            type="number"
            step="0.01"
            placeholder="z.B. 12345.67"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
        </div>

        <div className="flex items-end">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto" style={{ backgroundColor: 'var(--nexo-cta)', borderRadius: '4px' }}>
            {loading ? 'Wird gespeichert...' : 'Speichern'}
          </Button>
        </div>
      </div>
    </form>
  );
}
