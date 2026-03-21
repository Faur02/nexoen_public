'use client';

import { useState } from 'react';

const fmtEuro = (n: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

interface HeizkostenRechnerProps {
  verbrauchskosten: number;
  categorySlug?: string;
}

export function HeizkostenRechner({ verbrauchskosten, categorySlug }: HeizkostenRechnerProps) {
  const [reduction, setReduction] = useState(10);
  const savings = Math.round(verbrauchskosten * reduction / 100);
  const verb = categorySlug === 'warmwasser' ? 'weniger Warmwasser verbrauchst' : 'weniger heizt';

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <p className="font-body" style={{ margin: 0, fontSize: '13px', color: 'var(--nexo-text-secondary)' }}>
          Wenn du <strong style={{ color: 'var(--nexo-text-primary)' }}>{reduction}%</strong> {verb}
        </p>
        <p className="font-heading" style={{ margin: 0, fontSize: '22px', fontWeight: 400, color: 'var(--nexo-guthaben-text)' }}>
          sparst du ca. {fmtEuro(savings)}/Jahr
        </p>
      </div>

      <input
        type="range"
        min={5}
        max={30}
        step={5}
        value={reduction}
        onChange={e => setReduction(Number(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--nexo-cta)', cursor: 'pointer', height: '4px' }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        {[5, 10, 15, 20, 25, 30].map(pct => (
          <button
            key={pct}
            onClick={() => setReduction(pct)}
            className="font-body"
            style={{
              fontSize: '11px',
              color: reduction === pct ? 'var(--nexo-cta)' : 'var(--nexo-text-muted)',
              fontWeight: reduction === pct ? 600 : 400,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px 0',
            }}
          >
            {pct}%
          </button>
        ))}
      </div>

      <p className="font-body" style={{ margin: '12px 0 0', fontSize: '11px', color: 'var(--nexo-text-muted)', lineHeight: 1.4 }}>
        Berechnet aus deinem anteiligen Verbrauch. Tatsächliche Ersparnisse hängen vom Gesamtverbrauch deines Gebäudes ab.
      </p>
    </div>
  );
}
