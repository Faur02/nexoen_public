import { HeatingBillingSetup, HeatingForecastResult, RoomWithRadiators, Reading, AbrechnungSetup, CombinedForecastResult, ForecastConfidence, IstaConsumption } from '@/types/database';

/**
 * Derive the period end date (12 months after start, minus 1 day).
 * e.g. "2025-01-01" → "2025-12-31"
 */
function getPeriodEndDate(periodStartDate: string): string {
  const start = new Date(periodStartDate);
  const end = new Date(start);
  end.setFullYear(end.getFullYear() + 1);
  end.setDate(end.getDate() - 1);
  return end.toISOString().split('T')[0];
}

/**
 * Calculate total heating units from radiator readings.
 * Sums the latest reading value for each radiator across all rooms.
 * Scopes to periodStartDate..periodEndDate when provided.
 */
export function calculateTotalUnitsFromReadings(
  rooms: RoomWithRadiators[],
  periodStartDate?: string,
  periodEndDate?: string
): number {
  let total = 0;
  const startTime = periodStartDate ? new Date(periodStartDate).getTime() : 0;
  const endTime = periodEndDate ? new Date(periodEndDate).getTime() + 86400000 : Infinity; // +1 day to include end date

  for (const room of rooms) {
    for (const radiator of room.radiators) {
      const readings = (periodStartDate || periodEndDate)
        ? radiator.readings.filter(r => {
            const t = new Date(r.reading_date).getTime();
            return t >= startTime && t < endTime;
          })
        : radiator.readings;

      if (readings.length > 0) {
        const sorted = [...readings].sort(
          (a, b) => new Date(b.reading_date).getTime() - new Date(a.reading_date).getTime()
        );
        total += sorted[0].value;
      }
    }
  }

  return total;
}

/**
 * Calculate consumption from regular meter readings (for water meters).
 * If periodStartDate is provided, uses the reading closest to that date as baseline.
 * If periodEndDate is provided, uses the reading closest to (on or before) that date
 * as the "latest" instead of the actual latest reading.
 */
export function calculateTotalConsumptionFromReadings(
  readings: Reading[],
  periodStartDate?: string,
  periodEndDate?: string
): number {
  if (readings.length < 2) return 0;

  const sorted = [...readings].sort(
    (a, b) => new Date(a.reading_date).getTime() - new Date(b.reading_date).getTime()
  );

  // Determine the "latest" reading: closest to periodEnd if provided, otherwise actual latest
  let latest: typeof sorted[0];
  if (periodEndDate) {
    const endTime = new Date(periodEndDate).getTime();
    // Find the latest reading that's on or before periodEndDate
    const beforeEnd = sorted.filter(r => new Date(r.reading_date).getTime() <= endTime + 86400000);
    if (beforeEnd.length === 0) return 0;
    latest = beforeEnd[beforeEnd.length - 1];
  } else {
    latest = sorted[sorted.length - 1];
  }

  // Determine the target date for finding the baseline reading
  let targetDate: Date;
  if (periodStartDate) {
    targetDate = new Date(periodStartDate);
  } else {
    const latestDate = new Date(latest.reading_date);
    targetDate = new Date(latestDate);
    targetDate.setFullYear(targetDate.getFullYear() - 1);
  }

  // Find the reading closest to the target date (but not the latest reading itself)
  let closestReading = sorted[0];
  let closestDiff = Math.abs(new Date(sorted[0].reading_date).getTime() - targetDate.getTime());

  for (const reading of sorted) {
    if (reading.id === latest.id) continue;
    const diff = Math.abs(new Date(reading.reading_date).getTime() - targetDate.getTime());
    if (diff < closestDiff) {
      closestDiff = diff;
      closestReading = reading;
    }
  }

  return Math.max(0, latest.value - closestReading.value);
}

/**
 * Calculate total units from ista monthly consumption data.
 * Filters by startMonth and/or endMonth (YYYY-MM format) when provided.
 */
export function calculateTotalUnitsFromIsta(
  istaData: IstaConsumption[],
  startMonth?: string,
  endMonth?: string
): number {
  let filtered = istaData;
  if (startMonth) {
    filtered = filtered.filter((d) => d.month >= startMonth);
  }
  if (endMonth) {
    filtered = filtered.filter((d) => d.month <= endMonth);
  }
  return filtered.reduce((sum, d) => sum + d.units, 0);
}

