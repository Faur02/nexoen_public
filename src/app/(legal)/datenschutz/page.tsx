export const metadata = {
  title: 'Datenschutzerklärung – nexoen',
};

export default function DatenschutzPage() {
  return (
    <article className="space-y-8 font-body" style={{ color: 'var(--nexo-text-primary, #1F2937)' }}>
      <div>
        <h1 className="font-heading text-3xl mb-2" style={{ fontWeight: 400 }}>Datenschutzerklärung</h1>
        <p className="text-sm" style={{ color: 'var(--nexo-text-secondary, #6B7280)' }}>
          Stand: März 2026
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="font-heading text-xl" style={{ fontWeight: 600 }}>1. Verantwortlicher</h2>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Verantwortlicher im Sinne der DSGVO ist:
        </p>
        <p style={{ lineHeight: '1.7' }}>
          [YOUR NAME]<br />
          [YOUR STREET ADDRESS]<br />
          [YOUR ZIP CODE] [YOUR CITY]<br />
          E-Mail: <a href="mailto:support@yourdomain.de" style={{ color: 'var(--nexo-cta, #1D7874)' }}>support@yourdomain.de</a>
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-xl" style={{ fontWeight: 600 }}>2. Erhobene Daten</h2>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Wir erheben und verarbeiten folgende personenbezogene Daten:
        </p>
        <ul className="list-disc pl-5 space-y-1" style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          <li><strong style={{ color: 'var(--nexo-text-primary, #1F2937)' }}>Kontodaten:</strong> E-Mail-Adresse und optionaler Name bei der Registrierung</li>
          <li><strong style={{ color: 'var(--nexo-text-primary, #1F2937)' }}>Nutzungsdaten:</strong> Zählerstände, Ablesewerte, Tarifinformationen und Abrechnungsdaten, die Sie selbst eingeben</li>
          <li><strong style={{ color: 'var(--nexo-text-primary, #1F2937)' }}>Zahlungsdaten:</strong> Abonnementstatus und Zahlungsinformationen (verarbeitet durch Stripe – wir speichern keine vollständigen Kartendaten)</li>
          <li><strong style={{ color: 'var(--nexo-text-primary, #1F2937)' }}>Technische Daten:</strong> Session-Cookies für die Authentifizierung sowie optionale Analyse-Cookies (Google Analytics) nur nach Ihrer ausdrücklichen Einwilligung</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-xl" style={{ fontWeight: 600 }}>3. Rechtsgrundlage der Verarbeitung</h2>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Die Verarbeitung Ihrer Daten erfolgt auf Basis von:
        </p>
        <ul className="list-disc pl-5 space-y-1" style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          <li><strong style={{ color: 'var(--nexo-text-primary, #1F2937)' }}>Art. 6 Abs. 1 lit. b DSGVO</strong> – Vertragserfüllung (Bereitstellung des Dienstes nach Registrierung)</li>
          <li><strong style={{ color: 'var(--nexo-text-primary, #1F2937)' }}>Art. 6 Abs. 1 lit. f DSGVO</strong> – Berechtigtes Interesse (Sicherheit und Stabilität des Dienstes)</li>
          <li><strong style={{ color: 'var(--nexo-text-primary, #1F2937)' }}>Art. 6 Abs. 1 lit. a DSGVO</strong> – Einwilligung (Analyse-Cookies / Google Analytics, nur wenn Sie zustimmen)</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-xl" style={{ fontWeight: 600 }}>4. Dienstleister und Dritte</h2>

        <div>
          <h3 className="font-semibold">Vercel (Hosting)</h3>
          <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
            Die Webanwendung wird gehostet bei Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.
            Vercel verarbeitet dabei technische Verbindungsdaten (IP-Adressen, Anfrage-Metadaten) bei der
            Auslieferung der Seite. Die Datenübertragung in die USA wird durch Standardvertragsklauseln (SCC)
            gemäß Art. 46 Abs. 2 lit. c DSGVO abgesichert. Weitere Informationen:{' '}
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--nexo-cta, #1D7874)' }}>vercel.com/legal/privacy-policy</a>
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Supabase (Datenbank & Authentifizierung)</h3>
          <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
            Wir verwenden Supabase (Supabase Inc., San Francisco, CA, USA) als Datenbank und
            Authentifizierungsdienst. Ihre Kontodaten und Nutzungsdaten werden auf Supabase-Servern
            gespeichert. Die Übertragung erfolgt verschlüsselt. Die Datenübertragung in die USA wird
            durch Standardvertragsklauseln (SCC) gemäß Art. 46 Abs. 2 lit. c DSGVO abgesichert.
            Weitere Informationen:{' '}
            <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--nexo-cta, #1D7874)' }}>supabase.com/privacy</a>
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Zoho Mail (E-Mail-Versand)</h3>
          <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
            Für den Versand von Authentifizierungs-E-Mails (Registrierungsbestätigung, Passwort-Reset,
            Erinnerungen) nutzen wir Zoho Mail (Zoho Corporation Pvt. Ltd., Tamil Nadu, Indien / Zoho
            Corporation, Pleasanton, CA, USA). Dabei werden E-Mail-Adressen der Empfänger verarbeitet.
            Weitere Informationen:{' '}
            <a href="https://www.zoho.com/privacy.html" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--nexo-cta, #1D7874)' }}>zoho.com/privacy.html</a>
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Stripe (Zahlungsabwicklung)</h3>
          <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
            Zahlungen werden über Stripe (Stripe Inc., San Francisco, CA, USA) abgewickelt. Stripe
            verarbeitet Zahlungsdaten nach eigenem Datenschutzstandard. Wir erhalten lediglich den
            Zahlungsstatus und eine Kundennummer. Die Datenübertragung in die USA wird durch
            Standardvertragsklauseln (SCC) gemäß Art. 46 Abs. 2 lit. c DSGVO abgesichert.
            Weitere Informationen:{' '}
            <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--nexo-cta, #1D7874)' }}>stripe.com/de/privacy</a>
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Google Analytics (Websiteanalyse)</h3>
          <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
            Mit Ihrer Einwilligung verwenden wir Google Analytics 4 (Google Ireland Limited, Gordon House,
            Barrow Street, Dublin 4, Irland). Dabei werden Nutzungsdaten (besuchte Seiten, Verweildauer,
            Herkunft) erfasst. Google Analytics 4 speichert IP-Adressen nicht vollständig. Daten können
            an Google LLC-Server in den USA übertragen werden; die Übertragung wird durch
            Standardvertragsklauseln (SCC) gemäß Art. 46 Abs. 2 lit. c DSGVO abgesichert. Google Analytics
            wird nur geladen, wenn Sie die Analyse-Cookies im Cookie-Banner akzeptieren. Ihre Einwilligung
            können Sie jederzeit widerrufen, indem Sie Cookies in Ihrem Browser löschen. Weitere
            Informationen:{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--nexo-cta, #1D7874)' }}>policies.google.com/privacy</a>
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Sentry (Fehlerüberwachung)</h3>
          <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
            Zur Erkennung und Behebung technischer Fehler nutzen wir Sentry (Functional Software Inc.
            d/b/a Sentry, 45 Fremont Street, San Francisco, CA 94105, USA). Im Fehlerfall kann Sentry
            technische Daten wie Fehlermeldungen, Geräteinformationen und pseudonymisierte Benutzer-IDs
            erfassen. Die Datenübertragung in die USA wird durch Standardvertragsklauseln (SCC) gemäß
            Art. 46 Abs. 2 lit. c DSGVO abgesichert. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO
            (berechtigtes Interesse an Stabilität und Sicherheit des Dienstes). Weitere Informationen:{' '}
            <a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--nexo-cta, #1D7874)' }}>sentry.io/privacy</a>
          </p>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-xl" style={{ fontWeight: 600 }}>5. Cookies</h2>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Diese Website verwendet zwei Arten von Cookies:
        </p>
        <ul className="list-disc pl-5 space-y-1" style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          <li><strong style={{ color: 'var(--nexo-text-primary, #1F2937)' }}>Technisch notwendige Cookies:</strong> Session-Cookies von Supabase für die Authentifizierung. Diese sind für den Betrieb des Dienstes erforderlich und können nicht deaktiviert werden.</li>
          <li><strong style={{ color: 'var(--nexo-text-primary, #1F2937)' }}>Analyse-Cookies (optional):</strong> Google Analytics 4 Cookies zur Websiteanalyse. Diese werden nur gesetzt, wenn Sie im Cookie-Banner auf „Akzeptieren" klicken. Sie können Ihre Einwilligung jederzeit durch Löschen der Cookies widerrufen.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-xl" style={{ fontWeight: 600 }}>6. Speicherdauer</h2>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Ihre Daten werden gespeichert, solange Ihr Konto aktiv ist. Nach Kontolöschung werden alle
          personenbezogenen Daten innerhalb von 30 Tagen gelöscht. Gesetzliche Aufbewahrungsfristen
          (z. B. für Rechnungsdaten: 10 Jahre nach § 147 AO) bleiben unberührt.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-xl" style={{ fontWeight: 600 }}>7. Ihre Rechte</h2>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:
        </p>
        <ul className="list-disc pl-5 space-y-1" style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          <li><strong style={{ color: 'var(--nexo-text-primary, #1F2937)' }}>Auskunft</strong> (Art. 15 DSGVO) – Sie können jederzeit Auskunft über Ihre gespeicherten Daten verlangen</li>
          <li><strong style={{ color: 'var(--nexo-text-primary, #1F2937)' }}>Berichtigung</strong> (Art. 16 DSGVO) – Korrektur unrichtiger Daten</li>
          <li><strong style={{ color: 'var(--nexo-text-primary, #1F2937)' }}>Löschung</strong> (Art. 17 DSGVO) – Löschung Ihres Kontos und aller Daten jederzeit über Einstellungen → Konto</li>
          <li><strong style={{ color: 'var(--nexo-text-primary, #1F2937)' }}>Datenportabilität</strong> (Art. 20 DSGVO) – Export Ihrer Daten über Einstellungen → Daten & Export</li>
          <li><strong style={{ color: 'var(--nexo-text-primary, #1F2937)' }}>Widerspruch</strong> (Art. 21 DSGVO) – Widerspruch gegen die Verarbeitung</li>
        </ul>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Zur Ausübung Ihrer Rechte wenden Sie sich an:{' '}
          <a href="mailto:support@nexoen.de" style={{ color: 'var(--nexo-cta, #1D7874)' }}>support@nexoen.de</a>
        </p>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Sie haben außerdem das Recht, sich bei der zuständigen Datenschutzaufsichtsbehörde zu beschweren.
        </p>
      </section>
    </article>
  );
}
