import {
  differenceInDays,
  startOfYear,
  endOfYear,
  differenceInMonths,
} from 'date-fns';
import { Reading, Tariff, ForecastResult, MeterUnit } from '@/types/database';
import { getDailyAverageConsumption } from './consumption';
import { calculateCostForConsumption } from './costs';

const FORECAST_VARIANCE = 0.15; // 15% uncertainty range

/**
 * Calculate yearly forecast with Nachzahlung/Guthaben prediction
 */
export function calculateYearlyForecast(
  readings: Reading[],
  tariff: Tariff,
  referenceDate: Date = new Date(),
  unit: MeterUnit = 'kWh'
): ForecastResult | null {
  const consumption = getDailyAverageConsumption(readings, unit);

  if (!consumption) {
    return null;
  }

  const { dailyAverage } = consumption;
  const yearStart = startOfYear(referenceDate);
  const yearEnd = endOfYear(referenceDate);

  // Days calculations
  const daysPassed = differenceInDays(referenceDate, yearStart);
  const daysRemaining = differenceInDays(yearEnd, referenceDate);

  // Months calculations for base cost
  const monthsPassed = differenceInMonths(referenceDate, yearStart) + 1;
  const monthsRemaining = 12 - monthsPassed;

  // Consumption projections
  const estimatedConsumptionSoFar = dailyAverage * daysPassed;
  const forecastRemainingConsumption = dailyAverage * daysRemaining;
  const projectedYearlyConsumption =
    estimatedConsumptionSoFar + forecastRemainingConsumption;

  // Cost calculations
  const costSoFar = calculateCostForConsumption(
    estimatedConsumptionSoFar,
    tariff.arbeitspreis,
    tariff.grundpreis,
    monthsPassed
  );

  const forecastRemainingCost = calculateCostForConsumption(
    forecastRemainingConsumption,
    tariff.arbeitspreis,
    tariff.grundpreis,
    monthsRemaining
  );

  const projectedYearlyCost = costSoFar + forecastRemainingCost;

  // Min/Max range
  const minCost = projectedYearlyCost * (1 - FORECAST_VARIANCE);
  const maxCost = projectedYearlyCost * (1 + FORECAST_VARIANCE);

  // Abschlag comparison
  const monthlyAbschlag = tariff.abschlag || 0;
  const totalAbschlagPaid = monthlyAbschlag * 12;
  const difference = projectedYearlyCost - totalAbschlagPaid;

  return {
    projectedYearlyCost,
    projectedYearlyConsumption,
    minCost,
    maxCost,
    totalAbschlagPaid,
    difference: Math.abs(difference), // Always positive; use differenceType for direction
    differenceType: difference > 0 ? 'nachzahlung' : 'guthaben',
  };
}

/**
 * Calculate current month forecast
 */
export function calculateMonthlyForecast(
  readings: Reading[],
  tariff: Tariff,
  referenceDate: Date = new Date(),
  unit: MeterUnit = 'kWh'
): { estimatedCost: number; estimatedConsumption: number } | null {
  const consumption = getDailyAverageConsumption(readings, unit);

  if (!consumption) {
    return null;
  }

  const { dailyAverage } = consumption;
  const daysInMonth = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth() + 1,
    0
  ).getDate();

  const estimatedConsumption = dailyAverage * daysInMonth;
  const estimatedCost =
    estimatedConsumption * tariff.arbeitspreis + tariff.grundpreis;

  return {
    estimatedCost,
    estimatedConsumption,
  };
}
