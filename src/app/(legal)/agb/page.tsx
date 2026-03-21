export const metadata = {
  title: 'AGB – nexoen',
};

export default function AgbPage() {
  return (
    <article className="space-y-8 font-body" style={{ color: 'var(--nexo-text-primary, #1F2937)' }}>
      <div>
        <h1 className="font-heading text-3xl mb-2" style={{ fontWeight: 400 }}>Allgemeine Geschäftsbedingungen</h1>
        <p className="text-sm" style={{ color: 'var(--nexo-text-secondary, #6B7280)' }}>
          Stand: März 2026
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="font-heading text-xl" style={{ fontWeight: 600 }}>1. Geltungsbereich</h2>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der Webanwendung nexoen, betrieben von
          Faur Gabriel-Andrei, Werner-Seelenbinder 32, 09484 Kurort Oberwiesenthal (nachfolgend „Anbieter").
          Mit der Registrierung eines Kontos akzeptieren Sie diese AGB.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-xl" style={{ fontWeight: 600 }}>2. Leistungsbeschreibung</h2>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          nexoen ist eine Webanwendung zur Erfassung von Energiezählerständen (Strom, Gas, Wasser, Heizung)
          sowie zur Prognose und Analyse von Nebenkosten auf Basis eingegebener Tarife und ista-Abrechnungsdaten.
          Der Dienst dient ausschließlich zur persönlichen Haushaltsverwaltung und stellt keine steuerliche
          oder rechtliche Beratung dar.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-xl" style={{ fontWeight: 600 }}>3. Abonnements und Preise</h2>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          nexoen bietet folgende Nutzungsmodelle an:
        </p>
        <ul className="list-disc pl-5 space-y-1" style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          <li><strong style={{ color: 'var(--nexo-text-primary, #1F2937)' }}>Testphase:</strong> 14 Tage kostenlos mit vollem Funktionsumfang, kein Zahlungsmittel erforderlich</li>
          <li><strong style={{ color: 'var(--nexo-text-primary, #1F2937)' }}>Jahresabonnement:</strong> 19,99 €/Jahr, voller Zugriff auf alle Funktionen, jährliche Abrechnung</li>
        </ul>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Aktuelle Preise sind auf der Abonnement-Seite innerhalb der Anwendung einsehbar. Der Anbieter ist
          Kleinunternehmer gemäß § 19 UStG. Es wird keine Umsatzsteuer erhoben und ausgewiesen. Der
          angegebene Preis ist der Endpreis.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-xl" style={{ fontWeight: 600 }}>4. Zahlung und Abrechnung</h2>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Zahlungen werden über Stripe abgewickelt. Das Jahresabonnement verlängert sich automatisch
          um ein weiteres Jahr, sofern es nicht zuvor gekündigt wird. Sie können jederzeit kündigen –
          die Kündigung wird zum Ende des laufenden Abrechnungszeitraums wirksam. Bei Zahlungsausfall
          behalten wir uns vor, den Zugang zu kostenpflichtigen Funktionen zu sperren.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-xl" style={{ fontWeight: 600 }}>5. Kündigung</h2>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Sie können Ihr Abonnement jederzeit über Einstellungen → Abonnement oder per E-Mail an{' '}
          <a href="mailto:support@nexoen.de" style={{ color: 'var(--nexo-cta, #1D7874)' }}>support@nexoen.de</a>{' '}
          kündigen. Die Kündigung wird zum Ende des aktuellen Abrechnungszeitraums wirksam.
        </p>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Das kostenlose Konto bleibt nach der Kündigung eines Abonnements weiterhin nutzbar.
          Sie können Ihr Konto vollständig löschen über Einstellungen → Konto. Dabei werden alle
          gespeicherten Daten unwiderruflich gelöscht.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-xl" style={{ fontWeight: 600 }}>6. Widerrufsrecht</h2>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.
        </p>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.
        </p>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (Faur Gabriel-Andrei, Werner-Seelenbinder 32,
          09484 Kurort Oberwiesenthal, E-Mail:{' '}
          <a href="mailto:support@nexoen.de" style={{ color: 'var(--nexo-cta, #1D7874)' }}>support@nexoen.de</a>)
          mittels einer eindeutigen Erklärung (z. B. eine E-Mail) über Ihren Entschluss, diesen Vertrag
          zu widerrufen, informieren. Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung
          über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
        </p>
        <div>
          <p className="font-semibold" style={{ color: 'var(--nexo-text-primary, #1F2937)' }}>Folgen des Widerrufs</p>
          <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
            Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen
            erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen,
            an dem die Mitteilung über Ihren Widerruf bei uns eingegangen ist. Für diese Rückzahlung
            verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt
            haben; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.
          </p>
        </div>
        <div className="rounded-[4px] p-4 space-y-2" style={{ background: 'var(--nexo-bg, #F9FAFB)', border: '1px solid var(--nexo-border, #E5E7EB)' }}>
          <p className="font-semibold text-sm" style={{ color: 'var(--nexo-text-primary, #1F2937)' }}>Muster-Widerrufsformular</p>
          <p className="text-sm" style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
            (Wenn Sie den Vertrag widerrufen wollen, füllen Sie bitte dieses Formular aus und senden Sie es per E-Mail an{' '}
            <a href="mailto:support@nexoen.de" style={{ color: 'var(--nexo-cta, #1D7874)' }}>support@nexoen.de</a>.)
          </p>
          <ul className="text-sm space-y-1" style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
            <li>An: Faur Gabriel-Andrei, Werner-Seelenbinder 32, 09484 Kurort Oberwiesenthal, support@nexoen.de</li>
            <li>Hiermit widerrufe ich den von mir abgeschlossenen Vertrag über die Erbringung der folgenden Dienstleistung: nexoen Jahresabonnement</li>
            <li>Bestellt am: _______________</li>
            <li>Name: _______________</li>
            <li>Adresse: _______________</li>
            <li>Datum: _______________</li>
          </ul>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-xl" style={{ fontWeight: 600 }}>7. Freiwillige 30-Tage-Geld-zurück-Garantie</h2>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Zusätzlich zum gesetzlichen Widerrufsrecht (§ 6) gewähren wir eine freiwillige
          Geld-zurück-Garantie: Wenn Sie innerhalb von 30 Tagen nach Abschluss des Jahresabonnements
          aus beliebigem Grund unzufrieden sind, erstatten wir Ihnen den vollen Betrag von 19,99 € –
          ohne Angabe von Gründen. Senden Sie dazu einfach eine E-Mail an{' '}
          <a href="mailto:support@nexoen.de" style={{ color: 'var(--nexo-cta, #1D7874)' }}>support@nexoen.de</a>.
          Die Erstattung erfolgt innerhalb von 14 Tagen auf das ursprüngliche Zahlungsmittel.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-xl" style={{ fontWeight: 600 }}>8. Verfügbarkeit</h2>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Wir bemühen uns um eine hohe Verfügbarkeit des Dienstes, können jedoch keine 100%ige
          Verfügbarkeit garantieren. Wartungsarbeiten werden, wenn möglich, vorab angekündigt.
          Ein Anspruch auf Verfügbarkeit besteht nicht.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-xl" style={{ fontWeight: 600 }}>9. Haftungsbeschränkung</h2>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Die in nexoen angezeigten Prognosen und Berechnungen basieren auf den von Ihnen eingegebenen Daten
          und dienen ausschließlich zur Orientierung. Der Anbieter übernimmt keine Haftung für die
          Richtigkeit der Prognosen oder für Entscheidungen, die auf Basis der Anwendung getroffen werden.
          Die Haftung des Anbieters ist auf Vorsatz und grobe Fahrlässigkeit beschränkt.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-xl" style={{ fontWeight: 600 }}>10. Änderungen der AGB</h2>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Wir behalten uns vor, diese AGB mit angemessener Vorankündigung zu ändern. Sie werden über
          wesentliche Änderungen per E-Mail informiert. Die fortgesetzte Nutzung des Dienstes nach
          Inkrafttreten geänderter AGB gilt als Zustimmung.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-xl" style={{ fontWeight: 600 }}>11. Anwendbares Recht</h2>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist, soweit gesetzlich zulässig,
          Kurort Oberwiesenthal.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-xl" style={{ fontWeight: 600 }}>12. Kontakt</h2>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Bei Fragen zu diesen AGB wenden Sie sich an:{' '}
          <a href="mailto:support@nexoen.de" style={{ color: 'var(--nexo-cta, #1D7874)' }}>support@nexoen.de</a>
        </p>
      </section>
    </article>
  );
}
