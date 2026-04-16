'use client';

import { useState } from 'react';
import * as Sentry from '@sentry/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getExportData } from '@/lib/actions/export';
import { meterTypeLabels } from '@/types/database';

// Prevent CSV/formula injection: prefix any value starting with =, +, -, @, tab, or CR with a tab
function escapeCsvField(value: string): string {
  if (/^[=+\-@\t\r]/.test(value)) {
    return `\t${value}`;
  }
  return value;
}

export function DataExportTab() {
  const [loadingCsv, setLoadingCsv] = useState(false);

  const handleCsvExport = async () => {
    setLoadingCsv(true);
    try {
      const data = await getExportData();

      if (!data.profile && data.meters.length === 0) {
        alert('Keine Daten zum Exportieren vorhanden.');
        return;
      }

      // Build CSV with semicolon delimiter for German Excel
      const BOM = '\uFEFF';
      const lines: string[] = [];

      // Profile section
      if (data.profile) {
        lines.push('Profil');
        lines.push('Name;E-Mail;Abonnement;Design;Testphase bis;E-Mail-Erinnerungen;Mitglied seit');
        const p = data.profile;
        lines.push(
          `${escapeCsvField(p.name || '')};${escapeCsvField(p.email)};${p.subscription_tier};${p.theme};${p.trial_ends_at ? new Date(p.trial_ends_at).toLocaleDateString('de-DE') : ''};${p.email_reminders_enabled ? 'Ja' : 'Nein'};${new Date(p.created_at).toLocaleDateString('de-DE')}`
        );
        lines.push('');
      }

      // Readings section
      lines.push('Zählerstände');
      lines.push('Zähler;Typ;Einheit;Datum;Zählerstand');

      // Build meter lookup
      const meterMap = new Map(data.meters.map((m) => [m.id, m]));

      for (const reading of data.readings) {
        const meter = meterMap.get(reading.meter_id);
        if (!meter) continue;
        const date = new Date(reading.reading_date).toLocaleDateString('de-DE');
        const value = reading.value.toString().replace('.', ',');
        lines.push(
          `${escapeCsvField(meter.name)};${meterTypeLabels[meter.type]};${meter.unit};${date};${value}`
        );
      }

      // Tariffs section
      lines.push('');
      lines.push('Tarife');
      lines.push('Zähler;Tarifname;Arbeitspreis;Grundpreis;Abschlag;Gültig ab;Gültig bis');

      for (const tariff of data.tariffs) {
        const meter = meterMap.get(tariff.meter_id);
        if (!meter) continue;
        const validFrom = new Date(tariff.valid_from).toLocaleDateString('de-DE');
        const validUntil = tariff.valid_until
          ? new Date(tariff.valid_until).toLocaleDateString('de-DE')
          : 'unbegrenzt';
        lines.push(
          `${escapeCsvField(meter.name)};${escapeCsvField(tariff.name || '-')};${tariff.arbeitspreis.toString().replace('.', ',')};${tariff.grundpreis.toString().replace('.', ',')};${(tariff.abschlag || 0).toString().replace('.', ',')};${validFrom};${validUntil}`
        );
      }

      // Build category ID → meter name map (predefined meters have category_id set)
      const categoryNameMap = new Map(
        data.meters
          .filter((m) => m.category_id != null)
          .map((m) => [m.category_id!, m.name])
      );

      // ista consumption section
      if (data.istaConsumption.length > 0) {
        lines.push('');
        lines.push('ista Monatsdaten');
        lines.push('Monat;Kategorie;Einheiten');
        for (const entry of data.istaConsumption) {
          const categoryName = categoryNameMap.get(entry.category_id) ?? entry.category_id;
          lines.push(`${escapeCsvField(entry.month)};${escapeCsvField(categoryName)};${entry.units.toString().replace('.', ',')}`);
        }
      }

      // Rooms section
      if (data.rooms.length > 0) {
        lines.push('');
        lines.push('Räume');
        lines.push('Zähler;Raumname');
        for (const room of data.rooms) {
          const meter = meterMap.get(room.meter_id);
          lines.push(`${escapeCsvField(meter?.name ?? '')};${escapeCsvField(room.name)}`);
        }
      }

      // Radiators section
      if (data.radiators.length > 0) {
        const roomMap = new Map(data.rooms.map((r) => [r.id, r]));
        lines.push('');
        lines.push('Heizkörper');
        lines.push('Raum;Heizkörpername');
        for (const radiator of data.radiators) {
          const room = roomMap.get(radiator.room_id);
          lines.push(`${escapeCsvField(room?.name ?? '')};${escapeCsvField(radiator.name)}`);
        }
      }

      // Radiator readings section
      if (data.radiatorReadings.length > 0) {
        const radiatorMap = new Map(data.radiators.map((r) => [r.id, r]));
        const roomMap2 = new Map(data.rooms.map((r) => [r.id, r]));
        lines.push('');
        lines.push('Heizkörper-Ablesungen');
        lines.push('Raum;Heizkörper;Datum;Wert');
        for (const rr of data.radiatorReadings) {
          const radiator = radiatorMap.get(rr.radiator_id);
          const room = radiator ? roomMap2.get(radiator.room_id) : undefined;
          const date = new Date(rr.reading_date).toLocaleDateString('de-DE');
          const value = rr.value.toString().replace('.', ',');
          lines.push(`${escapeCsvField(room?.name ?? '')};${escapeCsvField(radiator?.name ?? '')};${date};${value}`);
        }
      }

      // Abrechnung setup section
      if (data.abrechnungSetup) {
        const ab = data.abrechnungSetup;
        lines.push('');
        lines.push('Abrechnungssetup');
        lines.push('Zeitraum Start;Zeitraum Ende;ista Nebenkosten/Jahr;Betriebskosten/Jahr;Vorauszahlung/Monat');
        lines.push(
          `${escapeCsvField(ab.abrechnungszeitraum_start || '')};${escapeCsvField(ab.abrechnungszeitraum_end || '')};${(ab.ista_nebenkosten_year || 0).toString().replace('.', ',')};${(ab.kalte_betriebskosten_year || 0).toString().replace('.', ',')};${(ab.vorauszahlung_monthly || 0).toString().replace('.', ',')}`
        );
      }

      // Notification preferences
      if (data.notificationPreferences) {
        const n = data.notificationPreferences;
        lines.push('');
        lines.push('Benachrichtigungseinstellungen');
        lines.push('Verbrauchsalarme;Monatszusammenfassung;Nachzahlungswarnung');
        lines.push(`${n.consumption_alerts ? 'Ja' : 'Nein'};${n.monthly_summary ? 'Ja' : 'Nein'};${n.nachzahlung_warning ? 'Ja' : 'Nein'}`);
      }

      const csvContent = BOM + lines.join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nexoen-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      Sentry.captureException(error);
      alert('Fehler beim Exportieren der Daten.');
    } finally {
      setLoadingCsv(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card style={{ borderRadius: '4px', boxShadow: 'var(--nexo-card-shadow)' }}>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 400, color: 'var(--nexo-text-primary)' }}>Daten exportieren</CardTitle>
          <CardDescription className="font-body">
            Laden Sie Ihre Zählerstände und Tarifdaten herunter
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 p-4 border rounded">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-5 h-5" style={{ color: 'var(--nexo-cta)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h4 className="font-medium text-sm" style={{ color: 'var(--nexo-text-primary)' }}>
                  CSV-Export
                </h4>
              </div>
              <p className="text-xs mb-3" style={{ color: 'var(--nexo-text-secondary)' }}>
                Alle Zählerstände und Tarife als CSV-Datei. Kompatibel mit Excel und Google Sheets.
              </p>
              <Button
                onClick={handleCsvExport}
                disabled={loadingCsv}
                variant="outline"
                size="sm"
                style={{ borderRadius: '4px' }}
              >
                {loadingCsv ? 'Wird exportiert...' : 'CSV herunterladen'}
              </Button>
            </div>

            <div className="flex-1 p-4 border rounded">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-5 h-5" style={{ color: 'var(--nexo-cta)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <h4 className="font-medium text-sm" style={{ color: 'var(--nexo-text-primary)' }}>
                  PDF-Berichte
                </h4>
              </div>
              <p className="text-xs mb-3" style={{ color: 'var(--nexo-text-secondary)' }}>
                Detaillierte PDF-Berichte für einzelne Zähler finden Sie auf der Berichtsseite.
              </p>
              <Button
                variant="outline"
                size="sm"
                style={{ borderRadius: '4px' }}
                asChild
              >
                <a href="/reports">Zu den Berichten</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
