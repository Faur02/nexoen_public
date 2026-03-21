'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createMeter } from '@/lib/actions/meters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { HelpTooltip } from '@/components/ui/help-tooltip';
import { MeterType, MeterUnit } from '@/types/database';

export function NewMeterForm() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [type, setType] = useState<MeterType>('electricity');
  const [unit, setUnit] = useState<MeterUnit>('kWh');
  const [conversionFactor, setConversionFactor] = useState('10.5');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTypeChange = (newType: MeterType) => {
    setType(newType);
    switch (newType) {
      case 'electricity': setUnit('kWh'); break;
      case 'gas':         setUnit('kWh'); break;
      case 'water':       setUnit('m3');  break;
      case 'heating':     setUnit('units'); break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const meter = await createMeter({
        name,
        type,
        unit,
        conversionFactor: unit === 'm3' && type === 'gas' ? parseFloat(conversionFactor) : 1.0,
      });
      router.push(`/meters/${meter.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      setLoading(false);
    }
  };

  return (
    <Card style={{ borderRadius: '4px', boxShadow: 'var(--nexo-card-shadow)' }}>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive" style={{ borderRadius: '4px' }}>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center">
              Name
              <HelpTooltip text="Geben Sie dem Zähler einen Namen, damit Sie ihn später leicht wiederfinden. Z.B. 'Strom Wohnung' oder 'Heizung 2024'." />
            </Label>
            <Input
              id="name"
              placeholder="z.B. Strom Wohnung, Wasser, Heizung 2024"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ borderRadius: '4px' }}
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center">
              Zählertyp
              <HelpTooltip text="Wählen Sie die Art des Zählers. Bei Heizung können Sie später Räume und Heizkörper hinzufügen." />
            </Label>
            <div className="grid grid-cols-2 gap-4">
              {([
                { key: 'electricity' as MeterType, icon: '⚡', label: 'Strom', desc: 'Elektrizität in kWh' },
                { key: 'gas' as MeterType, icon: '🔥', label: 'Gas', desc: 'Erdgas in kWh oder m³' },
              ]).map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleTypeChange(item.key)}
                  className="p-4 border text-left transition-colors"
                  style={{
                    borderRadius: '4px',
                    borderColor: type === item.key ? 'var(--nexo-cta)' : 'var(--nexo-border)',
                    backgroundColor: type === item.key ? 'rgba(29, 120, 116, 0.05)' : 'transparent',
                  }}
                >
                  <div className="font-medium flex items-center gap-2">
                    <span className="text-xl">{item.icon}</span> {item.label}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--nexo-text-secondary)' }}>{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {type === 'gas' && (
            <>
              <div className="space-y-2">
                <Label className="flex items-center">
                  Einheit
                  <HelpTooltip text="Schauen Sie auf Ihren Gaszähler: Zeigt er kWh oder m³ an? Ältere Zähler zeigen oft m³, neuere oft kWh." />
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  {(['kWh', 'm3'] as const).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUnit(u)}
                      className="p-3 border text-center transition-colors"
                      style={{
                        borderRadius: '4px',
                        borderColor: unit === u ? 'var(--nexo-cta)' : 'var(--nexo-border)',
                        backgroundColor: unit === u ? 'rgba(29, 120, 116, 0.05)' : 'transparent',
                      }}
                    >
                      {u === 'm3' ? 'm³ (Kubikmeter)' : u}
                    </button>
                  ))}
                </div>
              </div>

              {unit === 'm3' && (
                <div className="space-y-2">
                  <Label htmlFor="conversionFactor" className="flex items-center">
                    Umrechnungsfaktor (m³ → kWh)
                    <HelpTooltip text="Dieser Faktor rechnet Kubikmeter in kWh um. Er steht auf Ihrer Gasrechnung unter 'Brennwert' oder 'Umrechnungsfaktor'. Standard in Deutschland ist ca. 10,5." />
                  </Label>
                  <Input
                    id="conversionFactor"
                    type="number"
                    step="0.01"
                    placeholder="10.5"
                    value={conversionFactor}
                    onChange={(e) => setConversionFactor(e.target.value)}
                    style={{ borderRadius: '4px' }}
                  />
                </div>
              )}
            </>
          )}

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: 'var(--nexo-cta)', borderRadius: '4px' }}
            >
              {loading ? 'Wird angelegt...' : 'Zähler anlegen'}
            </Button>
            <Link href="/meters">
              <Button type="button" variant="outline" style={{ borderRadius: '4px' }}>
                Abbrechen
              </Button>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
