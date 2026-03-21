'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RoomWithRadiators } from '@/types/database';
import { calculateHeatingMonthlyBreakdown, HeatingMonthlyBreakdown } from '@/lib/calculations/heating-monthly';
import { formatNumber } from '@/lib/calculations/costs';

interface HeatingMonthlyOverviewProps {
  rooms: RoomWithRadiators[];
}

const cardStyle = {
  borderRadius: '4px',
  boxShadow: 'var(--nexo-card-shadow)',
  border: 'none',
};

function MonthRow({ month, expanded, onToggle }: {
  month: HeatingMonthlyBreakdown;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr
        className="cursor-pointer"
        style={{
          borderBottom: '1px solid var(--nexo-surface)',
          transition: 'background-color 0.15s ease',
        }}
        onClick={onToggle}
      >
        <td style={{ padding: '12px 16px' }}>
          <div className="flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              style={{
                transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
                flexShrink: 0,
              }}
            >
              <path d="M6 4L10 8L6 12" stroke="var(--nexo-text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontWeight: 500 }}>{month.monthName} {month.year}</span>
          </div>
        </td>
        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
          {formatNumber(month.totalUnits)} Einheiten
        </td>
      </tr>
      {expanded && (
        <tr style={{ backgroundColor: 'var(--nexo-hover-bg)' }}>
          <td colSpan={2} style={{ padding: '12px 16px' }}>
            <div style={{ paddingLeft: '24px' }} className="space-y-2">
              {month.roomBreakdown.map((room) => (
                <div
                  key={room.roomId}
                  style={{
                    borderLeft: '3px solid var(--nexo-cta)',
                    paddingLeft: '16px',
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>
                    {room.roomName}: {formatNumber(room.units)} Einheiten
                  </div>
                  <div className="space-y-1" style={{ marginTop: '4px' }}>
                    {room.radiators.map((rad) => (
                      <div key={rad.radiatorId} style={{ fontSize: '13px', color: 'var(--nexo-text-secondary)' }}>
                        {rad.radiatorName}: {formatNumber(rad.units)} Einheiten
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function HeatingMonthlyOverview({ rooms }: HeatingMonthlyOverviewProps) {
  const [mounted, setMounted] = useState(false);
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-[300px]" />;

  // Pass null for tariff since we only need consumption data
  const result = calculateHeatingMonthlyBreakdown(rooms, null);

  const toggleMonth = (key: string) => {
    setExpandedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  if (!result) {
    return (
      <Card style={cardStyle}>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px' }}>
            Monatsübersicht
          </CardTitle>
          <CardDescription>
            Verbrauch pro Monat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert style={{ borderRadius: '4px' }}>
            <AlertDescription>
              Mindestens 2 Ablesungen pro Heizkörper erforderlich um die Monatsübersicht zu sehen.
              Tragen Sie regelmäßig die Werte Ihrer Heizkostenverteiler ein.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card style={cardStyle}>
        <CardHeader className="pb-2">
          <CardDescription>Gesamtverbrauch</CardDescription>
          <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '24px' }}>
            {formatNumber(result.totalUnits)} Einheiten
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p style={{ fontSize: '12px', color: 'var(--nexo-text-secondary)' }}>
            Über {result.months.length} Monate, {rooms.length} Räume
          </p>
        </CardContent>
      </Card>

      {/* Monthly Table — consumption only */}
      <Card style={cardStyle}>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px' }}>
            Monatliche Aufschlüsselung
          </CardTitle>
          <CardDescription>
            Klicken Sie auf einen Monat um die Raumdetails zu sehen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--nexo-border)' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '13px', color: 'var(--nexo-text-secondary)' }}>Monat</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '13px', color: 'var(--nexo-text-secondary)' }}>Verbrauch</th>
                </tr>
              </thead>
              <tbody>
                {result.months.map((month) => {
                  const key = `${month.year}-${month.month}`;
                  return (
                    <MonthRow
                      key={key}
                      month={month}
                      expanded={expandedMonths.has(key)}
                      onToggle={() => toggleMonth(key)}
                    />
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: '2px solid var(--nexo-border)', fontWeight: 600 }}>
                  <td style={{ padding: '12px 16px' }}>Gesamt</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    {formatNumber(result.totalUnits)} Einheiten
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
