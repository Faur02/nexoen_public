import { differenceInDays } from 'date-fns';
import { Reading, ConsumptionResult, MeterUnit } from '@/types/database';


/**
 * Calculate consumption between two readings
 */
export function calculateConsumptionBetweenReadings(
  olderReading: Reading,
  newerReading: Reading,
  unit: MeterUnit
): ConsumptionResult {
  const consumption = newerReading.value - olderReading.value;
  const days = differenceInDays(
    new Date(newerReading.reading_date),
    new Date(olderReading.reading_date)
  );

  const dailyAverage = days > 0 ? consumption / days : 0;

  return {
    totalConsumption: consumption,
    dailyAverage,
    days,
    unit,
  };
}

/**
 * Get daily average consumption from a list of readings
 * Uses the most recent readings for calculation
 */
export function getDailyAverageConsumption(
  readings: Reading[],
  unit: MeterUnit,
  maxDaysBack: number = 90
): ConsumptionResult | null {
  if (readings.length < 2) {
    return null;
  }

  // Sort by date descending (newest first)
  const sorted = [...readings].sort(
    (a, b) =>
      new Date(b.reading_date).getTime() - new Date(a.reading_date).getTime()
  );

  const newestReading = sorted[0];
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - maxDaysBack);

  // Find the oldest reading within our window
  // Since sorted is in descending order (newest first), we iterate from the end
  // to find the oldest reading that's still within the cutoff date
  let oldestReading = sorted[sorted.length - 1];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const reading = sorted[i];
    if (new Date(reading.reading_date) >= cutoffDate) {
      oldestReading = reading;
      break; // Found the oldest reading within the window
    }
  }

  if (newestReading.id === oldestReading.id) {
    // Not enough data points
    return null;
  }

  return calculateConsumptionBetweenReadings(oldestReading, newestReading, unit);
}