/**
 * Ista-style billing forecast (works for both heating and warm water).
 *
 * Grundkosten = totalBuildingCost × grundkostenPercent/100 × (yourArea / totalBuildingArea)
 * Verbrauchskosten = totalBuildingCost × verbrauchskostenPercent/100 × (yourUnits / totalBuildingUnits)
 * yourAnnualCost = Grundkosten + Verbrauchskosten
 *
 * periodStartDate (YYYY-MM-DD): start of the current billing period.
 * Data is automatically capped at periodStart + 12 months (one billing cycle).
 * Mid-year data is extrapolated to a full-year estimate.
 */
export function calculateHeatingForecast(
  setup: HeatingBillingSetup,
  rooms: RoomWithRadiators[],
  waterReadings?: Reading[],
  istaData?: IstaConsumption[],
  periodStartDate?: string
): HeatingForecastResult | null {
  const {
    total_building_cost,
    grundkosten_percent,
    verbrauchskosten_percent,
    total_building_area,
    your_area,
    total_building_units,
    your_units,
    abschlag_monthly,
  } = setup;

  // Derive period boundaries
  const periodEndDate = periodStartDate ? getPeriodEndDate(periodStartDate) : undefined;
  const periodStartMonth = periodStartDate ? periodStartDate.substring(0, 7) : undefined;
  const periodEndMonth = periodEndDate ? periodEndDate.substring(0, 7) : undefined;

  // Determine the user's units: manual override > ista monthly data > radiator/meter readings
  let effectiveUnits: number;
  let needsExtrapolation = false;

  if (your_units != null) {
    // Manual override = full-year value from the bill, no extrapolation needed
    effectiveUnits = your_units;
  } else if (istaData && istaData.length > 0) {
    effectiveUnits = calculateTotalUnitsFromIsta(istaData, periodStartMonth, periodEndMonth);
    needsExtrapolation = !!periodStartDate;
  } else if (waterReadings) {
    effectiveUnits = calculateTotalConsumptionFromReadings(waterReadings, periodStartDate, periodEndDate);
    needsExtrapolation = !!periodStartDate;
  } else {
    effectiveUnits = calculateTotalUnitsFromReadings(rooms, periodStartDate, periodEndDate);
    needsExtrapolation = !!periodStartDate;
  }

  // Extrapolate partial-year consumption to a full-year estimate.
  // total_building_units is a full-year number from the last bill, so our consumption
  // must also represent a full year for the ratio to be meaningful.
  if (needsExtrapolation && periodStartDate) {
    const periodStart = new Date(periodStartDate);
    const periodEnd = new Date(periodEndDate!);
    const now = new Date();
    // Cap "now" at the period end — don't count months beyond the billing cycle
    const effectiveNow = now > periodEnd ? periodEnd : now;
    // Use fractional months (days / 30.44) for accurate extrapolation,
    // especially in the first month when integer month boundaries = 0.
    const msElapsed = effectiveNow.getTime() - periodStart.getTime();
    const daysElapsed = msElapsed / (1000 * 60 * 60 * 24);
    const monthsElapsed = daysElapsed / 30.44; // average days per month

    if (monthsElapsed >= 0.5 && monthsElapsed < 12) {
      effectiveUnits = (effectiveUnits / monthsElapsed) * 12;
    }
  }

  if (total_building_area <= 0 || total_building_units <= 0 || your_area <= 0) {
    return null;
  }

  // Clamp ratios to prevent nonsensical values
  const areaRatio = Math.min(your_area / total_building_area, 1);
  const unitsRatio = Math.min(effectiveUnits / total_building_units, 1);

  const grundkosten = total_building_cost * (grundkosten_percent / 100) * areaRatio;
  const verbrauchskosten = total_building_cost * (verbrauchskosten_percent / 100) * unitsRatio;
  const yourAnnualCost = grundkosten + verbrauchskosten;
  const annualAbschlag = abschlag_monthly * 12;
  const rawDifference = yourAnnualCost - annualAbschlag;

  return {
    grundkosten,
    verbrauchskosten,
    yourAnnualCost,
    annualAbschlag,
    difference: Math.abs(rawDifference), // Always positive; use differenceType for direction
    differenceType: rawDifference > 0 ? 'nachzahlung' : 'guthaben',
    grundkostenPercent: grundkosten_percent,
    verbrauchskostenPercent: verbrauchskosten_percent,
    areaRatio,
    unitsRatio,
  };
}

