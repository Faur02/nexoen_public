import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getMeterWithDetails } from '@/lib/actions/meters';
import { getActiveTariff } from '@/lib/actions/tariffs';
import { getRoomsWithRadiators } from '@/lib/actions/heating';
import { getCategory } from '@/lib/actions/categories';
import { getIstaConsumptionByCategory } from '@/lib/actions/ista-consumption';
import { getAbrechnungSetup } from '@/lib/actions/abrechnung';
import { getHeatingBillingSetup } from '@/lib/actions/heating-billing';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency, formatNumber } from '@/lib/calculations/costs';
import { calculateYearlyForecast, calculateMonthlyForecast } from '@/lib/calculations/forecast';
import { calculateHeatingForecast } from '@/lib/calculations/heating-forecast';
import { getDailyAverageConsumption } from '@/lib/calculations/consumption';
import type { HeatingForecastResult } from '@/types/database';
import { ReadingForm } from '@/components/forms/reading-form';
import { ReadingsList } from '@/components/forms/readings-list';
import { TariffForm } from '@/components/forms/tariff-form';
import { TariffsList } from '@/components/forms/tariffs-list';
import { MeterActions } from '@/components/forms/meter-actions';
import { HeatingManager } from '@/components/forms/heating-manager';
import { ConsumptionChart } from '@/components/charts/consumption-chart';
import { IstaConsumptionChart } from '@/components/charts/ista-consumption-chart';
import { MonthlyCostChart } from '@/components/charts/monthly-cost-chart';
import { MonthlyOverview } from '@/components/charts/monthly-overview';
import { HeatingMonthlyOverview } from '@/components/charts/heating-monthly-overview';
import { IstaConsumptionForm } from '@/components/ista/ista-consumption-form';
import { IstaConsumptionList } from '@/components/ista/ista-consumption-list';
import { IstaPeriodSummary } from '@/components/ista/ista-period-summary';
import { HeizkostenRechner } from '@/components/dashboard/heizkosten-rechner';
import { HeizkostenErklaerung } from '@/components/dashboard/heizkosten-erklaerung';
import { meterTypeLabels } from '@/types/database';
import type { MeterType, SubscriptionTier } from '@/types/database';
import { hasAccess, getEffectiveTier } from '@/lib/config/tiers';

// Daily consumption averages for a 3-person household in Germany (2 adults + 1 child)
const householdAverages: Record<MeterType, { value: number; unit: string; label: string }> = {
  electricity: { value: 9.6, unit: 'kWh', label: 'Durchschnitt Haushalt 3 Personen' },
  gas: { value: 37.0, unit: 'kWh', label: 'Durchschnitt Haushalt 3 Personen' },
  water: { value: 0.39, unit: 'm\u00B3', label: 'Durchschnitt Haushalt 3 Personen' },
  heating: { value: 0, unit: 'units', label: 'Durchschnitt Haushalt 3 Personen' },
};

const meterDotColors: Record<MeterType, string> = {
  electricity: '#5B8DEF',
  gas: '#E28A5C',
  water: '#2FAE8E',
  heating: '#E6A65C',
};

// Category-specific colors (override meterDotColors for predefined categories)
const categorySlugColors: Record<string, string> = {
  heizung: '#E6A65C',
  warmwasser: '#2FAE8E',
  kaltwasser: '#5B8DEF',
};

const cardShadow = 'var(--nexo-card-shadow)';

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

function ArrowIcon({ color, size = 12, up = true }: { color: string; size?: number; up?: boolean }) {
  const height = size * (11 / 18);
  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 18 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: up ? 'rotate(0deg)' : 'rotate(180deg)' }}
    >
      <path
        d="M3.26556 10.832L9 5.50039L14.7344 10.832C14.9779 11.056 15.363 11.056 15.6065 10.832L17.8193 8.77473C18.0602 8.55326 18.0602 8.18456 17.8193 7.96302L9.436 0.168034C9.19257 -0.0560113 8.80743 -0.0560113 8.564 0.168034L0.180672 7.9631C-0.0602241 8.18456 -0.0602241 8.55326 0.180672 8.77473L2.39357 10.832C2.63699 11.056 3.02205 11.056 3.26556 10.832Z"
        fill={color}
      />
    </svg>
  );
}

