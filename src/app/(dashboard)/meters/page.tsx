import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getMetersWithDetailsAndTariffs, ensurePredefinedMeters } from '@/lib/actions/meters';
import { getUserCategories } from '@/lib/actions/categories';
import { calculateYearlyForecast } from '@/lib/calculations/forecast';
import { MeterType } from '@/types/database';

const meterDotColors: Record<MeterType, string> = {
  electricity: '#5B8DEF',
  gas: '#E28A5C',
  water: '#2FAE8E',
  heating: '#E6A65C',
  cold_water: '#5B8DEF',
  warm_water: '#2FAE8E',
};

const categoryColors: Record<string, string> = {
  heizung: '#E6A65C',
  warmwasser: '#2FAE8E',
  kaltwasser: '#5B8DEF',
};

const categoryDescriptions: Record<string, string> = {
  heizung: 'Heizkörper-Ablesungen (HKV)',
  warmwasser: 'Warmwasser-Zählerstände (m³)',
  kaltwasser: 'Kaltwasser-Zählerstände (m³)',
};

const categoryHints: Record<string, string> = {
  heizung: 'Teil deiner Nebenkostenabrechnung',
  warmwasser: 'Teil deiner Nebenkostenabrechnung',
  kaltwasser: 'Nur zur eigenen Kontrolle — bereits in Betriebskosten enthalten',
};

const cardShadow = 'var(--nexo-card-shadow)';

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

