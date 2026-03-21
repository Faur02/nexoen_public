'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Reading, Tariff, MeterUnit } from '@/types/database';
import { calculateMonthlyBreakdown, MonthlyBreakdown } from '@/lib/calculations/monthly';
import { formatCurrency, formatNumber } from '@/lib/calculations/costs';

interface MonthlyOverviewProps {
  readings: Reading[];
  tariff: Tariff | null;
  unit: MeterUnit;
}

const cardStyle = {
  borderRadius: '4px',
  boxShadow: 'var(--nexo-card-shadow)',
  border: 'none',
};

function StatusIndicator({ status, difference }: { status: 'saved' | 'over' | 'neutral'; difference: number }) {
  if (status === 'saved') {
    return (
      <span className="inline-flex items-center gap-1 font-medium" style={{ color: 'var(--nexo-guthaben-text)' }}>
        <span className="text-lg">+</span>
        {formatCurrency(Math.abs(difference))}
      </span>
    );
  }
  if (status === 'over') {
    return (
      <span className="inline-flex items-center gap-1 font-medium" style={{ color: 'var(--nexo-nachzahlung-text)' }}>
        <span className="text-lg">-</span>
        {formatCurrency(Math.abs(difference))}
      </span>
    );
  }
  return <span style={{ color: 'var(--nexo-text-secondary)' }}>-</span>;
}

function StatusBadge({ status }: { status: 'saved' | 'over' | 'neutral' }) {
  if (status === 'saved') {
    return (
      <span
        className="inline-flex items-center px-2 py-1 text-xs font-medium"
        style={{ borderRadius: '4px', backgroundColor: 'var(--nexo-guthaben-bg)', color: 'var(--nexo-guthaben-text)' }}
      >
        Im Budget
      </span>
    );
  }
  if (status === 'over') {
    return (
      <span
        className="inline-flex items-center px-2 py-1 text-xs font-medium"
        style={{ borderRadius: '4px', backgroundColor: 'var(--nexo-nachzahlung-bg)', color: 'var(--nexo-nachzahlung-text)' }}
      >
        Über Budget
      </span>
    );
  }
  return null;
}

function MonthRow({ month, unit }: { month: MonthlyBreakdown; unit: MeterUnit }) {
  const rowBg = month.status === 'over'
    ? 'var(--nexo-nachzahlung-tint)'
    : month.status === 'saved'
      ? 'var(--nexo-guthaben-tint)'
      : 'transparent';

  return (
    <tr style={{ borderBottom: '1px solid var(--nexo-surface)', backgroundColor: rowBg }}>
      <td style={{ padding: '12px 16px' }}>
        <div style={{ fontWeight: 500 }}>{month.monthName} {month.year}</div>
        {month.isEstimated && (
          <div style={{ fontSize: '11px', color: 'var(--nexo-text-secondary)' }}>geschätzt</div>
        )}
      </td>
      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
        {formatNumber(month.consumption)} {unit}
      </td>
      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
        {formatCurrency(month.cost)}
      </td>
      <td className="hidden sm:table-cell" style={{ padding: '12px 16px', textAlign: 'right' }}>
        {month.abschlag > 0 ? formatCurrency(month.abschlag) : '-'}
      </td>
      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
        <StatusIndicator status={month.status} difference={month.difference} />
      </td>
      <td className="hidden sm:table-cell" style={{ padding: '12px 16px', textAlign: 'center' }}>
        <StatusBadge status={month.status} />
      </td>
    </tr>
  );
}

