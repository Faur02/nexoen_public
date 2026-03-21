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
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IstaConsumption } from '@/types/database';

interface IstaConsumptionChartProps {
  data: IstaConsumption[];
  categorySlug: string;
}

const cardStyle = {
  borderRadius: '4px',
  boxShadow: 'var(--nexo-card-shadow)',
  border: 'none',
};

function formatMonth(yyyyMM: string): string {
  const [year, month] = yyyyMM.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString('de-DE', { month: 'short', year: '2-digit' });
}

export function IstaConsumptionChart({ data, categorySlug }: IstaConsumptionChartProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-[300px]" />;
  const color = categorySlug === 'heizung' ? '#E6A65C' : '#2FAE8E';
  const unit = categorySlug === 'heizung' ? 'HKV' : 'm³';

  if (!data || data.length === 0) {
    return (
      <Card style={cardStyle}>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px' }}>
            Monatlicher Verbrauch
          </CardTitle>
          <CardDescription>Monatliche Verbrauchsdaten</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center" style={{ color: 'var(--nexo-text-secondary)' }}>
          Noch keine Monatsdaten erfasst
        </CardContent>
      </Card>
    );
  }

  const chartData = [...data]
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((d) => ({
      month: formatMonth(d.month),
      verbrauch: d.units,
    }));

  return (
    <Card style={cardStyle}>
      <CardHeader>
        <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px' }}>
          Monatlicher Verbrauch
        </CardTitle>
        <CardDescription>
          Monatlicher Verbrauch ({unit})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--nexo-border)" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: 'var(--nexo-text-secondary)' }}
                tickMargin={8}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'var(--nexo-text-secondary)' }}
                tickFormatter={(v) => v.toLocaleString('de-DE')}
                width={45}
              />
              <Tooltip
                formatter={(value) => [
                  `${Number(value).toLocaleString('de-DE')} ${unit}`,
                  'Verbrauch',
                ]}
                labelFormatter={(label) => `Monat: ${label}`}
                contentStyle={{ borderRadius: '4px', border: '1px solid var(--nexo-border)' }}
              />
              <Bar dataKey="verbrauch" fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
