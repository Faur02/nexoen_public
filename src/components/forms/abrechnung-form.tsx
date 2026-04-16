'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { HelpTooltip } from '@/components/ui/help-tooltip';
import { upsertHeatingBillingSetup } from '@/lib/actions/heating-billing';
import { upsertAbrechnungSetup } from '@/lib/actions/abrechnung';
import { calculateCombinedForecast } from '@/lib/calculations/heating-forecast';
import { formatCurrency } from '@/lib/calculations/costs';
import type {
  HeatingBillingSetup,
  AbrechnungSetup,
  RoomWithRadiators,
  Reading,
  CombinedForecastResult,
  IstaConsumption,
} from '@/types/database';

const cardStyle = {
  borderRadius: '4px',
  boxShadow: 'var(--nexo-card-shadow)',
  border: 'none',
};

interface AbrechnungFormProps {
  heizungCategoryId: string;
  warmwasserCategoryId: string;
  heizungSetup: HeatingBillingSetup | null;
  warmwasserSetup: HeatingBillingSetup | null;
  abrechnungSetup: AbrechnungSetup | null;
  rooms: RoomWithRadiators[];
  waterReadings: Reading[];
  heizungIstaData?: IstaConsumption[];
  warmwasserIstaData?: IstaConsumption[];
}

