import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getMetersForReports, MeterReportData, getMetersByCategory } from '@/lib/actions/meters';
import { getUserCategories } from '@/lib/actions/categories';
import { getHeatingBillingSetup } from '@/lib/actions/heating-billing';
import { getAbrechnungSetup } from '@/lib/actions/abrechnung';
import { getIstaConsumptionByCategory } from '@/lib/actions/ista-consumption';
import { getRoomsWithRadiators } from '@/lib/actions/heating';
import { getReadings } from '@/lib/actions/readings';
import { calculateCombinedForecast } from '@/lib/calculations/heating-forecast';
import { CombinedForecastResult, SubscriptionTier } from '@/types/database';
import { getEffectiveTier, hasAccess } from '@/lib/config/tiers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatNumber } from '@/lib/calculations/costs';
import { ReportActions } from './report-actions';

const cardShadow = 'var(--nexo-card-shadow)';

export default async function ReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profileData } = await supabase
    .from('profiles')
    .select('subscription_tier, trial_ends_at')
    .eq('id', user.id)
    .single() as { data: { subscription_tier: SubscriptionTier; trial_ends_at: string | null } | null };

  const subscriptionTier = getEffectiveTier(
    profileData?.subscription_tier ?? 'expired',
    profileData?.trial_ends_at ?? null
  );

  // --- Fetch all independent data in parallel ---
  const [allMeters, categories, { data: meterRows }] = await Promise.all([
    getMetersForReports(),
    getUserCategories(),
    supabase.from('meters').select('id, category_id').eq('user_id', user.id),
  ]);

  const heizungCat = categories.find(c => c.slug === 'heizung');
  const warmwasserCat = categories.find(c => c.slug === 'warmwasser');

  const predefinedCategoryIds = new Set(
    categories.filter(c => c.is_predefined).map(c => c.id)
  );

  // Fetch predefined meter IDs to filter them out of the tariff list
  const predefinedMeterIds = new Set<string>();

  if (meterRows) {
    for (const row of meterRows) {
      if (row.category_id && predefinedCategoryIds.has(row.category_id)) {
        predefinedMeterIds.add(row.id);
      }
    }
  }

  // Filter: tariff meters = non-predefined only
  const meters = allMeters.filter(m => !predefinedMeterIds.has(m.id));

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

  // Calculate combined Nebenkosten forecast
  const hasAbrechnungData = !!(heizungSetup || warmwasserSetup) && !!abrechnungSetup;
  let combinedForecast: CombinedForecastResult | null = null;

  let currentPeriodStart: string | undefined;
  if (abrechnungSetup?.abrechnungszeitraum_start) {
    currentPeriodStart = abrechnungSetup.abrechnungszeitraum_start;
  }

  if (hasAbrechnungData && abrechnungSetup) {
    combinedForecast = calculateCombinedForecast(
      heizungSetup,
      warmwasserSetup,
      {
        kalte_betriebskosten_year: abrechnungSetup.kalte_betriebskosten_year,
        ista_nebenkosten_year: abrechnungSetup.ista_nebenkosten_year ?? 0,
        vorauszahlung_monthly: abrechnungSetup.vorauszahlung_monthly,
      },
      heizungRooms,
      warmwasserReadings,
      heizungIstaData,
      warmwasserIstaData,
      currentPeriodStart,
    );
  }

  // --- Tariff totals (Strom/Gas only) ---
  const tariffYearly = meters.reduce((sum, m) => sum + m.yearlyEstimate, 0);
  const tariffAbschlag = meters.reduce((sum, m) => sum + ((m.tariff?.abschlag || 0) * 12), 0);
  const tariffDifference = tariffYearly - tariffAbschlag;

  // --- Nebenkosten totals ---
  const nebenkostenYearly = combinedForecast?.totalProjected ?? 0;
  const nebenkostenVorauszahlungen = combinedForecast?.annualVorauszahlungen ?? 0;

  // --- Grand totals ---
  const totalYearly = tariffYearly + nebenkostenYearly;
  const totalPrepaid = tariffAbschlag + nebenkostenVorauszahlungen;
  const totalDifference = totalYearly - totalPrepaid;
  const isNachzahlung = totalDifference > 0;

  const hasAnyData = meters.length > 0 || combinedForecast;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between flex-wrap gap-y-4 animate-fade-in-up">
        <div>
          <h1
            className="font-heading text-3xl lg:text-5xl"
            style={{
              lineHeight: '120%',
              fontWeight: 400,
              color: 'var(--nexo-text-primary)',
            }}
          >
            Berichte
          </h1>
          <p
            className="font-body text-base lg:text-xl"
            style={{
              marginTop: '12px',
              lineHeight: '140%',
              color: 'var(--nexo-text-secondary)',
            }}
          >
            Erstellen Sie PDF-Berichte Ihrer Energiedaten
          </p>
        </div>
        <ReportActions meters={meters} combinedForecast={combinedForecast} subscriptionTier={subscriptionTier} />
      </div>

      {!hasAnyData ? (
        <Card style={{ borderRadius: '4px', boxShadow: cardShadow }}>
          <CardContent className="py-12 text-center">
            <p style={{ color: 'var(--nexo-text-secondary)' }}>
              Keine Zähler vorhanden. Fügen Sie erst Zähler und Zählerstände hinzu.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Tariff meters (Strom/Gas) */}
          {meters.length > 0 && (
            <Card style={{ borderRadius: '4px', boxShadow: cardShadow }} className="animate-fade-in-up stagger-1">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 400, color: 'var(--nexo-text-primary)' }}>Strom & Gas</CardTitle>
                <CardDescription className="font-body">
                  Tarifbasierte Verbrauchsprognosen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {meters.map((meter) => (
                    <div key={meter.id} className="border-b pb-4 last:border-0">
                      <h3 className="font-body font-medium text-lg" style={{ color: 'var(--nexo-text-primary)' }}>
                        {meter.name}
                        <span className="ml-2 text-sm font-normal" style={{ color: 'var(--nexo-text-secondary)' }}>
                          ({meter.type === 'electricity' ? 'Strom' : meter.type === 'gas' ? 'Gas' : meter.type === 'water' ? 'Wasser' : 'Heizung'})
                        </span>
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                        <div>
                          <p className="font-body text-sm" style={{ color: 'var(--nexo-text-secondary)' }}>Tagesverbrauch</p>
                          <p className="font-body font-medium" style={{ color: 'var(--nexo-text-primary)' }}>{formatNumber(meter.dailyAverage)} {meter.unit}</p>
                        </div>
                        <div>
                          <p className="font-body text-sm" style={{ color: 'var(--nexo-text-secondary)' }}>Monatskosten</p>
                          <p className="font-body font-medium" style={{ color: 'var(--nexo-text-primary)' }}>{formatCurrency(meter.monthlyEstimate)}</p>
                        </div>
                        <div>
                          <p className="font-body text-sm" style={{ color: 'var(--nexo-text-secondary)' }}>Jahreskosten</p>
                          <p className="font-body font-medium" style={{ color: 'var(--nexo-text-primary)' }}>{formatCurrency(meter.yearlyEstimate)}</p>
                        </div>
                        <div>
                          <p className="font-body text-sm" style={{ color: 'var(--nexo-text-secondary)' }}>Zählerstände</p>
                          <p className="font-body font-medium" style={{ color: 'var(--nexo-text-primary)' }}>{meter.readings.length} Einträge</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Nebenkosten (ista) section */}
          {combinedForecast && (
            <Card style={{ borderRadius: '4px', boxShadow: cardShadow }} className="animate-fade-in-up stagger-2">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 400, color: 'var(--nexo-text-primary)' }}>Nebenkosten</CardTitle>
                <CardDescription className="font-body">
                  Heizung, Warmwasser & Betriebskosten (Heizkostenabrechnung)
                </CardDescription>
                <p style={{ fontSize: '11px', color: 'var(--nexo-text-muted)', marginTop: '2px' }}>
                  Prognosegenauigkeit: ca. {combinedForecast.confidence.accuracyPct}% — basierend auf{' '}
                  {Math.min(Math.floor(combinedForecast.confidence.monthsElapsed), 12)}/12 Monaten Daten
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Heizung */}
                  {combinedForecast.heizung && (
                    <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--nexo-border)' }}>
                      <div className="flex items-center gap-3">
                        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#E6A65C' }} />
                        <span style={{ color: 'var(--nexo-text-primary)' }}>Heizung</span>
                      </div>
                      <span className="font-medium" style={{ color: 'var(--nexo-text-primary)' }}>
                        {formatCurrency(combinedForecast.heizung.yourAnnualCost)}
                      </span>
                    </div>
                  )}

                  {/* Warmwasser */}
                  {combinedForecast.warmwasser && (
                    <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--nexo-border)' }}>
                      <div className="flex items-center gap-3">
                        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#2FAE8E' }} />
                        <span style={{ color: 'var(--nexo-text-primary)' }}>Warmwasser</span>
                      </div>
                      <span className="font-medium" style={{ color: 'var(--nexo-text-primary)' }}>
                        {formatCurrency(combinedForecast.warmwasser.yourAnnualCost)}
                      </span>
                    </div>
                  )}

                  {/* ista Nebenkosten */}
                  {combinedForecast.istaNebenkostenYear > 0 && (
                    <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--nexo-border)' }}>
                      <div className="flex items-center gap-3">
                        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#C084FC' }} />
                        <span style={{ color: 'var(--nexo-text-primary)' }}>Hausnebenkosten</span>
                      </div>
                      <span className="font-medium" style={{ color: 'var(--nexo-text-primary)' }}>
                        {formatCurrency(combinedForecast.istaNebenkostenYear)}
                      </span>
                    </div>
                  )}

                  {/* Betriebskosten */}
                  {combinedForecast.betriebskosten > 0 && (
                    <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--nexo-border)' }}>
                      <div className="flex items-center gap-3">
                        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#5B8DEF' }} />
                        <span style={{ color: 'var(--nexo-text-primary)' }}>Kalte Betriebskosten</span>
                      </div>
                      <span className="font-medium" style={{ color: 'var(--nexo-text-primary)' }}>
                        {formatCurrency(combinedForecast.betriebskosten)}
                      </span>
                    </div>
                  )}

                  {/* Totals */}
                  <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--nexo-border)' }}>
                    <span className="font-medium" style={{ color: 'var(--nexo-text-primary)' }}>Nebenkosten gesamt</span>
                    <span className="font-medium" style={{ color: 'var(--nexo-text-primary)' }}>
                      {formatCurrency(combinedForecast.totalProjected)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--nexo-border)' }}>
                    <span style={{ color: 'var(--nexo-text-secondary)' }}>Vorauszahlungen (Jahr)</span>
                    <span style={{ color: 'var(--nexo-text-secondary)' }}>
                      − {formatCurrency(combinedForecast.annualVorauszahlungen)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="font-medium" style={{
                      color: combinedForecast.differenceType === 'nachzahlung'
                        ? 'var(--nexo-nachzahlung-text)'
                        : 'var(--nexo-guthaben-text)',
                    }}>
                      {combinedForecast.differenceType === 'nachzahlung' ? 'Nachzahlung' : 'Guthaben'}
                    </span>
                    <span className="font-medium" style={{
                      color: combinedForecast.differenceType === 'nachzahlung'
                        ? 'var(--nexo-nachzahlung-text)'
                        : 'var(--nexo-guthaben-text)',
                    }}>
                      {combinedForecast.differenceType === 'nachzahlung' ? '+' : ''}{formatCurrency(combinedForecast.difference)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Grand totals */}
          <Card style={{ borderRadius: '4px', boxShadow: cardShadow }} className="animate-fade-in-up stagger-3">
            <CardHeader>
              <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 400, color: 'var(--nexo-text-primary)' }}>Gesamtübersicht</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="font-body text-sm" style={{ color: 'var(--nexo-text-secondary)' }}>Jahreskosten gesamt</p>
                  <p className="font-heading" style={{ fontSize: '24px', fontWeight: 400, color: 'var(--nexo-text-primary)' }}>
                    {formatCurrency(totalYearly)}
                  </p>
                </div>
                <div>
                  <p className="font-body text-sm" style={{ color: 'var(--nexo-text-secondary)' }}>Abschläge & Vorauszahlungen</p>
                  <p className="font-heading" style={{ fontSize: '24px', fontWeight: 400, color: 'var(--nexo-text-primary)' }}>
                    {formatCurrency(totalPrepaid)}
                  </p>
                </div>
                <div>
                  <p className="font-body text-sm" style={{ color: 'var(--nexo-text-secondary)' }}>Differenz</p>
                  <p
                    className="font-heading"
                    style={{
                      fontSize: '24px',
                      fontWeight: 400,
                      color: isNachzahlung ? 'var(--nexo-nachzahlung-text)' : 'var(--nexo-guthaben-text)',
                    }}
                  >
                    {isNachzahlung ? '+' : ''}{formatCurrency(totalDifference)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
