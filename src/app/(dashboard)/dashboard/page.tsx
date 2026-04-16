import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getMetersWithDetailsAndTariffs, getMetersByCategory } from '@/lib/actions/meters';
import { getUserCategories } from '@/lib/actions/categories';
import { getHeatingBillingSetup } from '@/lib/actions/heating-billing';
import { getAbrechnungSetup } from '@/lib/actions/abrechnung';
import { getIstaConsumptionByCategory } from '@/lib/actions/ista-consumption';
import { getRoomsWithRadiators } from '@/lib/actions/heating';
import { getReadings } from '@/lib/actions/readings';
import { calculateYearlyForecast } from '@/lib/calculations/forecast';
import { calculateCombinedForecast } from '@/lib/calculations/heating-forecast';
import { SubscriptionTier, CombinedForecastResult } from '@/types/database';
import { hasAccess, getEffectiveTier } from '@/lib/config/tiers';
import { ForecastWarning } from '@/components/forecast-warning';
import { AnimatedNumber } from '@/components/dashboard/animated-number';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Format as integer euros — no cents */
function fmtEur(n: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

// ─── SVG helpers ─────────────────────────────────────────────────────────────

function getPoints(data: number[], w: number, h: number): [number, number][] {
  if (data.length < 2) return [];
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  return data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - 4 - ((v - min) / range) * (h - 8),
  ]);
}

function polylineStr(pts: [number, number][]): string {
  return pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
}

function areaPath(pts: [number, number][], h: number): string {
  if (pts.length === 0) return '';
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  return `${line} L${pts[pts.length - 1][0].toFixed(1)} ${h} L0 ${h} Z`;
}