export function AbrechnungForm({
  heizungCategoryId,
  warmwasserCategoryId,
  heizungSetup,
  warmwasserSetup,
  abrechnungSetup,
  rooms,
  waterReadings,
  heizungIstaData,
  warmwasserIstaData,
}: AbrechnungFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Section 1: Abrechnungsdaten (shared)
  const [zeitraumStart, setZeitraumStart] = useState(abrechnungSetup?.abrechnungszeitraum_start ?? '');
  const [zeitraumEnd, setZeitraumEnd] = useState(abrechnungSetup?.abrechnungszeitraum_end ?? '');
  const [totalBuildingArea, setTotalBuildingArea] = useState(
    heizungSetup?.total_building_area?.toString() ?? warmwasserSetup?.total_building_area?.toString() ?? ''
  );
  const [yourArea, setYourArea] = useState(
    heizungSetup?.your_area?.toString() ?? warmwasserSetup?.your_area?.toString() ?? ''
  );
  const [grundkostenPercent, setGrundkostenPercent] = useState(
    heizungSetup?.grundkosten_percent?.toString() ?? '30'
  );
  const [verbrauchskostenPercent, setVerbrauchskostenPercent] = useState(
    heizungSetup?.verbrauchskosten_percent?.toString() ?? '70'
  );

  // Section 2: Heizkosten
  const [heizungTotalCost, setHeizungTotalCost] = useState(heizungSetup?.total_building_cost?.toString() ?? '');
  const [heizungTotalUnits, setHeizungTotalUnits] = useState(heizungSetup?.total_building_units?.toString() ?? '');
  const [heizungYourUnits, setHeizungYourUnits] = useState(heizungSetup?.your_units?.toString() ?? '');

  // Section 3: Warmwasser
  const [wwTotalCost, setWwTotalCost] = useState(warmwasserSetup?.total_building_cost?.toString() ?? '');
  const [wwTotalUnits, setWwTotalUnits] = useState(warmwasserSetup?.total_building_units?.toString() ?? '');
  const [wwYourUnits, setWwYourUnits] = useState(warmwasserSetup?.your_units?.toString() ?? '');

  // Section 4: ista Nebenkosten
  const [istaNebenkostenYear, setIstaNebenkostenYear] = useState(abrechnungSetup?.ista_nebenkosten_year?.toString() ?? '');

  // Section 5: Kalte Betriebskosten
  const [kalteBetriebskosten, setKalteBetriebskosten] = useState(abrechnungSetup?.kalte_betriebskosten_year?.toString() ?? '');

  // Section 6: Vorauszahlungen
  const [vorauszahlungMonthly, setVorauszahlungMonthly] = useState(abrechnungSetup?.vorauszahlung_monthly?.toString() ?? '');

  const handleGrundkostenChange = (val: string) => {
    setGrundkostenPercent(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      setVerbrauchskostenPercent((100 - num).toString());
    }
  };

  const handleVerbrauchskostenChange = (val: string) => {
    setVerbrauchskostenPercent(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      setGrundkostenPercent((100 - num).toString());
    }
  };

  // Build preview setups for live calculation
  const forecast: CombinedForecastResult | null = useMemo(() => {
    const tba = parseFloat(totalBuildingArea);
    const ya = parseFloat(yourArea);
    const gp = parseFloat(grundkostenPercent);
    const vp = parseFloat(verbrauchskostenPercent);

    if (isNaN(tba) || isNaN(ya) || isNaN(gp) || isNaN(vp) || tba <= 0 || ya <= 0) return null;

    const hCost = parseFloat(heizungTotalCost);
    const hUnits = parseFloat(heizungTotalUnits);
    const hYourUnits = heizungYourUnits ? parseFloat(heizungYourUnits) : null;

    const previewHeizung: HeatingBillingSetup | null =
      !isNaN(hCost) && !isNaN(hUnits) && hCost > 0 && hUnits > 0
        ? {
            id: '', user_id: '', category_id: heizungCategoryId,
            total_building_cost: hCost, grundkosten_percent: gp, verbrauchskosten_percent: vp,
            total_building_area: tba, your_area: ya, total_building_units: hUnits,
            your_units: hYourUnits !== null && !isNaN(hYourUnits) ? hYourUnits : null,
            abschlag_monthly: 0, created_at: '', updated_at: '',
          }
        : null;

    const wCost = parseFloat(wwTotalCost);
    const wUnits = parseFloat(wwTotalUnits);
    const wYourUnits = wwYourUnits ? parseFloat(wwYourUnits) : null;

    const previewWarmwasser: HeatingBillingSetup | null =
      !isNaN(wCost) && !isNaN(wUnits) && wCost > 0 && wUnits > 0
        ? {
            id: '', user_id: '', category_id: warmwasserCategoryId,
            total_building_cost: wCost, grundkosten_percent: gp, verbrauchskosten_percent: vp,
            total_building_area: tba, your_area: ya, total_building_units: wUnits,
            your_units: wYourUnits !== null && !isNaN(wYourUnits) ? wYourUnits : null,
            abschlag_monthly: 0, created_at: '', updated_at: '',
          }
        : null;

    if (!previewHeizung && !previewWarmwasser) return null;

    // The Abrechnungszeitraum start IS the forecast period start
    const periodStart: string | undefined = zeitraumStart || undefined;

    return calculateCombinedForecast(
      previewHeizung,
      previewWarmwasser,
      {
        kalte_betriebskosten_year: parseFloat(kalteBetriebskosten) || 0,
        ista_nebenkosten_year: parseFloat(istaNebenkostenYear) || 0,
        vorauszahlung_monthly: parseFloat(vorauszahlungMonthly) || 0,
      },
      rooms,
      waterReadings,
      heizungIstaData,
      warmwasserIstaData,
      periodStart,
    );
  }, [
    totalBuildingArea, yourArea, grundkostenPercent, verbrauchskostenPercent,
    heizungTotalCost, heizungTotalUnits, heizungYourUnits, heizungCategoryId,
    wwTotalCost, wwTotalUnits, wwYourUnits, warmwasserCategoryId,
    kalteBetriebskosten, istaNebenkostenYear, vorauszahlungMonthly,
    zeitraumStart, rooms, waterReadings, heizungIstaData, warmwasserIstaData,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const tba = parseFloat(totalBuildingArea);
      const ya = parseFloat(yourArea);
      const gp = parseFloat(grundkostenPercent);
      const vp = parseFloat(verbrauchskostenPercent);

      if (isNaN(tba) || isNaN(ya) || isNaN(gp) || isNaN(vp)) {
        throw new Error('Bitte Gebäude- und Wohnfläche ausfüllen');
      }
      if (Math.abs(gp + vp - 100) > 0.01) {
        throw new Error('Grundkosten + Verbrauchskosten müssen zusammen 100% ergeben');
      }

      // Save all 3 sections in parallel (independent writes)
      const hCost = parseFloat(heizungTotalCost);
      const hUnits = parseFloat(heizungTotalUnits);
      const wCost = parseFloat(wwTotalCost);
      const wUnits = parseFloat(wwTotalUnits);

      await Promise.all([
        !isNaN(hCost) && !isNaN(hUnits) && hCost > 0 && hUnits > 0
          ? upsertHeatingBillingSetup({
              categoryId: heizungCategoryId,
              totalBuildingCost: hCost,
              grundkostenPercent: gp,
              verbrauchskostenPercent: vp,
              totalBuildingArea: tba,
              yourArea: ya,
              totalBuildingUnits: hUnits,
              yourUnits: heizungYourUnits ? parseFloat(heizungYourUnits) : null,
              abschlagMonthly: 0,
            })
          : Promise.resolve(),
        !isNaN(wCost) && !isNaN(wUnits) && wCost > 0 && wUnits > 0
          ? upsertHeatingBillingSetup({
              categoryId: warmwasserCategoryId,
              totalBuildingCost: wCost,
              grundkostenPercent: gp,
              verbrauchskostenPercent: vp,
              totalBuildingArea: tba,
              yourArea: ya,
              totalBuildingUnits: wUnits,
              yourUnits: wwYourUnits ? parseFloat(wwYourUnits) : null,
              abschlagMonthly: 0,
            })
          : Promise.resolve(),
        upsertAbrechnungSetup({
          abrechnungszeitraumStart: zeitraumStart || null,
          abrechnungszeitraumEnd: zeitraumEnd || null,
          kalteBetriebskostenYear: parseFloat(kalteBetriebskosten) || 0,
          istaNebenkostenYear: parseFloat(istaNebenkostenYear) || 0,
          vorauszahlungMonthly: parseFloat(vorauszahlungMonthly) || 0,
        }),
      ]);

      setSuccess('Alle Abrechnungsdaten gespeichert!');
      setTimeout(() => setSuccess(null), 3000);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern');
    } finally {
      setLoading(false);
    }
  };

  const isNachzahlung = forecast?.differenceType === 'nachzahlung';
  const statusColor = forecast
    ? isNachzahlung ? 'var(--nexo-nachzahlung-text)' : 'var(--nexo-guthaben-text)'
    : 'var(--nexo-text-muted)';
  const statusBg = forecast
    ? isNachzahlung ? 'var(--nexo-nachzahlung-bg)' : 'var(--nexo-guthaben-bg)'
    : 'var(--nexo-surface)';
  const borderColor = isNachzahlung ? 'var(--nexo-nachzahlung-border)' : 'var(--nexo-guthaben-border)';
  const dashedBorder = isNachzahlung ? 'var(--nexo-nachzahlung-border-dashed)' : 'var(--nexo-guthaben-border-dashed)';

  const hasExistingData = heizungSetup || warmwasserSetup || abrechnungSetup;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Live Forecast Preview */}
      {forecast && (
        <div
          className="animate-fade-in-up"
          style={{
            backgroundColor: statusBg,
            borderRadius: '4px',
            boxShadow: 'var(--nexo-card-shadow)',
            padding: '24px',
          }}
        >
          <p className="font-body" style={{ fontSize: '14px', fontWeight: 500, color: statusColor }}>
            {isNachzahlung ? 'Erwartete Nachzahlung (gesamt)' : 'Erwartetes Guthaben (gesamt)'}
          </p>
          <p
            className="font-heading"
            style={{ fontSize: '32px', fontWeight: 400, color: statusColor, marginTop: '8px' }}
          >
            ~{formatCurrency(forecast.difference)}
          </p>
          <p className="font-body" style={{ fontSize: '14px', color: statusColor, opacity: 0.8, marginTop: '8px' }}>
            Vorauszahlungen: {formatCurrency(parseFloat(vorauszahlungMonthly) || 0)}/Monat
          </p>

          <div style={{ marginTop: '16px', borderTop: `1px solid ${borderColor}`, paddingTop: '14px' }}>
            <div className="space-y-2">
              {/* Heizkosten breakdown */}
              {forecast.heizung && (
                <>
                  <div className="flex justify-between gap-3">
                    <span className="font-body" style={{ fontSize: '13px', color: statusColor, opacity: 0.7 }}>
                      Heizung
                    </span>
                    <span className="font-body flex-shrink-0" style={{ fontSize: '13px', fontWeight: 600, color: statusColor }}>
                      {formatCurrency(forecast.heizung.yourAnnualCost)}
                    </span>
                  </div>
                </>
              )}

              {/* Warmwasser breakdown */}
              {forecast.warmwasser && (
                <div className="flex justify-between gap-3">
                  <span className="font-body" style={{ fontSize: '13px', color: statusColor, opacity: 0.7 }}>
                    Warmwasser
                  </span>
                  <span className="font-body flex-shrink-0" style={{ fontSize: '13px', fontWeight: 600, color: statusColor }}>
                    {formatCurrency(forecast.warmwasser.yourAnnualCost)}
                  </span>
                </div>
              )}

              {/* ista Nebenkosten */}
              {forecast.istaNebenkostenYear > 0 && (
                <div className="flex justify-between gap-3">
                  <span className="font-body" style={{ fontSize: '13px', color: statusColor, opacity: 0.7 }}>
                    Hausnebenkosten
                  </span>
                  <span className="font-body flex-shrink-0" style={{ fontSize: '13px', fontWeight: 600, color: statusColor }}>
                    {formatCurrency(forecast.istaNebenkostenYear)}
                  </span>
                </div>
              )}

              {/* Betriebskosten */}
              {forecast.betriebskosten > 0 && (
                <div className="flex justify-between gap-3">
                  <span className="font-body" style={{ fontSize: '13px', color: statusColor, opacity: 0.7 }}>
                    Kalte Betriebskosten
                  </span>
                  <span className="font-body flex-shrink-0" style={{ fontSize: '13px', fontWeight: 600, color: statusColor }}>
                    {formatCurrency(forecast.betriebskosten)}
                  </span>
                </div>
              )}

              {/* Total */}
              <div style={{ borderTop: `1px dashed ${dashedBorder}`, paddingTop: '6px', marginTop: '4px' }}>
                <div className="flex justify-between gap-3">
                  <span className="font-body" style={{ fontSize: '13px', color: statusColor, opacity: 0.7 }}>Gesamtkosten (projiziert)</span>
                  <span className="font-body flex-shrink-0" style={{ fontSize: '13px', fontWeight: 600, color: statusColor }}>
                    {formatCurrency(forecast.totalProjected)}
                  </span>
                </div>
                <div className="flex justify-between gap-3" style={{ marginTop: '4px' }}>
                  <span className="font-body" style={{ fontSize: '13px', color: statusColor, opacity: 0.7 }}>
                    Vorauszahlungen ({formatCurrency(parseFloat(vorauszahlungMonthly) || 0)}/Monat)
                  </span>
                  <span className="font-body flex-shrink-0" style={{ fontSize: '13px', fontWeight: 600, color: statusColor }}>
                    -{formatCurrency(forecast.annualVorauszahlungen)}
                  </span>
                </div>
              </div>

              {/* Result */}
              <div style={{ borderTop: `1px dashed ${dashedBorder}`, paddingTop: '6px', marginTop: '4px' }}>
                <div className="flex justify-between gap-3">
                  <span className="font-body" style={{ fontSize: '13px', fontWeight: 600, color: statusColor }}>
                    {isNachzahlung ? 'Nachzahlung' : 'Guthaben'}
                  </span>
                  <span className="font-body flex-shrink-0" style={{ fontSize: '13px', fontWeight: 700, color: statusColor }}>
                    ~{formatCurrency(forecast.difference)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 1: Abrechnungsdaten */}
      <Card style={cardStyle}>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px' }}>
            Abrechnungsdaten
            <HelpTooltip text="Gemeinsame Gebäudedaten aus Ihrer Heizkostenabrechnung (z.B. von ista). Diese gelten für Heizung und Warmwasser." />
          </CardTitle>
          <CardDescription className="font-body">Gebäudedaten und Verteilschlüssel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zeitraumStart">Abrechnungszeitraum von</Label>
              <Input
                id="zeitraumStart"
                type="date"
                value={zeitraumStart}
                onChange={(e) => setZeitraumStart(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zeitraumEnd">Abrechnungszeitraum bis</Label>
              <Input
                id="zeitraumEnd"
                type="date"
                value={zeitraumEnd}
                onChange={(e) => setZeitraumEnd(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalBuildingArea">Gesamtfläche Gebäude (m²)</Label>
              <Input
                id="totalBuildingArea"
                type="number"
                step="0.01"
                min="0"
                placeholder="z.B. 3238"
                value={totalBuildingArea}
                onChange={(e) => setTotalBuildingArea(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="yourArea">Ihre Wohnfläche (m²)</Label>
              <Input
                id="yourArea"
                type="number"
                step="0.01"
                min="0"
                placeholder="z.B. 56.29"
                value={yourArea}
                onChange={(e) => setYourArea(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grundkostenPercent">
                Grundkosten-Anteil (%)
                <HelpTooltip text="Wird nach Wohnfläche verteilt. Standard: 30%" />
              </Label>
              <Input
                id="grundkostenPercent"
                type="number"
                step="1"
                min="0"
                max="100"
                value={grundkostenPercent}
                onChange={(e) => handleGrundkostenChange(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="verbrauchskostenPercent">
                Verbrauchskosten-Anteil (%)
                <HelpTooltip text="Wird nach Verbrauch (Heizeinheiten / m³) verteilt. Standard: 70%" />
              </Label>
              <Input
                id="verbrauchskostenPercent"
                type="number"
                step="1"
                min="0"
                max="100"
                value={verbrauchskostenPercent}
                onChange={(e) => handleVerbrauchskostenChange(e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Heizkosten */}
      <Card style={cardStyle}>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px' }}>
            Heizkosten
            <HelpTooltip text="Daten aus Ihrer Heizkostenabrechnung (Seite 3). Gilt für alle Anbieter (ista, Techem, Minol u.a.). Gesamtkosten und Einheiten des Gebäudes." />
          </CardTitle>
          <CardDescription className="font-body">Heizkostenabrechnung · Seite 3, oberer Teil (Heizkosten)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heizungTotalCost">Gesamtkosten Heizung Gebäude (€)</Label>
            <Input
              id="heizungTotalCost"
              type="number"
              step="0.01"
              min="0"
              placeholder="z.B. 43753.02"
              value={heizungTotalCost}
              onChange={(e) => setHeizungTotalCost(e.target.value)}
            />
            {parseFloat(heizungTotalCost) > 0 && (
              <p style={{ fontSize: '11px', color: 'var(--nexo-text-muted)', marginTop: '4px' }}>
                ⚠ Wert aus Vorjahr — aktualisieren sobald die neue Rechnung vorliegt
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="heizungTotalUnits">Gesamt-Heizeinheiten Gebäude (HKV)</Label>
              <Input
                id="heizungTotalUnits"
                type="number"
                step="0.01"
                min="0"
                placeholder="z.B. 89432"
                value={heizungTotalUnits}
                onChange={(e) => setHeizungTotalUnits(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heizungYourUnits">
                Ihre Heizeinheiten
                <HelpTooltip text="Leer lassen = automatisch aus Ihren Heizkörper-Ablesungen berechnet." />
              </Label>
              <Input
                id="heizungYourUnits"
                type="number"
                step="0.01"
                min="0"
                placeholder="Auto aus Ablesungen"
                value={heizungYourUnits}
                onChange={(e) => setHeizungYourUnits(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Warmwasser */}
      <Card style={cardStyle}>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px' }}>
            Warmwasser
            <HelpTooltip text="Daten aus Ihrer Warmwasserabrechnung (Seite 3). Gilt für alle Anbieter (ista, Techem, Minol u.a.). Gesamtkosten und m³ des Gebäudes." />
          </CardTitle>
          <CardDescription className="font-body">Heizkostenabrechnung · Seite 3, unterer Teil (Warmwasserkosten)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wwTotalCost">Gesamtkosten Warmwasser Gebäude (€)</Label>
            <Input
              id="wwTotalCost"
              type="number"
              step="0.01"
              min="0"
              placeholder="z.B. 12767.76"
              value={wwTotalCost}
              onChange={(e) => setWwTotalCost(e.target.value)}
            />
            {parseFloat(wwTotalCost) > 0 && (
              <p style={{ fontSize: '11px', color: 'var(--nexo-text-muted)', marginTop: '4px' }}>
                ⚠ Wert aus Vorjahr — aktualisieren sobald die neue Rechnung vorliegt
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="wwTotalUnits">Gesamt-Warmwasser Gebäude (m³)</Label>
              <Input
                id="wwTotalUnits"
                type="number"
                step="0.01"
                min="0"
                placeholder="z.B. 517.02"
                value={wwTotalUnits}
                onChange={(e) => setWwTotalUnits(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wwYourUnits">
                Ihr Warmwasserverbrauch (m³)
                <HelpTooltip text="Leer lassen = automatisch aus Ihren Zählerständen berechnet." />
              </Label>
              <Input
                id="wwYourUnits"
                type="number"
                step="0.01"
                min="0"
                placeholder="Auto aus Zählerständen"
                value={wwYourUnits}
                onChange={(e) => setWwYourUnits(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: ista Nebenkosten */}
      <Card style={cardStyle}>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px' }}>
            Hausnebenkosten
            <HelpTooltip text="Ihre direkten Hausnebenkosten aus der Heizkostenabrechnung (Seite 3). Diese Kosten werden nicht über die 30/70-Formel berechnet, sondern direkt Ihnen zugeordnet." />
          </CardTitle>
          <CardDescription className="font-body">Heizkostenabrechnung · Seite 3 &quot;Hausnebenkosten&quot; (Trinkwasser, Abwasser, Service, Geräte)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="istaNebenkostenYear">
              Hausnebenkosten (€/Jahr)
              <HelpTooltip text="Summe Ihrer Hausnebenkosten aus der Heizkostenabrechnung (Seite 3). Enthält z.B. Trinkwasser VK, Abwasser VK, Service und Gerätekosten." />
            </Label>
            <Input
              id="istaNebenkostenYear"
              type="number"
              step="0.01"
              min="0"
              placeholder="z.B. 580.92"
              value={istaNebenkostenYear}
              onChange={(e) => setIstaNebenkostenYear(e.target.value)}
            />
          </div>
          <p className="font-body" style={{ fontSize: '12px', color: 'var(--nexo-text-muted)' }}>
            Diese Kosten stehen auf Seite 3 Ihrer Abrechnung unter &quot;Hausnebenkosten&quot;.
          </p>
        </CardContent>
      </Card>

      {/* Section 5: Kalte Betriebskosten */}
      <Card style={cardStyle}>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px' }}>
            Kalte Betriebskosten
            <HelpTooltip text="Gesamtkosten aus der Betriebskostenabrechnung der Hausverwaltung abzüglich der Heiz- und Wasserkosten des Anbieters." />
          </CardTitle>
          <CardDescription className="font-body">Hausverwaltungs-Abrechnung · Gesamtkosten minus Anbieter-Zeile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="kalteBetriebskosten">
              Kalte Betriebskosten (€/Jahr)
              <HelpTooltip text="Gesamtbetrag aus der Hausverwaltungs-Abrechnung minus die Heiz- und Wasserkosten des Anbieters. Enthält z.B. Grundsteuer, Versicherung, Müll, Hauswart, Winterdienst." />
            </Label>
            <Input
              id="kalteBetriebskosten"
              type="number"
              step="0.01"
              min="0"
              placeholder="z.B. 908.01"
              value={kalteBetriebskosten}
              onChange={(e) => setKalteBetriebskosten(e.target.value)}
            />
          </div>
          <p className="font-body" style={{ fontSize: '12px', color: 'var(--nexo-text-muted)' }}>
            Berechnung: Gesamtkosten Hausverwaltung − Heiz-/Wasserkosten des Anbieters = Kalte Betriebskosten
          </p>
          <details style={{ marginTop: 10 }}>
            <summary className="font-body" style={{ fontSize: '12px', color: 'var(--nexo-cta)', cursor: 'pointer', fontWeight: 500, userSelect: 'none' }}>
              Beispielrechnung anzeigen
            </summary>
            <div
              className="font-body"
              style={{
                marginTop: 10,
                padding: '12px 14px',
                borderRadius: '4px',
                backgroundColor: 'var(--nexo-surface)',
                fontSize: '12px',
                color: 'var(--nexo-text-secondary)',
                lineHeight: '1.7',
              }}
            >
              <p style={{ fontWeight: 600, color: 'var(--nexo-text-primary)', marginBottom: 6 }}>
                So finden Sie den Wert in Ihrer Hausverwaltungs-Abrechnung:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2px 12px', alignItems: 'baseline' }}>
                <span style={{ whiteSpace: 'nowrap' }}>Summe Betriebskosten (Hausverwaltung)</span>
                <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>z.B. 2.447,70 €</span>
                <span>− Heiz- u. Wasserkosten des Anbieters (1. Zeile)</span>
                <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>− 1.539,69 €</span>
                <span style={{ borderTop: '1px solid var(--nexo-border)', paddingTop: 4, fontWeight: 600, color: 'var(--nexo-text-primary)' }}>
                  = Kalte Betriebskosten
                </span>
                <span style={{ borderTop: '1px solid var(--nexo-border)', paddingTop: 4, textAlign: 'right', fontWeight: 600, color: 'var(--nexo-text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                  908,01 €
                </span>
              </div>
              <p style={{ marginTop: 8, color: 'var(--nexo-text-muted)' }}>
                Die Heiz-/Wasserkosten des Anbieters sind in der Betriebskostenabrechnung meist die erste Position unter &quot;Kostenanteil&quot;.
              </p>
            </div>
          </details>
        </CardContent>
      </Card>

      {/* Section 6: Vorauszahlungen */}
      <Card style={cardStyle}>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px' }}>
            Vorauszahlungen
            <HelpTooltip text="Ihre monatliche Nebenkosten-Vorauszahlung an den Vermieter (ohne Kaltmiete)." />
          </CardTitle>
          <CardDescription className="font-body">Monatlicher Abschlag für alle Nebenkosten</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vorauszahlungMonthly">
              Nebenkosten-Vorauszahlung (€/Monat)
              <HelpTooltip text="Der Betrag, den Sie monatlich an Ihren Vermieter für Nebenkosten zahlen (ohne Kaltmiete). Steht im Mietvertrag oder der letzten Abrechnung." />
            </Label>
            <Input
              id="vorauszahlungMonthly"
              type="number"
              step="0.01"
              min="0"
              placeholder="z.B. 208.84"
              value={vorauszahlungMonthly}
              onChange={(e) => setVorauszahlungMonthly(e.target.value)}
            />
          </div>
          <p className="font-body" style={{ fontSize: '12px', color: 'var(--nexo-text-muted)' }}>
            Jahresbetrag: {formatCurrency((parseFloat(vorauszahlungMonthly) || 0) * 12)}
          </p>
        </CardContent>
      </Card>

      {/* Messages */}
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

      {/* Submit */}
      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? 'Speichern...' : hasExistingData ? 'Aktualisieren' : 'Speichern'}
        </Button>
      </div>
    </form>
  );
}
