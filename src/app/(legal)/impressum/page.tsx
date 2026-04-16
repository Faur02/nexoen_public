export const metadata = {
  title: 'Impressum – nexoen',
};

export default function ImpressumPage() {
  return (
    <article className="space-y-8 font-body" style={{ color: 'var(--nexo-text-primary, #1F2937)' }}>
      <div>
        <h1 className="font-heading text-3xl mb-2" style={{ fontWeight: 400 }}>Impressum</h1>
        <p className="text-sm" style={{ color: 'var(--nexo-text-secondary, #6B7280)' }}>
          Angaben gemäß § 5 DDG
        </p>
      </div>

      <section className="space-y-1">
        <h2 className="font-heading text-lg" style={{ fontWeight: 600 }}>Anbieter</h2>
        <p>[YOUR NAME]</p>
        <p>[YOUR STREET ADDRESS]</p>
        <p>[YOUR ZIP CODE] [YOUR CITY]</p>
        <p>Deutschland</p>
      </section>

      <section className="space-y-1">
        <h2 className="font-heading text-lg" style={{ fontWeight: 600 }}>Kontakt</h2>
        <p>E-Mail: <a href="mailto:support@yourdomain.de" style={{ color: 'var(--nexo-cta, #1D7874)' }}>support@yourdomain.de</a></p>
        <p className="text-sm" style={{ color: 'var(--nexo-text-secondary, #6B7280)' }}>
          Kontaktanfragen werden werktags innerhalb von 48 Stunden beantwortet.
        </p>
      </section>

      <section className="space-y-1">
        <h2 className="font-heading text-lg" style={{ fontWeight: 600 }}>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
        <p>[YOUR NAME]</p>
        <p>[YOUR STREET ADDRESS]</p>
        <p>[YOUR ZIP CODE] [YOUR CITY]</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-lg" style={{ fontWeight: 600 }}>Haftungsausschluss</h2>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit
          und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir
          gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-lg" style={{ fontWeight: 600 }}>Streitschlichtung</h2>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
          <a
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--nexo-cta, #1D7874)' }}
          >
            https://ec.europa.eu/consumers/odr/
          </a>
          . Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </section>
    </article>
  );
}
