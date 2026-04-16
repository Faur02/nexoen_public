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
          E-Mail: <a href="mailto:support@nexoen.de" style={{ color: 'var(--nexo-cta, #1D7874)' }}>support@nexoen.de</a>
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
            gemäß Art. 46 Abs. 2 lit. c DSGVO sowie das EU-US Data Privacy Framework (DPF) abgesichert.
            Vercel ist unter dem EU-US DPF zertifiziert. Weitere Informationen:{' '}
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
            verarbeitet Zahlungsdaten als eigenverantwortlicher Auftragsverarbeiter. Wir erhalten lediglich
            den Zahlungsstatus und eine Kundennummer. Die Datenübertragung in die USA wird durch
            Standardvertragsklauseln (SCC) gemäß Art. 46 Abs. 2 lit. c DSGVO sowie das EU-US Data Privacy
            Framework (DPF) abgesichert. Stripe ist unter dem EU-US DPF zertifiziert.
            Weitere Informationen:{' '}
            <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--nexo-cta, #1D7874)' }}>stripe.com/de/privacy</a>
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Google Analytics (Websiteanalyse)</h3>
          <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
            Mit Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG) verwenden wir Google
            Analytics 4 (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland). Dabei
            werden Nutzungsdaten (besuchte Seiten, Verweildauer, Herkunft) erfasst. Google Analytics 4
            speichert IP-Adressen anonymisiert. Daten können an Google LLC-Server in den USA übertragen
            werden; die Übertragung wird durch Standardvertragsklauseln (SCC) gemäß Art. 46 Abs. 2 lit. c
            DSGVO sowie das EU-US Data Privacy Framework (DPF) abgesichert. Google ist unter dem EU-US DPF
            zertifiziert. Google Analytics wird technisch blockiert und nur geladen, wenn Sie die
            Analyse-Cookies im Cookie-Banner ausdrücklich akzeptieren. Ihre Einwilligung können Sie
            jederzeit widerrufen, indem Sie Cookies in Ihrem Browser löschen. Weitere
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
          Diese Website verwendet Cookies gemäß § 25 TDDDG (Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz).
          Nicht technisch notwendige Cookies werden erst nach Ihrer ausdrücklichen Einwilligung gesetzt und
          technisch blockiert, bis diese erteilt wird.
        </p>
        <ul className="list-disc pl-5 space-y-1" style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          <li><strong style={{ color: 'var(--nexo-text-primary, #1F2937)' }}>Technisch notwendige Cookies (§ 25 Abs. 2 TDDDG):</strong> Session-Cookies von Supabase für die Authentifizierung. Diese sind für den Betrieb des Dienstes unbedingt erforderlich und benötigen keine Einwilligung.</li>
          <li><strong style={{ color: 'var(--nexo-text-primary, #1F2937)' }}>Analyse-Cookies (nur mit Einwilligung nach § 25 Abs. 1 TDDDG):</strong> Google Analytics 4 Cookies zur Websiteanalyse. Diese werden technisch blockiert und erst gesetzt, wenn Sie im Cookie-Banner ausdrücklich auf „Akzeptieren" klicken. Ihre Einwilligung können Sie jederzeit widerrufen.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-xl" style={{ fontWeight: 600 }}>6. Speicherdauer</h2>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Wir speichern Ihre personenbezogenen Daten nur so lange, wie es für den jeweiligen Zweck
          erforderlich ist (Art. 5 Abs. 1 lit. e DSGVO):
        </p>
        <ul className="list-disc pl-5 space-y-1" style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          <li><strong style={{ color: 'var(--nexo-text-primary, #1F2937)' }}>Kontodaten (E-Mail, Name):</strong> Bis zur Löschung Ihres Kontos. Nach Kontolöschung werden alle Daten innerhalb von 30 Tagen entfernt.</li>
          <li><strong style={{ color: 'var(--nexo-text-primary, #1F2937)' }}>Nutzungsdaten (Zählerstände, Abrechnungsdaten):</strong> Bis zur Kontolöschung; Sie können diese jederzeit selbst löschen.</li>
          <li><strong style={{ color: 'var(--nexo-text-primary, #1F2937)' }}>Zahlungs- und Rechnungsdaten:</strong> 10 Jahre gemäß § 147 AO (steuerliche Aufbewahrungspflicht).</li>
          <li><strong style={{ color: 'var(--nexo-text-primary, #1F2937)' }}>Session-Cookies:</strong> Ablauf mit Ende der Browser-Sitzung oder nach konfigurierbarer Zeitspanne.</li>
          <li><strong style={{ color: 'var(--nexo-text-primary, #1F2937)' }}>Fehlerprotokolle (Sentry):</strong> Automatische Löschung nach 90 Tagen.</li>
          <li><strong style={{ color: 'var(--nexo-text-primary, #1F2937)' }}>Analyse-Daten (Google Analytics):</strong> 14 Monate (Standardeinstellung GA4), danach automatische Löschung.</li>
        </ul>
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
          Zuständige Aufsichtsbehörde für den Anbieter ist:
        </p>
        <div className="rounded-[4px] p-4" style={{ background: 'var(--nexo-bg, #F9FAFB)', border: '1px solid var(--nexo-border, #E5E7EB)' }}>
          <p style={{ lineHeight: '1.8' }}>
            Sächsischer Datenschutzbeauftragter<br />
            Devrientstraße 5<br />
            01067 Dresden<br />
            <a href="https://www.saechsdsb.de" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--nexo-cta, #1D7874)' }}>www.saechsdsb.de</a>
          </p>
        </div>
      </section>
    </article>
  );
}
