'use client';

import { useState } from 'react';

const sectionBadge = (n: number, color: string) => (
  <span
    className="font-body"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      backgroundColor: color,
      color: '#fff',
      fontSize: '11px',
      fontWeight: 700,
      flexShrink: 0,
    }}
  >
    {n}
  </span>
);

const sectionColors: Record<number, string> = {
  1: '#94a3b8',
  2: '#E6A65C',
  3: '#2FAE8E',
  4: '#C084FC',
  5: '#5B8DEF',
  6: '#64748b',
};

function BillRow({ label, section, muted }: { label: string; section?: number; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3" style={{ padding: '6px 0', borderBottom: '1px solid var(--nexo-border)' }}>
      <span
        className="font-body"
        style={{ fontSize: '13px', color: muted ? 'var(--nexo-text-muted)' : 'var(--nexo-text-secondary)', flex: 1 }}
      >
        {label}
      </span>
      {section !== undefined && sectionBadge(section, sectionColors[section])}
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <p
      className="font-body"
      style={{
        fontSize: '10px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: 'var(--nexo-text-muted)',
        marginTop: '12px',
        marginBottom: '4px',
      }}
    >
      {label}
    </p>
  );
}

export function AbrechnungGuide() {
  const [open, setOpen] = useState(true);

  return (
    <div
      style={{
        backgroundColor: 'var(--nexo-card-bg)',
        borderRadius: '4px',
        boxShadow: 'var(--nexo-card-shadow)',
        overflow: 'hidden',
      }}
    >
      {/* Header row — always visible */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between"
        style={{ padding: '16px 20px', cursor: 'pointer', background: 'none', border: 'none', textAlign: 'left' }}
      >
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--nexo-text-secondary)', flexShrink: 0 }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span className="font-body" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--nexo-text-primary)' }}>
            Wo finde ich diese Werte?
          </span>
          <span className="font-body" style={{ fontSize: '12px', color: 'var(--nexo-text-muted)' }}>
            — Kurzanleitung zum Ausf&uuml;llen
          </span>
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            color: 'var(--nexo-text-muted)',
            flexShrink: 0,
          }}
        >
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Collapsible body */}
      {open && (
        <div style={{ padding: '0 20px 20px' }}>
          {/* Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-1" style={{ marginBottom: '16px', paddingTop: '4px' }}>
            {[
              { n: 1, label: 'Abrechnungsdaten' },
              { n: 2, label: 'Heizkosten' },
              { n: 3, label: 'Warmwasser' },
              { n: 4, label: 'Hausnebenkosten' },
              { n: 5, label: 'Betriebskosten' },
              { n: 6, label: 'Vorauszahlungen' },
            ].map(({ n, label }) => (
              <div key={n} className="flex items-center gap-1.5">
                {sectionBadge(n, sectionColors[n])}
                <span className="font-body" style={{ fontSize: '12px', color: 'var(--nexo-text-secondary)' }}>{label}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* LEFT: ista-Abrechnung */}
            <div
              style={{
                backgroundColor: 'var(--nexo-surface)',
                borderRadius: '4px',
                border: '1px solid var(--nexo-border)',
                padding: '14px 16px',
              }}
            >
              <p className="font-body" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--nexo-text-secondary)', marginBottom: '10px' }}>
                Heizkostenabrechnung (ista, Techem, Minol …)
              </p>

              <Divider label="Seite 1 — Übersicht" />
              <BillRow label="Abrechnungszeitraum (z. B. 01.01.–31.12.)" section={1} />
              <BillRow label="Ihre Wohnfläche (m²)" section={1} />

              <Divider label="Seite 3 — Heizkosten" />
              <BillRow label="Gesamtkosten Gebäude (Heizung)" section={2} />
              <BillRow label="Einheiten gesamt (alle Heizkörper, HKV)" section={2} />
              <BillRow label="Ihre Einheiten (nur Ihre Wohnung)" section={2} />

              <Divider label="Seite 3 — Warmwasserkosten" />
              <BillRow label="Gesamtkosten Gebäude (Warmwasser)" section={3} />
              <BillRow label="Gesamtverbrauch Gebäude (m³)" section={3} />
              <BillRow label="Ihr Verbrauch (m³)" section={3} />

              <Divider label='Seite 3 — "Hausnebenkosten"' />
              <BillRow label="Summe Hausnebenkosten (Trinkwasser, Abwasser, Service…)" section={4} />
            </div>

            {/* RIGHT: Hausverwaltung */}
            <div
              style={{
                backgroundColor: 'var(--nexo-surface)',
                borderRadius: '4px',
                border: '1px solid var(--nexo-border)',
                padding: '14px 16px',
              }}
            >
              <p className="font-body" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--nexo-text-secondary)', marginBottom: '10px' }}>
                Hausverwaltung — Betriebskostenabrechnung
              </p>

              <Divider label="Kostenaufstellung" />
              <BillRow label='Erste Zeile: "Heiz- u. Wasserkosten" (Ihr Anbieter)' muted />
              <BillRow label="+ alle weiteren Betriebskosten-Zeilen (Grundsteuer, Versicherung, Müll …)" muted />
              <BillRow label="= Summe aller Kosten (Kostenanteil)" muted />
              <div style={{ margin: '8px 0', padding: '8px 10px', backgroundColor: 'var(--nexo-card-bg)', borderRadius: '4px', border: '1px solid var(--nexo-border)' }}>
                <p className="font-body" style={{ fontSize: '12px', color: 'var(--nexo-text-secondary)' }}>
                  <strong>Betriebskosten =</strong> Summe &minus; Anbieter-Zeile
                </p>
              </div>
              <BillRow label="Dieser berechnete Wert gehört in Abschnitt 5" section={5} />

              <Divider label="Vorauszahlungen" />
              <BillRow label="Monatlicher Abschlag (Nebenkosten, €/Monat)" section={6} />

              <div style={{ marginTop: '12px', padding: '10px', backgroundColor: 'var(--nexo-card-bg)', borderRadius: '4px', border: '1px dashed var(--nexo-border)' }}>
                <p className="font-body" style={{ fontSize: '12px', color: 'var(--nexo-text-muted)', lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--nexo-text-secondary)' }}>Tipp:</strong> Die Gebäudefläche (m²) steht meist auf Seite 1 oder 2 der Heizkostenabrechnung unter &quot;Verteilerschlüssel&quot;.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