interface MeterDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MeterDetailPage({ params }: MeterDetailPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { id } = await params;

  const { data: profileData } = await supabase
    .from('profiles')
    .select('subscription_tier, trial_ends_at')
    .eq('id', user.id)
    .single();
  const rawTier: SubscriptionTier = (profileData?.subscription_tier as SubscriptionTier) || 'expired';
  const isPlus = hasAccess(getEffectiveTier(rawTier, profileData?.trial_ends_at ?? null));

  const meter = await getMeterWithDetails(id);

  if (!meter) {
    notFound();
  }

  const isHeating = meter.type === 'heating';

  // Resolve category for color
  const category = meter.category_id ? await getCategory(meter.category_id) : null;
  const dotColor = category?.slug && categorySlugColors[category.slug]
    ? categorySlugColors[category.slug]
    : meterDotColors[meter.type];

  // Determine if this meter should show the ista tab
  const showIstaTab = category?.slug === 'heizung' || category?.slug === 'warmwasser';
  const isKaltwasser = category?.slug === 'kaltwasser';

  // Fetch data based on meter type — all in parallel
  const [activeTariff, rooms, istaData, abrechnungSetup] = await Promise.all([
    getActiveTariff(id),
    isHeating ? getRoomsWithRadiators(id) : Promise.resolve([]),
    showIstaTab && category ? getIstaConsumptionByCategory(category.id) : Promise.resolve([]),
    showIstaTab ? getAbrechnungSetup() : Promise.resolve(null),
  ]);

  // Month-over-month ista trend
  const istaTrend = (() => {
    if (istaData.length < 2) return null;
    const sorted = [...istaData].sort((a, b) => b.month.localeCompare(a.month));
    const cur = sorted[0];
    const prev = sorted[1];
    if (!prev.units || prev.units === 0) return null;
    const changePct = Math.round((cur.units - prev.units) / prev.units * 100);
    const fmtMonth = (ym: string) => {
      const [y, m] = ym.split('-');
      return new Date(parseInt(y), parseInt(m) - 1, 1).toLocaleDateString('de-DE', { month: 'long' });
    };
    return { changePct, curMonth: fmtMonth(cur.month), prevMonth: fmtMonth(prev.month) };
  })();

  // Monthly cost estimates from ista data (computed after istaForecast is available)
  // Populated below after istaForecast is set
  let monthlyKosten: { month: string; label: string; estimatedCost: number }[] = [];

  // Ista-based forecast for heizung/warmwasser
  let istaForecast: HeatingForecastResult | null = null;
  let yourArea: number | null = null;
  if (showIstaTab && category) {
    const billingSetup = await getHeatingBillingSetup(category.id);
    if (billingSetup) {
      yourArea = billingSetup.your_area > 0 ? billingSetup.your_area : null;
      // The Abrechnungszeitraum start IS the forecast period start
      const periodStart: string | undefined = abrechnungSetup?.abrechnungszeitraum_start ?? undefined;

      if (category.slug === 'warmwasser') {
        // Use readings already loaded for this meter (it IS the warmwasser meter)
        istaForecast = calculateHeatingForecast(billingSetup, [], meter.readings, istaData, periodStart);
      } else {
        // For heizung, use rooms/radiator readings as fallback
        istaForecast = calculateHeatingForecast(billingSetup, rooms, undefined, istaData, periodStart);
      }
    }
  }

  // Monthly cost estimates — only for heizung (not warmwasser, costs are combined)
  if (category?.slug === 'heizung' && istaForecast && istaData.length > 0) {
    const totalUnits = istaData.reduce((sum, d) => sum + d.units, 0);
    if (totalUnits > 0) {
      const fmtLabel = (ym: string) => {
        const [y, m] = ym.split('-');
        return new Date(parseInt(y), parseInt(m) - 1, 1).toLocaleDateString('de-DE', { month: 'short', year: '2-digit' });
      };
      monthlyKosten = [...istaData]
        .sort((a, b) => a.month.localeCompare(b.month))
        .map(d => ({
          month: d.month,
          label: fmtLabel(d.month),
          estimatedCost: (d.units / totalUnits) * istaForecast!.yourAnnualCost,
        }));
    }
  }

  // Tariff-based forecasts (only for Strom, Gas, Kaltwasser — NOT for ista categories)
  const usesTariffForecast = !isHeating && !showIstaTab && !isKaltwasser;
  const consumption = !isHeating ? getDailyAverageConsumption(meter.readings, meter.unit) : null;
  const monthlyForecast = usesTariffForecast && activeTariff && meter.readings.length >= 2
    ? calculateMonthlyForecast(meter.readings, activeTariff)
    : null;
  const yearlyForecast = usesTariffForecast && activeTariff && meter.readings.length >= 2
    ? calculateYearlyForecast(meter.readings, activeTariff)
    : null;

  // Nachzahlung/Guthaben status — from ista forecast or tariff forecast
  const isNachzahlung = istaForecast
    ? istaForecast.differenceType === 'nachzahlung'
    : yearlyForecast ? yearlyForecast.differenceType === 'nachzahlung' : null;
  const statusColor = isNachzahlung === null ? 'var(--nexo-text-muted)' : isNachzahlung ? 'var(--nexo-nachzahlung-text)' : 'var(--nexo-guthaben-text)';
  const statusBg = isNachzahlung === null ? 'var(--nexo-surface)' : isNachzahlung ? 'var(--nexo-nachzahlung-bg)' : 'var(--nexo-guthaben-bg)';
  const categoryColor = category?.slug === 'heizung' ? '#E6A65C' : '#2FAE8E';

  // Comparison values (for non-heating meters)
  const average = householdAverages[meter.type];
  const dailyConsumption = consumption?.dailyAverage ?? 0;
  const maxBarValue = Math.max(dailyConsumption, average.value, 1);
  const userPercent = maxBarValue > 0 ? Math.min((dailyConsumption / maxBarValue) * 100, 100) : 0;
  const avgPercent = maxBarValue > 0 ? Math.min((average.value / maxBarValue) * 100, 100) : 0;
  const percentDiffFromAverage = average.value > 0
    ? Math.round(((dailyConsumption - average.value) / average.value) * 100)
    : 0;
  const userBarColor = percentDiffFromAverage > 0 ? 'var(--nexo-nachzahlung-text)' : 'var(--nexo-guthaben-text)';

  // ista-derived consumption stats for Warmwasser and Heizung right card
  const istaTotal = istaData.reduce((sum, d) => sum + d.units, 0);
  // Warmwasser: daily average from ista monthly data vs warm water household benchmark (3 persons)
  const istaWarmwasserDaily = showIstaTab && !isHeating && istaData.length > 0
    ? istaTotal / (istaData.length * 30.44)
    : null;
  const warmwasserHouseholdAvg = 0.13; // m³/day — German 3-person household warm water (~43L/person/day)
  const wwMaxBar = Math.max(istaWarmwasserDaily ?? 0, warmwasserHouseholdAvg, 0.01);
  const wwUserPct = istaWarmwasserDaily ? Math.min((istaWarmwasserDaily / wwMaxBar) * 100, 100) : 0;
  const wwAvgPct = Math.min((warmwasserHouseholdAvg / wwMaxBar) * 100, 100);
  const wwPercentDiff = istaWarmwasserDaily
    ? Math.round(((istaWarmwasserDaily - warmwasserHouseholdAvg) / warmwasserHouseholdAvg) * 100)
    : 0;
  const wwBarColor = wwPercentDiff > 0 ? 'var(--nexo-nachzahlung-text)' : 'var(--nexo-guthaben-text)';

  // Heizung: annual cost comparison (€/Jahr) vs national average scaled to user's apartment area
  // German Heizspiegel average: ~12 €/m²/year. Scaled to user's floor area if known, else 720 € fallback.
  const heizungCostRef = yourArea && yourArea > 0 ? Math.round(yourArea * 12) : 720;
  const heizungUserCost = isHeating && istaForecast ? istaForecast.yourAnnualCost : null;
  const hzMaxBar = Math.max(heizungUserCost ?? 0, heizungCostRef, 1);
  const hzUserPct = heizungUserCost ? Math.min((heizungUserCost / hzMaxBar) * 100, 100) : 0;
  const hzAvgPct = Math.min((heizungCostRef / hzMaxBar) * 100, 100);
  const hzPercentDiff = heizungUserCost
    ? Math.round(((heizungUserCost - heizungCostRef) / heizungCostRef) * 100)
    : 0;
  const hzBarColor = hzPercentDiff > 0 ? 'var(--nexo-nachzahlung-text)' : 'var(--nexo-guthaben-text)';

  // Tab configuration per meter type
  // Heating: Räume, Monatsübersicht (no Tarife — billing is on /abrechnung)
  // Water: Zählerstände, Diagramme, Monatsübersicht (no Tarife — billing is on /abrechnung)
  // Electricity/Gas: Zählerstände, Diagramme, Monatsübersicht, Tarife
  const showTariffs = !isHeating && meter.type !== 'water';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <Link
          href="/meters"
          className="font-heading inline-block"
          style={{
            fontSize: '16px',
            color: 'var(--nexo-cta)',
            fontWeight: 400,
            opacity: 0.7,
            transition: 'opacity 0.2s ease',
            textDecoration: 'none',
          }}
        >
          &larr; Zurück zu Zähler
        </Link>
        <div className="flex items-start justify-between flex-wrap gap-y-3 mt-4">
          <div>
            <div className="flex items-center gap-3">
              <h1
                className="font-heading text-3xl lg:text-5xl"
                style={{
                  lineHeight: '120%',
                  fontWeight: 400,
                  color: 'var(--nexo-text-primary)',
                }}
              >
                {meter.name}
              </h1>
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  backgroundColor: dotColor,
                  flexShrink: 0,
                  marginTop: '8px',
                }}
              />
            </div>
            <p
              className="font-body"
              style={{
                marginTop: '8px',
                fontSize: '16px',
                color: 'var(--nexo-text-secondary)',
              }}
            >
              {meterTypeLabels[meter.type]} &middot; Einheit in {meter.unit}
              {meter.type === 'gas' && meter.unit === 'm3' && (
                <span style={{ marginLeft: 8 }}>(Umrechnungsfaktor: {meter.conversion_factor})</span>
              )}
              {isHeating && (
                <span style={{ marginLeft: 8 }}>({rooms.length} Räume)</span>
              )}
            </p>
            {category?.slug === 'kaltwasser' && (
              <p
                className="font-body"
                style={{
                  marginTop: '6px',
                  fontSize: '13px',
                  color: 'var(--nexo-text-muted)',
                }}
              >
                Zur eigenen Kontrolle — Kosten sind bereits in den Betriebskosten der Abrechnung enthalten.
              </p>
            )}
          </div>
          <MeterActions meter={meter} />
        </div>
      </div>

      {/* Top Section: Forecast + Comparison (non-heating, tariff-based) */}
      {!isHeating && usesTariffForecast && (
        <div className="grid gap-6 md:grid-cols-2 animate-fade-in-up stagger-1 opacity-0">
          {/* LEFT: Nachzahlung/Guthaben card */}
          <div
            className="flex flex-col justify-center"
            style={{
              backgroundColor: statusBg,
              borderRadius: '4px',
              boxShadow: cardShadow,
              padding: '24px',
            }}
          >
            <div className="flex items-center gap-2">
              {isNachzahlung !== null && (
                <ArrowIcon color={statusColor} size={14} up={isNachzahlung} />
              )}
              <p className="font-body" style={{ fontSize: '14px', fontWeight: 500, color: statusColor }}>
                {isNachzahlung === null
                  ? 'Prognose'
                  : isNachzahlung
                    ? 'Erwartete Nachzahlung'
                    : 'Erwartetes Guthaben'}
              </p>
            </div>
            <p
              className="font-heading"
              style={{
                fontSize: '32px',
                lineHeight: '120%',
                fontWeight: 400,
                color: statusColor,
                marginTop: '8px',
              }}
            >
              {yearlyForecast && activeTariff?.abschlag
                ? `~${formatCurrency(yearlyForecast.difference)}`
                : '-'}
            </p>
            <p
              className="font-body"
              style={{ fontSize: '14px', color: statusColor, opacity: 0.8, marginTop: '8px' }}
            >
              {activeTariff?.abschlag
                ? `Abschlag: ${formatCurrency(activeTariff.abschlag)}/Monat`
                : 'Kein Abschlag hinterlegt'}
            </p>

            {yearlyForecast && activeTariff?.abschlag ? (
              <div style={{ marginTop: '16px', borderTop: `1px solid ${isNachzahlung ? 'var(--nexo-nachzahlung-border)' : 'var(--nexo-guthaben-border)'}`, paddingTop: '14px' }}>
                <div className="space-y-2">
                  <div className="flex justify-between gap-3">
                    <span className="font-body" style={{ fontSize: '13px', color: statusColor, opacity: 0.7 }}>Jahreskosten (Prognose)</span>
                    <span className="font-body" style={{ fontSize: '13px', fontWeight: 600, color: statusColor, flexShrink: 0 }}>{formatCurrency(yearlyForecast.projectedYearlyCost)}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="font-body" style={{ fontSize: '13px', color: statusColor, opacity: 0.7 }}>Abschläge ({formatCurrency(activeTariff.abschlag)} × 12)</span>
                    <span className="font-body" style={{ fontSize: '13px', fontWeight: 600, color: statusColor, flexShrink: 0 }}>−{formatCurrency(yearlyForecast.totalAbschlagPaid)}</span>
                  </div>
                  <div style={{ borderTop: `1px dashed ${isNachzahlung ? 'var(--nexo-nachzahlung-border-dashed)' : 'var(--nexo-guthaben-border-dashed)'}`, paddingTop: '6px', marginTop: '4px' }}>
                    <div className="flex justify-between gap-3">
                      <span className="font-body" style={{ fontSize: '13px', fontWeight: 600, color: statusColor }}>
                        {isNachzahlung ? 'Nachzahlung' : 'Guthaben'}
                      </span>
                      <span className="font-body" style={{ fontSize: '13px', fontWeight: 700, color: statusColor, flexShrink: 0 }}>
                        ~{formatCurrency(yearlyForecast.difference)}
                      </span>
                    </div>
                  </div>
                </div>
                {consumption && average.value > 0 && (
                  <p className="font-body" style={{ fontSize: '11px', color: statusColor, opacity: 0.6, marginTop: '10px' }}>
                    Dein Verbrauch: {formatNumber(dailyConsumption)} {meter.unit}/Tag
                    {percentDiffFromAverage !== 0
                      ? ` (${percentDiffFromAverage > 0 ? '+' : ''}${percentDiffFromAverage}% vs. Ø Haushalt)`
                      : ' (im Durchschnitt)'}
                  </p>
                )}
              </div>
            ) : null}
          </div>

          {/* RIGHT: Comparison bars */}
          <div
            className="flex flex-col justify-center space-y-5"
            style={{
              backgroundColor: 'var(--nexo-card-bg)',
              borderRadius: '4px',
              boxShadow: cardShadow,
              padding: '24px',
            }}
          >
            <div>
              <div className="flex items-start justify-between gap-x-3 mb-1.5">
                <span className="font-body" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--nexo-text-primary)', minWidth: 0, flexShrink: 1 }}>
                  Dein Verbrauch
                </span>
                <span className="font-body" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--nexo-text-primary)', flexShrink: 0, whiteSpace: 'nowrap' }}>
                  {consumption
                    ? `${formatNumber(dailyConsumption)} ${meter.unit}/Tag`
                    : '-'}
                  {consumption && percentDiffFromAverage !== 0 && (
                    <span style={{ marginLeft: 8, fontSize: '12px', fontWeight: 500, color: userBarColor }}>
                      {percentDiffFromAverage > 0 ? '+' : ''}{percentDiffFromAverage}%
                    </span>
                  )}
                </span>
              </div>
              <div style={{ width: '100%', height: 6, borderRadius: 999, backgroundColor: 'var(--nexo-progress-track)' }}>
                <div
                  style={{
                    width: `${userPercent}%`,
                    height: '100%',
                    borderRadius: 999,
                    backgroundColor: userBarColor,
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-start justify-between gap-x-3 mb-1.5">
                <span className="font-body" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--nexo-text-muted)', minWidth: 0, flexShrink: 1 }}>
                  {average.label}
                </span>
                <span className="font-body" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--nexo-text-muted)', flexShrink: 0, whiteSpace: 'nowrap' }}>
                  {formatNumber(average.value)} {average.unit}/Tag
                </span>
              </div>
              <div style={{ width: '100%', height: 6, borderRadius: 999, backgroundColor: 'var(--nexo-progress-track)' }}>
                <div
                  style={{
                    width: `${avgPercent}%`,
                    height: '100%',
                    borderRadius: 999,
                    backgroundColor: 'var(--nexo-progress-avg)',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Water billing forecast moved to /abrechnung page */}

      {/* Kaltwasser: Full-width comparison card */}
      {isKaltwasser && (
        <div
          className="animate-fade-in-up stagger-1 opacity-0"
          style={{
            backgroundColor: 'var(--nexo-card-bg)',
            borderRadius: '4px',
            boxShadow: cardShadow,
            padding: '24px',
          }}
        >
          <p className="font-body" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--nexo-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '20px' }}>
            Verbrauch im Vergleich
          </p>
          <div className="space-y-5">
            <div>
              <div className="flex items-start justify-between gap-x-3 mb-1.5">
                <span className="font-body" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--nexo-text-primary)', minWidth: 0, flexShrink: 1 }}>
                  Dein Verbrauch
                </span>
                <span className="font-body" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--nexo-text-primary)', flexShrink: 0, whiteSpace: 'nowrap' }}>
                  {consumption
                    ? `${formatNumber(dailyConsumption)} ${meter.unit}/Tag`
                    : '–'}
                  {consumption && percentDiffFromAverage !== 0 && (
                    <span style={{ marginLeft: 8, fontSize: '12px', fontWeight: 500, color: userBarColor }}>
                      {percentDiffFromAverage > 0 ? '+' : ''}{percentDiffFromAverage}%
                    </span>
                  )}
                </span>
              </div>
              <div style={{ width: '100%', height: 6, borderRadius: 999, backgroundColor: 'var(--nexo-progress-track)' }}>
                <div style={{ width: `${userPercent}%`, height: '100%', borderRadius: 999, backgroundColor: userBarColor, transition: 'width 0.5s ease' }} />
              </div>
            </div>
            <div>
              <div className="flex items-start justify-between gap-x-3 mb-1.5">
                <span className="font-body" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--nexo-text-muted)', minWidth: 0, flexShrink: 1 }}>
                  {average.label}
                </span>
                <span className="font-body" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--nexo-text-muted)', flexShrink: 0, whiteSpace: 'nowrap' }}>
                  {formatNumber(average.value)} {average.unit}/Tag
                </span>
              </div>
              <div style={{ width: '100%', height: 6, borderRadius: 999, backgroundColor: 'var(--nexo-progress-track)' }}>
                <div style={{ width: `${avgPercent}%`, height: '100%', borderRadius: 999, backgroundColor: 'var(--nexo-progress-avg)', transition: 'width 0.5s ease' }} />
              </div>
            </div>
          </div>
          {consumption && (
            <p className="font-body" style={{ fontSize: '12px', color: 'var(--nexo-text-muted)', marginTop: '16px' }}>
              {percentDiffFromAverage === 0
                ? 'Dein Kaltwasserverbrauch liegt im Durchschnitt.'
                : percentDiffFromAverage > 0
                  ? `Du verbrauchst ${percentDiffFromAverage}% mehr als ein durchschnittlicher 3-Personen-Haushalt.`
                  : `Du verbrauchst ${Math.abs(percentDiffFromAverage)}% weniger als ein durchschnittlicher 3-Personen-Haushalt.`}
            </p>
          )}
        </div>
      )}

      {/* Statistics Cards Row (tariff-based meters only) */}
      {usesTariffForecast && !isHeating && (
        <div className="grid gap-4 md:grid-cols-3">
          <div
            className="nexo-card animate-fade-in-up stagger-2 opacity-0"
            style={{ backgroundColor: 'var(--nexo-card-bg)', borderRadius: '4px', boxShadow: cardShadow, padding: '24px' }}
          >
            <p className="font-body" style={{ fontSize: '14px', color: 'var(--nexo-text-secondary)' }}>Tagesverbrauch (Ø)</p>
            <p className="font-heading" style={{ fontSize: '24px', fontWeight: 400, color: 'var(--nexo-text-primary)', marginTop: '4px' }}>
              {consumption ? formatNumber(consumption.dailyAverage) : '-'} {meter.unit}
            </p>
            <p className="font-body" style={{ fontSize: '12px', color: 'var(--nexo-text-muted)', marginTop: '8px' }}>
              {consumption ? `Basierend auf ${consumption.days} Tagen` : 'Nicht genug Daten'}
            </p>
          </div>

          <div
            className="nexo-card animate-fade-in-up stagger-3 opacity-0"
            style={{ backgroundColor: 'var(--nexo-card-bg)', borderRadius: '4px', boxShadow: cardShadow, padding: '24px' }}
          >
            <p className="font-body" style={{ fontSize: '14px', color: 'var(--nexo-text-secondary)' }}>Monatskosten (geschätzt)</p>
            <p className="font-heading" style={{ fontSize: '24px', fontWeight: 400, color: 'var(--nexo-text-primary)', marginTop: '4px' }}>
              {monthlyForecast ? formatCurrency(monthlyForecast.estimatedCost) : '-'}
            </p>
            <p className="font-body" style={{ fontSize: '12px', color: 'var(--nexo-text-muted)', marginTop: '8px' }}>
              {monthlyForecast
                ? `${formatNumber(monthlyForecast.estimatedConsumption)} ${meter.unit}`
                : activeTariff ? 'Nicht genug Daten' : 'Kein Tarif hinterlegt'}
            </p>
          </div>

          <div
            className="nexo-card animate-fade-in-up stagger-4 opacity-0"
            style={{ backgroundColor: 'var(--nexo-card-bg)', borderRadius: '4px', boxShadow: cardShadow, padding: '24px' }}
          >
            <p className="font-body" style={{ fontSize: '14px', color: 'var(--nexo-text-secondary)' }}>Jahreskosten (Prognose)</p>
            <p className="font-heading" style={{ fontSize: '24px', fontWeight: 400, color: 'var(--nexo-text-primary)', marginTop: '4px' }}>
              {yearlyForecast ? formatCurrency(yearlyForecast.projectedYearlyCost) : '-'}
            </p>
            <p className="font-body" style={{ fontSize: '12px', color: 'var(--nexo-text-muted)', marginTop: '8px' }}>
              {yearlyForecast
                ? `${formatCurrency(yearlyForecast.minCost)} – ${formatCurrency(yearlyForecast.maxCost)}`
                : 'Nicht genug Daten'}
            </p>
          </div>
        </div>
      )}

      {/* Kaltwasser: Consumption stats (m³, no costs) */}
      {isKaltwasser && (
        <div className="grid gap-4 md:grid-cols-3">
          <div
            className="nexo-card animate-fade-in-up stagger-2 opacity-0"
            style={{ backgroundColor: 'var(--nexo-card-bg)', borderRadius: '4px', boxShadow: cardShadow, padding: '24px' }}
          >
            <p className="font-body" style={{ fontSize: '14px', color: 'var(--nexo-text-secondary)' }}>Tagesverbrauch (Ø)</p>
            <p className="font-heading" style={{ fontSize: '24px', fontWeight: 400, color: 'var(--nexo-text-primary)', marginTop: '4px' }}>
              {consumption ? formatNumber(consumption.dailyAverage) : '–'} {meter.unit}
            </p>
            <p className="font-body" style={{ fontSize: '12px', color: 'var(--nexo-text-muted)', marginTop: '8px' }}>
              {consumption ? `Basierend auf ${consumption.days} Tagen` : 'Nicht genug Daten'}
            </p>
          </div>

          <div
            className="nexo-card animate-fade-in-up stagger-3 opacity-0"
            style={{ backgroundColor: 'var(--nexo-card-bg)', borderRadius: '4px', boxShadow: cardShadow, padding: '24px' }}
          >
            <p className="font-body" style={{ fontSize: '14px', color: 'var(--nexo-text-secondary)' }}>Monatsverbrauch (geschätzt)</p>
            <p className="font-heading" style={{ fontSize: '24px', fontWeight: 400, color: 'var(--nexo-text-primary)', marginTop: '4px' }}>
              {consumption ? formatNumber(Math.round(consumption.dailyAverage * 30 * 100) / 100) : '–'} {meter.unit}
            </p>
            <p className="font-body" style={{ fontSize: '12px', color: 'var(--nexo-text-muted)', marginTop: '8px' }}>
              Hochrechnung auf 30 Tage
            </p>
          </div>

          <div
            className="nexo-card animate-fade-in-up stagger-4 opacity-0"
            style={{ backgroundColor: 'var(--nexo-card-bg)', borderRadius: '4px', boxShadow: cardShadow, padding: '24px' }}
          >
            <p className="font-body" style={{ fontSize: '14px', color: 'var(--nexo-text-secondary)' }}>Jahresverbrauch (geschätzt)</p>
            <p className="font-heading" style={{ fontSize: '24px', fontWeight: 400, color: 'var(--nexo-text-primary)', marginTop: '4px' }}>
              {consumption ? formatNumber(Math.round(consumption.dailyAverage * 365 * 10) / 10) : '–'} {meter.unit}
            </p>
            <p className="font-body" style={{ fontSize: '12px', color: 'var(--nexo-text-muted)', marginTop: '8px' }}>
              Hochrechnung auf 365 Tage
            </p>
          </div>
        </div>
      )}

      {/* Ista-based forecast for Heizung and Warmwasser */}
      {showIstaTab && (
        <div className="grid gap-6 md:grid-cols-2 animate-fade-in-up stagger-1 opacity-0">
          {/* LEFT: Ista forecast card */}
          {istaForecast ? (
            <div
              className="flex flex-col justify-center"
              style={{
                backgroundColor: 'var(--nexo-card-bg)',
                borderRadius: '4px',
                boxShadow: cardShadow,
                padding: '24px',
              }}
            >
              <p className="font-body" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--nexo-text-secondary)' }}>
                {category?.slug === 'heizung' ? 'Dein Kostenanteil (Heizung)' : 'Dein Kostenanteil (Warmwasser)'}
              </p>
              <p
                className="font-heading"
                style={{
                  fontSize: '32px',
                  lineHeight: '120%',
                  fontWeight: 400,
                  color: categoryColor,
                  marginTop: '8px',
                }}
              >
                ~{formatCurrency(istaForecast.yourAnnualCost)}
              </p>
              <p className="font-body" style={{ fontSize: '14px', color: 'var(--nexo-text-muted)', marginTop: '8px' }}>
                Fließt in die Nebenkostenabrechnung ein
              </p>

              <div style={{ marginTop: '16px', borderTop: '1px solid var(--nexo-border)', paddingTop: '14px' }}>
                <div className="space-y-2">
                  <div className="flex justify-between gap-3">
                    <span className="font-body" style={{ fontSize: '13px', color: 'var(--nexo-text-muted)' }}>
                      Grundkosten ({istaForecast.grundkostenPercent}% nach Fläche)
                    </span>
                    <span className="font-body" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--nexo-text-primary)', flexShrink: 0 }}>
                      {formatCurrency(istaForecast.grundkosten)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="font-body" style={{ fontSize: '13px', color: 'var(--nexo-text-muted)' }}>
                      Verbrauchskosten ({istaForecast.verbrauchskostenPercent}% nach {category?.slug === 'heizung' ? 'HKV' : 'm³'})
                    </span>
                    <span className="font-body" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--nexo-text-primary)', flexShrink: 0 }}>
                      {formatCurrency(istaForecast.verbrauchskosten)}
                    </span>
                  </div>
                  <div style={{ borderTop: '1px dashed var(--nexo-border)', paddingTop: '6px', marginTop: '4px' }}>
                    <div className="flex justify-between gap-3">
                      <span className="font-body" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--nexo-text-primary)' }}>Jahreskosten</span>
                      <span className="font-body" style={{ fontSize: '13px', fontWeight: 700, color: categoryColor, flexShrink: 0 }}>
                        ~{formatCurrency(istaForecast.yourAnnualCost)}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="font-body" style={{ fontSize: '11px', color: 'var(--nexo-text-muted)', marginTop: '10px' }}>
                  Flächenanteil: {Math.round(istaForecast.areaRatio * 100 * 10) / 10}% · Verbrauchsanteil: {Math.round(istaForecast.unitsRatio * 100 * 10) / 10}%
                </p>
                <p className="font-body" style={{ fontSize: '11px', color: 'var(--nexo-text-muted)', opacity: 0.6, marginTop: '4px' }}>
                  ca. 85–90% Prognosegenauigkeit · Gebäudekosten aus Vorjahr
                </p>
              </div>
            </div>
          ) : (
            <a
              href="/abrechnung"
              className="flex flex-col items-center justify-center text-center no-underline"
              style={{
                backgroundColor: 'var(--nexo-card-bg)',
                borderRadius: '4px',
                boxShadow: cardShadow,
                padding: '24px',
                border: '1px dashed var(--nexo-border)',
                minHeight: 150,
              }}
            >
              <p className="font-heading" style={{ fontSize: '18px', fontWeight: 400, color: 'var(--nexo-text-primary)' }}>
                {category?.slug === 'heizung' ? 'Dein Kostenanteil (Heizung)' : 'Dein Kostenanteil (Warmwasser)'}
              </p>
              <p className="font-body" style={{ fontSize: '13px', color: 'var(--nexo-text-muted)', marginTop: '4px' }}>
                Abrechnungsdaten ausfüllen, um die Prognose zu sehen
              </p>
              <span className="font-body" style={{ fontSize: '12px', color: 'var(--nexo-cta)', marginTop: '8px', fontWeight: 500 }}>
                Abrechnung einrichten →
              </span>
            </a>
          )}

          {/* RIGHT: Stats */}
          <div
            className="flex flex-col justify-center space-y-4"
            style={{
              backgroundColor: 'var(--nexo-card-bg)',
              borderRadius: '4px',
              boxShadow: cardShadow,
              padding: '24px',
            }}
          >
            {/* Heizung: Räume + ista count side by side */}
            {isHeating && (
              <div className="flex gap-6">
                <div>
                  <p className="font-body" style={{ fontSize: '13px', color: 'var(--nexo-text-secondary)' }}>Räume</p>
                  <p className="font-heading" style={{ fontSize: '28px', fontWeight: 400, color: 'var(--nexo-text-primary)', marginTop: '2px' }}>
                    {rooms.length}
                  </p>
                  <p className="font-body" style={{ fontSize: '11px', color: 'var(--nexo-text-muted)', marginTop: '2px' }}>
                    {rooms.reduce((sum, r) => sum + r.radiators.length, 0)} Heizkörper
                  </p>
                </div>
                <div>
                  <p className="font-body" style={{ fontSize: '13px', color: 'var(--nexo-text-secondary)' }}>Monatsdaten</p>
                  <p className="font-heading" style={{ fontSize: '28px', fontWeight: 400, color: 'var(--nexo-text-primary)', marginTop: '2px' }}>
                    {istaData.length}
                  </p>
                  <p className="font-body" style={{ fontSize: '11px', color: 'var(--nexo-text-muted)', marginTop: '2px' }}>
                    Monatseinträge
                  </p>
                </div>
              </div>
            )}

            {/* Warmwasser: ista count */}
            {!isHeating && showIstaTab && (
              <div>
                <p className="font-body" style={{ fontSize: '13px', color: 'var(--nexo-text-secondary)' }}>Monatsdaten</p>
                <p className="font-heading" style={{ fontSize: '28px', fontWeight: 400, color: 'var(--nexo-text-primary)', marginTop: '2px' }}>
                  {istaData.length}
                </p>
                <p className="font-body" style={{ fontSize: '11px', color: 'var(--nexo-text-muted)', marginTop: '2px' }}>
                  Monatseinträge erfasst
                </p>
              </div>
            )}

            {/* Heizung: cost comparison bars */}
            {heizungUserCost !== null && (
              <>
                <div>
                  <div className="flex items-start justify-between gap-x-3 mb-1.5">
                    <span className="font-body" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--nexo-text-primary)', minWidth: 0, flexShrink: 1 }}>
                      Deine Heizkosten
                    </span>
                    <span className="font-body" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--nexo-text-primary)', flexShrink: 0, whiteSpace: 'nowrap' }}>
                      {formatCurrency(heizungUserCost)}/Jahr
                      {hzPercentDiff !== 0 && (
                        <span style={{ marginLeft: 8, fontSize: '12px', fontWeight: 500, color: hzBarColor }}>
                          {hzPercentDiff > 0 ? '+' : ''}{hzPercentDiff}%
                        </span>
                      )}
                    </span>
                  </div>
                  <div style={{ width: '100%', height: 6, borderRadius: 999, backgroundColor: 'var(--nexo-progress-track)' }}>
                    <div style={{ width: `${hzUserPct}%`, height: '100%', borderRadius: 999, backgroundColor: hzBarColor, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-start justify-between gap-x-3 mb-1.5">
                    <span className="font-body" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--nexo-text-muted)', minWidth: 0, flexShrink: 1 }}>
                      {yourArea ? `Ø für ${yourArea} m²` : 'Durchschnitt Haushalt 3 Personen'}
                    </span>
                    <span className="font-body" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--nexo-text-muted)', flexShrink: 0, whiteSpace: 'nowrap' }}>
                      {heizungCostRef} €/Jahr
                    </span>
                  </div>
                  <div style={{ width: '100%', height: 6, borderRadius: 999, backgroundColor: 'var(--nexo-progress-track)' }}>
                    <div style={{ width: `${hzAvgPct}%`, height: '100%', borderRadius: 999, backgroundColor: 'var(--nexo-progress-avg)', transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              </>
            )}

            {/* Warmwasser: daily avg comparison bars */}
            {istaWarmwasserDaily !== null && (
              <>
                <div>
                  <div className="flex items-start justify-between gap-x-3 mb-1.5">
                    <span className="font-body" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--nexo-text-primary)', minWidth: 0, flexShrink: 1 }}>
                      Dein Verbrauch
                    </span>
                    <span className="font-body" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--nexo-text-primary)', flexShrink: 0, whiteSpace: 'nowrap' }}>
                      {formatNumber(istaWarmwasserDaily)} m³/Tag
                      {wwPercentDiff !== 0 && (
                        <span style={{ marginLeft: 8, fontSize: '12px', fontWeight: 500, color: wwBarColor }}>
                          {wwPercentDiff > 0 ? '+' : ''}{wwPercentDiff}%
                        </span>
                      )}
                    </span>
                  </div>
                  <div style={{ width: '100%', height: 6, borderRadius: 999, backgroundColor: 'var(--nexo-progress-track)' }}>
                    <div style={{ width: `${wwUserPct}%`, height: '100%', borderRadius: 999, backgroundColor: wwBarColor, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-start justify-between gap-x-3 mb-1.5">
                    <span className="font-body" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--nexo-text-muted)', minWidth: 0, flexShrink: 1 }}>
                      Durchschnitt Haushalt 3 Personen
                    </span>
                    <span className="font-body" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--nexo-text-muted)', flexShrink: 0, whiteSpace: 'nowrap' }}>
                      0,13 m³/Tag
                    </span>
                  </div>
                  <div style={{ width: '100%', height: 6, borderRadius: 999, backgroundColor: 'var(--nexo-progress-track)' }}>
                    <div style={{ width: `${wwAvgPct}%`, height: '100%', borderRadius: 999, backgroundColor: 'var(--nexo-progress-avg)', transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              </>
            )}

            {!isHeating && consumption && (
              <div>
                <p className="font-body" style={{ fontSize: '14px', color: 'var(--nexo-text-secondary)' }}>Tagesverbrauch (Ø)</p>
                <p className="font-heading" style={{ fontSize: '24px', fontWeight: 400, color: 'var(--nexo-text-primary)', marginTop: '4px' }}>
                  {formatNumber(consumption.dailyAverage)} {meter.unit}
                </p>
                <p className="font-body" style={{ fontSize: '12px', color: 'var(--nexo-text-muted)', marginTop: '4px' }}>
                  Basierend auf {consumption.days} Tagen
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Heizung cost explanation card — only for Heizung when ista forecast has ratio data */}
      {isHeating && istaForecast && istaForecast.areaRatio > 0 && (
        <div
          className="animate-fade-in-up stagger-2 opacity-0"
          style={{
            backgroundColor: 'var(--nexo-card-bg)',
            borderRadius: '4px',
            boxShadow: cardShadow,
            padding: '24px',
          }}
        >
          <HeizkostenErklaerung heizung={istaForecast} warmwasser={null} />
        </div>
      )}

      {/* Tabs */}
      <div className="animate-fade-in-up stagger-5 opacity-0">
        <Tabs defaultValue={isHeating ? 'rooms' : 'readings'} className="space-y-4">
          <div className="overflow-x-auto w-full pb-1">
          <TabsList variant="line" className="min-w-max">
            {isHeating ? (
              <>
                <TabsTrigger value="rooms">Räume &amp; Heizkörper</TabsTrigger>
                {showIstaTab && <TabsTrigger value="ista">Monatsdaten</TabsTrigger>}
                <TabsTrigger value="monthly">Monatsübersicht</TabsTrigger>
              </>
            ) : (
              <>
                <TabsTrigger value="readings">Zählerstände</TabsTrigger>
                {showIstaTab && <TabsTrigger value="ista">Monatsdaten</TabsTrigger>}
                <TabsTrigger value="charts">Diagramme</TabsTrigger>
                {!showIstaTab && !isKaltwasser && <TabsTrigger value="monthly">Monatsübersicht</TabsTrigger>}
              </>
            )}
            {showTariffs && <TabsTrigger value="tariffs">Tarife</TabsTrigger>}
          </TabsList>
          </div>

          {isHeating ? (
            <>
              <TabsContent value="rooms" className="space-y-4">
                {rooms.length === 0 && istaData.length > 0 && (
                  <p style={{ fontSize: '13px', color: 'var(--nexo-text-muted)', padding: '12px 16px', backgroundColor: 'var(--nexo-card-bg)', borderRadius: '4px', border: '1px solid var(--nexo-border)', boxShadow: 'var(--nexo-card-shadow)' }}>
                    ℹ Heizkörper-Ablesungen sind optional — Monatsdaten werden für die Prognose verwendet
                  </p>
                )}
                <HeatingManager meterId={meter.id} rooms={rooms} />
              </TabsContent>

              <TabsContent value="monthly" className="space-y-4">
                <HeatingMonthlyOverview rooms={rooms} />
              </TabsContent>
            </>
          ) : (
            <>
              <TabsContent value="readings" className="space-y-4">
                {showIstaTab && istaData.length > 0 && (
                  <p style={{ fontSize: '13px', color: 'var(--nexo-text-muted)', padding: '12px 16px', backgroundColor: 'var(--nexo-card-bg)', borderRadius: '4px', border: '1px solid var(--nexo-border)', boxShadow: 'var(--nexo-card-shadow)' }}>
                    ℹ Zählerstand-Ablesungen sind optional — Monatsdaten werden für die Prognose verwendet
                  </p>
                )}
                <Card style={{ borderRadius: '4px' }}>
                  <CardHeader>
                    <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 400 }}>Neuen Zählerstand erfassen</CardTitle>
                    <CardDescription className="font-body">
                      Geben Sie den aktuellen Zählerstand ein
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ReadingForm meterId={meter.id} unit={meter.unit} />
                  </CardContent>
                </Card>

                <Card style={{ borderRadius: '4px' }}>
                  <CardHeader>
                    <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 400 }}>Verlauf</CardTitle>
                    <CardDescription className="font-body">
                      Alle erfassten Zählerstände
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ReadingsList readings={meter.readings} meterId={meter.id} unit={meter.unit} />
                  </CardContent>
                </Card>
              </TabsContent>

              {!showIstaTab && !isKaltwasser && (
                <TabsContent value="monthly" className="space-y-4">
                  <MonthlyOverview
                    readings={meter.readings}
                    tariff={activeTariff}
                    unit={meter.unit}
                  />
                </TabsContent>
              )}

              <TabsContent value="charts" className="space-y-4">
                {showIstaTab && category ? (
                  <IstaConsumptionChart
                    data={istaData}
                    categorySlug={category.slug}
                  />
                ) : (
                  <>
                    {!isKaltwasser && (
                      <MonthlyCostChart
                        readings={meter.readings}
                        tariff={activeTariff}
                        unit={meter.unit}
                        meterType={meter.type}
                      />
                    )}
                    <ConsumptionChart
                      readings={meter.readings}
                      unit={meter.unit}
                      meterType={meter.type}
                    />
                  </>
                )}
              </TabsContent>
            </>
          )}

          {showIstaTab && category && (
            <TabsContent value="ista" className="space-y-4">
              {istaTrend && (
                <div className="font-body" style={{
                  padding: '10px 14px',
                  backgroundColor: 'var(--nexo-card-bg)',
                  borderRadius: '4px',
                  boxShadow: 'var(--nexo-card-shadow)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <span style={{ fontSize: '16px' }}>
                    {Math.abs(istaTrend.changePct) < 3 ? '➡' : istaTrend.changePct > 0 ? '↑' : '↓'}
                  </span>
                  <span style={{
                    fontSize: '13px',
                    color: Math.abs(istaTrend.changePct) < 3
                      ? 'var(--nexo-text-muted)'
                      : istaTrend.changePct > 0
                        ? 'var(--nexo-nachzahlung-text)'
                        : 'var(--nexo-guthaben-text)',
                    fontWeight: 500,
                  }}>
                    {Math.abs(istaTrend.changePct) < 3
                      ? `Verbrauch stabil gegenüber ${istaTrend.prevMonth}`
                      : istaTrend.changePct > 0
                        ? `${istaTrend.curMonth}: ${istaTrend.changePct}% mehr als ${istaTrend.prevMonth}`
                        : `${istaTrend.curMonth}: ${Math.abs(istaTrend.changePct)}% weniger als ${istaTrend.prevMonth}${Math.abs(istaTrend.changePct) >= 5 ? ' · Gut!' : ''}`}
                  </span>
                </div>
              )}
              {/* Plus feature: Heizkostenrechner — savings simulator */}
              {istaForecast && istaForecast.verbrauchskosten > 0 && (
                <div style={{ position: 'relative' }}>
                  <div style={{
                    backgroundColor: 'var(--nexo-card-bg)',
                    borderRadius: '4px',
                    boxShadow: 'var(--nexo-card-shadow)',
                    padding: '16px 20px',
                    filter: isPlus ? 'none' : 'blur(5px)',
                    userSelect: isPlus ? 'auto' : 'none',
                    pointerEvents: isPlus ? 'auto' : 'none',
                  }}>
                    <p className="font-heading" style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 400, color: 'var(--nexo-text-primary)' }}>
                      {category?.slug === 'warmwasser' ? 'Was spare ich beim Warmwasserverbrauch?' : 'Was spare ich wenn ich weniger heize?'}
                    </p>
                    <HeizkostenRechner verbrauchskosten={istaForecast.verbrauchskosten} categorySlug={category?.slug} />
                  </div>
                  {!isPlus && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <span className="font-body" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--nexo-text-primary)' }}>🔒 Wie viel kannst du sparen?</span>
                      <a href="/settings?tab=abonnement" className="font-body" style={{ fontSize: '12px', color: 'var(--nexo-cta)', textDecoration: 'none', fontWeight: 500 }}>
                        Abo aktivieren →
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Plus feature: Monthly cost estimates */}
              {monthlyKosten.length >= 2 && (() => {
                const recent = monthlyKosten.slice(-12);
                const maxCost = Math.max(...recent.map(m => m.estimatedCost), 0.01);
                const n = recent.length;
                const chartH = 38;
                const pts: [number, number][] = recent.map((m, i) => [
                  (i + 0.5) * (100 / n),
                  chartH - (m.estimatedCost / maxCost) * (chartH - 3),
                ]);
                const linePath = smoothCurve(pts);
                const areaPath = smoothAreaCurve(pts, chartH);
                const fmtEur = (v: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);
                return (
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      backgroundColor: 'var(--nexo-card-bg)',
                      borderRadius: '4px',
                      boxShadow: 'var(--nexo-card-shadow)',
                      padding: '16px 20px',
                      filter: isPlus ? 'none' : 'blur(5px)',
                      userSelect: isPlus ? 'auto' : 'none',
                      pointerEvents: isPlus ? 'auto' : 'none',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                        <p className="font-heading" style={{ margin: 0, fontSize: '15px', fontWeight: 400, color: 'var(--nexo-text-primary)' }}>
                          Geschätzte Kosten pro Monat
                        </p>
                        <span className="font-body" style={{ fontSize: '11px', color: 'var(--nexo-text-muted)' }}>
                          max. {fmtEur(maxCost)}
                        </span>
                      </div>
                      <svg viewBox={`0 0 100 ${chartH}`} preserveAspectRatio="none"
                        style={{ width: '100%', height: 52, display: 'block' }}>
                        <defs>
                          <linearGradient id="monthly-sparkline-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: categoryColor, stopOpacity: 0.22 }} />
                            <stop offset="100%" style={{ stopColor: categoryColor, stopOpacity: 0.02 }} />
                          </linearGradient>
                        </defs>
                        <line x1={0} y1={chartH} x2={100} y2={chartH} stroke="var(--nexo-border)" strokeWidth={0.4} />
                        <path d={areaPath} fill="url(#monthly-sparkline-grad)" />
                        <path d={linePath} fill="none" stroke={categoryColor} strokeWidth={1.5}
                          strokeLinejoin="round" strokeLinecap="round" strokeOpacity={0.8} />
                      </svg>
                      <div style={{ display: 'flex', marginTop: 4 }}>
                        {recent.map(m => (
                          <span key={m.month} className="font-body" style={{ flex: 1, textAlign: 'center', fontSize: '10px', color: 'var(--nexo-text-muted)' }}>
                            {m.label.slice(0, 3)}
                          </span>
                        ))}
                      </div>
                      <p className="font-body" style={{ margin: '10px 0 0', fontSize: '10px', color: 'var(--nexo-text-muted)', lineHeight: 1.4 }}>
                        Schätzung basierend auf deinen Monatsdaten und den Gesamtheizkosten.
                      </p>
                    </div>
                    {!isPlus && (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <span className="font-body" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--nexo-text-primary)' }}>🔒 Was hat dich jeder Monat gekostet?</span>
                        <a href="/upgrade" className="font-body" style={{ fontSize: '12px', color: 'var(--nexo-cta)', textDecoration: 'none', fontWeight: 500 }}>
                          Mit nexoen freischalten →
                        </a>
                      </div>
                    )}
                  </div>
                );
              })()}

              <IstaPeriodSummary
                data={istaData}
                categorySlug={category.slug}
                abrechnungSetup={abrechnungSetup}
              />
              <IstaConsumptionForm
                categoryId={category.id}
                categorySlug={category.slug}
              />
              <IstaConsumptionList
                data={istaData}
                categorySlug={category.slug}
              />
            </TabsContent>
          )}

          {showTariffs && (
            <TabsContent value="tariffs" className="space-y-4">
              <Card style={{ borderRadius: '4px' }}>
                <CardHeader>
                  <CardTitle>Neuen Tarif anlegen</CardTitle>
                  <CardDescription>
                    Hinterlegen Sie Ihre Tarifkonditionen
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TariffForm meterId={meter.id} meterType={meter.type} meterUnit={meter.unit} />
                </CardContent>
              </Card>

              <Card style={{ borderRadius: '4px' }}>
                <CardHeader>
                  <CardTitle>Tarifhistorie</CardTitle>
                  <CardDescription>
                    Alle hinterlegten Tarife
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TariffsList tariffs={meter.tariffs} meterId={meter.id} meterUnit={meter.unit} />
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