export default async function MetersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [metersData, categories] = await Promise.all([
    getMetersWithDetailsAndTariffs(),
    getUserCategories(),
  ]);

  const predefined = categories
    .filter(c => c.is_predefined)
    .sort((a, b) => {
      const order = ['heizung', 'warmwasser', 'kaltwasser'];
      return order.indexOf(a.slug) - order.indexOf(b.slug);
    });

  // Ensure each predefined category has a meter (auto-creates if missing)
  const predefinedMeterMap = await ensurePredefinedMeters(predefined);

  // Non-predefined meters (e.g. Strom, Gas)
  // Filter by category_id (not meter ID) so any meter linked to a predefined category
  // is excluded — even if duplicates exist due to concurrent requests
  const predefinedCategoryIds = new Set(predefined.map(c => c.id));
  const otherMeters = metersData.filter(
    ({ meter }) => !meter.category_id || !predefinedCategoryIds.has(meter.category_id)
  );

  const otherMetersWithForecast = otherMeters.map(({ meter, readings, tariff }) => {
    if (meter.type === 'heating' || !tariff || readings.length < 2) {
      return { meter, tariff, forecast: null, readingCount: readings.length };
    }
    const forecast = calculateYearlyForecast(readings, tariff, new Date(), meter.unit);
    return { meter, tariff, forecast, readingCount: readings.length };
  });

  // Build last-reading date map for all meters (used for overdue nudges)
  const now = new Date();
  const lastReadingByMeterId = new Map<string, Date | null>();
  for (const { meter, readings } of metersData) {
    if (readings.length === 0) {
      lastReadingByMeterId.set(meter.id, null);
    } else {
      const latest = readings.reduce((a, b) =>
        new Date(a.reading_date) > new Date(b.reading_date) ? a : b
      );
      lastReadingByMeterId.set(meter.id, new Date(latest.reading_date));
    }
  }

  function daysSinceReading(meterId: string): number | null {
    const date = lastReadingByMeterId.get(meterId);
    if (!date) return null;
    return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  }

  function readingNudge(meterId: string, createdAt: string): { text: string; color: string } | null {
    const days = daysSinceReading(meterId);
    const createdDaysAgo = Math.floor((now.getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));
    if (days === null) {
      // No readings yet — only nudge if meter is older than 7 days
      if (createdDaysAgo <= 7) return null;
      return { text: 'Noch keine Ablesung — jetzt eintragen', color: 'var(--nexo-nachzahlung-text)' };
    }
    if (days > 60) return { text: `Letzte Ablesung vor ${days} Tagen`, color: 'var(--nexo-nachzahlung-text)' };
    if (days > 30) return { text: `Letzte Ablesung vor ${days} Tagen`, color: 'var(--nexo-text-muted)' };
    return null;
  }

  let cardIndex = 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1
          className="font-heading text-3xl lg:text-5xl"
          style={{
            lineHeight: '120%',
            fontWeight: 400,
            color: 'var(--nexo-text-primary)',
          }}
        >
          Zähler
        </h1>
        <p
          className="font-body text-base lg:text-xl"
          style={{
            marginTop: '12px',
            lineHeight: '140%',
            color: 'var(--nexo-text-secondary)',
          }}
        >
          Verwalten Sie Ihre Zähler für Strom, Gas, Wasser und Heizung
        </p>
      </div>

      {/* Predefined category cards — always visible */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {predefined.map((category) => {
          cardIndex++;
          const color = categoryColors[category.slug] || 'var(--nexo-text-muted)';
          const description = categoryDescriptions[category.slug] || '';
          const meter = predefinedMeterMap.get(category.id);
          // Heizung uses radiator readings, not meter readings — skip nudge
          const nudge = meter && category.slug !== 'heizung'
            ? readingNudge(meter.id, meter.created_at)
            : null;

          return (
            <Link key={category.id} href={meter ? `/meters/${meter.id}` : '#'}>
              <div
                className={`nexo-card cursor-pointer animate-fade-in-up stagger-${cardIndex} opacity-0`}
                style={{
                  borderRadius: '4px',
                  boxShadow: cardShadow,
                  backgroundColor: 'var(--nexo-card-bg)',
                  padding: '24px',
                  borderLeft: `4px solid ${color}`,
                  height: '100%',
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: color,
                      flexShrink: 0,
                    }}
                  />
                  <h2
                    className="font-heading"
                    style={{
                      fontSize: '28px',
                      lineHeight: '120%',
                      fontWeight: 400,
                      color: 'var(--nexo-text-primary)',
                    }}
                  >
                    {category.name}
                  </h2>
                </div>

                <p
                  className="font-body"
                  style={{
                    fontSize: '14px',
                    color: 'var(--nexo-text-secondary)',
                    marginTop: '12px',
                  }}
                >
                  {description}
                </p>
                {categoryHints[category.slug] && (
                  <p
                    className="font-body"
                    style={{
                      fontSize: '11px',
                      color: 'var(--nexo-text-muted)',
                      marginTop: '8px',
                    }}
                  >
                    {categoryHints[category.slug]}
                  </p>
                )}
                {nudge && (
                  <p
                    className="font-body"
                    style={{
                      fontSize: '11px',
                      color: nudge.color,
                      marginTop: '10px',
                      fontWeight: 500,
                    }}
                  >
                    ↑ {nudge.text}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Other meters (Strom, Gas, etc.) + Add button */}
      <div>
        <h2
          className="font-heading text-xl lg:text-2xl"
          style={{
            fontWeight: 400,
            color: 'var(--nexo-text-primary)',
            marginBottom: '16px',
          }}
        >
          Weitere Zähler
        </h2>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {otherMetersWithForecast.map(({ meter, forecast }) => {
            cardIndex++;
            const isNachzahlung = forecast ? forecast.differenceType === 'nachzahlung' : null;
            const arrowColor = isNachzahlung === null
              ? 'var(--nexo-text-muted)'
              : isNachzahlung
                ? 'var(--nexo-nachzahlung-text)'
                : 'var(--nexo-guthaben-text)';
            const arrowUp = isNachzahlung === null ? true : isNachzahlung;
            const nudge = readingNudge(meter.id, meter.created_at);

            return (
              <Link key={meter.id} href={`/meters/${meter.id}`}>
                <div
                  className={`nexo-card cursor-pointer animate-fade-in-up stagger-${Math.min(cardIndex, 5)} opacity-0`}
                  style={{
                    borderRadius: '4px',
                    boxShadow: cardShadow,
                    backgroundColor: 'var(--nexo-card-bg)',
                    padding: '24px',
                    height: '100%',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <ArrowIcon color={arrowColor} size={14} up={arrowUp} />
                    <h2
                      className="font-heading"
                      style={{
                        fontSize: 'clamp(20px, 5vw, 32px)',
                        lineHeight: '120%',
                        fontWeight: 400,
                        color: 'var(--nexo-text-primary)',
                      }}
                    >
                      {meter.name}
                    </h2>
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: meterDotColors[meter.type],
                        flexShrink: 0,
                      }}
                    />
                  </div>

                  <p
                    className="font-body"
                    style={{
                      fontSize: '14px',
                      color: 'var(--nexo-text-secondary)',
                      marginTop: '12px',
                    }}
                  >
                    Erstellt am{' '}
                    {new Date(meter.created_at).toLocaleDateString('de-DE', {
                      day: 'numeric',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </p>

                  <p
                    className="font-body"
                    style={{
                      fontSize: '14px',
                      color: 'var(--nexo-text-secondary)',
                      marginTop: '4px',
                    }}
                  >
                    Einheit: {meter.unit}
                    {meter.type === 'gas' && meter.unit === 'm3' && (
                      <span style={{ marginLeft: 8 }}>
                        (Faktor: {meter.conversion_factor})
                      </span>
                    )}
                  </p>

                  {nudge && (
                    <p
                      className="font-body"
                      style={{
                        fontSize: '12px',
                        color: nudge.color,
                        marginTop: '10px',
                        fontWeight: 500,
                      }}
                    >
                      ↑ {nudge.text}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}

          {/* Add meter card */}
          <Link href="/meters/new">
            <div
              className={`nexo-card flex flex-col items-center justify-center cursor-pointer animate-fade-in-up stagger-${Math.min(cardIndex + 1, 5)} opacity-0`}
              style={{
                borderRadius: '4px',
                border: '2px dashed var(--nexo-progress-avg)',
                padding: '24px',
                height: '100%',
                minHeight: '160px',
                transition: 'border-color 0.2s ease',
              }}
            >
              <h3
                className="font-heading"
                style={{
                  fontSize: '18px',
                  fontWeight: 400,
                  color: 'var(--nexo-cta)',
                  marginBottom: '8px',
                }}
              >
                Zähler Hinzufügen
              </h3>
              <span
                style={{
                  fontSize: '32px',
                  color: 'var(--nexo-cta)',
                  lineHeight: 1,
                }}
              >
                +
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
