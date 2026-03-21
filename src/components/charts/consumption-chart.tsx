'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Reading, MeterUnit } from '@/types/database';

interface ConsumptionChartProps {
  readings: Reading[];
  unit: MeterUnit;
  meterType: 'electricity' | 'gas' | 'water' | 'heating';
}

interface ChartDataPoint {
  date: string;
  reading: number;
  consumption: number;
  dailyAvg: number;
}

const cardStyle = {
  borderRadius: '4px',
  boxShadow: 'var(--nexo-card-shadow)',
  border: 'none',
};

export function ConsumptionChart({ readings, unit, meterType }: ConsumptionChartProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-[340px]" />;
  if (readings.length < 2) {
    return (
      <Card style={cardStyle}>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px' }}>
            Verbrauchsverlauf
          </CardTitle>
          <CardDescription>
            Mindestens 2 Zählerstände erforderlich
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center" style={{ color: 'var(--nexo-text-secondary)' }}>
          Noch nicht genug Daten für ein Diagramm
        </CardContent>
      </Card>
    );
  }

  // Sort readings by date ascending
  const sortedReadings = [...readings].sort(
    (a, b) => new Date(a.reading_date).getTime() - new Date(b.reading_date).getTime()
  );

  // Calculate consumption between readings
  const chartData: ChartDataPoint[] = sortedReadings.map((reading, index) => {
    let consumption = 0;
    let dailyAvg = 0;

    if (index > 0) {
      const prevReading = sortedReadings[index - 1];
      consumption = reading.value - prevReading.value;
      const days = Math.max(
        1,
        (new Date(reading.reading_date).getTime() - new Date(prevReading.reading_date).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      dailyAvg = consumption / days;
    }

    return {
      date: new Date(reading.reading_date).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
      }),
      reading: reading.value,
      consumption: Math.round(consumption * 100) / 100,
      dailyAvg: Math.round(dailyAvg * 100) / 100,
    };
  });

  // Remove first point for consumption chart (no previous reading)
  const consumptionData = chartData.slice(1);

  const getColor = () => {
    switch (meterType) {
      case 'electricity':
        return '#5B8DEF';
      case 'gas':
        return '#E28A5C';
      case 'water':
        return '#2FAE8E';
      case 'heating':
        return '#E6A65C';
      default:
        return '#6b7280';
    }
  };

  const color = getColor();

  return (
    <div className="space-y-6">
      {/* Meter Reading History */}
      <Card style={cardStyle}>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px' }}>
            Zählerstandsverlauf
          </CardTitle>
          <CardDescription>
            Entwicklung des Zählerstands über Zeit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--nexo-border)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: 'var(--nexo-text-secondary)' }}
                  tickMargin={10}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: 'var(--nexo-text-secondary)' }}
                  tickFormatter={(value) => value.toLocaleString('de-DE')}
                />
                <Tooltip
                  formatter={(value) => [
                    `${Number(value).toLocaleString('de-DE')} ${unit}`,
                    'Zählerstand',
                  ]}
                  labelFormatter={(label) => `Datum: ${label}`}
                  contentStyle={{ borderRadius: '4px', border: '1px solid var(--nexo-border)' }}
                />
                <Line
                  type="monotone"
                  dataKey="reading"
                  stroke={color}
                  strokeWidth={2}
                  dot={{ fill: color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Consumption per Period */}
      {consumptionData.length > 0 && (
        <Card style={cardStyle}>
          <CardHeader>
            <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px' }}>
              Verbrauch pro Zeitraum
            </CardTitle>
            <CardDescription>
              Verbrauch zwischen den Ablesungen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={consumptionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--nexo-border)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: 'var(--nexo-text-secondary)' }}
                    tickMargin={10}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: 'var(--nexo-text-secondary)' }}
                    tickFormatter={(value) => value.toLocaleString('de-DE')}
                  />
                  <Tooltip
                    formatter={(value) => [
                      `${Number(value).toLocaleString('de-DE')} ${unit}`,
                      'Verbrauch',
                    ]}
                    labelFormatter={(label) => `Bis: ${label}`}
                    contentStyle={{ borderRadius: '4px', border: '1px solid var(--nexo-border)' }}
                  />
                  <Bar dataKey="consumption" fill={color} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily Average */}
      {consumptionData.length > 0 && (
        <Card style={cardStyle}>
          <CardHeader>
            <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px' }}>
              Tagesverbrauch (Durchschnitt)
            </CardTitle>
            <CardDescription>
              Durchschnittlicher Verbrauch pro Tag
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={consumptionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--nexo-border)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: 'var(--nexo-text-secondary)' }}
                    tickMargin={10}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: 'var(--nexo-text-secondary)' }}
                    tickFormatter={(value) => value.toLocaleString('de-DE')}
                  />
                  <Tooltip
                    formatter={(value) => [
                      `${Number(value).toLocaleString('de-DE')} ${unit}/Tag`,
                      'Tagesverbrauch',
                    ]}
                    labelFormatter={(label) => `Bis: ${label}`}
                    contentStyle={{ borderRadius: '4px', border: '1px solid var(--nexo-border)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="dailyAvg"
                    stroke={color}
                    strokeWidth={2}
                    dot={{ fill: color, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
