'use client';

import { useState } from 'react';
import { createTariff } from '@/lib/actions/tariffs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { HelpTooltip } from '@/components/ui/help-tooltip';
import { MeterType } from '@/types/database';

interface TariffFormProps {
  meterId: string;
  meterType: MeterType;
  meterUnit: 'kWh' | 'm3' | 'units';
}

export function TariffForm({ meterId, meterType, meterUnit }: TariffFormProps) {
  const [name, setName] = useState('');
  const [arbeitspreis, setArbeitspreis] = useState('');
  const [grundpreis, setGrundpreis] = useState('');
  const [abschlag, setAbschlag] = useState('');
  const [abwasserPreis, setAbwasserPreis] = useState('');
  const [validFrom, setValidFrom] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Dynamic labels based on meter type
  const getArbeitspreisLabel = () => {
    switch (meterType) {
      case 'water':
        return `Wasserpreis (€/${meterUnit})`;
      case 'heating':
        return 'Preis pro Einheit (€/Einheit)';
      default:
        return `Arbeitspreis (€/${meterUnit})`;
    }
  };

  const getArbeitspreisTooltip = () => {
    switch (meterType) {
      case 'water':
        return 'Der Preis pro Kubikmeter Wasser. Steht auf Ihrer Wasserrechnung als Wasserpreis oder Verbrauchspreis.';
      case 'heating':
        return 'Der Preis pro Einheit auf dem Heizkostenverteiler. Diesen Wert finden Sie in Ihrer Heizkostenabrechnung.';
      default:
        return 'Der Preis pro verbrauchter Kilowattstunde. Steht auf Ihrer Rechnung als Verbrauchspreis oder Arbeitspreis. Beispiel: 32,90 Cent = 0.329 eingeben';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      await createTariff({
        meterId,
        name: name || undefined,
        arbeitspreis: parseFloat(arbeitspreis),
        grundpreis: parseFloat(grundpreis),
        abschlag: abschlag ? parseFloat(abschlag) : undefined,
        abwasserPreis: meterType === 'water' && abwasserPreis ? parseFloat(abwasserPreis) : undefined,
        validFrom,
      });

      setSuccess(true);
      setName('');
      setArbeitspreis('');
      setGrundpreis('');
      setAbschlag('');
      setAbwasserPreis('');
      setValidFrom(new Date().toISOString().split('T')[0]);

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
          <AlertDescription>Tarif erfolgreich gespeichert!</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center">
            Tarifname (optional)
            <HelpTooltip text="Der Name Ihres Stromanbieters oder Tarifs, z.B. 'Vattenfall Easy24' oder 'E.ON Grundversorgung'" />
          </Label>
          <Input
            id="name"
            placeholder="z.B. Vattenfall Easy24"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="validFrom" className="flex items-center">
            Gültig ab
            <HelpTooltip text="Ab wann gilt dieser Tarif? Bei einem neuen Vertrag das Startdatum, sonst das heutige Datum." />
          </Label>
          <Input
            id="validFrom"
            type="date"
            value={validFrom}
            onChange={(e) => setValidFrom(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="arbeitspreis" className="flex items-center">
            {getArbeitspreisLabel()}
            <HelpTooltip text={getArbeitspreisTooltip()} />
          </Label>
          <Input
            id="arbeitspreis"
            type="number"
            step="0.0001"
            placeholder={meterType === 'water' ? 'z.B. 1.85' : 'z.B. 0.329'}
            value={arbeitspreis}
            onChange={(e) => setArbeitspreis(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="grundpreis" className="flex items-center">
            Grundpreis (€/Monat)
            <HelpTooltip text="Die monatliche Grundgebühr, unabhängig vom Verbrauch. Steht auf Ihrer Rechnung als 'Grundpreis' oder 'Grundgebühr'." />
          </Label>
          <Input
            id="grundpreis"
            type="number"
            step="0.01"
            placeholder="z.B. 12.50"
            value={grundpreis}
            onChange={(e) => setGrundpreis(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="abschlag" className="flex items-center">
            Abschlag (€/Monat)
            <HelpTooltip text="Der Betrag, den Sie monatlich an Ihren Anbieter zahlen (Vorauszahlung). Am Jahresende wird abgerechnet ob Sie zu viel oder zu wenig gezahlt haben." />
          </Label>
          <Input
            id="abschlag"
            type="number"
            step="0.01"
            placeholder="z.B. 85.00"
            value={abschlag}
            onChange={(e) => setAbschlag(e.target.value)}
          />
        </div>
      </div>

      {meterType === 'water' && (
        <div className="space-y-2">
          <Label htmlFor="abwasserPreis" className="flex items-center">
            Abwassergebühr (€/m³)
            <HelpTooltip text="Die Gebühr für die Abwasserentsorgung pro Kubikmeter. Diese wird zusätzlich zum Wasserpreis berechnet und steht auf Ihrer Wasserrechnung." />
          </Label>
          <Input
            id="abwasserPreis"
            type="number"
            step="0.0001"
            placeholder="z.B. 2.45"
            value={abwasserPreis}
            onChange={(e) => setAbwasserPreis(e.target.value)}
          />
        </div>
      )}

      <Button type="submit" disabled={loading} style={{ backgroundColor: 'var(--nexo-cta)', borderRadius: '4px' }}>
        {loading ? 'Wird gespeichert...' : 'Tarif speichern'}
      </Button>
    </form>
  );
}
