'use client';

import { useState } from 'react';
import Link from 'next/link';

const C = {
  heizung:    '#E6A65C',
  warmwasser: '#2FAE8E',
  blue:       '#5B8DEF',
  gas:        '#E28A5C',
  purple:     '#C084FC',
  gray:       '#6B7280',
  cta:        '#1D7874',
};

const baseCard: React.CSSProperties = {
  backgroundColor: 'var(--nexo-card-bg)',
  borderRadius: '4px',
  border: '1px solid var(--nexo-border)',
  boxShadow: 'var(--nexo-card-shadow)',
};

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span style={{
      fontFamily: 'var(--font-body)',
      display: 'inline-flex', alignItems: 'center',
      fontSize: 11, fontWeight: 700,
      padding: '3px 9px', borderRadius: '3px',
      backgroundColor: color + '18', color,
      whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      {text}
    </span>
  );
}

function FieldRow({ name, note, source, sourceColor = C.gray, example, auto = false, last = false }: {
  name: string; note?: string; source: string; sourceColor?: string;
  example?: string; auto?: boolean; last?: boolean;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '14px 0',
      borderBottom: last ? 'none' : '1px solid var(--nexo-border)',
      opacity: auto ? 0.55 : 1,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--nexo-text-primary)', margin: 0 }}>
          {name}
        </p>
        {note && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--nexo-text-secondary)', margin: '3px 0 0', lineHeight: 1.55 }}>
            {note}
          </p>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flexShrink: 0, paddingTop: 2 }}>
        <Badge text={source} color={sourceColor} />
        {example && (
          <span className="hidden sm:block" style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--nexo-text-muted)', minWidth: 76, textAlign: 'right', paddingTop: 3 }}>
            {example}
          </span>
        )}
      </div>
    </div>
  );
}

function Section({ color, title, subtitle, children }: {
  color: string; title: string; subtitle?: string; children: React.ReactNode;
}) {
  return (
    <div style={{ ...baseCard, borderLeft: `4px solid ${color}`, overflow: 'hidden' }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--nexo-border)' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color, margin: 0 }}>
          {title}
        </p>
        {subtitle && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--nexo-text-secondary)', margin: '4px 0 0' }}>
            {subtitle}
          </p>
        )}
      </div>
      <div style={{ padding: '0 24px' }}>{children}</div>
    </div>
  );
}

function TipBox({ children, color = C.cta }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{
      borderRadius: '4px',
      backgroundColor: 'var(--nexo-surface)',
      borderLeft: `3px solid ${color}`,
      padding: '14px 18px',
    }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--nexo-text-secondary)', margin: 0, lineHeight: 1.65 }}>
        {children}
      </p>
    </div>
  );
}

