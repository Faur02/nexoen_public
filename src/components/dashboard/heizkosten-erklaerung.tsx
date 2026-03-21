import { HeatingForecastResult } from '@/types/database';
import { formatCurrency } from '@/lib/calculations/costs';

interface HeizkostenErklaerungProps {
  heizung: HeatingForecastResult;
  warmwasser: HeatingForecastResult | null;
  accentColor?: string;
}

export function HeizkostenErklaerung({ heizung, warmwasser, accentColor = '#E6A65C' }: HeizkostenErklaerungProps) {
  const diff = heizung.unitsRatio - heizung.areaRatio;

  let verdict: string;
  let verdictColor: string;
  if (diff > 0.05) {
    verdict = 'Mehr als Nachbarn';
    verdictColor = 'var(--nexo-nachzahlung-text)';
  } else if (diff < -0.05) {
    verdict = 'Sparsamer als Nachbarn';
    verdictColor = 'var(--nexo-guthaben-text)';
  } else {
    verdict = 'Normaler Verbrauch';
    verdictColor = 'var(--nexo-text-muted)';
  }

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <p className="font-heading" style={{ margin: 0, fontSize: '15px', fontWeight: 400, color: 'var(--nexo-text-primary)' }}>
          Heizungsanalyse
        </p>
        <span className="font-body" style={{ fontSize: '12px', fontWeight: 500, color: verdictColor }}>
          {verdict}
        </span>
      </div>

      {/* Feste Kosten */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
          <span className="font-body" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--nexo-text-primary)' }}>
            Feste Kosten
          </span>
          <span className="font-body" style={{ fontSize: '13px', color: 'var(--nexo-text-primary)' }}>
            <strong style={{ fontWeight: 600 }}>{formatCurrency(heizung.grundkosten)}</strong>
            <span style={{ color: 'var(--nexo-text-muted)', fontWeight: 400, marginLeft: 8 }}>{heizung.grundkostenPercent}%</span>
          </span>
        </div>
        <div style={{ height: 6, backgroundColor: 'var(--nexo-border)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ width: `${heizung.grundkostenPercent}%`, height: '100%', backgroundColor: 'var(--nexo-text-muted)', opacity: 0.35, borderRadius: 3 }} />
        </div>
        <p className="font-body" style={{ fontSize: '11px', color: 'var(--nexo-text-muted)', margin: '5px 0 0' }}>
          Nach Fläche · nicht änderbar
        </p>
      </div>

      {/* Dein Verbrauch */}
      <div style={{ marginBottom: warmwasser ? 14 : 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
          <span className="font-body" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--nexo-text-primary)' }}>
            Dein Verbrauch
          </span>
          <span className="font-body" style={{ fontSize: '13px', color: 'var(--nexo-text-primary)' }}>
            <strong style={{ fontWeight: 600 }}>{formatCurrency(heizung.verbrauchskosten)}</strong>
            <span style={{ color: 'var(--nexo-text-muted)', fontWeight: 400, marginLeft: 8 }}>{heizung.verbrauchskostenPercent}%</span>
          </span>
        </div>
        <div style={{ height: 6, backgroundColor: 'var(--nexo-border)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ width: `${heizung.verbrauchskostenPercent}%`, height: '100%', backgroundColor: accentColor, borderRadius: 3 }} />
        </div>
        <p className="font-body" style={{ fontSize: '11px', color: 'var(--nexo-text-muted)', margin: '5px 0 0' }}>
          Nach HKV · weniger heizen = weniger zahlen
        </p>
      </div>

      {/* Warmwasser bonus */}
      {warmwasser && (
        <p className="font-body" style={{ fontSize: '10px', color: 'var(--nexo-text-muted)', margin: 0 }}>
          + Warmwasser {formatCurrency(warmwasser.yourAnnualCost)}/Jahr
        </p>
      )}
    </>
  );
}