export function MonthlyOverview({ readings, tariff, unit }: MonthlyOverviewProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-[300px]" />;
  const result = calculateMonthlyBreakdown(readings, tariff, unit);

  if (!result) {
    return (
      <Card style={cardStyle}>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px' }}>
            Monatsübersicht
          </CardTitle>
          <CardDescription>
            Verbrauch und Kosten pro Monat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert style={{ borderRadius: '4px' }}>
            <AlertDescription>
              {!tariff
                ? 'Bitte legen Sie zuerst einen Tarif mit Abschlag an, um die Monatsübersicht zu sehen.'
                : 'Mindestens 2 Zählerstände erforderlich für die Monatsübersicht.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const isGuthaben = result.overallStatus === 'saved';
  const isNachzahlung = result.overallStatus === 'over';

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card style={cardStyle}>
          <CardHeader className="pb-2">
            <CardDescription>Gesamtverbrauch</CardDescription>
            <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '24px' }}>
              {formatNumber(result.totalConsumption)} {unit}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p style={{ fontSize: '12px', color: 'var(--nexo-text-secondary)' }}>
              Über {result.months.length} Monate
            </p>
          </CardContent>
        </Card>

        <Card style={cardStyle}>
          <CardHeader className="pb-2">
            <CardDescription>Gesamtkosten</CardDescription>
            <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '24px' }}>
              {formatCurrency(result.totalCost)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p style={{ fontSize: '12px', color: 'var(--nexo-text-secondary)' }}>
              Abschlag gezahlt: {formatCurrency(result.totalAbschlag)}
            </p>
          </CardContent>
        </Card>

        <Card style={{
          ...cardStyle,
          border: isGuthaben ? '2px solid var(--nexo-guthaben-text)' : isNachzahlung ? '2px solid var(--nexo-nachzahlung-text)' : 'none',
          backgroundColor: isGuthaben ? 'var(--nexo-guthaben-tint)' : isNachzahlung ? 'var(--nexo-nachzahlung-tint)' : 'var(--nexo-card-bg)',
        }}>
          <CardHeader className="pb-2">
            <CardDescription>
              {isGuthaben ? 'Zwischenstand (Guthaben)' : 'Zwischenstand (Nachzahlung)'}
            </CardDescription>
            <CardTitle style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '24px',
              color: isGuthaben ? 'var(--nexo-guthaben-text)' : isNachzahlung ? 'var(--nexo-nachzahlung-text)' : 'inherit',
            }}>
              {isGuthaben ? '+' : isNachzahlung ? '-' : ''}
              {formatCurrency(Math.abs(result.totalDifference))}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p style={{ fontSize: '12px', color: 'var(--nexo-text-secondary)' }}>
              {isGuthaben
                ? 'Sie liegen unter Ihrem Budget'
                : isNachzahlung
                  ? 'Sie liegen über Ihrem Budget'
                  : 'Kein Abschlag hinterlegt'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Table */}
      <Card style={cardStyle}>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px' }}>
            Monatliche Aufschlüsselung
          </CardTitle>
          <CardDescription>
            Verbrauch und Kosten im Vergleich zum Abschlag
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--nexo-border)' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '13px', color: 'var(--nexo-text-secondary)' }}>Monat</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '13px', color: 'var(--nexo-text-secondary)' }}>Verbrauch</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '13px', color: 'var(--nexo-text-secondary)' }}>Kosten</th>
                  <th className="hidden sm:table-cell" style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '13px', color: 'var(--nexo-text-secondary)' }}>Abschlag</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '13px', color: 'var(--nexo-text-secondary)' }}>Differenz</th>
                  <th className="hidden sm:table-cell" style={{ padding: '12px 16px', textAlign: 'center', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '13px', color: 'var(--nexo-text-secondary)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {result.months.map((month) => (
                  <MonthRow
                    key={`${month.year}-${month.month}`}
                    month={month}
                    unit={unit}
                  />
                ))}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: '2px solid var(--nexo-border)', fontWeight: 600 }}>
                  <td style={{ padding: '12px 16px' }}>Gesamt</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    {formatNumber(result.totalConsumption)} {unit}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    {formatCurrency(result.totalCost)}
                  </td>
                  <td className="hidden sm:table-cell" style={{ padding: '12px 16px', textAlign: 'right' }}>
                    {formatCurrency(result.totalAbschlag)}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <StatusIndicator status={result.overallStatus} difference={result.totalDifference} />
                  </td>
                  <td className="hidden sm:table-cell" style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <StatusBadge status={result.overallStatus} />
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {result.months.some(m => m.isEstimated) && (
            <p style={{ fontSize: '12px', color: 'var(--nexo-text-secondary)', marginTop: '16px' }}>
              * &quot;geschätzt&quot; bedeutet, dass der Verbrauch aus einem längeren Zeitraum
              gleichmäßig auf die Monate verteilt wurde. Für genauere Werte tragen Sie
              monatlich Zählerstände ein.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