export default function AnleitungPage() {
  const [tab, setTab] = useState<'nebenkosten' | 'strom'>('nebenkosten');

  return (
    <div className="px-4 sm:px-6 py-8 pb-24 lg:pb-8 space-y-4" style={{ maxWidth: 860 }}>

      {/* ── Header ──────────────────────────────────────────────── */}
      <div>
        <h1 className="font-heading text-3xl lg:text-4xl" style={{ fontWeight: 400, color: 'var(--nexo-text-primary)', lineHeight: '120%' }}>
          Anleitung
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, marginTop: 8, color: 'var(--nexo-text-secondary)' }}>
          Alle Felder erklärt — damit Ihre Prognose so genau wie möglich wird.
        </p>
      </div>

      {/* ── nexoen overview ─────────────────────────────────────── */}
      <div style={{ ...baseCard, padding: '20px 24px' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.cta, margin: '0 0 16px' }}>
          Wie nexoen funktioniert
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {([
            { n: 1, title: 'Abrechnung ausfüllen', desc: 'Einmal pro Jahr: Werte aus Ihren Jahresabrechnungen übertragen. Dauert ca. 10 Minuten.' },
            { n: 2, title: 'Monatlich ablesen',    desc: 'Verbrauch eintragen (ista App, Zählerstand). nexoen wird damit automatisch genauer.' },
            { n: 3, title: 'Prognose verfolgen',   desc: 'Das ganze Jahr sehen Sie, ob eine Nachzahlung oder Guthaben auf Sie zukommt — rechtzeitig gegensteuern.' },
          ] as const).map(({ n, title, desc }) => (
            <div key={n} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: C.cta, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                {n}
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--nexo-text-primary)', margin: '0 0 3px' }}>{title}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--nexo-text-secondary)', margin: 0, lineHeight: 1.55 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 4, padding: 4, borderRadius: '4px', backgroundColor: 'var(--muted)', width: 'fit-content' }}>
        {(['nebenkosten', 'strom'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
              padding: '7px 18px', borderRadius: '4px', border: 'none', cursor: 'pointer',
              backgroundColor: tab === t ? 'var(--nexo-card-bg)' : 'transparent',
              color: 'var(--nexo-text-primary)',
              opacity: tab === t ? 1 : 0.5,
              boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            {t === 'nebenkosten' ? 'Nebenkosten' : 'Strom & Gas'}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════
          NEBENKOSTEN TAB
      ══════════════════════════════════════════════════════════ */}
      {tab === 'nebenkosten' && (
        <div className="space-y-4">

          {/* 2 documents */}
          <div style={{ ...baseCard, padding: '20px 24px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--nexo-text-secondary)', margin: '0 0 14px' }}>
              Diese 2 Dokumente brauchen Sie
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Doc 1 */}
              <div style={{ borderRadius: '4px', padding: '16px', backgroundColor: C.heizung + '0C', border: `1px solid ${C.heizung}30` }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, color: C.heizung, margin: '0 0 3px' }}>Heizkostenabrechnung</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--nexo-text-secondary)', margin: '0 0 12px' }}>Von: ista, Techem, Minol, Brunata, KALO …</p>
                {['Abrechnungszeitraum & Flächen', 'Heizkosten', 'Warmwasser', 'Hausnebenkosten'].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: C.heizung, flexShrink: 0 }} />
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--nexo-text-secondary)', margin: 0 }}>{item}</p>
                  </div>
                ))}
              </div>
              {/* Doc 2 */}
              <div style={{ borderRadius: '4px', padding: '16px', backgroundColor: C.blue + '0C', border: `1px solid ${C.blue}30` }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, color: C.blue, margin: '0 0 3px' }}>Betriebskostenabrechnung</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--nexo-text-secondary)', margin: '0 0 12px' }}>Von: Hausverwaltung / Vermieter</p>
                {['Kalte Betriebskosten (Gesamtsumme)', 'Gesamtfläche des Gebäudes'].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: C.blue, flexShrink: 0 }} />
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--nexo-text-secondary)', margin: 0 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 1 — Abrechnungsdaten */}
          <Section color={C.cta} title="Abrechnungsdaten">
            <FieldRow name="Abrechnungszeitraum" note="Start- und Enddatum — meist 01.01. bis 31.12. des Vorjahres." source="Seite 1" sourceColor={C.cta} example="01.01.–31.12.2024" />
            <FieldRow name="Gesamtfläche Gebäude (m²)" note="Summe aller Wohnflächen im Gebäude." source="Seite 1" sourceColor={C.cta} example="z.B. 450 m²" />
            <FieldRow name="Ihre Wohnfläche (m²)" note="Fläche Ihrer Wohnung aus dem Mietvertrag." source="Mietvertrag" sourceColor={C.gray} example="z.B. 65 m²" last />
          </Section>

          {/* 2 — Heizkosten */}
          <Section color={C.heizung} title="Heizkosten" subtitle="Heizkostenabrechnung · Seite 3, oben">
            <FieldRow name="Gesamtkosten Heizung (€)" note="Gesamte Heizkosten des Gebäudes für das Abrechnungsjahr." source="Seite 3" sourceColor={C.heizung} example="z.B. 2.847 €" />
            <FieldRow name="Gesamt-Heizeinheiten (HKV)" note="Summe aller HKV-Einheiten im Gebäude — steht auf Seite 3 als Gesamtwert." source="Seite 3" sourceColor={C.heizung} example="z.B. 1.240" />
            <FieldRow name="Ihre Heizeinheiten" note="nexoen berechnet diesen Wert automatisch aus Ihren Monatsdaten oder Ablesungen. Nur manuell ausfüllen, wenn Sie den Jahreswert aus der Abrechnung kennen." source="Automatisch" sourceColor={C.warmwasser} example="–" auto last />
          </Section>

          {/* 3 — Warmwasser */}
          <Section color={C.warmwasser} title="Warmwasser" subtitle="Heizkostenabrechnung · Seite 3, unten">
            <FieldRow name="Gesamtkosten Warmwasser (€)" note="Gesamte Warmwasserkosten des Gebäudes." source="Seite 3" sourceColor={C.warmwasser} example="z.B. 412 €" />
            <FieldRow name="Gesamt-Warmwasser (m³)" note="Gesamter Warmwasserverbrauch des Gebäudes in Kubikmetern." source="Seite 3" sourceColor={C.warmwasser} example="z.B. 85 m³" />
            <FieldRow name="Ihr Warmwasserverbrauch (m³)" note="nexoen berechnet diesen Wert automatisch aus Ihren Monatsdaten oder Zählerständen." source="Automatisch" sourceColor={C.warmwasser} example="–" auto last />
          </Section>

          {/* 4 — Hausnebenkosten */}
          <Section color={C.purple} title="Hausnebenkosten" subtitle="Heizkostenabrechnung · direkt Ihnen berechnet">
            <FieldRow name="Hausnebenkosten (€/Jahr)" note="Ihr persönlicher Anteil an Servicekosten des Messdienstleisters — z.B. Trinkwasser, Gerätemiete, Servicepauschale. Steht unter 'Hausnebenkosten' auf Ihrer Heizkostenabrechnung." source="Heizkostenabrechnung" sourceColor={C.purple} example="z.B. 134 €" last />
          </Section>

          {/* 5 — Kalte Betriebskosten */}
          <Section color={C.blue} title="Kalte Betriebskosten" subtitle="Betriebskostenabrechnung der Hausverwaltung">
            <FieldRow name="Kalte Betriebskosten (€/Jahr)" note="Alle Nebenkosten der Hausverwaltung (Grundsteuer, Versicherung, Müll …) minus der ista/Techem-Zeile. Nur die Summe — keine Einzelpositionen." source="Hausverwaltung" sourceColor={C.blue} example="z.B. 908 €" last />
            <div style={{ padding: '12px 0 16px' }}>
              <div style={{ borderRadius: '4px', backgroundColor: 'var(--nexo-surface)', padding: '12px 16px' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--nexo-text-secondary)', margin: 0, lineHeight: 1.6 }}>
                  <span style={{ color: 'var(--nexo-text-primary)', fontWeight: 600 }}>Formel: </span>
                  Summe Betriebskosten (Hausverwaltung)
                  <span style={{ color: C.blue, fontWeight: 700 }}> − </span>
                  Heizkostenanteil (ista-Zeile)
                  <span style={{ color: C.blue, fontWeight: 700 }}> = </span>
                  Kalte Betriebskosten
                </p>
              </div>
            </div>
          </Section>

          {/* 6 — Vorauszahlungen */}
          <Section color={C.cta} title="Vorauszahlungen" subtitle="Ihr monatlicher Nebenkosten-Abschlag">
            <FieldRow name="Monatlicher Abschlag (€/Monat)" note="Betrag, den Sie monatlich an die Hausverwaltung zahlen. Steht auf dem Kontoauszug oder im Mietvertrag." source="Kontoauszug" sourceColor={C.cta} example="z.B. 209 €" last />
          </Section>

          {/* Monatsdaten tip */}
          <TipBox color={C.warmwasser}>
            <strong style={{ color: 'var(--nexo-text-primary)' }}>Bessere Prognose mit Monatsdaten — </strong>
            Tragen Sie jeden Monat die Werte aus Ihrer Anbieter-App ein (ista EcoTrend, Techem SmartBridge).
            Je mehr Monate erfasst, desto genauer die Prognose. Zu finden unter{' '}
            <strong style={{ color: 'var(--nexo-text-primary)' }}>Zähler → Heizung / Warmwasser</strong>.
          </TipBox>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
            <Link href="/abrechnung" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', borderRadius: '4px', backgroundColor: C.cta, color: '#fff', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
              Zur Abrechnung
            </Link>
            <Link href="/meters" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', borderRadius: '4px', border: '1px solid var(--nexo-border)', color: 'var(--nexo-text-primary)', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
              Zu den Zählern
            </Link>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          STROM & GAS TAB
      ══════════════════════════════════════════════════════════ */}
      {tab === 'strom' && (
        <div className="space-y-4">

          {/* A — Zähler anlegen */}
          <Section color={C.blue} title="A — Zähler anlegen" subtitle="Zähler → Neuer Zähler">
            <FieldRow name="Zählertyp" note="Strom (kWh) oder Gas (kWh / m³)." source="Einmalig" sourceColor={C.blue} />
            <FieldRow name="Zählername" note="Beliebiger Name — z.B. 'Strom Wohnung'." source="Frei wählbar" sourceColor={C.gray} last />
          </Section>

          {/* B — Tarif */}
          <Section color={C.cta} title="B — Tarif eintragen" subtitle="Zähler-Detail → Tarife">
            <FieldRow name="Arbeitspreis (€/kWh)" note="Preis pro Kilowattstunde. Pflichtfeld — ohne ihn gibt es keine Prognose." source="Strom-/Gasvertrag" sourceColor={C.cta} example="z.B. 0,32 €/kWh" />
            <FieldRow name="Grundpreis (€/Monat)" note="Fixer monatlicher Betrag unabhängig vom Verbrauch." source="Strom-/Gasvertrag" sourceColor={C.gray} example="z.B. 9,50 €" />
            <FieldRow name="Abschlag (€/Monat)" note="Monatlicher Abschlag an den Anbieter. Nötig damit nexoen Nachzahlung oder Guthaben berechnen kann." source="Kontoauszug" sourceColor={C.cta} example="z.B. 85 €" last />
          </Section>

          {/* C — Zählerstände */}
          <Section color={C.warmwasser} title="C — Zählerstände erfassen" subtitle="Zähler-Detail → Zählerstände">
            <FieldRow name="Datum" note="Datum der Ablesung — am besten monatlich zum selben Tag." source="Ablesung" sourceColor={C.warmwasser} example="z.B. 01.04.2025" />
            <FieldRow name="Zählerstand (kWh oder m³)" note="Aktueller Stand des Zählergeräts. nexoen berechnet daraus den Tagesverbrauch und extrapoliert auf das Jahr." source="Zählergerät" sourceColor={C.warmwasser} example="z.B. 8.432 kWh" last />
          </Section>

          {/* Gas note */}
          <div style={{ borderRadius: '4px', backgroundColor: 'var(--nexo-surface)', borderLeft: `3px solid ${C.gas}`, padding: '14px 18px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--nexo-text-secondary)', margin: 0, lineHeight: 1.65 }}>
              <strong style={{ color: 'var(--nexo-text-primary)' }}>Gas in m³? </strong>
              Ältere Gaszähler zeigen m³, neuere kWh. Bei m³ gibt nexoen einen Umrechnungsfaktor vor (Standard: 10,5 kWh/m³). Den genauen Wert finden Sie auf Ihrer Gasrechnung unter <em>Brennwert</em>.
            </p>
          </div>

          {/* D — Prognose */}
          <Section color={C.cta} title="D — Prognose lesen" subtitle="Dashboard · Strom &amp; Gas Kacheln">
            <FieldRow name="Erwartete Jahreskosten" note="Hochrechnung auf Basis Ihres bisherigen Verbrauchs und Tarifs." source="Automatisch" sourceColor={C.warmwasser} auto />
            <FieldRow name="Nachzahlung / Guthaben" note="Differenz zwischen erwarteten Jahreskosten und geleisteten Abschlägen. Erscheint sobald ein Abschlag eingetragen ist." source="Automatisch" sourceColor={C.warmwasser} auto last />
          </Section>

          {/* Tip */}
          <TipBox color={C.cta}>
            <strong style={{ color: 'var(--nexo-text-primary)' }}>Tarif wechseln? </strong>
            Legen Sie einen neuen Tarif mit dem Startdatum des neuen Vertrags an — der alte bleibt erhalten und wird automatisch beendet.
          </TipBox>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
            <Link href="/meters" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', borderRadius: '4px', backgroundColor: C.cta, color: '#fff', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
              Zu den Zählern
            </Link>
            <Link href="/dashboard" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', borderRadius: '4px', border: '1px solid var(--nexo-border)', color: 'var(--nexo-text-primary)', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
              Zum Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
