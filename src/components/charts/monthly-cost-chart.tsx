'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Reading, Tariff, MeterUnit } from '@/types/database';
import { calculateMonthlyBreakdown } from '@/lib/calculations/monthly';
import { formatCurrency } from '@/lib/calculations/costs';

interface MonthlyCostChartProps {
  readings: Reading[];
  tariff: Tariff | null;
  unit: MeterUnit;
  meterType: 'electricity' | 'gas' | 'water' | 'heating';
}

const cardStyle = {
  borderRadius: '4px',
  boxShadow: 'var(--nexo-card-shadow)',
  border: 'none',
};

export function MonthlyCostChart({ readings, tariff, unit, meterType }: MonthlyCostChartProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-[300px]" />;
  const result = calculateMonthlyBreakdown(readings, tariff, unit);

  if (!result || result.months.length === 0) {
    return null;
  }

  const chartData = result.months.map((month) => ({
    name: `${month.monthName.slice(0, 3)} ${month.year.toString().slice(2)}`,
    cost: month.cost,
    abschlag: month.abschlag,
    status: month.status,
  }));

  const abschlag = tariff?.abschlag || 0;

  return (
    <Card style={cardStyle}>
      <CardHeader>
        <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px' }}>
          Monatliche Kosten vs. Abschlag
        </CardTitle>
        <CardDescription>
          {abschlag > 0
            ? `Ihr Abschlag: ${formatCurrency(abschlag)}/Monat (grüne Linie)`
            : 'Legen Sie einen Abschlag an um den Vergleich zu sehen'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--nexo-border)" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: 'var(--nexo-text-secondary)' }}
                tickMargin={10}
              />
              <YAxis
                tick={{ fontSize: 12, fill: 'var(--nexo-text-secondary)' }}
                tickFormatter={(value) => `${value}€`}
              />
              <Tooltip
                formatter={(value) => [formatCurrency(Number(value)), 'Kosten']}
                labelFormatter={(label) => `Monat: ${label}`}
                contentStyle={{ borderRadius: '4px', border: '1px solid var(--nexo-border)' }}
              />
              {abschlag > 0 && (
                <ReferenceLine
                  y={abschlag}
                  stroke="#2FAE8E"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  label={{
                    value: `Abschlag: ${formatCurrency(abschlag)}`,
                    position: 'right',
                    fill: '#2FAE8E',
                    fontSize: 12,
                  }}
                />
              )}
              <Bar dataKey="cost" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.status === 'over' ? '#E28A5C' : entry.status === 'saved' ? '#2FAE8E' : '#9CA3AF'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-4" style={{ fontSize: '13px' }}>
          <div className="flex items-center gap-2">
            <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: '#2FAE8E' }}></div>
            <span>Unter Budget</span>
          </div>
          <div className="flex items-center gap-2">
            <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: '#E28A5C' }}></div>
            <span>Über Budget</span>
          </div>
          <div className="flex items-center gap-2">
            <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: '#9CA3AF' }}></div>
            <span>Kein Abschlag</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
