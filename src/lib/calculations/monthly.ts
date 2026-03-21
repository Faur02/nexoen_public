import { Reading, Tariff, MeterUnit } from '@/types/database';

export interface MonthlyBreakdown {
  year: number;
  month: number; // 0-11
  monthName: string;
  consumption: number;
  cost: number;
  abschlag: number;
  difference: number; // positive = saved, negative = over budget
  status: 'saved' | 'over' | 'neutral';
  isEstimated: boolean;
}

export interface MonthlyOverviewResult {
  months: MonthlyBreakdown[];
  totalConsumption: number;
  totalCost: number;
  totalAbschlag: number;
  totalDifference: number;
  overallStatus: 'saved' | 'over' | 'neutral';
}

const germanMonthNames = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
];

/**
 * Calculate monthly breakdown from readings
 * Distributes consumption across months based on daily averages
 */
export function calculateMonthlyBreakdown(
  readings: Reading[],
  tariff: Tariff | null,
  unit: MeterUnit
): MonthlyOverviewResult | null {
  if (readings.length < 2 || !tariff) {
    return null;
  }

  // Sort readings by date ascending
  const sortedReadings = [...readings].sort(
    (a, b) => new Date(a.reading_date).getTime() - new Date(b.reading_date).getTime()
  );

  // Build a map of monthly consumption
  const monthlyData: Map<string, { consumption: number; isEstimated: boolean }> = new Map();

  // Process each period between readings
  for (let i = 1; i < sortedReadings.length; i++) {
    const prevReading = sortedReadings[i - 1];
    const currReading = sortedReadings[i];

    const startDate = new Date(prevReading.reading_date);
    const endDate = new Date(currReading.reading_date);
    const totalConsumption = currReading.value - prevReading.value;
    const totalDays = Math.max(1, Math.round(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ));
    const dailyAverage = totalConsumption / totalDays;

    // Distribute consumption across months
    let currentDate = new Date(startDate);

    while (currentDate < endDate) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const key = `${year}-${month}`;

      // Calculate days in this month within the period
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0); // Last day of month

      const periodStart = currentDate > monthStart ? currentDate : monthStart;
      const periodEnd = endDate < monthEnd ? endDate : monthEnd;

      const daysInPeriod = Math.max(1, Math.round(
        (periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24)
      ));

      const monthConsumption = dailyAverage * daysInPeriod;

      // Add to monthly data
      const existing = monthlyData.get(key) || { consumption: 0, isEstimated: false };
      monthlyData.set(key, {
        consumption: existing.consumption + monthConsumption,
        isEstimated: totalDays > 35, // Mark as estimated if period > 1 month
      });

      // Move to next month
      currentDate = new Date(year, month + 1, 1);
    }
  }

  // Convert to array and calculate costs
  const months: MonthlyBreakdown[] = [];
  const abschlag = tariff.abschlag || 0;

  // Sort keys chronologically
  const sortedKeys = Array.from(monthlyData.keys()).sort((a, b) => {
    const [yearA, monthA] = a.split('-').map(Number);
    const [yearB, monthB] = b.split('-').map(Number);
    return yearA !== yearB ? yearA - yearB : monthA - monthB;
  });

  for (const key of sortedKeys) {
    const [year, month] = key.split('-').map(Number);
    const data = monthlyData.get(key)!;

    // Calculate cost: (consumption * Arbeitspreis) + (Grundpreis for partial month)
    const energyCost = data.consumption * tariff.arbeitspreis;
    // Grundpreis is applied fully per month (not prorated for partial months),
    // matching standard German utility billing practice.
    const baseCost = tariff.grundpreis;
    const totalCost = energyCost + baseCost;

    const difference = abschlag - totalCost;

    let status: 'saved' | 'over' | 'neutral' = 'neutral';
    if (abschlag > 0) {
      if (difference > 1) status = 'saved';
      else if (difference < -1) status = 'over';
    }

    months.push({
      year,
      month,
      monthName: germanMonthNames[month],
      consumption: Math.round(data.consumption * 100) / 100,
      cost: Math.round(totalCost * 100) / 100,
      abschlag,
      difference: Math.round(difference * 100) / 100,
      status,
      isEstimated: data.isEstimated,
    });
  }

  // Calculate totals
  const totalConsumption = months.reduce((sum, m) => sum + m.consumption, 0);
  const totalCost = months.reduce((sum, m) => sum + m.cost, 0);
  const totalAbschlag = months.reduce((sum, m) => sum + m.abschlag, 0);
  const totalDifference = totalAbschlag - totalCost;

  let overallStatus: 'saved' | 'over' | 'neutral' = 'neutral';
  if (totalAbschlag > 0) {
    if (totalDifference > 1) overallStatus = 'saved';
    else if (totalDifference < -1) overallStatus = 'over';
  }

  return {
    months,
    totalConsumption: Math.round(totalConsumption * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    totalAbschlag: Math.round(totalAbschlag * 100) / 100,
    totalDifference: Math.round(totalDifference * 100) / 100,
    overallStatus,
  };
}
