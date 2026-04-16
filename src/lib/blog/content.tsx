import Link from 'next/link';

// ── Shared helpers ──────────────────────────────────────────────

function NexoenCTA() {
  return (
    <div className="bg-teal-50 border border-teal-100 rounded-[4px] p-6 my-8" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <p style={{ fontWeight: 700, color: '#0f172a', margin: 0 }}>nexoen – deine Nebenkosten immer im Griff</p>
      <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
        Tracke Strom, Heizung und Wasser das ganze Jahr. Erhalte eine Prognose für deine Nachzahlung. Verstehe endlich, was auf deiner Abrechnung steht.
      </p>
      <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #0f766e, #14b8a6)', color: '#fff', fontWeight: 700, borderRadius: '4px', padding: '0.625rem 1.25rem', fontSize: '0.9rem', textDecoration: 'none', alignSelf: 'flex-start' }}>
        Kostenlos starten – 3 Monate gratis
      </Link>
    </div>
  );
}

function NumItem({ n, t, d }: { n: number; t: string; d: string }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
      <div style={{ flexShrink: 0, width: '2rem', height: '2rem', borderRadius: '4px', background: '#ccfbf1', color: '#0f766e', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem' }}>{n}</div>
      <div>
        <p style={{ fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem' }}>{t}</p>
        <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>{d}</p>
      </div>
    </div>
  );
}

function Toc({ items }: { items: [string, string][] }) {
  return (
    <div className="bg-white border border-slate-200 rounded-[4px] p-6 my-8">
      <p style={{ fontFamily: 'var(--font-display-lp), Playfair Display, serif', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem', fontSize: '1rem' }}>Inhaltsverzeichnis</p>
      <ol style={{ paddingLeft: '1.25rem', margin: 0, color: '#0d9488', fontSize: '0.9rem', lineHeight: '2' }}>
        {items.map(([id, label]) => (
          <li key={id}><a href={`#${id}`} style={{ color: '#0d9488', textDecoration: 'none' }}>{label}</a></li>
        ))}
      </ol>
    </div>
  );
}

// ── Article content functions ────────────────────────────────────

function FehlerContent({ excerpt }: { excerpt: string }) {
  return (
    <>
      <p className="text-xl text-slate-500 leading-relaxed mb-8 font-light">{excerpt}</p>
      <Toc items={[
        ['warum', 'Warum Fehler in Nebenkostenabrechnungen entstehen'],
        ['haeufigste', 'Die häufigsten Fehler in Nebenkostenabrechnungen'],
        ['rechte', 'Welche Rechte Mieter haben'],
        ['erkennen', 'Wie du Fehler in deiner Abrechnung erkennst'],
        ['pruefen', 'Nebenkostenabrechnung einfach prüfen'],
        ['fazit', 'Fazit'],
      ]} />

      <h2 id="warum">Warum Fehler in Nebenkostenabrechnungen entstehen</h2>
      <p>Eine Nebenkostenabrechnung enthält oft viele einzelne Kostenpositionen und Berechnungen. Gerade bei größeren Gebäuden mit mehreren Wohnungen können schnell Fehler entstehen.</p>
      <p>Typische Gründe sind zum Beispiel:</p>
      <ul>
        <li>Falsche Daten in der Hausverwaltung</li>
        <li>Falsche Wohnflächenberechnung</li>
        <li>Falsch angewendete Umlageschlüssel</li>
        <li>Technische Fehler bei Zählern oder Ablesungen</li>
        <li>Unklare Kostenaufteilungen</li>
      </ul>
      <p>Oft entstehen diese Fehler nicht absichtlich, sondern durch komplexe Abrechnungsprozesse. Trotzdem kann das Ergebnis für Mieter teuer werden.</p>

      <h2 id="haeufigste">Die häufigsten Fehler in Nebenkostenabrechnungen</h2>
      <p>Einige Fehler treten besonders häufig auf. Wenn du deine Abrechnung prüfst, solltest du besonders auf diese Punkte achten.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
        <NumItem n={1} t="Falscher Umlageschlüssel" d="Viele Betriebskosten werden nach Wohnfläche, Anzahl der Bewohner oder Verbrauch verteilt. Wenn ein falscher Schlüssel verwendet wird, kann dein Anteil deutlich höher ausfallen." />
        <NumItem n={2} t="Nicht umlagefähige Kosten" d="Reparaturen, Instandhaltung, Verwaltungskosten und Bankgebühren dürfen nicht auf Mieter umgelegt werden. Tauchen sie trotzdem auf, solltest du die Abrechnung prüfen." />
        <NumItem n={3} t="Falsche Wohnfläche" d="Viele Nebenkosten werden anteilig nach Wohnfläche berechnet. Wenn die Fläche größer angegeben ist als tatsächlich, zahlst du automatisch mehr. Ein Vergleich mit deinem Mietvertrag hilft." />
        <NumItem n={4} t="Unplausible Heizkosten" d="Wenn deine Heizkosten deutlich höher sind als im Vorjahr oder bei ähnlichen Wohnungen, kann das auf falsche Zählerstände, falsche Ablesung oder falsche Kostenverteilung hinweisen." />
        <NumItem n={5} t="Doppelt berechnete Kosten" d="In manchen Abrechnungen tauchen Kosten mehrmals oder in verschiedenen Kategorien auf – zum Beispiel Hausmeisterkosten zusätzlich als Reinigungskosten. Diese Fehler können mehrere hundert Euro Unterschied verursachen." />
      </div>

      <h2 id="rechte">Welche Rechte Mieter haben</h2>
      <p>Viele Mieter wissen nicht, dass sie mehrere wichtige Rechte haben:</p>
      <ul>
        <li><strong>Belegeinsicht:</strong> Du kannst Rechnungen und Belege beim Vermieter einsehen.</li>
        <li>Fragen zur Abrechnung stellen und Erklärungen verlangen.</li>
        <li>Einwände gegen die Abrechnung einlegen – in der Regel innerhalb von 12 Monaten nach Erhalt.</li>
      </ul>
      <p>Wenn du Zweifel hast, solltest du die Abrechnung daher möglichst früh prüfen.</p>

      <h2 id="erkennen">Wie du Fehler in deiner Nebenkostenabrechnung erkennst</h2>
      <p>Eine gute Methode ist eine systematische Prüfung Schritt für Schritt:</p>
      <ul>
        <li>Stimmt der Abrechnungszeitraum (maximal 12 Monate)?</li>
        <li>Wurde die Abrechnung rechtzeitig erstellt?</li>
        <li>Stimmen die Vorauszahlungen?</li>
        <li>Sind alle Kostenpositionen nachvollziehbar?</li>
        <li>Ist der Umlageschlüssel korrekt angewendet?</li>
      </ul>
      <p>Wenn dir etwas ungewöhnlich vorkommt, lohnt sich eine genauere Analyse – und ein Widerspruch ist oft einfacher als gedacht.</p>

      <h2 id="pruefen">Nebenkostenabrechnung einfach prüfen</h2>
      <p>Die manuelle Prüfung einer Nebenkostenabrechnung kann kompliziert sein, besonders wenn viele Kostenpositionen enthalten sind. <Link href="/" style={{ color: '#0d9488', textDecoration: 'underline', fontWeight: 600 }}>nexoen</Link> kann Mietern helfen, ihre Abrechnung schneller zu verstehen – die App analysiert deine Nebenkosten und zeigt mögliche Auffälligkeiten oder ungewöhnlich hohe Kosten.</p>
      <NexoenCTA />

      <h2 id="fazit">Fazit</h2>
      <p>Fehler in Nebenkostenabrechnungen sind keine Seltenheit. Schon kleine Rechenfehler oder falsche Kostenverteilungen können dazu führen, dass Mieter zu viel bezahlen. Deshalb lohnt es sich immer:</p>
      <ul>
        <li>Die Abrechnung genau zu prüfen</li>
        <li>Ungewöhnliche Kosten zu hinterfragen</li>
        <li>Bei Bedarf Belege einzusehen</li>
      </ul>
      <p>Wenn du deine Nebenkostenabrechnung besser verstehen und mögliche Fehler schneller erkennen möchtest, <Link href="/register" style={{ color: '#0d9488', textDecoration: 'underline', fontWeight: 600 }}>teste nexoen kostenlos</Link>.</p>
    </>
  );
}

function ZuHochContent({ excerpt }: { excerpt: string }) {
  return (
    <>
      <p className="text-xl text-slate-500 leading-relaxed mb-8 font-light">{excerpt}</p>
      <Toc items={[
        ['warum-gestiegen', 'Warum Nebenkosten in den letzten Jahren gestiegen sind'],
        ['ungewoehnlich', 'Wann eine Nebenkostenabrechnung ungewöhnlich hoch ist'],
        ['gruende', 'Die häufigsten Gründe für hohe Nachzahlungen'],
        ['was-tun', 'Was Mieter bei einer hohen Nebenkostenabrechnung tun können'],
        ['pruefen', 'Nebenkostenabrechnung einfacher prüfen'],
        ['fazit', 'Fazit'],
      ]} />

      <h2 id="warum-gestiegen">Warum Nebenkosten in den letzten Jahren gestiegen sind</h2>
      <p>Ein wichtiger Grund für hohe Nebenkosten sind gestiegene Energiepreise. Besonders Heizkosten sind in vielen Haushalten stark gestiegen. In vielen Mehrfamilienhäusern machen Heiz- und Warmwasserkosten mehr als die Hälfte der gesamten Nebenkosten aus.</p>
      <p>Weitere Faktoren, die Nebenkosten erhöhen können:</p>
      <ul>
        <li>Steigende Energiepreise</li>
        <li>Höhere Wartungs- und Servicekosten</li>
        <li>Gestiegene Müllgebühren</li>
        <li>Höhere Grundsteuer</li>
        <li>Höhere Kosten für Hausmeister oder Reinigung</li>
      </ul>
      <p>Auch ein besonders kalter Winter kann dazu führen, dass der Energieverbrauch deutlich steigt.</p>

      <h2 id="ungewoehnlich">Wann eine Nebenkostenabrechnung ungewöhnlich hoch ist</h2>
      <p>Nicht jede hohe Nachzahlung bedeutet automatisch einen Fehler. Trotzdem solltest du besonders aufmerksam werden, wenn:</p>
      <ul>
        <li>Deine Kosten deutlich höher sind als im Vorjahr</li>
        <li>Deine Kosten viel höher sind als bei ähnlichen Wohnungen</li>
        <li>Einzelne Positionen ungewöhnlich hoch erscheinen</li>
        <li>Neue Kosten auftauchen, die du nicht kennst</li>
      </ul>
      <div className="bg-slate-100 border border-slate-200 rounded-[4px] p-5 my-6">
        <p style={{ fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem' }}>Beispiel</p>
        <p style={{ color: '#64748b', margin: 0 }}>Wenn deine Heizkosten plötzlich 30–50 % höher sind als im Vorjahr, lohnt sich ein genauer Blick auf die Abrechnung – und auf mögliche Fehler in der Kostenverteilung.</p>
      </div>

      <h2 id="gruende">Die häufigsten Gründe für hohe Nachzahlungen</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
        <NumItem n={1} t="Gestiegene Energiepreise" d="Wenn Energiepreise steigen, wirkt sich das direkt auf Heiz- und Warmwasserkosten aus. Gerade in Gebäuden mit älteren Heizsystemen oder schlechter Dämmung können diese Kosten stark ansteigen." />
        <NumItem n={2} t="Zu niedrige Vorauszahlungen" d="Manchmal sind die monatlichen Vorauszahlungen im Mietvertrag zu niedrig angesetzt. Wenn die tatsächlichen Kosten höher sind, entsteht automatisch eine Nachzahlung." />
        <NumItem n={3} t="Hoher Energieverbrauch" d="Sehr hohe Raumtemperaturen, häufiges Heizen bei geöffneten Fenstern oder langer Warmwasserverbrauch können den Energieverbrauch deutlich beeinflussen." />
        <NumItem n={4} t="Fehler in der Nebenkostenabrechnung" d="Falscher Umlageschlüssel, falsche Wohnfläche, doppelt berechnete Kosten oder falsche Zählerstände können schnell mehrere hundert Euro Unterschied ausmachen." />
      </div>

      <h2 id="was-tun">Was Mieter bei einer hohen Nebenkostenabrechnung tun können</h2>
      <p>Wenn deine Nebenkostenabrechnung ungewöhnlich hoch ist, solltest du systematisch vorgehen.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
        <NumItem n={1} t="Abrechnung genau prüfen" d="Kontrolliere Abrechnungszeitraum, Vorauszahlungen, Kostenpositionen und Umlageschlüssel. Schon ein einfacher Vergleich mit dem Vorjahr kann Auffälligkeiten zeigen." />
        <NumItem n={2} t="Belegeinsicht verlangen" d="Als Mieter hast du das Recht, die Originalrechnungen einzusehen. Dadurch kannst du prüfen, ob die angegebenen Kosten tatsächlich entstanden sind." />
        <NumItem n={3} t="Einwände erheben" d="Wenn du Fehler entdeckst, kannst du Einwände gegen die Abrechnung einlegen. In der Regel hast du dafür 12 Monate Zeit nach Erhalt der Nebenkostenabrechnung." />
      </div>

      <div style={{ borderLeft: '4px solid #14b8a6', background: 'linear-gradient(to right, #f0fdfa, transparent)', borderRadius: '0 4px 4px 0', padding: '1.25rem 1.5rem', margin: '2rem 0' }}>
        <p style={{ color: '#0f172a', fontWeight: 600, margin: '0 0 0.5rem' }}>Tipp: Zahle unter Vorbehalt</p>
        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Wenn du Zweifel an der Abrechnung hast, kannst du die Nachzahlung unter Vorbehalt leisten. So vermeidest du Mahnungen, während du die Abrechnung noch prüfst.</p>
      </div>

      <h2 id="pruefen">Nebenkostenabrechnung einfacher prüfen</h2>
      <p>Viele Mieter finden Nebenkostenabrechnungen kompliziert. <Link href="/" style={{ color: '#0d9488', textDecoration: 'underline', fontWeight: 600 }}>nexoen</Link> kann dabei helfen – die App analysiert deine Nebenkosten und zeigt ungewöhnlich hohe Kosten sowie mögliche Fehler in der Abrechnung.</p>
      <NexoenCTA />

      <h2 id="fazit">Fazit</h2>
      <p>Eine hohe Nebenkostenabrechnung kann verschiedene Ursachen haben – von steigenden Energiepreisen bis hin zu Fehlern in der Abrechnung. Deshalb solltest du immer:</p>
      <ul>
        <li>Deine Nebenkostenabrechnung prüfen</li>
        <li>Ungewöhnliche Kosten hinterfragen</li>
        <li>Belege einsehen, wenn etwas unklar ist</li>
      </ul>
      <p>Mit einer systematischen Prüfung kannst du mögliche Fehler erkennen und vermeiden, dass du unnötig zu viel bezahlst. <Link href="/register" style={{ color: '#0d9488', textDecoration: 'underline', fontWeight: 600 }}>nexoen kostenlos testen</Link> und deine Nebenkosten das ganze Jahr im Blick behalten.</p>
    </>
  );
}

function VermieterKostenContent({ excerpt }: { excerpt: string }) {
  return (
    <>
      <p className="text-xl text-slate-500 leading-relaxed mb-8 font-light">{excerpt}</p>
      <Toc items={[
        ['was-sind', 'Was sind Nebenkosten bzw. Betriebskosten?'],
        ['erlaubt', 'Welche Nebenkosten Vermieter abrechnen dürfen'],
        ['nicht-erlaubt', 'Kosten, die Vermieter nicht umlegen dürfen'],
        ['verteilung', 'Wie Nebenkosten auf Mieter verteilt werden'],
        ['pruefen', 'Nebenkostenabrechnung einfacher prüfen'],
        ['fazit', 'Fazit'],
      ]} />

      <h2 id="was-sind">Was sind Nebenkosten bzw. Betriebskosten?</h2>
      <p>Nebenkosten werden im Mietrecht meist <strong>Betriebskosten</strong> genannt. Dabei handelt es sich um laufende Kosten, die durch den Betrieb eines Gebäudes entstehen. Diese Kosten darf der Vermieter auf Mieter umlegen, wenn dies im Mietvertrag vereinbart wurde.</p>
      <div className="bg-teal-50 border border-teal-100 rounded-[4px] p-5 my-6">
        <p style={{ fontWeight: 700, color: '#0f766e', margin: '0 0 0.5rem' }}>Rechtliche Grundlage</p>
        <p style={{ color: '#0f766e', fontSize: '0.9rem', margin: 0 }}>Die <strong>Betriebskostenverordnung (BetrKV)</strong> listet alle umlagefähigen Kostenarten auf. Nur Kosten, die dort aufgeführt sind und im Mietvertrag vereinbart wurden, dürfen auf Mieter verteilt werden.</p>
      </div>

      <h2 id="erlaubt">Welche Nebenkosten Vermieter abrechnen dürfen</h2>
      <p>Zu den typischen umlagefähigen Nebenkosten gehören unter anderem:</p>
      <ul>
        <li><strong>Grundsteuer</strong> – wird von der Gemeinde erhoben und darf umgelegt werden</li>
        <li><strong>Wasserkosten</strong> – Frischwasser sowie Abwassergebühren</li>
        <li><strong>Heizkosten und Warmwasser</strong> – Brennstoffkosten, Wartung, Betrieb</li>
        <li><strong>Müllabfuhr</strong> – Gebühren für die Entsorgung von Hausmüll</li>
        <li><strong>Straßenreinigung und Winterdienst</strong></li>
        <li><strong>Hausmeister</strong> – für Reinigung, Pflege oder kleine Wartungen</li>
        <li><strong>Gebäudereinigung</strong> – Treppenhaus, Keller, Gemeinschaftsflächen</li>
        <li><strong>Gartenpflege</strong></li>
        <li><strong>Gebäudeversicherung</strong> – Feuer, Sturm, Leitungswasser</li>
        <li><strong>Allgemeinstrom</strong> – Treppenhaus, Keller, Außenbeleuchtung, Aufzüge</li>
      </ul>

      <h2 id="nicht-erlaubt">Kosten, die Vermieter nicht umlegen dürfen</h2>
      <p>Viele Mieter wissen nicht, dass einige Kosten nicht in der Nebenkostenabrechnung stehen dürfen:</p>
      <ul>
        <li><strong>Reparaturen</strong> – wenn etwas kaputt geht und repariert werden muss</li>
        <li><strong>Instandhaltung</strong> – z. B. Austausch einer Heizung oder Renovierungen</li>
        <li><strong>Verwaltungskosten</strong> – Kosten für Hausverwaltung oder Buchhaltung</li>
        <li><strong>Bankgebühren</strong> – für Kontoführung oder Zahlungsabwicklung</li>
        <li><strong>Rechtskosten</strong> – Anwälte oder rechtliche Streitigkeiten</li>
      </ul>
      <p>Wenn solche Kosten in deiner Nebenkostenabrechnung auftauchen, solltest du die Abrechnung genauer prüfen.</p>

      <h2 id="verteilung">Wie Nebenkosten auf Mieter verteilt werden</h2>
      <p>Die Gesamtkosten eines Gebäudes werden auf alle Wohnungen verteilt. Dafür gibt es verschiedene Umlageschlüssel:</p>
      <ul>
        <li><strong>Wohnfläche</strong> – die Kosten werden proportional zur Wohnungsgröße verteilt</li>
        <li><strong>Anzahl der Bewohner</strong> – manchmal bei Wasser oder Müll verwendet</li>
        <li><strong>Verbrauch</strong> – besonders bei Heizkosten üblich</li>
      </ul>
      <p>Bei Heizkosten gilt in Deutschland häufig eine Aufteilung von 50–70 % nach Verbrauch und 30–50 % nach Wohnfläche. Dadurch soll ein fairer Energieverbrauch gefördert werden.</p>

      <h2 id="pruefen">Nebenkostenabrechnung einfach prüfen</h2>
      <p>Wenn du weißt, welche Kosten erlaubt sind, kannst du deine Abrechnung viel gezielter prüfen. <Link href="/" style={{ color: '#0d9488', textDecoration: 'underline', fontWeight: 600 }}>nexoen</Link> analysiert deine Nebenkostenabrechnung automatisch und zeigt mögliche Auffälligkeiten oder ungewöhnliche Kosten – so siehst du auf einen Blick, ob alles plausibel ist.</p>
      <NexoenCTA />

      <h2 id="fazit">Fazit</h2>
      <p>Nicht alle Kosten dürfen in einer Nebenkostenabrechnung auftauchen. Vermieter dürfen nur bestimmte Betriebskosten auf Mieter umlegen. Deshalb lohnt es sich immer:</p>
      <ul>
        <li>Die einzelnen Kostenpositionen zu prüfen</li>
        <li>Ungewöhnliche Kosten zu hinterfragen</li>
        <li>Die Abrechnung mit dem Mietvertrag zu vergleichen</li>
      </ul>
      <p>Mit <Link href="/register" style={{ color: '#0d9488', textDecoration: 'underline', fontWeight: 600 }}>nexoen</Link> behältst du deine Nebenkosten das ganze Jahr im Blick und weißt sofort, wenn etwas nicht stimmt.</p>
    </>
  );
}

function FristenContent({ excerpt }: { excerpt: string }) {
  return (
    <>
      <p className="text-xl text-slate-500 leading-relaxed mb-8 font-light">{excerpt}</p>
      <Toc items={[
        ['vermieter-frist', 'Wann Vermieter die Nebenkostenabrechnung schicken müssen'],
        ['mieter-frist', 'Wie lange Mieter Zeit haben, die Abrechnung zu prüfen'],
        ['nachzahlung', 'Wann eine Nachzahlung bezahlt werden muss'],
        ['konsequenzen', 'Was passiert, wenn Fristen überschritten werden'],
        ['pruefen', 'Nebenkostenabrechnung einfacher prüfen'],
        ['fazit', 'Fazit'],
      ]} />

      <h2 id="vermieter-frist">Wann Vermieter die Nebenkostenabrechnung schicken müssen</h2>
      <p>Im deutschen Mietrecht gilt eine klare Regel: Der Vermieter muss die Nebenkostenabrechnung spätestens <strong>12 Monate nach Ende des Abrechnungszeitraums</strong> zustellen. Der Abrechnungszeitraum beträgt meistens ein Kalenderjahr.</p>
      <div className="bg-slate-100 border border-slate-200 rounded-[4px] p-5 my-6">
        <p style={{ fontWeight: 700, color: '#0f172a', margin: '0 0 0.75rem' }}>Beispiel</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p style={{ color: '#64748b', margin: 0 }}><strong>Abrechnungszeitraum:</strong> 01.01.2024 – 31.12.2024</p>
          <p style={{ color: '#64748b', margin: 0 }}><strong>Spätester Termin für die Zustellung:</strong> 31.12.2025</p>
        </div>
      </div>
      <p>Wenn die Abrechnung später kommt, kann der Vermieter in vielen Fällen keine Nachzahlung mehr verlangen. Das ist ein wichtiger Schutz für Mieter.</p>

      <h2 id="mieter-frist">Wie lange Mieter Zeit haben, die Abrechnung zu prüfen</h2>
      <p>Auch Mieter haben eine gesetzliche Frist: Du hast <strong>12 Monate Zeit</strong>, um Einwände gegen die Nebenkostenabrechnung zu erheben. Diese Frist beginnt mit dem Tag, an dem du die Abrechnung erhältst.</p>
      <p>Innerhalb dieser Zeit kannst du:</p>
      <ul>
        <li>Die Abrechnung prüfen</li>
        <li>Fragen stellen</li>
        <li>Belege einsehen</li>
        <li>Fehler melden</li>
      </ul>
      <p>Nach Ablauf dieser Frist können Einwände deutlich schwieriger werden. Deshalb lohnt es sich, die Abrechnung früh zu prüfen.</p>

      <h2 id="nachzahlung">Wann eine Nachzahlung bezahlt werden muss</h2>
      <p>Wenn aus der Nebenkostenabrechnung eine Nachzahlung entsteht, muss diese normalerweise innerhalb von etwa <strong>30 Tagen</strong> bezahlt werden. Viele Vermieter geben ein konkretes Zahlungsziel in der Abrechnung an.</p>
      <div style={{ borderLeft: '4px solid #14b8a6', background: 'linear-gradient(to right, #f0fdfa, transparent)', borderRadius: '0 4px 4px 0', padding: '1.25rem 1.5rem', margin: '2rem 0' }}>
        <p style={{ color: '#0f172a', fontWeight: 600, margin: '0 0 0.5rem' }}>Tipp: Unter Vorbehalt zahlen</p>
        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Wenn du Zweifel an der Abrechnung hast, kannst du die Nachzahlung unter Vorbehalt zahlen. So vermeidest du mögliche Mahnungen, während du die Abrechnung noch prüfst.</p>
      </div>

      <h2 id="konsequenzen">Was passiert, wenn Fristen überschritten werden</h2>
      <p>Die Fristen können große Auswirkungen haben:</p>
      <ul>
        <li><strong>Vermieter zu spät:</strong> Kann meist keine Nachzahlung mehr verlangen</li>
        <li><strong>Mieter zu spät:</strong> Einwände und Ansprüche können schwieriger durchzusetzen sein</li>
      </ul>
      <p>Deshalb ist es sinnvoll, die Abrechnung möglichst frühzeitig zu prüfen, sobald sie ankommt.</p>

      <h2 id="pruefen">Nebenkostenabrechnung einfacher prüfen</h2>
      <p>Viele Nebenkostenabrechnungen enthalten zahlreiche Kostenpositionen und komplizierte Berechnungen. <Link href="/" style={{ color: '#0d9488', textDecoration: 'underline', fontWeight: 600 }}>nexoen</Link> analysiert deine Nebenkosten automatisch und zeigt mögliche Auffälligkeiten – so erkennst du schnell, ob deine Abrechnung plausibel ist und ob du innerhalb der Frist handeln musst.</p>
      <NexoenCTA />

      <h2 id="fazit">Fazit</h2>
      <p>Bei der Nebenkostenabrechnung spielen Fristen eine wichtige Rolle. Die wichtigsten Punkte für Mieter:</p>
      <ul>
        <li>Vermieter haben 12 Monate Zeit für die Abrechnung</li>
        <li>Mieter haben 12 Monate Zeit für Einwände</li>
        <li>Nachzahlungen müssen meist innerhalb von 30 Tagen bezahlt werden</li>
      </ul>
      <p>Mit <Link href="/register" style={{ color: '#0d9488', textDecoration: 'underline', fontWeight: 600 }}>nexoen</Link> behältst du deine Nebenkosten das ganze Jahr im Blick – und bist auf die Abrechnung vorbereitet, lange bevor sie eintrifft.</p>
    </>
  );
}

function VerstehenkContent({ excerpt }: { excerpt: string }) {
  return (
    <>
      <p className="text-xl text-slate-500 leading-relaxed mb-8 font-light">{excerpt}</p>
      <Toc items={[
        ['was-ist', 'Was eine Nebenkostenabrechnung eigentlich ist'],
        ['bestandteile', 'Welche Bestandteile eine Nebenkostenabrechnung hat'],
        ['umlageschluessel', 'Was der Umlageschlüssel bedeutet'],
        ['kostenanteil', 'Wie dein persönlicher Kostenanteil berechnet wird'],
        ['pruefen', 'Nebenkostenabrechnung einfacher prüfen'],
        ['fazit', 'Fazit'],
      ]} />

      <h2 id="was-ist">Was eine Nebenkostenabrechnung eigentlich ist</h2>
      <p>Die Nebenkostenabrechnung (auch Betriebskostenabrechnung genannt) zeigt, welche laufenden Kosten für ein Gebäude im vergangenen Jahr entstanden sind. Zu den typischen Nebenkosten gehören:</p>
      <ul>
        <li>Heizkosten</li>
        <li>Warmwasser</li>
        <li>Müllabfuhr</li>
        <li>Hausmeister</li>
        <li>Gebäudeversicherung</li>
        <li>Grundsteuer</li>
        <li>Reinigung des Treppenhauses</li>
      </ul>
      <p>Als Mieter zahlst du diese Kosten normalerweise jeden Monat als Vorauszahlung. Am Ende des Jahres erstellt der Vermieter eine Abrechnung und vergleicht Vorauszahlungen mit den tatsächlichen Kosten – das Ergebnis ist entweder eine <strong style={{ color: '#c2410c' }}>Nachzahlung</strong> oder ein <strong style={{ color: '#0f766e' }}>Guthaben</strong>.</p>

      <h2 id="bestandteile">Welche Bestandteile eine Nebenkostenabrechnung hat</h2>
      <p>Eine korrekte Nebenkostenabrechnung enthält mehrere wichtige Informationen:</p>
      <ul>
        <li><strong>Abrechnungszeitraum</strong> – der Zeitraum, für den die Kosten berechnet wurden (meist ein Jahr)</li>
        <li><strong>Gesamtkosten des Gebäudes</strong> – die gesamten Betriebskosten für alle Wohnungen</li>
        <li><strong>Umlageschlüssel</strong> – die Methode, mit der Kosten auf einzelne Wohnungen verteilt werden</li>
        <li><strong>Dein Anteil</strong> – der Betrag, den du als Mieter zahlen musst</li>
        <li><strong>Vorauszahlungen</strong> – die Summe der bereits bezahlten monatlichen Nebenkosten</li>
        <li><strong>Endergebnis</strong> – Nachzahlung oder Guthaben</li>
      </ul>
      <p>Wenn einer dieser Punkte fehlt, kann die Abrechnung unvollständig sein.</p>

      <h2 id="umlageschluessel">Was der Umlageschlüssel bedeutet</h2>
      <p>Der Umlageschlüssel bestimmt, wie die Gesamtkosten eines Gebäudes auf die einzelnen Wohnungen verteilt werden. Die häufigsten Umlageschlüssel sind:</p>
      <ul>
        <li><strong>Wohnfläche</strong> – Kosten werden proportional zur Größe der Wohnung verteilt</li>
        <li><strong>Anzahl der Bewohner</strong> – manchmal bei Wasser oder Müll verwendet</li>
        <li><strong>Verbrauch</strong> – besonders bei Heizkosten üblich</li>
      </ul>
      <p>Bei Heizkosten schreibt die Heizkostenverordnung vor, dass ein großer Teil nach tatsächlichem Verbrauch verteilt werden muss – typisch sind 50–70 % nach Verbrauch, 30–50 % nach Wohnfläche. Das soll dafür sorgen, dass sparsamer Energieverbrauch belohnt wird.</p>

      <h2 id="kostenanteil">Wie dein persönlicher Kostenanteil berechnet wird</h2>
      <div className="bg-slate-100 border border-slate-200 rounded-[4px] p-6 my-6">
        <p style={{ fontWeight: 700, color: '#0f172a', margin: '0 0 0.75rem' }}>Rechenbeispiel</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', color: '#64748b', fontSize: '0.9rem' }}>
          <p style={{ margin: 0 }}>Gesamtkosten des Gebäudes: <strong>20.000 €</strong></p>
          <p style={{ margin: 0 }}>Gesamtwohnfläche: <strong>1.000 m²</strong></p>
          <p style={{ margin: 0 }}>Deine Wohnfläche: <strong>50 m²</strong> → 5 % Anteil</p>
          <p style={{ margin: 0, marginTop: '0.5rem' }}>Dein Anteil: <strong>1.000 €</strong></p>
          <p style={{ margin: 0 }}>Deine Vorauszahlungen: <strong>900 €</strong></p>
          <p style={{ margin: 0, color: '#c2410c' }}>Nachzahlung: <strong>100 €</strong></p>
        </div>
      </div>

      <h2 id="pruefen">Nebenkostenabrechnung einfacher prüfen</h2>
      <p>Nebenkostenabrechnungen können trotz klarer Struktur kompliziert wirken. <Link href="/" style={{ color: '#0d9488', textDecoration: 'underline', fontWeight: 600 }}>nexoen</Link> hilft dir dabei, die Abrechnung schneller zu verstehen – die App analysiert deine Nebenkosten automatisch und erklärt einzelne Kostenpositionen verständlich.</p>
      <NexoenCTA />

      <h2 id="fazit">Fazit</h2>
      <p>Eine Nebenkostenabrechnung wirkt oft kompliziert, folgt aber einer klaren Struktur. Wenn du verstehst, wie die Kosten aufgebaut sind, wie der Umlageschlüssel funktioniert und wie dein Anteil berechnet wird, kannst du deine Abrechnung deutlich besser prüfen.</p>
      <p>Gerade bei hohen Nachzahlungen lohnt sich ein genauer Blick auf die einzelnen Kostenpositionen. <Link href="/register" style={{ color: '#0d9488', textDecoration: 'underline', fontWeight: 600 }}>Teste nexoen kostenlos</Link> und behalte deine Nebenkosten das ganze Jahr im Blick.</p>
    </>
  );
}

function SparenContent({ excerpt }: { excerpt: string }) {
  return (
    <>
      <p className="text-xl text-slate-500 leading-relaxed mb-8 font-light">{excerpt}</p>
      <Toc items={[
        ['warum', 'Warum Nebenkosten immer wichtiger werden'],
        ['kostenfaktoren', 'Die größten Kostenfaktoren in einer Wohnung'],
        ['tipps', '10 praktische Tipps zum Nebenkosten sparen'],
        ['pruefen', 'Nebenkosten besser verstehen und prüfen'],
        ['fazit', 'Fazit'],
      ]} />

      <h2 id="warum">Warum Nebenkosten immer wichtiger werden</h2>
      <p>In vielen Städten steigen nicht nur die Mieten, sondern auch die Nebenkosten. Besonders stark wirken sich folgende Kosten aus:</p>
      <ul>
        <li>Heizkosten</li>
        <li>Warmwasser</li>
        <li>Strom</li>
        <li>Müllgebühren</li>
        <li>Hausmeister und Gebäudereinigung</li>
      </ul>
      <p>In vielen Haushalten machen Heizkosten den größten Anteil der Nebenkosten aus. Deshalb liegt hier auch das größte Sparpotenzial.</p>

      <h2 id="kostenfaktoren">Die größten Kostenfaktoren in einer Wohnung</h2>
      <p>Bevor du Nebenkosten sparen kannst, solltest du wissen, wo die meisten Kosten entstehen:</p>
      <ul>
        <li><strong>Heizkosten</strong> – in vielen Gebäuden 40–60 % der gesamten Nebenkosten</li>
        <li><strong>Warmwasser</strong> – Duschen, Baden und Warmwasserverbrauch</li>
        <li><strong>Allgemeinstrom</strong> – Treppenhaus, Keller, Aufzug</li>
        <li><strong>Gebäudedienstleistungen</strong> – Hausmeister, Reinigung, Gartenpflege</li>
      </ul>
      <p>Viele dieser Kosten kannst du nicht komplett kontrollieren – aber dein Energieverbrauch hat einen großen Einfluss auf die Heiz- und Wasserkosten.</p>

      <h2 id="tipps">10 praktische Tipps zum Nebenkosten sparen</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
        <NumItem n={1} t="Raumtemperatur leicht senken" d="Schon 1 Grad weniger Raumtemperatur kann den Energieverbrauch um etwa 6 % reduzieren. Besonders im Schlafzimmer (17–18 °C) lässt sich viel sparen." />
        <NumItem n={2} t="Stoßlüften statt gekippter Fenster" d="Kurzes Stoßlüften (5–10 Minuten, Fenster ganz auf) spart Energie und verhindert Wärmeverlust durch dauerhaft gekippte Fenster." />
        <NumItem n={3} t="Heizkörper nicht verdecken" d="Möbel oder Vorhänge vor Heizkörpern blockieren die Wärme und zwingen die Heizung, stärker zu arbeiten." />
        <NumItem n={4} t="Warmwasser bewusst nutzen" d="Kürzer duschen und niedrigere Temperaturen beim Duschen können den Warmwasserverbrauch und damit die Nebenkosten deutlich senken." />
        <NumItem n={5} t="Heizkörper regelmäßig entlüften" d="Luft im Heizkörper reduziert die Heizleistung. Gluckernde Geräusche sind ein Anzeichen dafür, dass ein Entlüften helfen würde." />
        <NumItem n={6} t="Türen zwischen Räumen schließen" d="So bleibt die Wärme besser im Raum und die Heizung muss weniger arbeiten." />
        <NumItem n={7} t="Fenster abdichten" d="Undichte Fenster führen zu Wärmeverlust – eine einfache Abdichtung kann spürbar helfen." />
        <NumItem n={8} t="Waschmaschine effizient nutzen" d="Wasche bei niedrigeren Temperaturen und mit voller Trommel. Das spart Strom und Wasser." />
        <NumItem n={9} t="Standby-Geräte vermeiden" d="Auch Standby-Strom summiert sich über das Jahr. Steckerleisten mit Schalter helfen, Geräte vollständig auszuschalten." />
        <NumItem n={10} t="Verbrauch regelmäßig überprüfen" d="Wenn du deinen Energieverbrauch kennst, kannst du ihn besser kontrollieren. Tools wie nexoen helfen dir dabei, deinen Verbrauch das ganze Jahr im Blick zu behalten." />
      </div>

      <h2 id="pruefen">Nebenkosten besser verstehen und prüfen</h2>
      <p>Auch wenn du Energie sparst, lohnt sich ein Blick auf deine Nebenkostenabrechnung. Viele Mieter prüfen ihre Abrechnung nur oberflächlich, obwohl dort manchmal Fehler auftreten. <Link href="/" style={{ color: '#0d9488', textDecoration: 'underline', fontWeight: 600 }}>nexoen</Link> hilft dir, deine laufenden Kosten zu tracken und deine Abrechnung besser zu verstehen.</p>
      <NexoenCTA />

      <h2 id="fazit">Fazit</h2>
      <p>Nebenkosten lassen sich nicht komplett vermeiden, aber durch bewusstes Verhalten deutlich reduzieren. Besonders wichtig sind effizientes Heizen, bewusster Warmwasserverbrauch und regelmäßige Kontrolle der Nebenkostenabrechnung.</p>
      <p>Schon kleine Veränderungen im Alltag können langfristig helfen, deine Nebenkosten zu senken. Mit <Link href="/register" style={{ color: '#0d9488', textDecoration: 'underline', fontWeight: 600 }}>nexoen</Link> siehst du sofort, wo dein Verbrauch liegt und wo du noch sparen kannst.</p>
    </>
  );
}

function HeizkostenContent({ excerpt }: { excerpt: string }) {
  return (
    <>
      <p className="text-xl text-slate-500 leading-relaxed mb-8 font-light">{excerpt}</p>
      <Toc items={[
        ['warum-hoch', 'Warum Heizkosten so hoch sein können'],
        ['berechnung', 'Wie Heizkosten in Deutschland berechnet werden'],
        ['tipps', 'Die besten Tipps, um Heizkosten zu senken'],
        ['fehler', 'Häufige Fehler beim Heizen'],
        ['pruefen', 'Heizkosten und Nebenkostenabrechnung prüfen'],
        ['fazit', 'Fazit'],
      ]} />

      <h2 id="warum-hoch">Warum Heizkosten so hoch sein können</h2>
      <p>Die Höhe der Heizkosten hängt von mehreren Faktoren ab:</p>
      <ul>
        <li>Energiepreise (Gas, Öl oder Fernwärme)</li>
        <li>Dämmung des Gebäudes</li>
        <li>Alter der Heizungsanlage</li>
        <li>Größe der Wohnung</li>
        <li>Heizverhalten der Bewohner</li>
      </ul>
      <p>In schlecht gedämmten Gebäuden kann ein großer Teil der Wärme verloren gehen. Dadurch muss mehr geheizt werden, um eine angenehme Raumtemperatur zu erreichen – und die Kosten steigen.</p>

      <h2 id="berechnung">Wie Heizkosten in Deutschland berechnet werden</h2>
      <p>In Deutschland regelt die <strong>Heizkostenverordnung</strong>, wie Heizkosten auf Mieter verteilt werden müssen. Ein Teil der Kosten wird nach dem tatsächlichen Verbrauch berechnet.</p>
      <div className="bg-teal-50 border border-teal-100 rounded-[4px] p-5 my-6">
        <p style={{ fontWeight: 700, color: '#0f766e', margin: '0 0 0.5rem' }}>Typische Aufteilung</p>
        <ul style={{ color: '#0f766e', paddingLeft: '1.25rem', margin: 0 }}>
          <li>50–70 % nach Verbrauch</li>
          <li>30–50 % nach Wohnfläche</li>
        </ul>
        <p style={{ color: '#0f766e', fontSize: '0.85rem', margin: '0.75rem 0 0' }}>Das bedeutet: Wer weniger heizt, kann auch Heizkosten sparen.</p>
      </div>

      <h2 id="tipps">Die besten Tipps, um Heizkosten zu senken</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
        <NumItem n={1} t="Die richtige Raumtemperatur wählen" d="Wohnzimmer ~20–21 °C, Schlafzimmer ~17–18 °C, Küche ~18–20 °C. Schon ein Grad weniger kann den Energieverbrauch spürbar senken." />
        <NumItem n={2} t="Stoßlüften statt Dauerlüften" d="Fenster komplett öffnen, 5–10 Minuten lüften, dann wieder schließen. So wird die Luft ausgetauscht, ohne dass die Wände auskühlen." />
        <NumItem n={3} t="Heizkörper frei halten" d="Wenn Heizkörper von Möbeln oder Vorhängen verdeckt sind, kann sich die Wärme nicht richtig verteilen – die Heizung muss stärker arbeiten." />
        <NumItem n={4} t="Heizkörper entlüften" d="Wenn sich Luft im Heizkörper befindet (gluckernde Geräusche, nur teilweise warm), kann ein Entlüften die Effizienz deutlich verbessern." />
        <NumItem n={5} t="Türen geschlossen halten" d="Besonders zwischen unterschiedlich warmen Räumen sollte die Tür geschlossen bleiben, damit warme Luft nicht entweicht." />
      </div>

      <h2 id="fehler">Häufige Fehler beim Heizen</h2>
      <p>Viele Mieter machen unbewusst Fehler, die den Energieverbrauch erhöhen:</p>
      <ul>
        <li>Heizung komplett ausschalten und später stark aufdrehen</li>
        <li>Dauerhaft gekippte Fenster</li>
        <li>Möbel direkt vor Heizkörpern</li>
        <li>Sehr hohe Raumtemperaturen (22 °C+)</li>
      </ul>
      <p>Diese Gewohnheiten können dazu führen, dass die Heizkosten unnötig steigen – und am Ende des Jahres eine hohe Nachzahlung entsteht.</p>

      <h2 id="pruefen">Heizkosten und Nebenkostenabrechnung prüfen</h2>
      <p>Da Heizkosten einen großen Teil der Nebenkosten ausmachen, lohnt sich ein genauer Blick auf die Abrechnung. Du solltest prüfen, ob der Verbrauch plausibel ist, der Umlageschlüssel korrekt angewendet wurde und die Kosten im Vergleich zum Vorjahr stark gestiegen sind. <Link href="/" style={{ color: '#0d9488', textDecoration: 'underline', fontWeight: 600 }}>nexoen</Link> hilft dir dabei, deine Heizkosten laufend zu tracken und mögliche Auffälligkeiten zu erkennen.</p>
      <NexoenCTA />

      <h2 id="fazit">Fazit</h2>
      <p>Heizkosten gehören zu den größten Nebenkosten in einer Wohnung. Durch bewusstes Heizen und Lüften kannst du jedoch viel Energie sparen. Die wichtigsten Maßnahmen:</p>
      <ul>
        <li>Richtige Raumtemperatur</li>
        <li>Stoßlüften statt gekippter Fenster</li>
        <li>Freie Heizkörper</li>
        <li>Regelmäßige Kontrolle der Nebenkostenabrechnung</li>
      </ul>
      <p>Mit <Link href="/register" style={{ color: '#0d9488', textDecoration: 'underline', fontWeight: 600 }}>nexoen</Link> siehst du jederzeit, wie sich dein Heizverhalten auf die Kosten auswirkt – und kannst frühzeitig gegensteuern.</p>
    </>
  );
}

function EinspruchContent({ excerpt }: { excerpt: string }) {
  return (
    <>
      <p className="text-xl text-slate-500 leading-relaxed mb-8 font-light">{excerpt}</p>
      <Toc items={[
        ['wann', 'Wann ein Einspruch gegen die Nebenkostenabrechnung sinnvoll ist'],
        ['fristen', 'Welche Fristen Mieter beachten müssen'],
        ['schritt-fuer-schritt', 'Schritt-für-Schritt: So legst du Einspruch ein'],
        ['rechte', 'Welche Rechte Mieter bei der Prüfung haben'],
        ['pruefen', 'Nebenkostenabrechnung einfacher prüfen'],
        ['fazit', 'Fazit'],
      ]} />

      <h2 id="wann">Wann ein Einspruch gegen die Nebenkostenabrechnung sinnvoll ist</h2>
      <p>Ein Einspruch lohnt sich immer dann, wenn du Zweifel an der Richtigkeit der Abrechnung hast. Typische Gründe für einen Widerspruch können sein:</p>
      <ul>
        <li>Ungewöhnlich hohe Heizkosten</li>
        <li>Kostenpositionen, die du nicht verstehst</li>
        <li>Kosten, die nicht umlagefähig sind (z. B. Reparaturen, Verwaltung)</li>
        <li>Falsche Wohnfläche</li>
        <li>Falscher Umlageschlüssel</li>
        <li>Fehlende oder unklare Angaben in der Abrechnung</li>
      </ul>
      <p>Gerade bei großen Wohnanlagen oder komplexen Abrechnungen können solche Fehler vorkommen.</p>

      <h2 id="fristen">Welche Fristen Mieter beachten müssen</h2>
      <p>Im deutschen Mietrecht gilt eine wichtige Regel: Mieter haben <strong>12 Monate Zeit</strong>, um Einwände gegen die Nebenkostenabrechnung zu erheben. Diese Frist beginnt mit dem Tag, an dem du die Abrechnung erhältst.</p>
      <div className="bg-teal-50 border border-teal-100 rounded-[4px] p-5 my-6">
        <p style={{ fontWeight: 700, color: '#0f766e', margin: '0 0 0.5rem' }}>Beispiel</p>
        <p style={{ color: '#0f766e', fontSize: '0.9rem', margin: 0 }}>Abrechnung erhalten am <strong>15. März 2025</strong> → Einwände möglich bis <strong>15. März 2026</strong>. Deshalb: Abrechnung möglichst früh prüfen, damit genügend Zeit für Klärung bleibt.</p>
      </div>

      <h2 id="schritt-fuer-schritt">Schritt-für-Schritt: So legst du Einspruch ein</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
        <NumItem n={1} t="Abrechnung genau prüfen" d="Kontrolliere Abrechnungszeitraum, Vorauszahlungen, einzelne Kostenpositionen, Umlageschlüssel und Verbrauchswerte. Notiere dir alle Punkte, die dir unklar oder unplausibel erscheinen." />
        <NumItem n={2} t="Belegeinsicht verlangen" d="Als Mieter hast du das Recht, Originalbelege einzusehen – Rechnungen von Energieversorgern, Wartungsrechnungen, Ableseprotokolle. So kannst du prüfen, ob die Kosten tatsächlich entstanden sind." />
        <NumItem n={3} t="Schriftlichen Einspruch einlegen" d="Wenn du Fehler findest, reiche deinen Einspruch schriftlich beim Vermieter ein – per E-Mail oder Brief. Beschreibe die Probleme klar und beziehe dich auf konkrete Kostenpositionen." />
      </div>

      <div style={{ borderLeft: '4px solid #14b8a6', background: 'linear-gradient(to right, #f0fdfa, transparent)', borderRadius: '0 4px 4px 0', padding: '1.25rem 1.5rem', margin: '2rem 0' }}>
        <p style={{ color: '#0f172a', fontWeight: 600, margin: '0 0 0.5rem' }}>Wichtig: Ton sachlich halten</p>
        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Ein Einspruch ist ein normaler mietrechtlicher Vorgang. Formuliere deinen Widerspruch höflich und sachlich – das verbessert die Chancen auf eine schnelle Klärung.</p>
      </div>

      <h2 id="rechte">Welche Rechte Mieter bei der Prüfung haben</h2>
      <p>Als Mieter hast du mehrere wichtige Rechte bei der Prüfung der Nebenkostenabrechnung:</p>
      <ul>
        <li><strong>Belegeinsicht:</strong> Du darfst die Rechnungen und Belege beim Vermieter einsehen</li>
        <li><strong>Erklärung verlangen:</strong> Der Vermieter muss erklären können, wie die Kosten berechnet wurden</li>
        <li><strong>Korrektur verlangen:</strong> Wenn Fehler nachgewiesen werden, muss die Abrechnung korrigiert werden</li>
      </ul>

      <h2 id="pruefen">Nebenkostenabrechnung einfacher prüfen</h2>
      <p>Viele Nebenkostenabrechnungen sind komplex – mögliche Fehler sind schwer zu erkennen. <Link href="/" style={{ color: '#0d9488', textDecoration: 'underline', fontWeight: 600 }}>nexoen</Link> analysiert deine Nebenkosten automatisch und zeigt mögliche Auffälligkeiten oder ungewöhnliche Kostenpositionen – so erkennst du schnell, ob sich ein genauere Prüfung oder ein Einspruch lohnt.</p>
      <NexoenCTA />

      <h2 id="fazit">Fazit</h2>
      <p>Ein Einspruch gegen die Nebenkostenabrechnung kann sinnvoll sein, wenn Kosten unklar oder ungewöhnlich hoch erscheinen. Wichtig ist dabei:</p>
      <ul>
        <li>Die Abrechnung sorgfältig zu prüfen</li>
        <li>Die Frist von 12 Monaten zu beachten</li>
        <li>Bei Bedarf Belege einzusehen</li>
        <li>Den Einspruch schriftlich einzureichen</li>
      </ul>
      <p>So kannst du sicherstellen, dass du nur die Kosten bezahlst, die tatsächlich korrekt berechnet wurden. <Link href="/register" style={{ color: '#0d9488', textDecoration: 'underline', fontWeight: 600 }}>nexoen kostenlos testen</Link> und immer gut vorbereitet in die Abrechnungssaison gehen.</p>
    </>
  );
}

function BeispielContent({ excerpt }: { excerpt: string }) {
  return (
    <>
      <p className="text-xl text-slate-500 leading-relaxed mb-8 font-light">{excerpt}</p>
      <Toc items={[
        ['grundsaetzlich', 'Wie eine Nebenkostenabrechnung grundsätzlich funktioniert'],
        ['beispiel', 'Beispiel: Nebenkostenabrechnung für ein Mehrfamilienhaus'],
        ['anteil', 'Wie dein Anteil berechnet wird'],
        ['vorauszahlungen', 'Vergleich mit deinen Vorauszahlungen'],
        ['nachzahlungen', 'Warum Nachzahlungen entstehen können'],
        ['pruefen', 'Nebenkostenabrechnung einfacher prüfen'],
        ['fazit', 'Fazit'],
      ]} />

      <h2 id="grundsaetzlich">Wie eine Nebenkostenabrechnung grundsätzlich funktioniert</h2>
      <p>Eine Nebenkostenabrechnung zeigt, welche Betriebskosten für ein Gebäude innerhalb eines Jahres entstanden sind. Typische Kosten sind Heizkosten, Warmwasser, Müllabfuhr, Hausmeister, Gebäudeversicherung, Grundsteuer und Reinigung der Gemeinschaftsflächen.</p>
      <p>Diese Kosten werden zunächst für das gesamte Gebäude berechnet und anschließend auf alle Wohnungen verteilt. Als Mieter zahlst du während des Jahres monatliche Vorauszahlungen – am Ende werden diese mit den tatsächlichen Kosten verrechnet.</p>

      <h2 id="beispiel">Beispiel: Nebenkostenabrechnung für ein Mehrfamilienhaus</h2>
      <div className="bg-slate-100 border border-slate-200 rounded-[4px] p-6 my-6">
        <p style={{ fontWeight: 700, color: '#0f172a', margin: '0 0 1rem' }}>Musterdaten für das Gebäude</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', color: '#64748b', fontSize: '0.9rem' }}>
          <p style={{ margin: 0 }}>Gesamtwohnfläche: <strong>1.000 m²</strong></p>
          <p style={{ margin: 0, marginTop: '0.75rem', fontWeight: 600, color: '#0f172a' }}>Gesamte Betriebskosten: 24.000 €</p>
          <p style={{ margin: '0.25rem 0 0 1rem' }}>• Heizkosten: 12.000 €</p>
          <p style={{ margin: '0.25rem 0 0 1rem' }}>• Hausmeister: 4.000 €</p>
          <p style={{ margin: '0.25rem 0 0 1rem' }}>• Müllabfuhr: 2.000 €</p>
          <p style={{ margin: '0.25rem 0 0 1rem' }}>• Gebäudeversicherung: 2.000 €</p>
          <p style={{ margin: '0.25rem 0 0 1rem' }}>• Treppenhausreinigung: 2.000 €</p>
          <p style={{ margin: '0.25rem 0 0 1rem' }}>• Grundsteuer: 2.000 €</p>
        </div>
      </div>

      <h2 id="anteil">Wie dein Anteil berechnet wird</h2>
      <p>Angenommen, deine Wohnung hat eine Größe von 50 m² bei einer Gesamtwohnfläche von 1.000 m².</p>
      <div className="bg-teal-50 border border-teal-100 rounded-[4px] p-5 my-6">
        <p style={{ fontWeight: 700, color: '#0f766e', margin: '0 0 0.75rem' }}>Berechnung deines Anteils</p>
        <div style={{ color: '#0f766e', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <p style={{ margin: 0 }}>50 m² ÷ 1.000 m² = <strong>5 % Anteil</strong></p>
          <p style={{ margin: 0 }}>5 % von 24.000 € = <strong>1.200 €</strong></p>
        </div>
      </div>

      <h2 id="vorauszahlungen">Vergleich mit deinen Vorauszahlungen</h2>
      <div className="bg-slate-100 border border-slate-200 rounded-[4px] p-5 my-6">
        <div style={{ color: '#64748b', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <p style={{ margin: 0 }}>Monatliche Vorauszahlung: <strong>80 €</strong></p>
          <p style={{ margin: 0 }}>Jährliche Vorauszahlungen: <strong>960 €</strong></p>
          <p style={{ margin: 0 }}>Tatsächliche Kosten: <strong>1.200 €</strong></p>
          <p style={{ margin: '0.5rem 0 0', color: '#c2410c', fontWeight: 700 }}>Nachzahlung: 240 €</p>
        </div>
      </div>
      <p>Wenn deine Vorauszahlungen höher gewesen wären als die tatsächlichen Kosten, würdest du stattdessen ein Guthaben erhalten.</p>

      <h2 id="nachzahlungen">Warum Nachzahlungen entstehen können</h2>
      <p>Viele Mieter wundern sich über hohe Nachzahlungen. Häufige Gründe sind:</p>
      <ul>
        <li>Steigende Energiepreise</li>
        <li>Höherer Heizverbrauch (z. B. durch kalten Winter)</li>
        <li>Zu niedrige Vorauszahlungen</li>
        <li>Zusätzliche Dienstleistungen im Gebäude</li>
      </ul>
      <p>Auch Fehler in der Nebenkostenabrechnung können eine Rolle spielen – falscher Umlageschlüssel, falsche Wohnfläche oder doppelte Kostenpositionen. Deshalb lohnt sich immer ein genauer Blick auf die Abrechnung.</p>

      <h2 id="pruefen">Nebenkostenabrechnung einfacher prüfen</h2>
      <p>Eine Nebenkostenabrechnung kann viele einzelne Kostenpositionen enthalten. <Link href="/" style={{ color: '#0d9488', textDecoration: 'underline', fontWeight: 600 }}>nexoen</Link> hilft Mietern dabei, ihre Nebenkosten besser zu verstehen – die App zeigt dir laufend, wie sich dein Verbrauch entwickelt und wie hoch deine voraussichtliche Jahresabrechnung ausfallen wird.</p>
      <NexoenCTA />

      <h2 id="fazit">Fazit</h2>
      <p>Eine Nebenkostenabrechnung basiert auf einem einfachen Prinzip: Die Gesamtkosten eines Gebäudes werden auf alle Wohnungen verteilt. Wenn du verstehst, wie die Kosten entstehen, wie dein Anteil berechnet wird und wie Vorauszahlungen verrechnet werden, kannst du deine Abrechnung deutlich besser nachvollziehen.</p>
      <p>Gerade bei hohen Nachzahlungen lohnt sich eine genaue Prüfung. <Link href="/register" style={{ color: '#0d9488', textDecoration: 'underline', fontWeight: 600 }}>Teste nexoen kostenlos</Link> – und wisse schon während des Jahres, was am Ende auf dich zukommt.</p>
    </>
  );
}

function IstaTechContent({ excerpt }: { excerpt: string }) {
  return (
    <>
      <p className="text-xl text-slate-500 leading-relaxed mb-8 font-light">{excerpt}</p>
      <Toc items={[
        ['was-machen', 'Was Unternehmen wie ISTA oder Techem machen'],
        ['messung', 'Wie Heizkosten im Gebäude gemessen werden'],
        ['verteilung', 'Wie Heizkosten auf Mieter verteilt werden'],
        ['fragen', 'Häufige Fragen bei ISTA- oder Techem-Abrechnungen'],
        ['pruefen', 'Heizkostenabrechnung einfacher prüfen'],
        ['fazit', 'Fazit'],
      ]} />

      <h2 id="was-machen">Was Unternehmen wie ISTA oder Techem machen</h2>
      <p>In vielen Mehrfamilienhäusern beauftragt der Vermieter spezielle Dienstleister, um den Energieverbrauch zu messen und abzurechnen. Zu den bekanntesten Unternehmen gehören:</p>
      <ul>
        <li>ISTA</li>
        <li>Techem</li>
        <li>Brunata-Metrona</li>
      </ul>
      <p>Diese Firmen übernehmen die Installation von Messgeräten, die jährliche Ablesung der Heizkörper, die Berechnung der Heizkosten und die Erstellung der Heizkostenabrechnung. Der Vermieter integriert diese Daten anschließend in die Nebenkostenabrechnung für die Wohnung.</p>

      <h2 id="messung">Wie Heizkosten im Gebäude gemessen werden</h2>
      <p>Die meisten Wohnungen haben heute Heizkostenverteiler oder digitale Wärmezähler an den Heizkörpern. Diese Geräte messen den Wärmeverbrauch der einzelnen Wohnungen. Typische Systeme sind:</p>
      <ul>
        <li><strong>Heizkostenverteiler</strong> – messen die Wärmeabgabe eines Heizkörpers</li>
        <li><strong>Wärmemengenzähler</strong> – messen die tatsächliche Wärmemenge in der Heizungsanlage</li>
        <li><strong>Warmwasserzähler</strong> – messen den Verbrauch von Warmwasser in der Wohnung</li>
      </ul>
      <p>Viele moderne Geräte werden inzwischen per Funk ausgelesen, sodass keine Terminvereinbarung für die Ablesung notwendig ist.</p>

      <h2 id="verteilung">Wie Heizkosten auf Mieter verteilt werden</h2>
      <p>Die Verteilung der Heizkosten wird in Deutschland durch die <strong>Heizkostenverordnung</strong> geregelt. Ein Teil der Kosten wird nach Verbrauch verteilt.</p>
      <div className="bg-teal-50 border border-teal-100 rounded-[4px] p-5 my-6">
        <p style={{ fontWeight: 700, color: '#0f766e', margin: '0 0 0.5rem' }}>Typische Aufteilung</p>
        <ul style={{ color: '#0f766e', paddingLeft: '1.25rem', margin: 0 }}>
          <li>50–70 % der Kosten nach Verbrauch</li>
          <li>30–50 % nach Wohnfläche</li>
        </ul>
        <p style={{ color: '#0f766e', fontSize: '0.85rem', margin: '0.75rem 0 0' }}>Wer mehr heizt, zahlt auch mehr. Diese Regel soll einen sparsameren Energieverbrauch fördern.</p>
      </div>

      <h2 id="fragen">Häufige Fragen bei ISTA- oder Techem-Abrechnungen</h2>
      <div className="bg-white border border-slate-200 rounded-[4px] p-6 my-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <p style={{ fontWeight: 700, color: '#0f172a', margin: '0 0 0.4rem' }}>Warum sind meine Verbrauchswerte höher als im Vorjahr?</p>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Mögliche Gründe: kälterer Winter, längere Heizperioden, geändertes Heizverhalten oder steigende Energiepreise.</p>
        </div>
        <div>
          <p style={{ fontWeight: 700, color: '#0f172a', margin: '0 0 0.4rem' }}>Warum zahle ich auch Grundkosten?</p>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Ein Teil der Heizkosten entsteht unabhängig vom eigenen Verbrauch – z. B. Betrieb der Heizungsanlage, Wartung und Wärmeverluste im Gebäude. Diese werden anteilig nach Wohnfläche verteilt.</p>
        </div>
      </div>

      <h2 id="pruefen">Heizkostenabrechnung einfacher prüfen</h2>
      <p>Heizkostenabrechnungen von ISTA oder Techem enthalten oft viele Zahlen und technische Begriffe. <Link href="/" style={{ color: '#0d9488', textDecoration: 'underline', fontWeight: 600 }}>nexoen</Link> ist speziell dafür entwickelt, Mietern zu helfen, ihre Heiz- und Nebenkostenabrechnungen besser zu verstehen – inklusive der Daten von Dienstleistern wie ISTA und Techem.</p>
      <NexoenCTA />

      <h2 id="fazit">Fazit</h2>
      <p>Dienstleister wie ISTA oder Techem übernehmen in vielen Gebäuden die Messung und Berechnung der Heizkosten. Wichtige Punkte für Mieter:</p>
      <ul>
        <li>Heizkosten werden teilweise nach Verbrauch berechnet</li>
        <li>Ein Teil der Kosten wird nach Wohnfläche verteilt</li>
        <li>Steigende Energiepreise können die Kosten erhöhen</li>
      </ul>
      <p>Wenn du deine Heizkostenabrechnung besser verstehst, kannst du deine Nebenkosten insgesamt leichter nachvollziehen und prüfen. <Link href="/register" style={{ color: '#0d9488', textDecoration: 'underline', fontWeight: 600 }}>Teste nexoen kostenlos</Link> und behalte deine Heizkosten das ganze Jahr im Blick.</p>
    </>
  );
}

const tableStyle = { width: '100%', borderCollapse: 'collapse' as const, fontSize: '0.875rem' };
const thStyle = { padding: '0.6rem 0.75rem', textAlign: 'left' as const, border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 700, color: '#0f172a' };
const tdStyle = { padding: '0.6rem 0.75rem', border: '1px solid #e2e8f0', color: '#374151', verticalAlign: 'top' as const };

function MessdienstVergleichContent({ excerpt }: { excerpt: string }) {
  return (
    <>
      <p className="text-xl text-slate-500 leading-relaxed mb-8 font-light">{excerpt}</p>
      <Toc items={[
        ['was-machen', 'Was machen Messdienste überhaupt?'],
        ['anbieter', 'Die größten Messdienstanbieter in Deutschland'],
        ['vergleich-tabelle', 'Vergleich der wichtigsten Messdienste'],
        ['direkt', 'ISTA vs Techem – der direkte Vergleich'],
        ['schwer', 'Warum die Heizkostenabrechnung trotzdem schwer zu verstehen ist'],
        ['blick', 'Heizkosten frühzeitig im Blick behalten'],
        ['fazit', 'Fazit'],
      ]} />

      <h2 id="was-machen">Was machen Messdienste überhaupt?</h2>
      <p>Messdienste sind Unternehmen, die in Mehrfamilienhäusern Geräte installieren und den Energieverbrauch messen.</p>
      <p>Typische Aufgaben sind:</p>
      <ul>
        <li>Installation von Heizkostenverteilern</li>
        <li>Ablesen der Zählerstände</li>
        <li>Erstellung der Heizkostenabrechnung</li>
        <li>Verbrauchsauswertungen für Vermieter und Mieter</li>
      </ul>
      <p>Die Daten dieser Unternehmen bilden die Grundlage für die jährliche Nebenkostenabrechnung.</p>

      <h2 id="anbieter">Die größten Messdienstanbieter in Deutschland</h2>
      <p>Die wichtigsten Anbieter auf dem deutschen Markt sind:</p>
      <ul>
        <li>ista</li>
        <li>Techem</li>
        <li>Brunata-Metrona</li>
        <li>Minol</li>
        <li>KALO</li>
      </ul>
      <p>Alle diese Unternehmen bieten ähnliche Dienstleistungen an, unterscheiden sich aber teilweise bei Technik, Service und Digitalisierung.</p>

      <h2 id="vergleich-tabelle">Vergleich der wichtigsten Messdienste</h2>
      <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Anbieter</th>
              <th style={thStyle}>Besonderheiten</th>
              <th style={thStyle}>Digitalisierung</th>
              <th style={thStyle}>Marktstellung</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={tdStyle}><strong>ista</strong></td><td style={tdStyle}>Einer der größten Anbieter weltweit, viele digitale Lösungen</td><td style={tdStyle}>sehr stark</td><td style={tdStyle}>Marktführer</td></tr>
            <tr><td style={tdStyle}><strong>Techem</strong></td><td style={tdStyle}>Fokus auf Energieeffizienz und CO₂-Reduktion</td><td style={tdStyle}>sehr stark</td><td style={tdStyle}>Marktführer</td></tr>
            <tr><td style={tdStyle}><strong>Brunata-Metrona</strong></td><td style={tdStyle}>Stark im deutschen Markt, moderne Funktechnik</td><td style={tdStyle}>gut</td><td style={tdStyle}>etabliert</td></tr>
            <tr><td style={tdStyle}><strong>Minol</strong></td><td style={tdStyle}>Fokus auf Messdienst und Energie-Management</td><td style={tdStyle}>gut</td><td style={tdStyle}>etabliert</td></tr>
            <tr><td style={tdStyle}><strong>KALO</strong></td><td style={tdStyle}>Teil der Energiebranche, Fokus auf Verbrauchsdaten</td><td style={tdStyle}>mittel</td><td style={tdStyle}>kleiner Anbieter</td></tr>
          </tbody>
        </table>
      </div>

      <h2 id="direkt">ISTA vs Techem – der direkte Vergleich</h2>
      <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Kriterium</th>
              <th style={thStyle}>ista</th>
              <th style={thStyle}>Techem</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Marktgröße', 'sehr groß', 'sehr groß'],
              ['Digitalisierung', 'sehr hoch', 'sehr hoch'],
              ['Funkablesung', 'ja', 'ja'],
              ['Apps für Nutzer', 'ja', 'ja'],
              ['Energieanalysen', 'ja', 'ja'],
              ['Verbreitung', 'sehr häufig', 'sehr häufig'],
            ].map(([k, a, b]) => (
              <tr key={k}><td style={tdStyle}>{k}</td><td style={tdStyle}>{a}</td><td style={tdStyle}>{b}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>Beide Unternehmen gehören zu den <strong>größten Messdienstleistern in Europa</strong> und sind technisch auf einem ähnlichen Niveau.</p>
      <p>Für Mieter gibt es daher meist <strong>keinen großen Unterschied</strong>, da beide nach denselben gesetzlichen Regeln abrechnen müssen.</p>

      <h2 id="schwer">Warum die Heizkostenabrechnung trotzdem schwer zu verstehen ist</h2>
      <p>Viele Mieter wundern sich, warum ihre Heizkostenabrechnung so kompliziert ist. Das liegt daran, dass mehrere Faktoren zusammenkommen:</p>
      <ul>
        <li>Verbrauchsdaten der Messgeräte</li>
        <li>Grundkosten und Verbrauchskosten</li>
        <li>Umlageschlüssel im Gebäude</li>
        <li>Energiepreise des Versorgers</li>
      </ul>
      <p>Dadurch entstehen oft komplexe Tabellen und Berechnungen.</p>

      <h2 id="blick">Heizkosten frühzeitig im Blick behalten</h2>
      <p>Viele Mieter sehen ihre tatsächlichen Heizkosten erst am Ende des Jahres in der Abrechnung.</p>
      <p>Das Problem: Wenn die Kosten stark gestiegen sind, kommt die Nachzahlung oft überraschend.</p>
      <p>Mit der App <strong><Link href="/" style={{ color: '#0d9488', textDecoration: 'underline' }}>Nexoen</Link></strong> können Mieter ihre Heizkosten und Nebenkosten bereits während des Jahres verfolgen.</p>
      <p>So sehen Sie frühzeitig:</p>
      <ul>
        <li>wie sich Ihr Verbrauch entwickelt</li>
        <li>ob Ihre Heizkosten steigen</li>
        <li>ob eine hohe Nachzahlung möglich ist</li>
      </ul>
      <NexoenCTA />

      <h2 id="fazit">Fazit</h2>
      <p>Die größten Messdienstanbieter in Deutschland sind <strong>ista, Techem, Brunata-Metrona, Minol und KALO</strong>. Technisch unterscheiden sich die Anbieter nur gering, da sie alle nach den gesetzlichen Vorgaben der Heizkostenverordnung arbeiten.</p>
      <p>Für Mieter ist deshalb vor allem wichtig, die eigene Heizkostenabrechnung zu verstehen und den eigenen Verbrauch im Blick zu behalten.</p>
    </>
  );
}

function NebenkostenZuHochMieterContent({ excerpt }: { excerpt: string }) {
  return (
    <>
      <p className="text-xl text-slate-500 leading-relaxed mb-8 font-light">{excerpt}</p>
      <Toc items={[
        ['was-normal', 'Was gelten als normale Nebenkosten in Deutschland?'],
        ['nach-groesse', 'Vergleichswerte nach Wohnungsgröße'],
        ['heizkosten', 'Heizkosten: Was ist realistisch?'],
        ['wasser', 'Wasser: Normwerte für Mieter'],
        ['einflussfaktoren', 'Was deine Nebenkosten beeinflusst'],
        ['konkret', 'So vergleichst du deine eigenen Kosten'],
        ['fazit', 'Fazit'],
      ]} />

      <p>Viele Mieter fragen sich: Zahle ich zu viel? Oder sind meine Nebenkosten eigentlich normal? Die Antwort ist oft schwerer zu finden als gedacht – weil konkrete Vergleichswerte selten klar kommuniziert werden.</p>
      <p>Dieser Artikel zeigt dir, was in Deutschland als durchschnittlich gilt, welche Werte nach Wohnungsgröße realistisch sind – und wie du deine eigene Abrechnung konkret einordnen kannst.</p>

      <h2 id="was-normal">Was gelten als normale Nebenkosten in Deutschland?</h2>
      <p>Als grober Richtwert gilt in Deutschland: <strong>2,50 bis 3,00 Euro pro Quadratmeter und Monat</strong> – inklusive Heizkosten und Warmwasser.</p>
      <p>Der Deutsche Mieterbund spricht von der sogenannten <strong>„zweiten Miete"</strong> – die Nebenkosten sind in vielen Haushalten fast genauso hoch wie die Kaltmiete.</p>

      <div className="bg-teal-50 border border-teal-100 rounded-[4px] p-5 my-6">
        <p style={{ fontWeight: 700, color: '#0f766e', margin: '0 0 0.5rem' }}>Faustformel</p>
        <p style={{ color: '#0f766e', fontSize: '0.9rem', margin: 0 }}>Wohnfläche (m²) × 2,88 €/m² × 12 Monate = erwartete Jahresnebenkosten<br />Beispiel: 65 m² × 2,88 € × 12 = ca. <strong>2.246 €/Jahr</strong></p>
      </div>

      <p>Liegt deine Abrechnung dauerhaft deutlich über diesem Wert, lohnt sich eine genauere Prüfung.</p>

      <h2 id="nach-groesse">Vergleichswerte nach Wohnungsgröße</h2>
      <p>Die folgende Tabelle zeigt, was für verschiedene Wohnungsgrößen als realistisch gilt – basierend auf dem Richtwert von 2,88 €/m²/Monat:</p>

      <div className="bg-white border border-slate-200 rounded-[4px] overflow-hidden my-6">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '0.75rem 1rem', fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>
          <span>Wohnungsgröße</span>
          <span>Pro Monat</span>
          <span>Pro Jahr</span>
        </div>
        {[
          ['50 m²', '≈ 144 €', '≈ 1.728 €'],
          ['65 m²', '≈ 187 €', '≈ 2.246 €'],
          ['80 m²', '≈ 230 €', '≈ 2.765 €'],
          ['100 m²', '≈ 288 €', '≈ 3.456 €'],
        ].map(([size, monthly, yearly], i) => (
          <div key={size} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '0.75rem 1rem', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none', fontSize: '0.9rem', color: '#374151', background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
            <span style={{ fontWeight: 600 }}>{size}</span>
            <span>{monthly}</span>
            <span style={{ color: '#0f766e', fontWeight: 600 }}>{yearly}</span>
          </div>
        ))}
      </div>

      <p>Diese Werte sind Richtwerte – je nach Region, Gebäudealter und Heizsystem können die tatsächlichen Kosten abweichen. In Städten wie München oder Hamburg liegen sie oft 10–20 % über dem Bundesdurchschnitt.</p>

      <h2 id="heizkosten">Heizkosten: Was ist realistisch?</h2>
      <p>Heizkosten machen in deutschen Wohnungen oft <strong>50–60 % der gesamten Nebenkosten</strong> aus. Deshalb lohnt es sich, diesen Posten besonders genau anzuschauen.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1.25rem 0 2rem' }}>
        <NumItem n={1} t="Heizenergiebedarf nach Gebäudetyp" d="Gut gedämmtes Neubau-Gebäude: 50–80 kWh/m² pro Jahr. Älteres, schlecht gedämmtes Gebäude: 150–250 kWh/m² pro Jahr. Bei einem 65-m²-Altbau kann das schnell 1.500–2.000 € an Heizkosten bedeuten." />
        <NumItem n={2} t="Warmwasserkosten" d="Ein 3-Personen-Haushalt verbraucht durchschnittlich etwa 0,13 m³ Warmwasser pro Tag. Pro Jahr entspricht das rund 47 m³. In der Abrechnung entfallen darauf oft 300–500 €." />
        <NumItem n={3} t="Wenn Heizkosten plötzlich stark steigen" d="Eine Steigerung von mehr als 20–30 % gegenüber dem Vorjahr – ohne besonders kalten Winter – ist ein Warnsignal. Das kann auf falsche Zählerstände, eine defekte Heizanlage oder Fehler in der Kostenverteilung hinweisen." />
      </div>

      <div style={{ borderLeft: '4px solid #14b8a6', background: 'linear-gradient(to right, #f0fdfa, transparent)', borderRadius: '0 4px 4px 0', padding: '1.25rem 1.5rem', margin: '2rem 0' }}>
        <p style={{ color: '#0f172a', fontWeight: 600, margin: '0 0 0.5rem' }}>Praxis-Tipp: Vorjahresvergleich</p>
        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Vergleiche deine Heizkosten mit dem Vorjahr. Wenn die Kosten um mehr als 25 % gestiegen sind und du deinen Verbrauch nicht merklich erhöht hast, solltest du die Abrechnung genauer prüfen.</p>
      </div>

      <h2 id="wasser">Wasser: Normwerte für Mieter</h2>
      <p>Auch Wasserkosten können ein Hinweis auf Abrechnungsfehler sein. Als grobe Orientierung gilt:</p>
      <ul>
        <li><strong>Kaltwasser:</strong> ca. 0,13 m³ pro Person und Tag – ein 2-Personen-Haushalt verbraucht etwa 80–100 m³/Jahr</li>
        <li><strong>Warmwasser:</strong> ca. 0,04–0,06 m³ pro Person und Tag</li>
        <li><strong>Gesamtverbrauch</strong> für einen 2-Personen-Haushalt: ca. 70–120 m³ Kalt- und Warmwasser pro Jahr</li>
      </ul>
      <p>Wenn deine abgerechneten Wassermengen deutlich über diesen Werten liegen, ohne dass du eine Erklärung hast, solltest du die Zählerstände und die Ablesung überprüfen.</p>

      <h2 id="einflussfaktoren">Was deine Nebenkosten beeinflusst</h2>
      <p>Nicht alle hohen Nebenkosten sind Fehler. Es gibt legitime Gründe, warum deine Kosten über dem Durchschnitt liegen können:</p>
      <ul>
        <li><strong>Gebäudealter:</strong> Altbauten haben oft schlechtere Dämmung → höhere Heizkosten</li>
        <li><strong>Heizsystem:</strong> Ölheizung oder Fernwärme kann teurer sein als Gas</li>
        <li><strong>Lage der Wohnung:</strong> Erdgeschoss- und Eckwohnungen haben oft höhere Heizkosten</li>
        <li><strong>Region:</strong> Kalte Regionen wie Bayern oder Sachsen haben höhere Heizkosten</li>
        <li><strong>Besonders kalter Winter:</strong> Kann Heizkosten um 10–20 % erhöhen</li>
        <li><strong>Gestiegene Energiepreise:</strong> Preiserhöhungen schlagen direkt auf die Abrechnung durch</li>
      </ul>
      <p>Wenn keiner dieser Faktoren deine hohen Kosten erklärt, ist eine genauere Prüfung der Abrechnung sinnvoll.</p>

      <h2 id="konkret">So vergleichst du deine eigenen Kosten</h2>
      <p>Um herauszufinden, ob deine Nebenkosten zu hoch sind, gehe so vor:</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
        <NumItem n={1} t="Jahresgesamtkosten notieren" d="Nimm den Gesamtbetrag aus deiner Nebenkostenabrechnung – alle Positionen zusammen, noch ohne Vorauszahlungen abzuziehen." />
        <NumItem n={2} t="Durch Wohnfläche und 12 teilen" d="Teile die Jahreskosten durch deine Wohnfläche und nochmals durch 12. Du bekommst deinen €/m²/Monat-Wert. Liegt er deutlich über 3,50 €, lohnt sich ein genauerer Blick." />
        <NumItem n={3} t="Heizkosten separat prüfen" d="Notiere die reinen Heizkosten aus der Abrechnung und teile sie durch deine Wohnfläche und die Anzahl der Monate. Mehr als 2,50 €/m²/Monat nur für Heizung ist in gut gedämmten Gebäuden ungewöhnlich." />
        <NumItem n={4} t="Vorjahr vergleichen" d="Vergleiche mit deiner Abrechnung vom Vorjahr. Eine Steigerung über 20–25 % ist ein Warnsignal – außer es gab einen außergewöhnlich kalten Winter oder eine bekannte Preiserhöhung." />
      </div>

      <NexoenCTA />

      <h2 id="fazit">Fazit</h2>
      <p>Ob Nebenkosten „zu hoch" sind, lässt sich erst beurteilen, wenn man sie mit konkreten Werten vergleicht. Der Richtwert von <strong>2,50 bis 3,00 €/m²/Monat</strong> ist ein guter Ausgangspunkt.</p>
      <p>Liegen deine Kosten dauerhaft deutlich darüber, lohnt sich eine genaue Prüfung der Abrechnung – denn nicht jede hohe Nachzahlung bedeutet, dass alles korrekt ist. Mit <Link href="/register" style={{ color: '#0d9488', textDecoration: 'underline', fontWeight: 600 }}>nexoen</Link> kannst du deine Kosten das ganze Jahr verfolgen und früh erkennen, ob etwas nicht stimmt.</p>
    </>
  );
}

function NebenkostenZustellungContent({ excerpt }: { excerpt: string }) {
  return (
    <>
      <p className="text-xl text-slate-500 leading-relaxed mb-8 font-light">{excerpt}</p>
      <Toc items={[
        ['frist', 'Die gesetzliche Frist für die Nebenkostenabrechnung'],
        ['zu-spaet', 'Was passiert, wenn die Abrechnung zu spät kommt?'],
        ['mieter-frist', 'Wie lange haben Mieter Zeit, die Abrechnung zu prüfen?'],
        ['ueberraschend', 'Warum viele Nachzahlungen überraschend kommen'],
        ['blick', 'Nebenkosten frühzeitig im Blick behalten'],
        ['fazit', 'Fazit'],
      ]} />

      <p>Viele Mieter fragen sich jedes Jahr: Bis wann muss die Nebenkostenabrechnung eigentlich kommen?</p>
      <p>In Deutschland gibt es dafür eine klare gesetzliche Regel. Wenn Vermieter diese Frist verpassen, kann das für Mieter sogar Geld sparen.</p>

      <h2 id="frist">Die gesetzliche Frist für die Nebenkostenabrechnung</h2>
      <p>Nach § 556 Absatz 3 des Bürgerlichen Gesetzbuches (BGB) muss der Vermieter die Nebenkostenabrechnung spätestens <strong>12 Monate nach Ende des Abrechnungszeitraums</strong> zustellen.</p>
      <p>Das bedeutet:</p>
      <div className="bg-teal-50 border border-teal-100 rounded-[4px] p-5 my-6">
        <p style={{ fontWeight: 700, color: '#0f766e', margin: '0 0 0.5rem' }}>Beispiel</p>
        <p style={{ color: '#0f766e', fontSize: '0.9rem', margin: '0 0 0.2rem' }}>Abrechnungszeitraum: 01.01.2024 – 31.12.2024</p>
        <p style={{ color: '#0f766e', fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>Späteste Zustellung der Abrechnung: 31.12.2025</p>
      </div>
      <p>Die Abrechnung muss bis zu diesem Zeitpunkt <strong>beim Mieter angekommen sein</strong>, nicht nur erstellt worden sein.</p>

      <h2 id="zu-spaet">Was passiert, wenn die Abrechnung zu spät kommt?</h2>
      <p>Wenn der Vermieter die Frist verpasst, hat das wichtige Folgen:</p>
      <ul>
        <li>Der Vermieter darf <strong>keine Nachzahlung mehr verlangen</strong></li>
        <li>Eine Forderung wird rechtlich unwirksam</li>
        <li>Der Mieter muss die Nachzahlung nicht bezahlen</li>
      </ul>
      <p>Ein Guthaben des Mieters muss jedoch <strong>trotz verspäteter Abrechnung ausgezahlt werden</strong>.</p>

      <h2 id="mieter-frist">Wie lange haben Mieter Zeit, die Abrechnung zu prüfen?</h2>
      <p>Auch Mieter haben eine Frist.</p>
      <p>Nach Erhalt der Nebenkostenabrechnung haben Mieter <strong>12 Monate Zeit</strong>, um Einwände oder Fehler zu melden.</p>
      <p>Das bedeutet: Wenn Sie z. B. im Oktober 2025 eine Abrechnung bekommen, können Sie diese noch bis Oktober 2026 prüfen und widersprechen.</p>

      <h2 id="ueberraschend">Warum viele Nachzahlungen überraschend kommen</h2>
      <p>Viele Mieter sehen ihre tatsächlichen Heiz- und Nebenkosten erst am Ende des Jahres in der Abrechnung.</p>
      <p>Das Problem: Wenn die Kosten plötzlich stark gestiegen sind, kommt die Nachzahlung oft überraschend.</p>
      <p>Digitale Tools können helfen, diese Kosten schon während des Jahres im Blick zu behalten.</p>

      <h2 id="blick">Nebenkosten frühzeitig im Blick behalten</h2>
      <p>Mit der App <strong><Link href="/" style={{ color: '#0d9488', textDecoration: 'underline' }}>Nexoen</Link></strong> können Mieter ihre Heizkosten und Nebenkosten bereits während des Jahres verfolgen.</p>
      <p>So sehen Sie frühzeitig:</p>
      <ul>
        <li>ob Ihre Heizkosten steigen</li>
        <li>ob eine Nachzahlung wahrscheinlich ist</li>
        <li>wie sich Ihr Verbrauch entwickelt</li>
      </ul>
      <p>Dadurch lassen sich unangenehme Überraschungen bei der Nebenkostenabrechnung vermeiden.</p>
      <NexoenCTA />

      <h2 id="fazit">Fazit</h2>
      <p>Die Nebenkostenabrechnung muss spätestens <strong>12 Monate nach Ende des Abrechnungszeitraums</strong> beim Mieter ankommen.</p>
      <p>Verpasst der Vermieter diese Frist, darf er normalerweise <strong>keine Nachzahlung mehr verlangen</strong>.</p>
      <p>Für Mieter lohnt es sich deshalb, die Abrechnung immer genau zu prüfen und die eigenen Nebenkosten möglichst früh im Blick zu behalten.</p>
    </>
  );
}

function NebenkostenFehlerErkennenContent({ excerpt }: { excerpt: string }) {
  return (
    <>
      <p className="text-xl text-slate-500 leading-relaxed mb-8 font-light">{excerpt}</p>
      <Toc items={[
        ['vorbereitung', 'Was du brauchst, bevor du anfängst'],
        ['schritt1', 'Schritt 1: Zeitraum und Frist prüfen'],
        ['schritt2', 'Schritt 2: Deinen Kostenanteil selbst berechnen'],
        ['schritt3', 'Schritt 3: Heizkosten nachrechnen'],
        ['schritt4', 'Schritt 4: Nicht umlagefähige Kosten herausfiltern'],
        ['schritt5', 'Schritt 5: Ergebnis selbst prüfen'],
        ['was-tun', 'Was tun, wenn du Fehler findest?'],
        ['fazit', 'Fazit'],
      ]} />

      <p>Den meisten Ratgebern liest man: „Prüfe deinen Umlageschlüssel." Aber wie macht man das konkret? Wie rechnet man die Heizkosten nach? Und woher weiß ich, ob die Zahlen in meiner Abrechnung überhaupt plausibel sind?</p>
      <p>Dieser Artikel zeigt dir Schritt für Schritt, wie du deine Nebenkostenabrechnung selbst nachrechnen kannst – mit konkreten Beispielen und nachvollziehbaren Formeln.</p>

      <h2 id="vorbereitung">Was du brauchst, bevor du anfängst</h2>
      <p>Lege dir vor der Prüfung folgende Dokumente bereit:</p>
      <ul>
        <li><strong>Deine Nebenkostenabrechnung</strong> – am besten die aktuelle und die vom Vorjahr</li>
        <li><strong>Dein Mietvertrag</strong> – darin stehen deine Wohnfläche und die vereinbarten Nebenkosten</li>
        <li><strong>Deine Zählerstände</strong> – Strom, Wasser und ggf. Heizung aus eigener Ablesung</li>
        <li><strong>Die Gesamtfläche des Gebäudes</strong> – steht meist in der Abrechnung selbst</li>
      </ul>
      <p>Mit diesen vier Quellen kannst du die wichtigsten Posten deiner Abrechnung selbst überprüfen.</p>

      <h2 id="schritt1">Schritt 1: Zeitraum und Frist prüfen</h2>
      <p>Bevor du in die Zahlen einsteigst, prüfe das Grundgerüst:</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: '1.25rem 0' }}>
        <div className="bg-slate-50 border border-slate-100 rounded-[4px] p-4">
          <p style={{ fontWeight: 700, color: '#0f172a', margin: '0 0 0.3rem' }}>Abrechnungszeitraum maximal 12 Monate?</p>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Eine Nebenkostenabrechnung darf nur einen Zeitraum von maximal 12 Monaten abdecken. Wenn sie länger ist, ist das ein rechtlicher Fehler.</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-[4px] p-4">
          <p style={{ fontWeight: 700, color: '#0f172a', margin: '0 0 0.3rem' }}>Kam die Abrechnung rechtzeitig?</p>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Der Vermieter muss die Abrechnung spätestens 12 Monate nach Ende des Abrechnungszeitraums zustellen. Kommt sie später, darf er keine Nachzahlung mehr verlangen.</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-[4px] p-4">
          <p style={{ fontWeight: 700, color: '#0f172a', margin: '0 0 0.3rem' }}>Vorauszahlungen vollständig berücksichtigt?</p>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Addiere alle 12 Monatszahlungen, die du geleistet hast. Vergleiche die Summe mit dem in der Abrechnung genannten Vorauszahlungsbetrag. Manchmal fehlen Zahlungen oder sind falsch erfasst.</p>
        </div>
      </div>

      <h2 id="schritt2">Schritt 2: Deinen Kostenanteil selbst berechnen</h2>
      <p>Die meisten Betriebskosten werden anteilig nach Wohnfläche verteilt. Das kannst du selbst nachrechnen:</p>

      <div className="bg-teal-50 border border-teal-100 rounded-[4px] p-6 my-6">
        <p style={{ fontWeight: 700, color: '#0f172a', margin: '0 0 0.75rem' }}>Formel: Dein Flächenanteil</p>
        <p style={{ color: '#0f766e', fontFamily: 'monospace', fontSize: '0.95rem', margin: '0 0 0.5rem', fontWeight: 700 }}>Dein Anteil (%) = Deine Wohnfläche ÷ Gesamtfläche Gebäude × 100</p>
        <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 1rem' }}>Dieser Prozentsatz gilt dann für alle flächenbasierten Kostenpositionen.</p>
        <p style={{ fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem' }}>Beispiel</p>
        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Deine Wohnung: 65 m² | Gesamtfläche Gebäude: 850 m²<br /><strong>Anteil: 65 ÷ 850 × 100 = 7,65 %</strong><br />Wenn die Grundsteuer für das gesamte Gebäude 1.200 € beträgt:<br /><strong>Dein Anteil: 1.200 € × 7,65 % = 91,80 €</strong></p>
      </div>

      <p>Weicht der in der Abrechnung genannte Betrag von deiner Berechnung ab, prüfe zuerst, ob die Wohnfläche stimmt. Ein häufiger Fehler ist, dass die Wohnfläche in der Abrechnung größer eingetragen ist als in deinem Mietvertrag.</p>

      <h2 id="schritt3">Schritt 3: Heizkosten nachrechnen</h2>
      <p>Heizkosten sind der komplexeste Teil der Abrechnung – sie werden nicht nur nach Fläche, sondern auch nach Verbrauch verteilt. In Deutschland ist die <strong>30/70-Regel</strong> üblich:</p>
      <ul>
        <li><strong>30 % der Heizkosten</strong> werden nach Wohnfläche verteilt (Grundanteil)</li>
        <li><strong>70 % der Heizkosten</strong> werden nach individuellem Verbrauch (Heizkostenverteiler) verteilt</li>
      </ul>

      <div className="bg-teal-50 border border-teal-100 rounded-[4px] p-6 my-6">
        <p style={{ fontWeight: 700, color: '#0f172a', margin: '0 0 0.75rem' }}>Rechenbeispiel Heizkosten</p>
        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 0.4rem' }}>Gesamte Heizkosten Gebäude: <strong>8.400 €</strong></p>
        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 0.4rem' }}>Grundanteil (30 %): 8.400 × 30 % = <strong>2.520 €</strong> → nach Fläche verteilt</p>
        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 0.4rem' }}>Verbrauchsanteil (70 %): 8.400 × 70 % = <strong>5.880 €</strong> → nach Heizkostenverteiler</p>
        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 1rem' }}>Dein Flächenanteil (7,65 %): 2.520 × 7,65 % = <strong>192,78 €</strong></p>
        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 0.4rem' }}>Dein Verbrauch: z. B. 540 von 6.800 Gesamteinheiten = 7,94 %</p>
        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Verbrauchsanteil: 5.880 × 7,94 % = <strong>466,87 €</strong><br /><strong>Gesamt Heizkosten für dich: 192,78 + 466,87 = 659,65 €</strong></p>
      </div>

      <p>Wenn der in deiner Abrechnung genannte Betrag stark von diesem Ergebnis abweicht, liegt möglicherweise ein Fehler bei den Gesamtkosten, der Gesamtfläche oder deinen zugeschriebenen Verbrauchseinheiten vor.</p>

      <h2 id="schritt4">Schritt 4: Nicht umlagefähige Kosten herausfiltern</h2>
      <p>Gehe jede Kostenposition in deiner Abrechnung durch und prüfe, ob sie grundsätzlich umlagefähig ist. Diese Kosten dürfen <strong>nicht</strong> in der Nebenkostenabrechnung stehen:</p>
      <ul>
        <li>Reparaturen und Instandhaltungskosten (z. B. neue Heizungspumpe)</li>
        <li>Verwaltungskosten der Hausverwaltung</li>
        <li>Bankgebühren für das Hausgeldkonto</li>
        <li>Kosten für Leerstände</li>
        <li>Rechtsanwaltskosten</li>
      </ul>
      <p>Erlaubt sind hingegen: Grundsteuer, Wasser, Heizung, Aufzug, Straßenreinigung, Winterdienst, Hausmeister (anteilig), Gebäudeversicherung, Allgemeinstrom.</p>

      <div style={{ borderLeft: '4px solid #14b8a6', background: 'linear-gradient(to right, #f0fdfa, transparent)', borderRadius: '0 4px 4px 0', padding: '1.25rem 1.5rem', margin: '2rem 0' }}>
        <p style={{ color: '#0f172a', fontWeight: 600, margin: '0 0 0.5rem' }}>Worauf besonders achten</p>
        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>„Hausmeister" klingt erlaubt – aber wenn der Hausmeister auch Reparaturen durchführt, darf nur der Teil für Wartung und Reinigung umgelegt werden. Wenn pauschale Hausmeisterkosten abgerechnet werden, frage nach der genauen Aufschlüsselung.</p>
      </div>

      <h2 id="schritt5">Schritt 5: Ergebnis selbst prüfen</h2>
      <p>Am Ende einer korrekten Abrechnung steht folgende Rechnung:</p>

      <div className="bg-white border border-slate-200 rounded-[4px] p-6 my-6">
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9', color: '#374151', fontSize: '0.9rem' }}>
          <span>Summe deiner Kostenanteile</span>
          <span style={{ fontWeight: 600 }}>z. B. 1.850 €</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9', color: '#374151', fontSize: '0.9rem' }}>
          <span>Minus deine geleisteten Vorauszahlungen</span>
          <span style={{ fontWeight: 600 }}>− 1.800 €</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', color: '#0f172a', fontWeight: 700 }}>
          <span>Nachzahlung</span>
          <span style={{ color: '#c2410c' }}>50 €</span>
        </div>
      </div>

      <p>Vergleiche diese selbst berechnete Nachzahlung mit dem Betrag in der Abrechnung. Wenn es eine nennenswerte Abweichung gibt, hast du entweder einen Rechenfehler gefunden – oder einen anderen Fehler in der Abrechnung.</p>

      <NexoenCTA />

      <h2 id="was-tun">Was tun, wenn du Fehler findest?</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
        <NumItem n={1} t="Zunächst beim Vermieter nachfragen" d="Schreibe eine formlose E-Mail oder einen Brief und erkläre, welchen Fehler du gefunden hast. Manchmal handelt es sich um einfache Tippfehler, die schnell korrigiert werden." />
        <NumItem n={2} t="Belegeinsicht verlangen" d="Du hast das Recht, die Originalrechnungen zu sehen (§ 259 BGB). So kannst du prüfen, ob die genannten Beträge tatsächlich entstanden sind." />
        <NumItem n={3} t="Unter Vorbehalt zahlen" d={'Wenn du Fehler vermutest, zahle die Nachzahlung \u201eunter Vorbehalt\u201c. Das schützt dich rechtlich, während du die Abrechnung weiter prüfst.'} />
        <NumItem n={4} t="Fristen beachten" d="Du hast 12 Monate Zeit nach Erhalt der Abrechnung, um Einwände zu erheben. Je früher du prüfst, desto besser." />
      </div>

      <h2 id="fazit">Fazit</h2>
      <p>Eine Nebenkostenabrechnung ist kein Mysterium. Mit deiner Wohnfläche, der Gebäudegröße und den Gesamtkosten kannst du die meisten Posten selbst nachrechnen – und so schnell erkennen, ob etwas nicht stimmt.</p>
      <p>Je früher du deine Kosten im Blick hast, desto leichter wird die Prüfung am Jahresende. <Link href="/register" style={{ color: '#0d9488', textDecoration: 'underline', fontWeight: 600 }}>nexoen kostenlos testen</Link> – und deine Nebenkosten das ganze Jahr verfolgen.</p>
    </>
  );
}

// ── Main export ──────────────────────────────────────────────────

export function getPostContent(slug: string, excerpt: string): React.ReactNode {
  switch (slug) {
    case 'messdienste-vergleich':
      return <MessdienstVergleichContent excerpt={excerpt} />;
    case 'nebenkosten-zu-hoch-mieter':
      return <NebenkostenZuHochMieterContent excerpt={excerpt} />;
    case 'nebenkostenabrechnung-zustellung':
      return <NebenkostenZustellungContent excerpt={excerpt} />;
    case 'nebenkostenabrechnung-fehler-erkennen':
      return <NebenkostenFehlerErkennenContent excerpt={excerpt} />;
    case 'fehler-nebenkostenabrechnung':
      return <FehlerContent excerpt={excerpt} />;
    case 'nebenkostenabrechnung-zu-hoch':
      return <ZuHochContent excerpt={excerpt} />;
    case 'nebenkosten-vermieter-abrechnen':
      return <VermieterKostenContent excerpt={excerpt} />;
    case 'fristen-nebenkostenabrechnung':
      return <FristenContent excerpt={excerpt} />;
    case 'nebenkostenabrechnung-verstehen':
      return <VerstehenkContent excerpt={excerpt} />;
    case 'nebenkosten-sparen-tipps':
      return <SparenContent excerpt={excerpt} />;
    case 'heizkosten-senken':
      return <HeizkostenContent excerpt={excerpt} />;
    case 'einspruch-nebenkostenabrechnung':
      return <EinspruchContent excerpt={excerpt} />;
    case 'nebenkostenabrechnung-beispiel':
      return <BeispielContent excerpt={excerpt} />;
    case 'ista-techem-abrechnung':
      return <IstaTechContent excerpt={excerpt} />;
    default:
      return null;
  }
}
