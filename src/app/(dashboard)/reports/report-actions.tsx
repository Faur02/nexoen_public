'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MeterReportData } from '@/lib/actions/meters';
import { CombinedForecastResult, SubscriptionTier } from '@/types/database';
import { formatCurrency, formatNumber } from '@/lib/calculations/costs';
import { hasAccess } from '@/lib/config/tiers';

interface ReportActionsProps {
  meters: MeterReportData[];
  combinedForecast: CombinedForecastResult | null;
  subscriptionTier: SubscriptionTier;
}

const meterTypeLabels: Record<string, string> = {
  electricity: 'Strom',
  gas: 'Gas',
  water: 'Wasser',
  heating: 'Heizung',
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

const meterDotColors: Record<string, string> = {
  electricity: '#5B8DEF',
  gas: '#E28A5C',
  water: '#2FAE8E',
  heating: '#E6A65C',
};

export function ReportActions({ meters, combinedForecast, subscriptionTier }: ReportActionsProps) {
  const [generating, setGenerating] = useState(false);
  const canExportPDF = hasAccess(subscriptionTier);

  const generatePDF = async () => {
    setGenerating(true);

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Bitte erlauben Sie Pop-ups für diese Seite');
      setGenerating(false);
      return;
    }

    // Tariff totals (Strom/Gas)
    const tariffYearly = meters.reduce((sum, m) => sum + m.yearlyEstimate, 0);
    const tariffAbschlag = meters.reduce((sum, m) => sum + ((m.tariff?.abschlag || 0) * 12), 0);

    // Nebenkosten totals
    const nebenkostenYearly = combinedForecast?.totalProjected ?? 0;
    const nebenkostenVorauszahlungen = combinedForecast?.annualVorauszahlungen ?? 0;

    // Grand totals
    const totalYearly = tariffYearly + nebenkostenYearly;
    const totalPrepaid = tariffAbschlag + nebenkostenVorauszahlungen;
    const totalDifference = totalYearly - totalPrepaid;
    const isNachzahlung = totalDifference > 0;

    const today = new Date();
    const dateStr = today.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });

    const meterSections = meters.map(meter => {
      const color = meterDotColors[meter.type] || '#6B7280';
      const label = meterTypeLabels[meter.type] || meter.type;
      const hasAbschlag = meter.tariff?.abschlag && meter.tariff.abschlag > 0;
      const meterYearly = meter.yearlyEstimate;
      const meterAbschlag = (meter.tariff?.abschlag || 0) * 12;
      const meterDiff = meterYearly - meterAbschlag;
      const meterIsNachzahlung = meterDiff > 0;

      return `
        <div class="meter-section">
          <div class="meter-header">
            <div class="meter-dot" style="background: ${color};"></div>
            <div>
              <div class="meter-name">${escapeHtml(meter.name)}</div>
              <div class="meter-type">${label}</div>
            </div>
          </div>

          <div class="data-grid three-col">
            <div class="data-card">
              <div class="data-label">Tagesverbrauch (&#216;)</div>
              <div class="data-value">${formatNumber(meter.dailyAverage)} ${escapeHtml(meter.unit)}</div>
            </div>
            <div class="data-card">
              <div class="data-label">Monatskosten (gesch.)</div>
              <div class="data-value">${formatCurrency(meter.monthlyEstimate)}</div>
            </div>
            <div class="data-card">
              <div class="data-label">Jahreskosten (gesch.)</div>
              <div class="data-value">${formatCurrency(meter.yearlyEstimate)}</div>
            </div>
          </div>

          ${meter.tariff ? `
            <div class="subsection-title">Tarifinformationen</div>
            <div class="data-grid ${hasAbschlag ? 'four-col' : 'three-col'}">
              <div class="data-card-sm">
                <div class="data-label">Arbeitspreis</div>
                <div class="data-value-sm">${meter.tariff.arbeitspreis} &euro;/${escapeHtml(meter.unit)}</div>
              </div>
              <div class="data-card-sm">
                <div class="data-label">Grundpreis</div>
                <div class="data-value-sm">${formatCurrency(meter.tariff.grundpreis)}/Monat</div>
              </div>
              ${hasAbschlag ? `
                <div class="data-card-sm">
                  <div class="data-label">Abschlag</div>
                  <div class="data-value-sm">${formatCurrency(meter.tariff.abschlag!)}/Monat</div>
                </div>
                <div class="data-card-sm" style="background: ${meterIsNachzahlung ? '#FFF5EE' : '#EEFBF5'};">
                  <div class="data-label">${meterIsNachzahlung ? 'Nachzahlung' : 'Guthaben'}</div>
                  <div class="data-value-sm" style="color: ${meterIsNachzahlung ? '#E28A5C' : '#2FAE8E'};">
                    ${formatCurrency(Math.abs(meterDiff))}
                  </div>
                </div>
              ` : ''}
            </div>
          ` : `
            <div class="no-tariff">Kein Tarif hinterlegt</div>
          `}

          ${meter.readings.length > 0 ? `
            <div class="subsection-title">Zählerstandsverlauf</div>
            <table>
              <thead>
                <tr>
                  <th>Datum</th>
                  <th style="text-align: right;">Zählerstand (${escapeHtml(meter.unit)})</th>
                  ${meter.readings.length > 1 ? '<th style="text-align: right;">Verbrauch</th>' : ''}
                </tr>
              </thead>
              <tbody>
                ${meter.readings.map((r, i) => {
                  const next = meter.readings[i + 1];
                  const consumption = next ? r.value - next.value : null;
                  return `
                    <tr>
                      <td>${new Date(r.reading_date).toLocaleDateString('de-DE')}</td>
                      <td style="text-align: right; font-variant-numeric: tabular-nums;">${formatNumber(r.value)}</td>
                      ${meter.readings.length > 1 ? `<td style="text-align: right; font-variant-numeric: tabular-nums;">${consumption !== null ? formatNumber(consumption) : '&mdash;'}</td>` : ''}
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          ` : `<div class="no-tariff">Noch keine Zählerstände erfasst</div>`}
        </div>
      `;
    }).join('');

    // Nebenkosten section for PDF
    const nebenkostenSection = combinedForecast ? (() => {
      const rows: string[] = [];

      if (combinedForecast.heizung) {
        rows.push(`
          <div class="nk-row">
            <div class="nk-label"><div class="nk-dot" style="background: #E6A65C;"></div> Heizung</div>
            <div class="nk-value">${formatCurrency(combinedForecast.heizung.yourAnnualCost)}</div>
          </div>
        `);
      }
      if (combinedForecast.warmwasser) {
        rows.push(`
          <div class="nk-row">
            <div class="nk-label"><div class="nk-dot" style="background: #2FAE8E;"></div> Warmwasser</div>
            <div class="nk-value">${formatCurrency(combinedForecast.warmwasser.yourAnnualCost)}</div>
          </div>
        `);
      }
      if (combinedForecast.istaNebenkostenYear > 0) {
        rows.push(`
          <div class="nk-row">
            <div class="nk-label"><div class="nk-dot" style="background: #C084FC;"></div> Hausnebenkosten</div>
            <div class="nk-value">${formatCurrency(combinedForecast.istaNebenkostenYear)}</div>
          </div>
        `);
      }
      if (combinedForecast.betriebskosten > 0) {
        rows.push(`
          <div class="nk-row">
            <div class="nk-label"><div class="nk-dot" style="background: #5B8DEF;"></div> Kalte Betriebskosten</div>
            <div class="nk-value">${formatCurrency(combinedForecast.betriebskosten)}</div>
          </div>
        `);
      }

      const nkIsNachzahlung = combinedForecast.differenceType === 'nachzahlung';
      const nkColor = nkIsNachzahlung ? '#E28A5C' : '#2FAE8E';
      const nkBg = nkIsNachzahlung ? '#FFF5EE' : '#EEFBF5';

      return `
        <div class="meter-section">
          <div class="meter-header">
            <div class="meter-dot" style="background: #374151;"></div>
            <div>
              <div class="meter-name">Nebenkosten</div>
              <div class="meter-type">Heizung, Warmwasser & Betriebskosten</div>
            </div>
          </div>

          <div class="nk-breakdown">
            ${rows.join('')}
            <div class="nk-row nk-total">
              <div class="nk-label"><strong>Nebenkosten gesamt</strong></div>
              <div class="nk-value"><strong>${formatCurrency(combinedForecast.totalProjected)}</strong></div>
            </div>
            <div class="nk-row">
              <div class="nk-label" style="color: #6B7280;">Vorauszahlungen (Jahr)</div>
              <div class="nk-value" style="color: #6B7280;">&minus; ${formatCurrency(combinedForecast.annualVorauszahlungen)}</div>
            </div>
            <div class="nk-row nk-result" style="background: ${nkBg};">
              <div class="nk-label" style="color: ${nkColor}; font-weight: 600;">
                ${nkIsNachzahlung ? 'Nachzahlung' : 'Guthaben'}
              </div>
              <div class="nk-value" style="color: ${nkColor}; font-weight: 600;">
                ${nkIsNachzahlung ? '+' : ''} ${formatCurrency(combinedForecast.difference)}
              </div>
            </div>
          </div>
        </div>
      `;
    })() : '';

    const meterCount = meters.length + (combinedForecast ? 1 : 0);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="de">
      <head>
        <meta charset="utf-8" />
        <title>nexoen Energiebericht - ${dateStr}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700;900&family=Inter:wght@400;500;600&display=swap');

          * { margin: 0; padding: 0; box-sizing: border-box; }

          body {
            font-family: 'Inter', -apple-system, sans-serif;
            color: #1F2937;
            background: white;
            padding: 0;
            font-size: 13px;
            line-height: 1.5;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .page {
            max-width: 780px;
            margin: 0 auto;
            padding: 48px 40px;
          }

          /* Header */
          .report-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 28px;
            border-bottom: 3px solid #0f0f0f;
            margin-bottom: 32px;
          }

          .logo {
            font-family: 'Source Serif 4', Georgia, serif;
            display: flex;
            align-items: baseline;
            line-height: 1;
          }

          .report-meta {
            text-align: right;
            color: #6B7280;
            font-size: 12px;
            line-height: 1.7;
          }

          .report-title {
            font-family: 'Source Serif 4', Georgia, serif;
            font-size: 14px;
            font-weight: 600;
            color: #1F2937;
            margin-bottom: 2px;
          }

          /* Summary Banner */
          .summary-banner {
            display: flex;
            gap: 0;
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 36px;
            border: 1px solid #E5E7EB;
          }

          .summary-item {
            flex: 1;
            padding: 20px 24px;
            border-right: 1px solid #E5E7EB;
          }

          .summary-item:last-child {
            border-right: none;
          }

          .summary-item.highlight {
            background: ${isNachzahlung ? '#FFF5EE' : '#EEFBF5'};
          }

          .summary-label {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #6B7280;
            margin-bottom: 6px;
          }

          .summary-value {
            font-family: 'Source Serif 4', Georgia, serif;
            font-size: 22px;
            font-weight: 600;
            color: #1F2937;
          }

          .summary-value.nachzahlung { color: #E28A5C; }
          .summary-value.guthaben { color: #2FAE8E; }

          /* Meter Sections */
          .meter-section {
            margin-bottom: 36px;
            padding-bottom: 36px;
            border-bottom: 1px solid #E5E7EB;
            page-break-inside: avoid;
          }

          .meter-section:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
          }

          .meter-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
          }

          .meter-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            flex-shrink: 0;
          }

          .meter-name {
            font-family: 'Source Serif 4', Georgia, serif;
            font-size: 20px;
            font-weight: 600;
            color: #1F2937;
          }

          .meter-type {
            font-size: 12px;
            color: #6B7280;
          }

          /* Data Grids */
          .data-grid {
            display: flex;
            gap: 12px;
            margin-bottom: 16px;
          }

          .three-col .data-card,
          .three-col .data-card-sm { flex: 1; }
          .four-col .data-card,
          .four-col .data-card-sm { flex: 1; }

          .data-card {
            background: #F9FAFB;
            border-radius: 4px;
            padding: 16px;
            border: 1px solid #F3F4F6;
          }

          .data-card-sm {
            background: #F9FAFB;
            border-radius: 4px;
            padding: 12px 14px;
            border: 1px solid #F3F4F6;
          }

          .data-label {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            color: #6B7280;
            margin-bottom: 4px;
          }

          .data-value {
            font-family: 'Source Serif 4', Georgia, serif;
            font-size: 18px;
            font-weight: 600;
            color: #1F2937;
          }

          .data-value-sm {
            font-family: 'Source Serif 4', Georgia, serif;
            font-size: 15px;
            font-weight: 600;
            color: #1F2937;
          }

          .subsection-title {
            font-family: 'Source Serif 4', Georgia, serif;
            font-size: 14px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 10px;
            margin-top: 4px;
          }

          .no-tariff {
            color: #9CA3AF;
            font-style: italic;
            font-size: 13px;
            padding: 8px 0;
          }

          /* Nebenkosten breakdown */
          .nk-breakdown {
            border: 1px solid #E5E7EB;
            border-radius: 4px;
            overflow: hidden;
          }

          .nk-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px solid #F3F4F6;
          }

          .nk-row:last-child {
            border-bottom: none;
          }

          .nk-label {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #1F2937;
            font-size: 13px;
          }

          .nk-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            flex-shrink: 0;
          }

          .nk-value {
            font-family: 'Source Serif 4', Georgia, serif;
            font-size: 15px;
            font-weight: 600;
            color: #1F2937;
          }

          .nk-total {
            background: #F9FAFB;
            border-top: 2px solid #E5E7EB;
          }

          .nk-result {
            padding: 14px 16px;
          }

          /* Tables */
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
            margin-bottom: 8px;
          }

          thead th {
            background: #F9FAFB;
            border-bottom: 2px solid #E5E7EB;
            padding: 10px 14px;
            font-weight: 600;
            color: #6B7280;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            text-align: left;
          }

          tbody td {
            padding: 9px 14px;
            border-bottom: 1px solid #F3F4F6;
            color: #374151;
          }

          tbody tr:last-child td {
            border-bottom: none;
          }

          /* Footer */
          .report-footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #0f0f0f;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .footer-logo {
            font-family: 'Source Serif 4', Georgia, serif;
            display: flex;
            align-items: baseline;
            line-height: 1;
          }

          .footer-text {
            color: #9CA3AF;
            font-size: 10px;
            text-align: right;
            line-height: 1.6;
          }

          /* Print Styles */
          @media print {
            body { padding: 0; }
            .page { padding: 24px 20px; }
            .meter-section { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <!-- Header -->
          <div class="report-header">
            <div class="logo">
              <span style="font-size: 28px; font-weight: 600; letter-spacing: -0.01em; font-family: system-ui, -apple-system, sans-serif;"><span style="color: #0f172a;">nexo</span><span style="color: #0d9488;">en</span></span>
            </div>
            <div class="report-meta">
              <div class="report-title">Energiebericht</div>
              <div>${dateStr}</div>
              <div>${today.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr</div>
              <div>${meterCount} ${meterCount === 1 ? 'Bereich' : 'Bereiche'} erfasst</div>
            </div>
          </div>

          <!-- Summary Banner -->
          <div class="summary-banner">
            <div class="summary-item">
              <div class="summary-label">Jahreskosten (gesamt)</div>
              <div class="summary-value">${formatCurrency(totalYearly)}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Abschläge & Vorauszahlungen</div>
              <div class="summary-value">${formatCurrency(totalPrepaid)}</div>
            </div>
            <div class="summary-item highlight">
              <div class="summary-label">${isNachzahlung ? 'Erwartete Nachzahlung' : 'Erwartetes Guthaben'}</div>
              <div class="summary-value ${isNachzahlung ? 'nachzahlung' : 'guthaben'}">
                ${isNachzahlung ? '+' : '-'} ${formatCurrency(Math.abs(totalDifference))}
              </div>
            </div>
          </div>

          <!-- Meter Sections (Strom/Gas) -->
          ${meterSections}

          <!-- Nebenkosten Section -->
          ${nebenkostenSection}

          <!-- Footer -->
          <div class="report-footer">
            <div class="footer-logo">
              <span style="font-size: 14px; font-weight: 600; letter-spacing: -0.01em; font-family: system-ui, -apple-system, sans-serif;"><span style="color: #0f172a;">nexo</span><span style="color: #0d9488;">en</span></span>
            </div>
            <div class="footer-text">
              Automatisch erstellt von nexoen<br>
              Prognosen basieren auf bisherigen Verbrauchsdaten<br>
              und können vom tatsächlichen Verbrauch abweichen.
            </div>
          </div>
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      setGenerating(false);
    }, 500);
  };

  if (!canExportPDF) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Button
          disabled
          style={{ borderRadius: '4px', opacity: 0.5 }}
          title="Abo erforderlich für PDF-Export"
        >
          PDF erstellen
        </Button>
        <a
          href="/settings?tab=abonnement"
          className="font-body"
          style={{
            fontSize: '13px',
            color: 'var(--nexo-cta)',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          Abo aktivieren für PDF Export →
        </a>
      </div>
    );
  }

  return (
    <Button
      onClick={generatePDF}
      disabled={generating || (meters.length === 0 && !combinedForecast)}
      style={{ backgroundColor: 'var(--nexo-cta)', borderRadius: '4px' }}
    >
      {generating ? 'Wird erstellt...' : 'PDF erstellen'}
    </Button>
  );
}