/** Smooth curve through points using Catmull-Rom → cubic bezier */
function smoothCurve(pts: [number, number][]): string {
  if (pts.length < 2) return '';
  if (pts.length === 2)
    return `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)} L${pts[1][0].toFixed(1)} ${pts[1][1].toFixed(1)}`;
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${cp1x.toFixed(1)} ${cp1y.toFixed(1)} ${cp2x.toFixed(1)} ${cp2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

function smoothAreaCurve(pts: [number, number][], h: number): string {
  const line = smoothCurve(pts);
  if (!line || pts.length === 0) return '';
  return `${line} L${pts[pts.length - 1][0].toFixed(1)} ${h} L${pts[0][0].toFixed(1)} ${h} Z`;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STROM_AVG_YEARLY = 1200;

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [{ data: profileData }, metersData, categories] = await Promise.all([
    supabase.from('profiles').select('subscription_tier, trial_ends_at, name').eq('id', user.id).single(),
    getMetersWithDetailsAndTariffs(),
    getUserCategories(),
  ]);

  const subscriptionTier: SubscriptionTier = (profileData?.subscription_tier as SubscriptionTier) || 'expired';
  const isPlus = hasAccess(getEffectiveTier(subscriptionTier, profileData?.trial_ends_at ?? null));
  const heizungCat = categories.find(c => c.slug === 'heizung');
  const warmwasserCat = categories.find(c => c.slug === 'warmwasser');
  const predefinedCategoryIds = new Set(categories.filter(c => c.is_predefined).map(c => c.id));

  const [heizungSetup, warmwasserSetup, abrechnungSetup, heizungIstaData, warmwasserIstaData] =
    await Promise.all([
      heizungCat ? getHeatingBillingSetup(heizungCat.id) : Promise.resolve(null),
      warmwasserCat ? getHeatingBillingSetup(warmwasserCat.id) : Promise.resolve(null),
      getAbrechnungSetup(),
      heizungCat ? getIstaConsumptionByCategory(heizungCat.id) : Promise.resolve([]),
      warmwasserCat ? getIstaConsumptionByCategory(warmwasserCat.id) : Promise.resolve([]),
    ]);

  const [heizungMeters, warmwasserMeters] = await Promise.all([
    heizungCat ? getMetersByCategory(heizungCat.id) : Promise.resolve([]),
    warmwasserCat ? getMetersByCategory(warmwasserCat.id) : Promise.resolve([]),
  ]);

  const [heizungRooms, warmwasserReadings] = await Promise.all([
    heizungMeters.length > 0 ? getRoomsWithRadiators(heizungMeters[0].id) : Promise.resolve([]),
    warmwasserMeters.length > 0 ? getReadings(warmwasserMeters[0].id) : Promise.resolve([]),
  ]);

  // ─── Combined Nebenkosten forecast ────────────────────────────────────────
  const hasAbrechnungData = !!(heizungSetup || warmwasserSetup) && !!abrechnungSetup;
  let combinedForecast: CombinedForecastResult | null = null;
  let periodLabel: string | undefined;

  if (abrechnungSetup?.abrechnungszeitraum_start) {
    const fmt = (d: Date) =>
      `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
    const start = new Date(abrechnungSetup.abrechnungszeitraum_start);
    const end = abrechnungSetup.abrechnungszeitraum_end
      ? new Date(abrechnungSetup.abrechnungszeitraum_end)
      : null;
    periodLabel = end ? `${fmt(start)} – ${fmt(end)}` : fmt(start);
  }

  if (hasAbrechnungData && abrechnungSetup) {
    combinedForecast = calculateCombinedForecast(
      heizungSetup, warmwasserSetup,
      {
        kalte_betriebskosten_year: abrechnungSetup.kalte_betriebskosten_year,
        ista_nebenkosten_year: abrechnungSetup.ista_nebenkosten_year ?? 0,
        vorauszahlung_monthly: abrechnungSetup.vorauszahlung_monthly,
      },
      heizungRooms, warmwasserReadings,
      heizungIstaData, warmwasserIstaData,
      abrechnungSetup.abrechnungszeitraum_start ?? undefined,
    );
  }

  // ─── Tariff forecasts (custom meters only) ───────────────────────────────
  const meterForecasts = metersData
    .filter(({ meter }) => !meter.category_id || !predefinedCategoryIds.has(meter.category_id))
    .map(({ meter, readings, tariff }) => {
      if (meter.type === 'heating' || !tariff || readings.length < 2)
        return { meter, forecast: null, tariff, readings };
      return { meter, forecast: calculateYearlyForecast(readings, tariff, new Date(), meter.unit), tariff, readings };
    });

  const stromForecasts = meterForecasts.filter(({ meter }) => meter.type === 'electricity');
  const gasForecasts   = meterForecasts.filter(({ meter }) => meter.type === 'gas');

  const stromNachzahlung = stromForecasts.reduce((s, { forecast }) =>
    forecast?.differenceType === 'nachzahlung' ? s + forecast.difference : s, 0);
  const stromGuthaben = stromForecasts.reduce((s, { forecast }) =>
    forecast?.differenceType === 'guthaben' ? s + forecast.difference : s, 0);
  const stromNet = stromNachzahlung - stromGuthaben;
  const stromIsNachzahlung = stromNet > 0;
  const stromAmount = Math.abs(stromNet);
  const stromYearlyCost = stromForecasts.reduce((s, { forecast }) => s + (forecast?.projectedYearlyCost || 0), 0);
  const stromDiffFromAvg = STROM_AVG_YEARLY > 0
    ? Math.round(((stromYearlyCost - STROM_AVG_YEARLY) / STROM_AVG_YEARLY) * 100)
    : 0;

  const gasNachzahlung = gasForecasts.reduce((s, { forecast }) =>
    forecast?.differenceType === 'nachzahlung' ? s + forecast.difference : s, 0);
  const gasGuthaben = gasForecasts.reduce((s, { forecast }) =>
    forecast?.differenceType === 'guthaben' ? s + forecast.difference : s, 0);
  const gasNet = gasNachzahlung - gasGuthaben;
  const gasIsNachzahlung = gasNet > 0;
  const gasAmount = Math.abs(gasNet);
  const gasYearlyCost = gasForecasts.reduce((s, { forecast }) => s + (forecast?.projectedYearlyCost || 0), 0);

  const nebenkostenIsNachzahlung = combinedForecast?.differenceType === 'nachzahlung';
  const nebenkostenAmount = combinedForecast?.difference ?? 0;

  // ─── Abschlag computations ───────────────────────────────────────────────
  const vorauszahlungMonthly = abrechnungSetup?.vorauszahlung_monthly ?? 0;
  const totalStromAbschlag = stromForecasts.reduce((s, { tariff }) => s + (tariff?.abschlag || 0), 0);
  const recommendedMonthly = combinedForecast?.totalProjected
    ? Math.round(combinedForecast.totalProjected / 12) : 0;
  const abschlagGap = recommendedMonthly > 0 && vorauszahlungMonthly > 0
    ? recommendedMonthly - vorauszahlungMonthly : 0;
  const showAbschlagRecommendation = Math.abs(abschlagGap) > 10 && recommendedMonthly > 0 && vorauszahlungMonthly > 0;
  const abschlagIsUnder = abschlagGap > 0;
  const stromRecommendedMonthly = stromYearlyCost > 0 ? Math.round(stromYearlyCost / 12) : 0;
  const stromAbschlagGap = stromRecommendedMonthly > 0 && totalStromAbschlag > 0
    ? stromRecommendedMonthly - totalStromAbschlag : 0;
  const showStromAbschlagRecommendation = Math.abs(stromAbschlagGap) > 10 && stromRecommendedMonthly > 0 && totalStromAbschlag > 0;
  const stromAbschlagIsUnder = stromAbschlagGap > 0;

  // ─── Sparempfehlung ──────────────────────────────────────────────────────
  const monthsElapsed = combinedForecast?.confidence.monthsElapsed ?? 0;
  const monthsRemaining = Math.max(0, 12 - monthsElapsed);
  const monthlySavings = combinedForecast?.differenceType === 'nachzahlung'
    && monthsRemaining > 1 && combinedForecast.difference > 50
    ? Math.ceil(combinedForecast.difference / monthsRemaining) : 0;

  // ─── Worsening forecast ──────────────────────────────────────────────────
  const snapshotAmount = abrechnungSetup?.forecast_snapshot_amount ?? null;
  const snapshotDate = abrechnungSetup?.forecast_snapshot_updated_at ?? null;
  const currentNachzahlung = combinedForecast?.differenceType === 'nachzahlung' ? combinedForecast.difference : 0;
  const isWorsening =
    combinedForecast !== null && snapshotAmount !== null && snapshotDate !== null &&
    currentNachzahlung > 0 && currentNachzahlung > snapshotAmount * 1.05 &&
    currentNachzahlung - snapshotAmount > 20 &&
    Date.now() - new Date(snapshotDate).getTime() > 3 * 86400000;

  // ─── Heizkosten breakdown ────────────────────────────────────────────────
  const heizungData = combinedForecast?.heizung ? {
    fixkosten: Math.round(combinedForecast.heizung.grundkosten),
    verbrauch: Math.round(combinedForecast.heizung.verbrauchskosten),
    warmwasser: combinedForecast.warmwasser ? Math.round(combinedForecast.warmwasser.yourAnnualCost) : 0,
    total: Math.round(
      combinedForecast.heizung.yourAnnualCost + (combinedForecast.warmwasser?.yourAnnualCost ?? 0)
    ),
  } : null;

  // ─── Sparklines ──────────────────────────────────────────────────────────

  const nkSparkline = (() => {
    if (!combinedForecast?.heizung) return [];
    const totalHzUnits = heizungIstaData.reduce((s, d) => s + d.units, 0);
    if (totalHzUnits === 0) return [];
    return [...heizungIstaData]
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6)
      .map(d => (d.units / totalHzUnits) * combinedForecast!.heizung!.yourAnnualCost);
  })();

  const stromSparkline = (() => {
    const monthly: { month: string; cost: number }[] = [];
    for (const { readings, tariff } of stromForecasts) {
      if (!tariff || readings.length < 2) continue;
      const sorted = [...readings].sort((a, b) =>
        new Date(a.reading_date).getTime() - new Date(b.reading_date).getTime());
      for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1], curr = sorted[i];
        const days = (new Date(curr.reading_date).getTime() - new Date(prev.reading_date).getTime()) / 86400000;
        if (days <= 0 || curr.value < prev.value) continue;
        const cost = ((curr.value - prev.value) * (tariff.arbeitspreis || 0) / days
          + (tariff.grundpreis || 0) / 30.44) * 30.44;
        const month = curr.reading_date.substring(0, 7);
        const ex = monthly.find(m => m.month === month);
        if (ex) ex.cost += cost; else monthly.push({ month, cost });
      }
    }
    return monthly.sort((a, b) => a.month.localeCompare(b.month)).slice(-6).map(d => d.cost);
  })();

  const gasSparkline = (() => {
    const monthly: { month: string; cost: number }[] = [];
    for (const { readings, tariff } of gasForecasts) {
      if (!tariff || readings.length < 2) continue;
      const sorted = [...readings].sort((a, b) =>
        new Date(a.reading_date).getTime() - new Date(b.reading_date).getTime());
      for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1], curr = sorted[i];
        const days = (new Date(curr.reading_date).getTime() - new Date(prev.reading_date).getTime()) / 86400000;
        if (days <= 0 || curr.value < prev.value) continue;
        const cost = ((curr.value - prev.value) * (tariff.arbeitspreis || 0) / days
          + (tariff.grundpreis || 0) / 30.44) * 30.44;
        const month = curr.reading_date.substring(0, 7);
        const ex = monthly.find(m => m.month === month);
        if (ex) ex.cost += cost; else monthly.push({ month, cost });
      }
    }
    return monthly.sort((a, b) => a.month.localeCompare(b.month)).slice(-6).map(d => d.cost);
  })();

  // ─── Monthly bar chart ───────────────────────────────────────────────────
  const barChartData = (() => {
    if (!abrechnungSetup?.abrechnungszeitraum_start) return null;
    const periodStart = new Date(abrechnungSetup.abrechnungszeitraum_start);
    const totalHzUnits = heizungIstaData.reduce((s, d) => s + d.units, 0);
    const totalWwUnits = warmwasserIstaData.reduce((s, d) => s + d.units, 0);
    const stromMonthly = stromYearlyCost / 12;
    const fixedMonthly = ((combinedForecast?.istaNebenkostenYear ?? 0)
      + (combinedForecast?.betriebskosten ?? 0)) / 12;
    const now = new Date();

    const bars = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(periodStart.getFullYear(), periodStart.getMonth() + i, 1);
      const ms = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
      const label = month.toLocaleDateString('de-DE', { month: 'short' });
      const isPast = month < now;

      const hzItem = heizungIstaData.find(d => d.month === ms);
      const hzCost = hzItem && totalHzUnits > 0 && combinedForecast?.heizung
        ? (hzItem.units / totalHzUnits) * combinedForecast.heizung.yourAnnualCost
        : (combinedForecast?.heizung?.yourAnnualCost ?? 0) / 12;

      const wwItem = warmwasserIstaData.find(d => d.month === ms);
      const wwCost = wwItem && totalWwUnits > 0 && combinedForecast?.warmwasser
        ? (wwItem.units / totalWwUnits) * combinedForecast.warmwasser.yourAnnualCost
        : (combinedForecast?.warmwasser?.yourAnnualCost ?? 0) / 12;

      return { label, cost: Math.round(hzCost + wwCost + stromMonthly + fixedMonthly), isPast };
    });

    const totalMonthlyAbschlag = vorauszahlungMonthly + totalStromAbschlag;
    const maxCost = Math.max(...bars.map(b => b.cost), totalMonthlyAbschlag, 1);
    return { bars, totalMonthlyAbschlag, maxCost };
  })();

  // ─── Jahresbilanz ────────────────────────────────────────────────────────
  const totalAnnualPayments = (vorauszahlungMonthly + totalStromAbschlag) * 12;
  const totalProjectedCost = stromYearlyCost + (combinedForecast?.totalProjected ?? 0);
  const totalDiff = totalProjectedCost - totalAnnualPayments;
  const totalIsNachzahlung = totalDiff > 0;
  const showJahresbilanz = totalProjectedCost > 0 || totalAnnualPayments > 0;
  const bilanzmaxVal = Math.max(totalProjectedCost, totalAnnualPayments, 1);
  const accuracyPct = combinedForecast?.confidence.accuracyPct ?? 0;

  // ─── Action items (prioritized) ──────────────────────────────────────────
  type ActionItem = { weight: number; dot: string; text: string; href?: string };
  const actionItems: ActionItem[] = [];

  if (combinedForecast && !combinedForecast.confidence.hasBetriebskosten) {
    actionItems.push({ weight: 1, dot: '#EA580C',
      text: 'Betriebskosten fehlen — fülle die Abrechnung aus für eine vollständige Prognose.',
      href: '/abrechnung' });
  }
  if (combinedForecast && combinedForecast.confidence.dataSource === 'none') {
    actionItems.push({ weight: 1, dot: '#EA580C',
      text: 'Keine Monatsdaten — füge sie hinzu für eine genaue Prognose.',
      href: heizungMeters[0] ? `/meters/${heizungMeters[0].id}` : '/meters' });
  }
  if (monthlySavings > 0) {
    actionItems.push({ weight: 2, dot: '#EA580C',
      text: `${fmtEur(monthlySavings)}/Monat beiseitelegen — damit trifft dich die Nachzahlung nicht unvorbereitet.` });
  }
  if (isPlus && showAbschlagRecommendation && abschlagIsUnder) {
    actionItems.push({ weight: 2, dot: '#EA580C',
      text: `NK-Vorauszahlung erhöhen: empfohlen ${fmtEur(recommendedMonthly)}/Monat (+${fmtEur(abschlagGap)}).`,
      href: '/abrechnung' });
  }
  if (isPlus && showStromAbschlagRecommendation && stromAbschlagIsUnder) {
    actionItems.push({ weight: 2, dot: '#EA580C',
      text: `Strom-Abschlag erhöhen: empfohlen ${fmtEur(stromRecommendedMonthly)}/Monat (+${fmtEur(Math.abs(stromAbschlagGap))}).`,
      href: stromForecasts[0] ? `/meters/${stromForecasts[0].meter.id}` : '/meters' });
  }
  if (isPlus && showAbschlagRecommendation && !abschlagIsUnder) {
    actionItems.push({ weight: 3, dot: '#2FAE8E',
      text: `Du zahlst ${fmtEur(Math.abs(abschlagGap))}/Monat mehr Vorauszahlung als nötig — du kannst reduzieren.`,
      href: '/abrechnung' });
  }
  if (stromYearlyCost > 0 && Math.abs(stromDiffFromAvg) > 5) {
    actionItems.push({ weight: stromDiffFromAvg > 0 ? 2 : 3, dot: stromDiffFromAvg > 0 ? '#EA580C' : '#2FAE8E',
      text: `Stromverbrauch liegt ${Math.abs(stromDiffFromAvg)}% ${stromDiffFromAvg > 0 ? 'über' : 'unter'} dem Durchschnitt ähnlicher Haushalte.` });
  }
  if (combinedForecast?.heizung && combinedForecast.heizung.verbrauchskosten > 100) {
    const saving10 = Math.round(combinedForecast.heizung.verbrauchskosten * 0.1);
    actionItems.push({ weight: 4, dot: '#14B8A6',
      text: `10% weniger heizen spart ca. ${fmtEur(saving10)}/Jahr — der größte Hebel.` });
  }
  if (!isPlus) {
    actionItems.push({ weight: 5, dot: 'var(--nexo-cta)',
      text: 'Abschlag-Empfehlungen und Sparrechner mit nexoen freischalten →',
      href: '/upgrade' });
  }

  actionItems.sort((a, b) => a.weight - b.weight);

  const hasData = meterForecasts.length > 0 || hasAbrechnungData;

  // ─── Derived display values ───────────────────────────────────────────────
  const nkColor = nebenkostenIsNachzahlung ? 'var(--nexo-nachzahlung-text)' : 'var(--nexo-guthaben-text)';

  // Hero: pick worst tariff offender (highest net), then nebenkosten
  const hasStromData = stromYearlyCost > 0;
  const hasGasData = gasYearlyCost > 0;
  const showGasHero = hasGasData && (!hasStromData || gasNet >= stromNet);
  const heroLabel     = showGasHero ? 'Gas'     : 'Strom';
  const heroColor     = showGasHero ? '#E28A5C' : '#5B8DEF';
  const heroAmount    = showGasHero ? gasAmount    : stromAmount;
  const heroIsNach    = showGasHero ? gasIsNachzahlung : stromIsNachzahlung;
  const heroYearly    = showGasHero ? gasYearlyCost    : stromYearlyCost;
  const heroAbschlag  = showGasHero
    ? gasForecasts.reduce((s, { tariff }) => s + (tariff?.abschlag || 0), 0)
    : totalStromAbschlag;
  const heroDiffAvg   = showGasHero ? 0 : stromDiffFromAvg;
  const heroSparkline = showGasHero ? gasSparkline : stromSparkline;
  const heroStatusColor = heroIsNach ? 'var(--nexo-nachzahlung-text)' : 'var(--nexo-guthaben-text)';
  const heroType: 'tariff' | 'nebenkosten' | null =
    (hasStromData || hasGasData) ? 'tariff' :
    combinedForecast ? 'nebenkosten' : null;

  // Insights accent color = most urgent action
  const insightAccent = actionItems[0]?.weight <= 2 ? '#E28A5C' : '#2FAE8E';

  // Primary CTA link from action items
  const primaryCta = actionItems.find(a => a.href && a.weight <= 2);

  // ─── Monthly cost donut data ──────────────────────────────────────────────
  const avgMonthlyCost = barChartData
    ? Math.round(barChartData.bars.reduce((s, b) => s + b.cost, 0) / 12)
    : 0;

  const verbraucht = barChartData
    ? barChartData.bars.filter(b => b.isPast).reduce((s, b) => s + b.cost, 0)
    : 0;

  const donutSegments = (() => {
    const stromMo  = stromYearlyCost / 12;
    const heizMo   = (combinedForecast?.heizung?.yourAnnualCost ?? 0) / 12;
    const wwMo     = (combinedForecast?.warmwasser?.yourAnnualCost ?? 0) / 12;
    const fixMo    = ((combinedForecast?.istaNebenkostenYear ?? 0) + (combinedForecast?.betriebskosten ?? 0)) / 12;
    const total    = stromMo + heizMo + wwMo + fixMo;
    if (total <= 0) return null;
    const segs = [
      { label: 'Strom',      value: stromMo, color: '#5B8DEF' },
      { label: 'Heizung',    value: heizMo,  color: '#E6A65C' },
      { label: 'Warmwasser', value: wwMo,    color: '#2FAE8E' },
      { label: 'NK fix',     value: fixMo,   color: '#94A3B8' },
    ].filter(s => s.value > 1);
    const R = 55, C = 2 * Math.PI * R;
    let off = 0;
    const withGeom = segs.map(s => {
      const len = (s.value / total) * C;
      const dashOffset = off;
      off += len;
      return { ...s, total, dash: `${len.toFixed(2)} ${C.toFixed(2)}`, offset: -dashOffset };
    });
    const largest = withGeom.reduce((a, b) => b.value > a.value ? b : a, withGeom[0]);
    return { segs: withGeom, total, centerPct: Math.round((largest.value / total) * 100), centerLabel: largest.label };
  })();

  // Bar chart SVG constants — wider + taller for all-month labels
  const B_W = 560, B_H = 130;
  const B_PL = 38, B_PR = 8, B_PT = 12, B_PB = 28;
  const B_IW = B_W - B_PL - B_PR;
  const B_IH = B_H - B_PT - B_PB;
  const B_GW = B_IW / 12;
  const B_BW = B_GW * 0.60;
  const B_SG = (B_GW - B_BW) / 2;

  // Shared card style
  const card: React.CSSProperties = {
    backgroundColor: 'var(--nexo-card-bg)',
    borderRadius: '4px',
    border: '1px solid var(--nexo-border)',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  };

  return (
    <div className="pb-16">
      {hasData ? (
        <div className="space-y-6">

          {/* ── Worsening forecast banner ──────────────────────────────── */}
          {isPlus && isWorsening && (
            <ForecastWarning
              currentAmount={currentNachzahlung}
              snapshotAmount={snapshotAmount!}
              snapshotDate={snapshotDate!}
            />
          )}

          {/* ── Row 1: Hero card ───────────────────────────────────────── */}

          {/* Tariff hero — shows worst offender (Strom or Gas) */}
          {heroType === 'tariff' && (
            <div
              className="nexo-hover-card relative overflow-hidden"
              style={{ ...card, padding: 'clamp(16px, 4vw, 28px) clamp(16px, 5.5vw, 32px)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
            >
              {/* Decorative background — radial glow + soft contour lines in bottom portion */}
              {(() => {
                const rawPts = heroSparkline.length >= 2
                  ? getPoints(heroSparkline, 560, 28)
                  : ([[0,18],[140,10],[280,22],[420,8],[560,16]] as [number,number][]);
                const shift = (dy: number): [number,number][] =>
                  rawPts.map(([x, y]) => [x + 20, y + 108 + dy] as [number,number]);
                const c1 = smoothCurve(shift(0));
                const c2 = smoothCurve(shift(22));
                const c3 = smoothCurve(shift(44));
                const area = smoothAreaCurve(shift(0), 180);
                return (
                  <svg
                    viewBox="0 0 600 180"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
                    preserveAspectRatio="none"
                    aria-hidden
                  >
                    <defs>
                      <radialGradient id="tariff-glow" cx="88%" cy="15%" r="50%">
                        <stop offset="0%" style={{ stopColor: heroColor, stopOpacity: 0.13 }} />
                        <stop offset="100%" style={{ stopColor: heroColor, stopOpacity: 0 }} />
                      </radialGradient>
                      <linearGradient id="tariff-area" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: heroColor, stopOpacity: 0.05 }} />
                        <stop offset="100%" style={{ stopColor: heroColor, stopOpacity: 0.01 }} />
                      </linearGradient>
                    </defs>
                    <rect x="0" y="0" width="600" height="180" fill="url(#tariff-glow)" />
                    <path d={area} fill="url(#tariff-area)" />
                    <path d={c3} fill="none" stroke={heroColor} strokeWidth={1} strokeOpacity={0.06} />
                    <path d={c2} fill="none" stroke={heroColor} strokeWidth={1} strokeOpacity={0.10} />
                    <path d={c1} fill="none" stroke={heroColor} strokeWidth={1.5} strokeOpacity={0.18} />
                  </svg>
                );
              })()}

              <div style={{ position: 'relative', zIndex: 1, maxWidth: 500 }}>
                {/* Category label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                  {showGasHero ? (
                    <svg width={14} height={14} fill="none" stroke={heroColor} viewBox="0 0 24 24"
                      style={{ strokeWidth: 2, flexShrink: 0 }}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                  ) : (
                    <svg width={14} height={14} fill="none" stroke={heroColor} viewBox="0 0 24 24"
                      style={{ strokeWidth: 2.5, flexShrink: 0 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                  <span style={{ fontSize: '12px', fontWeight: 700, color: heroColor,
                    textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                    {heroLabel}
                  </span>
                </div>

                {/* Status label */}
                <p style={{ fontSize: '14px', fontWeight: 600, color: heroStatusColor, marginBottom: 10 }}>
                  {heroIsNach ? 'Nachzahlung erwartet' : 'Guthaben erwartet'}
                </p>

                {/* Big amount — colored by status */}
                <p className="font-heading" style={{ fontSize: 'clamp(32px, 10vw, 56px)', fontWeight: 700, lineHeight: 1,
                  letterSpacing: '-0.03em', color: heroStatusColor, margin: '0 0 18px 0' }}>
                  <AnimatedNumber value={heroAmount} suffix=" €" />
                </p>

                {/* Jahresprognose */}
                {heroYearly > 0 && (
                  <p style={{ fontSize: '15px', color: 'var(--nexo-text-secondary)', marginBottom: 6 }}>
                    Jahresprognose:{' '}
                    <strong style={{ color: 'var(--nexo-text-primary)' }}>{fmtEur(heroYearly)}</strong>
                  </p>
                )}

                {/* Abschlag */}
                {heroAbschlag > 0 && (
                  <p style={{ fontSize: '14px', color: 'var(--nexo-text-secondary)', marginBottom: 6 }}>
                    Abschlag:{' '}
                    <strong style={{ color: 'var(--nexo-text-primary)' }}>{fmtEur(heroAbschlag)}/Monat</strong>
                    <span style={{ display: 'inline-block' }}>{' '}({fmtEur(heroAbschlag * 12)}/Jahr)</span>
                  </p>
                )}

                {/* Comparison vs avg household */}
                {heroYearly > 0 && Math.abs(heroDiffAvg) > 5 && (
                  <p style={{ fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4,
                    color: heroDiffAvg > 0 ? 'var(--nexo-nachzahlung-text)' : 'var(--nexo-guthaben-text)',
                    marginTop: 4 }}>
                    {heroDiffAvg > 0 ? '↑' : '↓'} {Math.abs(heroDiffAvg)}% vs. Ø Haushalt
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Nebenkosten hero (when no Strom) */}
          {heroType === 'nebenkosten' && combinedForecast && (
            <div
              className="nexo-hover-card relative overflow-hidden"
              style={{
                ...card,
                padding: 'clamp(16px, 4vw, 28px) clamp(16px, 5.5vw, 32px)',
                backgroundColor: 'rgba(47, 174, 142, 0.05)',
                border: '1px solid rgba(47, 174, 142, 0.2)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
              }}
            >
              {/* Decorative background — radial glow + soft contour lines in bottom portion */}
              {(() => {
                const rawPts = nkSparkline.length >= 2
                  ? getPoints(nkSparkline, 560, 28)
                  : ([[0,16],[140,8],[280,20],[420,6],[560,14]] as [number,number][]);
                const shift = (dy: number): [number,number][] =>
                  rawPts.map(([x, y]) => [x + 20, y + 108 + dy] as [number,number]);
                const c1 = smoothCurve(shift(0));
                const c2 = smoothCurve(shift(22));
                const c3 = smoothCurve(shift(44));
                const area = smoothAreaCurve(shift(0), 180);
                return (
                  <svg
                    viewBox="0 0 600 180"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
                    preserveAspectRatio="none"
                    aria-hidden
                  >
                    <defs>
                      <radialGradient id="nk-glow" cx="88%" cy="15%" r="50%">
                        <stop offset="0%" style={{ stopColor: '#2FAE8E', stopOpacity: 0.13 }} />
                        <stop offset="100%" style={{ stopColor: '#2FAE8E', stopOpacity: 0 }} />
                      </radialGradient>
                      <linearGradient id="nk-area" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#2FAE8E', stopOpacity: 0.05 }} />
                        <stop offset="100%" style={{ stopColor: '#2FAE8E', stopOpacity: 0.01 }} />
                      </linearGradient>
                    </defs>
                    <rect x="0" y="0" width="600" height="180" fill="url(#nk-glow)" />
                    <path d={area} fill="url(#nk-area)" />
                    <path d={c3} fill="none" stroke="#2FAE8E" strokeWidth={1} strokeOpacity={0.06} />
                    <path d={c2} fill="none" stroke="#2FAE8E" strokeWidth={1} strokeOpacity={0.10} />
                    <path d={c1} fill="none" stroke="#2FAE8E" strokeWidth={1.5} strokeOpacity={0.18} />
                  </svg>
                );
              })()}

              <div style={{ position: 'relative', zIndex: 1, maxWidth: 500 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                  <svg width={14} height={14} fill="none" stroke="#2FAE8E" viewBox="0 0 24 24"
                    style={{ strokeWidth: 2, flexShrink: 0 }}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#2FAE8E',
                    textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                    Nebenkosten
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, flexWrap: 'wrap' }}>
                  <p className="font-heading" style={{ fontSize: 'clamp(32px, 10vw, 56px)', fontWeight: 700, lineHeight: 1,
                    letterSpacing: '-0.03em', color: nkColor, margin: 0 }}>
                    <AnimatedNumber value={nebenkostenAmount} suffix=" €" />
                  </p>
                  {nebenkostenAmount > 0 && (
                    <span style={{
                      fontSize: '14px', fontWeight: 700, padding: '5px 14px', borderRadius: 999,
                      backgroundColor: nebenkostenIsNachzahlung ? 'var(--nexo-nachzahlung-bg)' : 'var(--nexo-guthaben-bg)',
                      color: nebenkostenIsNachzahlung ? 'var(--nexo-nachzahlung-text)' : 'var(--nexo-guthaben-text)',
                      border: nebenkostenIsNachzahlung ? '1px solid var(--nexo-nachzahlung-border)' : '1px solid var(--nexo-guthaben-border)',
                    }}>
                      {nebenkostenIsNachzahlung ? '+' : '−'}{fmtEur(nebenkostenAmount)}
                    </span>
                  )}
                </div>

                <p style={{ fontSize: '16px', color: 'var(--nexo-text-secondary)', marginBottom: 10 }}>
                  {nebenkostenIsNachzahlung ? 'Nachzahlung' : 'Guthaben'} ca.
                  {combinedForecast.totalProjected > 0 && (
                    <>: <strong style={{ color: 'var(--nexo-text-primary)' }}>{fmtEur(combinedForecast.totalProjected)}/Jahr</strong> erwartet</>
                  )}
                </p>
                <p style={{ fontSize: '14px', color: 'var(--nexo-text-muted)' }}>
                  ca. {combinedForecast.confidence.accuracyPct}% Genauigkeit
                </p>
              </div>
            </div>
          )}

          {/* ── Row 2: Secondary cards ─────────────────────────────────── */}
          {(() => {
            // Determine which secondary cards to show
            const showNK = heroType === 'tariff' && combinedForecast !== null;
            const showHz = heizungData !== null;
            const showInsights = actionItems.length > 0;
            const count = [showNK, showHz, showInsights].filter(Boolean).length;
            if (count === 0) return null;

            const gridClass = count === 1
              ? 'grid grid-cols-1'
              : count === 2
                ? 'grid grid-cols-1 sm:grid-cols-2 gap-5'
                : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5';

            return (
              <div className={gridClass} style={{ gap: count === 1 ? 0 : undefined }}>

                {/* Nebenkosten secondary card */}
                {showNK && combinedForecast && (
                  <div className="nexo-hover-card" style={{ ...card }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                      <svg width={15} height={15} fill="none" stroke="var(--nexo-text-muted)" viewBox="0 0 24 24"
                        style={{ strokeWidth: 2, flexShrink: 0 }}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--nexo-text-muted)',
                        textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Nebenkosten
                      </span>
                    </div>

                    <p className="font-heading" style={{ fontSize: '34px', fontWeight: 700, color: nkColor,
                      lineHeight: 1, marginBottom: 8 }}>
                      <AnimatedNumber value={nebenkostenAmount} suffix=" €" />
                    </p>
                    <p style={{ fontSize: '14px', color: 'var(--nexo-text-secondary)', marginBottom: 4 }}>
                      {nebenkostenIsNachzahlung ? 'Nachzahlung' : 'Guthaben'} ca.
                    </p>
                    {combinedForecast.totalProjected > 0 && (
                      <p style={{ fontSize: '13px', color: 'var(--nexo-text-muted)', marginBottom: 4 }}>
                        {fmtEur(combinedForecast.totalProjected)}/Jahr erwartet
                      </p>
                    )}

                    {/* Smooth sparkline */}
                    {nkSparkline.length >= 2 && (() => {
                      const nkHex = nebenkostenIsNachzahlung ? '#E28A5C' : '#2FAE8E';
                      const pts = getPoints(nkSparkline, 100, 34);
                      const linePath = smoothCurve(pts);
                      const areaStr = smoothAreaCurve(pts, 40);
                      return (
                        <svg viewBox="0 0 100 40" style={{ width: '100%', height: 44, marginTop: 10 }}
                          preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="nk-mini-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" style={{ stopColor: nkHex, stopOpacity: 0.22 }} />
                              <stop offset="100%" style={{ stopColor: nkHex, stopOpacity: 0.02 }} />
                            </linearGradient>
                          </defs>
                          <path d={areaStr} fill="url(#nk-mini-grad)" />
                          <path d={linePath} fill="none" stroke={nkHex} strokeWidth={1.5}
                            strokeLinejoin="round" strokeLinecap="round" strokeOpacity={0.75} />
                        </svg>
                      );
                    })()}
                  </div>
                )}

                {/* Heizung & Warmwasser card */}
                {showHz && heizungData && (
                  <div className="nexo-hover-card" style={{ ...card }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                      <svg width={15} height={15} fill="none" stroke="#E6A65C" viewBox="0 0 24 24"
                        style={{ strokeWidth: 2, flexShrink: 0 }}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                      </svg>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--nexo-text-muted)',
                        textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Heizung &amp; Warmwasser
                      </span>
                    </div>

                    <p className="font-heading" style={{ fontSize: '34px', fontWeight: 700,
                      color: 'var(--nexo-text-primary)', lineHeight: 1, marginBottom: 18 }}>
                      {fmtEur(heizungData.total)}{' '}
                      <span style={{ fontSize: '16px', fontWeight: 500, color: 'var(--nexo-text-muted)' }}>/Jahr</span>
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {[
                        { label: 'Fixkosten', value: heizungData.fixkosten, color: '#94A3B8' },
                        { label: 'Verbrauch', value: heizungData.verbrauch, color: '#E6A65C' },
                        ...(heizungData.warmwasser > 0
                          ? [{ label: 'Warmwasser', value: heizungData.warmwasser, color: '#2FAE8E' }]
                          : []),
                      ].map(row => (
                        <div key={row.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: row.color, flexShrink: 0 }} />
                            <span style={{ fontSize: '14px', color: 'var(--nexo-text-secondary)' }}>{row.label}</span>
                          </div>
                          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--nexo-text-primary)' }}>
                            {fmtEur(row.value)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Proportional bar */}
                    {heizungData.total > 0 && (() => {
                      const fixPct = Math.round((heizungData.fixkosten / heizungData.total) * 100);
                      const varPct = 100 - fixPct;
                      return (
                        <div style={{ marginTop: 14 }}>
                          <div style={{ height: 5, borderRadius: 999, overflow: 'hidden', display: 'flex' }}>
                            <div style={{ width: `${fixPct}%`, backgroundColor: '#94A3B8', transition: 'width 0.8s ease' }} />
                            <div style={{ flex: 1, backgroundColor: '#E6A65C' }} />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                            <span style={{ fontSize: '11px', color: 'var(--nexo-text-muted)' }}>{fixPct}% fix</span>
                            <span style={{ fontSize: '11px', color: 'var(--nexo-text-muted)' }}>{varPct}% variabel</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Insights / Action card */}
                {showInsights && (
                  <div className="nexo-hover-card" style={{ ...card }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                      <svg width={14} height={14} fill="none" stroke="var(--nexo-text-muted)" viewBox="0 0 24 24"
                        style={{ strokeWidth: 2, flexShrink: 0 }}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--nexo-text-muted)',
                        textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Empfehlungen
                      </span>
                    </div>

                    {/* Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                      {actionItems.slice(0, 3).map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: item.dot,
                            flexShrink: 0, marginTop: 7 }} />
                          {item.href ? (
                            <a href={item.href} className="no-underline" style={{
                              fontSize: '14px', lineHeight: '21px',
                              color: item.weight <= 2 ? 'var(--nexo-text-primary)' : 'var(--nexo-text-secondary)',
                              fontWeight: item.weight <= 2 ? 500 : 400,
                              textDecoration: 'none',
                            }}>
                              {item.text}
                            </a>
                          ) : (
                            <p style={{
                              fontSize: '14px', lineHeight: '21px', margin: 0,
                              color: item.weight <= 2 ? 'var(--nexo-text-primary)' : 'var(--nexo-text-secondary)',
                              fontWeight: item.weight <= 2 ? 500 : 400,
                            }}>
                              {item.text}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Subtle text link CTA */}
                    {primaryCta && (
                      <a
                        href={primaryCta.href}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 16,
                          fontSize: '13px', fontWeight: 600, color: 'var(--nexo-cta)',
                          textDecoration: 'none',
                        }}
                      >
                        Details anzeigen →
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })()}

          {/* ── Row 3: Jahresbilanz + Monatliche Kosten ───────────────── */}
          {(showJahresbilanz || barChartData) && (
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

              {/* ── Jahresbilanz card ──────────────────────────────────── */}
              <div className="nexo-hover-card flex flex-col" style={card}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--nexo-text-muted)',
                  textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>
                  Jahresbilanz
                </p>

                {showJahresbilanz ? (
                  <>
                    <div style={{ marginBottom: 22 }}>
                      <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase',
                        letterSpacing: '0.08em', marginBottom: 8,
                        color: totalIsNachzahlung ? 'var(--nexo-nachzahlung-text)' : 'var(--nexo-guthaben-text)' }}>
                        {totalIsNachzahlung ? '↑ Nachzahlung' : '↓ Guthaben'}
                      </p>
                      <p className="font-heading" style={{ fontSize: '36px', fontWeight: 700,
                        letterSpacing: '-0.025em', lineHeight: 1,
                        color: totalIsNachzahlung ? 'var(--nexo-nachzahlung-text)' : 'var(--nexo-guthaben-text)' }}>
                        {fmtEur(Math.abs(totalDiff))}
                      </p>
                      <p style={{ fontSize: '13px', color: 'var(--nexo-text-muted)', marginTop: 6 }}>
                        {totalIsNachzahlung ? 'geschätzte Gesamtnachzahlung' : 'geschätztes Gesamtguthaben'}
                      </p>
                    </div>

                    <div style={{ marginBottom: 'auto' }}>
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                          <span style={{ fontSize: '13px', color: 'var(--nexo-text-muted)' }}>Prognose</span>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--nexo-text-primary)' }}>
                            {fmtEur(totalProjectedCost)}
                          </span>
                        </div>
                        <div style={{ height: 7, backgroundColor: 'var(--nexo-border)', borderRadius: 999, overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: `${(totalProjectedCost / bilanzmaxVal) * 100}%`,
                            backgroundColor: totalIsNachzahlung ? '#E6A65C' : '#2FAE8E',
                            borderRadius: 999, transition: 'width 0.8s ease',
                          }} />
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                          <span style={{ fontSize: '13px', color: 'var(--nexo-text-muted)' }}>Zahlungen</span>
                          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--nexo-text-secondary)' }}>
                            {fmtEur(totalAnnualPayments)}
                          </span>
                        </div>
                        <div style={{ height: 7, backgroundColor: 'var(--nexo-border)', borderRadius: 999, overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: `${(totalAnnualPayments / bilanzmaxVal) * 100}%`,
                            backgroundColor: 'var(--nexo-text-muted)',
                            borderRadius: 999, opacity: 0.45, transition: 'width 0.8s ease',
                          }} />
                        </div>
                      </div>

                      {/* Year progress dots */}
                      {monthsElapsed > 0 && (() => {
                        const filled = Math.min(Math.round(monthsElapsed), 12);
                        const dotColor = totalIsNachzahlung ? '#E6A65C' : '#2FAE8E';
                        return (
                          <div style={{ marginTop: 22 }}>
                            <p style={{ fontSize: '12px', color: 'var(--nexo-text-muted)', marginBottom: 9 }}>
                              Monat {filled} von 12
                            </p>
                            <div style={{ display: 'flex', gap: 6 }}>
                              {Array.from({ length: 12 }, (_, i) => (
                                <div key={i} style={{
                                  width: 9, height: 9, borderRadius: '50%', flexShrink: 0,
                                  backgroundColor: i < filled ? dotColor : 'transparent',
                                  border: `1.5px solid ${i < filled ? dotColor : 'var(--nexo-border)'}`,
                                }} />
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    <div style={{ borderTop: '1px solid var(--nexo-border)', marginTop: 18, paddingTop: 16 }}>
                      {accuracyPct > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                          <div style={{ width: 7, height: 7, borderRadius: '50%',
                            backgroundColor: 'var(--nexo-cta)', flexShrink: 0 }} />
                          <span style={{ fontSize: '13px', color: 'var(--nexo-text-secondary)', fontWeight: 500 }}>
                            ca. {accuracyPct}% Genauigkeit
                          </span>
                        </div>
                      )}
                      {periodLabel && (
                        <p style={{ fontSize: '13px', color: 'var(--nexo-text-muted)' }}>{periodLabel}</p>
                      )}
                    </div>
                  </>
                ) : (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <p className="font-heading" style={{ fontSize: '28px', fontWeight: 700,
                      color: 'var(--nexo-text-muted)', marginBottom: 12 }}>–</p>
                    <a href="/abrechnung" style={{ fontSize: '14px', color: 'var(--nexo-cta)',
                      fontWeight: 600, textDecoration: 'none' }}>
                      Abrechnung einrichten →
                    </a>
                  </div>
                )}
              </div>

              {/* ── Monatliche Kosten card (reference-style) ───────────── */}
              <div className="nexo-hover-card" style={card}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--nexo-text-primary)', marginBottom: 4 }}>
                      Monatliche Kosten
                    </p>
                    {avgMonthlyCost > 0 && (
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                        <span className="font-heading" style={{ fontSize: '36px', fontWeight: 700,
                          color: 'var(--nexo-text-primary)', lineHeight: 1 }}>
                          {avgMonthlyCost}
                        </span>
                        <span style={{ fontSize: '15px', color: 'var(--nexo-text-muted)' }}>€/Monat</span>
                      </div>
                    )}
                    {barChartData && barChartData.totalMonthlyAbschlag > 0 && (
                      <p style={{ fontSize: '14px', color: 'var(--nexo-text-secondary)', marginTop: 6 }}>
                        Abschlag: <strong style={{ color: 'var(--nexo-text-primary)' }}>
                          {fmtEur(barChartData.totalMonthlyAbschlag)}/Monat
                        </strong>
                      </p>
                    )}
                  </div>
                  {barChartData && (() => {
                    const peakBar = barChartData.bars.reduce((p, c) => c.cost > p.cost ? c : p, barChartData.bars[0]);
                    return (
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--nexo-text-muted)',
                          textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                          Höchster Monat
                        </p>
                        <p className="font-heading" style={{ fontSize: '24px', fontWeight: 700,
                          color: 'var(--nexo-text-primary)' }}>
                          {fmtEur(peakBar.cost)}
                        </p>
                      </div>
                    );
                  })()}
                </div>

                {barChartData ? (
                  <>
                    {/* Body: donut + bar chart */}
                    <div className="flex flex-col lg:flex-row" style={{ gap: 28, alignItems: 'center' }}>

                      {/* Donut chart */}
                      {donutSegments && (
                        <div className="mx-auto lg:mx-0" style={{ flexShrink: 0, width: 168 }}>
                          <svg width={168} height={168} viewBox="0 0 160 160">
                            <g transform="rotate(-90, 80, 80)">
                              {/* Track */}
                              <circle cx={80} cy={80} r={55} fill="none"
                                stroke="var(--nexo-border)" strokeWidth={14} />
                              {/* Segments */}
                              {donutSegments.segs.map((seg, i) => (
                                <circle key={i} cx={80} cy={80} r={55} fill="none"
                                  stroke={seg.color} strokeWidth={14}
                                  strokeDasharray={seg.dash}
                                  strokeDashoffset={seg.offset} />
                              ))}
                            </g>
                            {/* Center label */}
                            <text x="80" y="74" textAnchor="middle"
                              fontSize="22" fontWeight="700"
                              fill="var(--nexo-text-primary)"
                              fontFamily="var(--font-heading), Georgia, serif">
                              {donutSegments.centerPct}%
                            </text>
                            <text x="80" y="94" textAnchor="middle"
                              fontSize="11" fill="var(--nexo-text-muted)" fontFamily="system-ui">
                              {donutSegments.centerLabel}
                            </text>
                          </svg>
                        </div>
                      )}

                      {/* Bar chart */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <svg
                          viewBox={`0 0 ${B_W} ${B_H}`}
                          style={{ width: '100%', height: 'auto', display: 'block' }}
                          preserveAspectRatio="xMidYMid meet"
                        >
                          {/* Y-axis gridlines */}
                          {[0.5, 1].map((t, i) => {
                            const gy = B_PT + B_IH * (1 - t);
                            const gv = Math.round(barChartData.maxCost * t);
                            return (
                              <g key={i}>
                                <line x1={B_PL} y1={gy} x2={B_W - B_PR} y2={gy}
                                  stroke="var(--nexo-border)" strokeWidth={0.8} />
                                <text x={B_PL - 4} y={gy + 4} textAnchor="end" fontSize={10}
                                  fill="var(--nexo-text-muted)" fontFamily="system-ui">
                                  {gv}€
                                </text>
                              </g>
                            );
                          })}

                          {/* Abschlag reference line */}
                          {(() => {
                            if (!barChartData.totalMonthlyAbschlag) return null;
                            const ry = B_PT + B_IH - (barChartData.totalMonthlyAbschlag / barChartData.maxCost) * B_IH;
                            if (ry < B_PT || ry > B_PT + B_IH) return null;
                            return (
                              <line x1={B_PL} y1={ry} x2={B_W - B_PR} y2={ry}
                                stroke="var(--nexo-text-muted)" strokeWidth={1.2}
                                strokeDasharray="5 3" opacity={0.45} />
                            );
                          })()}

                          {/* Bars — all 12 months labeled */}
                          {barChartData.bars.map((bar, i) => {
                            const bx = B_PL + i * B_GW + B_SG;
                            const bh = Math.max((bar.cost / barChartData.maxCost) * B_IH, 2);
                            const by = B_PT + B_IH - bh;
                            const lx = B_PL + i * B_GW + B_GW / 2;
                            return (
                              <g key={i}>
                                <rect
                                  x={bx.toFixed(1)} y={by.toFixed(1)}
                                  width={B_BW.toFixed(1)} height={bh.toFixed(1)}
                                  rx={3} ry={3}
                                  fill={i === 11 ? '#E6A65C' : 'rgba(0,0,0,0.10)'}
                                />
                                <text x={lx.toFixed(1)} y={B_H - 6} textAnchor="middle"
                                  fontSize={9} fill="var(--nexo-text-muted)" fontFamily="system-ui">
                                  {bar.label}
                                </text>
                              </g>
                            );
                          })}
                        </svg>

                      </div>
                    </div>

                    {/* Legend strip — full width below donut + bar */}
                    {donutSegments && (
                      <div style={{
                        display: 'flex', flexWrap: 'wrap', gap: '8px 28px',
                        marginTop: 18, paddingTop: 14,
                        borderTop: '1px solid var(--nexo-border)',
                      }}>
                        {donutSegments.segs.map(seg => (
                          <div key={seg.label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%',
                              backgroundColor: seg.color, flexShrink: 0 }} />
                            <span style={{ fontSize: '13px', color: 'var(--nexo-text-secondary)' }}>
                              {seg.label}
                            </span>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--nexo-text-primary)' }}>
                              {fmtEur(seg.value)}
                            </span>
                          </div>
                        ))}
                        {verbraucht > 0 && (
                          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <svg width={13} height={13} fill="none" stroke="var(--nexo-text-muted)"
                              viewBox="0 0 24 24" style={{ strokeWidth: 2.5 }}>
                              <path strokeLinecap="round" strokeLinejoin="round"
                                d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span style={{ fontSize: '13px', color: 'var(--nexo-text-muted)' }}>Verbraucht</span>
                            <span className="font-heading" style={{ fontSize: '16px', fontWeight: 700,
                              color: 'var(--nexo-text-primary)' }}>
                              {fmtEur(verbraucht)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <p style={{ fontSize: '14px', color: 'var(--nexo-text-muted)', marginTop: 8 }}>
                    Noch keine Daten — richte die Abrechnung ein.
                  </p>
                )}
              </div>
            </div>
          )}

        </div>
      ) : (

        /* ── Empty state ─────────────────────────────────────────────── */
        <div className="space-y-6 pb-4">

          {/* ── Welcome hero ──────────────────────────────────────────── */}
          {(() => {
            const firstName = profileData?.name?.split(' ')[0] ?? 'da';
            const trialEndsAt = profileData?.trial_ends_at ? new Date(profileData.trial_ends_at) : null;
            const trialDaysLeft = trialEndsAt
              ? Math.max(0, Math.ceil((trialEndsAt.getTime() - Date.now()) / 86400000))
              : null;
            const trialPct = trialDaysLeft !== null ? Math.round((trialDaysLeft / 90) * 100) : null;

            // Contour line points for decorative background
            const pts1: [number,number][] = [[0,120],[150,95],[300,110],[450,85],[600,100]];
            const pts2: [number,number][] = [[0,140],[150,115],[300,135],[450,108],[600,125]];
            const pts3: [number,number][] = [[0,160],[150,138],[300,155],[450,130],[600,148]];
            const c1 = smoothCurve(pts1);
            const c2 = smoothCurve(pts2);
            const c3 = smoothCurve(pts3);

            return (
              <div
                className="relative overflow-hidden"
                style={{ ...card, padding: 'clamp(24px, 5vw, 36px) clamp(20px, 5vw, 32px)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
              >
                {/* Decorative background */}
                <svg viewBox="0 0 600 180" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
                  preserveAspectRatio="none" aria-hidden>
                  <defs>
                    <radialGradient id="welcome-glow" cx="85%" cy="20%" r="55%">
                      <stop offset="0%" style={{ stopColor: '#E6A65C', stopOpacity: 0.12 }} />
                      <stop offset="100%" style={{ stopColor: '#E6A65C', stopOpacity: 0 }} />
                    </radialGradient>
                  </defs>
                  <rect x="0" y="0" width="600" height="180" fill="url(#welcome-glow)" />
                  <path d={c3} fill="none" stroke="#E6A65C" strokeWidth={1} strokeOpacity={0.06} />
                  <path d={c2} fill="none" stroke="#E6A65C" strokeWidth={1} strokeOpacity={0.10} />
                  <path d={c1} fill="none" stroke="#E6A65C" strokeWidth={1.5} strokeOpacity={0.18} />
                </svg>

                <div className="relative flex flex-col gap-5" style={{ zIndex: 1 }}>
                  {/* Greeting */}
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#E6A65C', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>
                      nexoen
                    </p>
                    <h2 className="font-heading" style={{ fontSize: 'clamp(22px, 5vw, 32px)', fontWeight: 700, color: 'var(--nexo-text-primary)', marginBottom: 8, lineHeight: 1.2 }}>
                      Willkommen, {firstName}!
                    </h2>
                    <p style={{ fontSize: '15px', color: 'var(--nexo-text-secondary)', lineHeight: 1.6, maxWidth: 480 }}>
                      Drei Schritte bis zu deiner ersten Kostenprognose. Das Dashboard wird mit jedem Schritt genauer.
                    </p>
                  </div>

                  {/* Trial progress — integrated, no box */}
                  {trialDaysLeft !== null && trialDaysLeft > 0 && (
                    <div style={{ maxWidth: 340 }}>
                      <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                        <span style={{ fontSize: '13px', color: 'var(--nexo-text-secondary)' }}>
                          Kostenlos testen
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#E6A65C' }}>
                          {trialDaysLeft} Tage übrig
                        </span>
                      </div>
                      <div style={{ height: 4, backgroundColor: 'var(--nexo-border)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${trialPct}%`, backgroundColor: '#E6A65C', borderRadius: 2 }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* ── 3 Step cards ─────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                num: 1,
                href: '/abrechnung',
                color: '#E6A65C',
                icon: (
                  <svg width={28} height={28} fill="none" stroke="#E6A65C" viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 14l2 2 4-4M3 6a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6z" />
                  </svg>
                ),
                title: 'Abrechnung einrichten',
                desc: 'Heizkosten, Warmwasser und Betriebskosten aus deiner ista-Abrechnung eingeben.',
                cta: 'Jetzt einrichten →',
              },
              {
                num: 2,
                href: '/meters/new',
                color: '#5B8DEF',
                icon: (
                  <svg width={28} height={28} fill="none" stroke="#5B8DEF" viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Strom & Gas anlegen',
                desc: 'Tarif eintragen und erste Ablesung hinzufügen — die Prognose startet sofort.',
                cta: 'Zähler anlegen →',
              },
              {
                num: 3,
                href: '/meters',
                color: '#2FAE8E',
                icon: (
                  <svg width={28} height={28} fill="none" stroke="#2FAE8E" viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: 'Zählerstände ablesen',
                desc: 'Regelmäßig eintragen für immer genauere Prognosen über das ganze Jahr.',
                cta: 'Zu den Zählern →',
              },
            ].map(step => (
              <a
                key={step.num}
                href={step.href}
                className="nexo-hover-card flex flex-col no-underline group"
                style={{ ...card, padding: '24px', gap: 0 }}
              >
                {/* Step number + icon */}
                <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '4px', backgroundColor: 'var(--nexo-bg)', border: '1px solid var(--nexo-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {step.icon}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: step.color, opacity: 0.6 }}>
                    Schritt {step.num}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-heading" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--nexo-text-primary)', marginBottom: 8, lineHeight: 1.3 }}>
                  {step.title}
                </h3>

                {/* Description */}
                <p style={{ fontSize: '14px', color: 'var(--nexo-text-secondary)', lineHeight: 1.6, flexGrow: 1, marginBottom: 20 }}>
                  {step.desc}
                </p>

                {/* CTA */}
                <span style={{ fontSize: '14px', fontWeight: 600, color: step.color }}
                  className="group-hover:underline transition-all">
                  {step.cta}
                </span>
              </a>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}
