import type { IstaConsumption, AbrechnungSetup } from '@/types/database';

interface IstaPeriodSummaryProps {
  data: IstaConsumption[];
  categorySlug: string;
  abrechnungSetup: AbrechnungSetup | null;
}

export function IstaPeriodSummary({ data, categorySlug, abrechnungSetup }: IstaPeriodSummaryProps) {
  if (data.length === 0) return null;

  const isHeizung = categorySlug === 'heizung';
  const unitLabel = isHeizung ? 'Einheiten (HKV)' : 'm\u00B3';

  // Filter by Abrechnungszeitraum if set
  let filteredData = data;
  const start = abrechnungSetup?.abrechnungszeitraum_start;
  const end = abrechnungSetup?.abrechnungszeitraum_end;

  if (start && end) {
    // Convert date (YYYY-MM-DD) to YYYY-MM for comparison
    const startMonth = start.substring(0, 7);
    const endMonth = end.substring(0, 7);
    filteredData = data.filter((d) => d.month >= startMonth && d.month <= endMonth);
  }

  if (filteredData.length === 0) return null;

  const totalUnits = filteredData.reduce((sum, d) => sum + d.units, 0);
  const totalKwh = filteredData.reduce((sum, d) => sum + (d.kwh ?? 0), 0);
  const hasKwh = filteredData.some((d) => d.kwh != null);

  const periodLabel = start && end
    ? `${new Date(start).toLocaleDateString('de-DE')} – ${new Date(end).toLocaleDateString('de-DE')}`
    : 'Gesamter Zeitraum';

  return (
    <div
      style={{
        backgroundColor: 'var(--nexo-surface)',
        borderRadius: '4px',
        boxShadow: 'var(--nexo-card-shadow)',
        padding: '20px 24px',
      }}
    >
      <p
        className="font-body"
        style={{ fontSize: '13px', color: 'var(--nexo-text-muted)', marginBottom: '12px' }}
      >
        Verbrauch — {periodLabel}
      </p>
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-8">
        <div>
          <p className="font-heading" style={{ fontSize: '24px', fontWeight: 400, color: 'var(--nexo-text-primary)' }}>
            {totalUnits.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
          </p>
          <p className="font-body" style={{ fontSize: '12px', color: 'var(--nexo-text-muted)', marginTop: '2px' }}>
            {unitLabel} gesamt
          </p>
        </div>
        {hasKwh && (
          <div>
            <p className="font-heading" style={{ fontSize: '24px', fontWeight: 400, color: 'var(--nexo-text-primary)' }}>
              {totalKwh.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
            </p>
            <p className="font-body" style={{ fontSize: '12px', color: 'var(--nexo-text-muted)', marginTop: '2px' }}>
              kWh gesamt
            </p>
          </div>
        )}
        <div>
          <p className="font-heading" style={{ fontSize: '24px', fontWeight: 400, color: 'var(--nexo-text-primary)' }}>
            {filteredData.length}
          </p>
          <p className="font-body" style={{ fontSize: '12px', color: 'var(--nexo-text-muted)', marginTop: '2px' }}>
            Monate erfasst
          </p>
        </div>
      </div>
    </div>
  );
}