/**
 * Combined forecast for the unified Abrechnung page.
 * Combines ista-style Heizkosten + Warmwasser forecasts with Betriebskosten,
 * then subtracts the total annual Vorauszahlungen.
 *
 * periodStartDate (YYYY-MM-DD): start of the current billing period.
 * Automatically derived from abrechnungszeitraum_end + 1 day.
 * Data is capped at periodStart + 12 months to stay within one billing cycle.
 */
export function calculateCombinedForecast(
  heizungSetup: HeatingBillingSetup | null,
  warmwasserSetup: HeatingBillingSetup | null,
  abrechnungSetup: {
    kalte_betriebskosten_year: number;
    ista_nebenkosten_year: number;
    vorauszahlung_monthly: number;
  },
  rooms: RoomWithRadiators[],
  waterReadings: Reading[],
  heizungIstaData?: IstaConsumption[],
  warmwasserIstaData?: IstaConsumption[],
  periodStartDate?: string,
): CombinedForecastResult {
  const heizung = heizungSetup
    ? calculateHeatingForecast(heizungSetup, rooms, undefined, heizungIstaData, periodStartDate)
    : null;

  const warmwasser = warmwasserSetup
    ? calculateHeatingForecast(warmwasserSetup, [], waterReadings, warmwasserIstaData, periodStartDate)
    : null;

  const betriebskosten = abrechnungSetup.kalte_betriebskosten_year;
  const istaNebenkostenYear = abrechnungSetup.ista_nebenkosten_year;

  const totalProjected =
    (heizung?.yourAnnualCost ?? 0) +
    (warmwasser?.yourAnnualCost ?? 0) +
    istaNebenkostenYear +
    betriebskosten;

  const annualVorauszahlungen = abrechnungSetup.vorauszahlung_monthly * 12;

  const rawDifference = totalProjected - annualVorauszahlungen;

  // --- Confidence calculation ---
  // How many months of the billing period have elapsed (0–12)
  let monthsElapsed = 12;
  if (periodStartDate) {
    const periodStart = new Date(periodStartDate);
    const periodEnd = new Date(getPeriodEndDate(periodStartDate));
    const now = new Date();
    const effectiveNow = now > periodEnd ? periodEnd : now;
    const daysElapsed = (effectiveNow.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24);
    monthsElapsed = Math.min(daysElapsed / 30.44, 12);
  }
  // If either setup uses a manual your_units override, treat as full-year data
  if (heizungSetup?.your_units != null || warmwasserSetup?.your_units != null) {
    monthsElapsed = 12;
  }

  const hasIstaData =
    (heizungIstaData && heizungIstaData.length > 0) ||
    (warmwasserIstaData && warmwasserIstaData.length > 0);
  const hasReadings =
    waterReadings.length >= 2 ||
    rooms.some(r => r.radiators.some(rad => rad.readings.length > 0));

  const confidence_dataSource: ForecastConfidence['dataSource'] = hasIstaData ? 'ista' : hasReadings ? 'readings' : 'none';
  const hasBetriebskosten = abrechnungSetup.kalte_betriebskosten_year > 0;

  // Accuracy formula: base 90 (prior-year building costs always limit max)
  // minus penalties for data source quality, time elapsed, and missing Betriebskosten
  const dataSourcePenalty = confidence_dataSource === 'ista' ? 0 : confidence_dataSource === 'readings' ? -10 : -20;
  const timePenalty = -(1 - Math.min(monthsElapsed / 12, 1)) * 20;
  const betriebskostenPenalty = hasBetriebskosten ? 0 : -20;
  const accuracyPct = Math.max(30, Math.round(90 + dataSourcePenalty + timePenalty + betriebskostenPenalty));

  const confidence: ForecastConfidence = {
    monthsElapsed,
    dataSource: confidence_dataSource,
    hasBetriebskosten,
    hasHeizungData: heizung !== null,
    hasWarmwasserData: warmwasser !== null,
    accuracyPct,
  };

  return {
    heizung,
    warmwasser,
    betriebskosten,
    istaNebenkostenYear,
    totalProjected,
    annualVorauszahlungen,
    difference: Math.abs(rawDifference), // Always positive; use differenceType for direction
    differenceType: rawDifference > 0 ? 'nachzahlung' : 'guthaben',
    confidence,
  };
}
