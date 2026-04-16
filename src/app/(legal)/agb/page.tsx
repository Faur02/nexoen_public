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
          [YOUR NAME], [YOUR STREET ADDRESS], [YOUR ZIP CODE] [YOUR CITY] (nachfolgend „Anbieter").
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
          <li><strong style={{ color: 'var(--nexo-text-primary, #1F2937)' }}>Testphase:</strong> 3 Monate kostenlos mit vollem Funktionsumfang, kein Zahlungsmittel erforderlich</li>
          <li><strong style={{ color: 'var(--nexo-text-primary, #1F2937)' }}>Jahresabonnement:</strong> 19,99 € pro Jahr (Endpreis), voller Zugriff auf alle Funktionen, jährliche Abrechnung</li>
        </ul>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Der Anbieter ist Kleinunternehmer gemäß § 19 UStG. Es wird keine Umsatzsteuer erhoben und ausgewiesen.
          Der angegebene Preis ist der Endpreis. Aktuelle Preise sind auf der Abonnement-Seite innerhalb der
          Anwendung einsehbar.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-xl" style={{ fontWeight: 600 }}>4. Zahlung und Abrechnung</h2>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Zahlungen werden über Stripe abgewickelt. Das Jahresabonnement verlängert sich automatisch
          um ein weiteres Jahr, sofern es nicht spätestens einen Tag vor Ablauf des Abrechnungszeitraums
          gekündigt wird. Bei Zahlungsausfall behalten wir uns vor, den Zugang zu kostenpflichtigen
          Funktionen zu sperren.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-xl" style={{ fontWeight: 600 }}>5. Kündigung</h2>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Sie können Ihr Abonnement jederzeit kündigen – über den Button{' '}
          <strong style={{ color: 'var(--nexo-text-primary, #1F2937)' }}>&bdquo;Verträge hier kündigen&ldquo;</strong>{' '}
          in der Fußzeile dieser Website, über Einstellungen → Abonnement in der App oder per E-Mail an{' '}
          <a href="mailto:support@nexoen.de" style={{ color: 'var(--nexo-cta, #1D7874)' }}>support@nexoen.de</a>.
          Die Kündigung wird zum Ende des aktuellen Abrechnungszeitraums wirksam.
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
          Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.
        </p>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Um Ihr Widerrufsrecht auszuüben, müssen Sie uns ([YOUR NAME], [YOUR STREET ADDRESS], [YOUR ZIP CODE] [YOUR CITY], E-Mail:{' '}
          <a href="mailto:support@nexoen.de" style={{ color: 'var(--nexo-cta, #1D7874)' }}>support@nexoen.de</a>)
          mittels einer eindeutigen Erklärung (z. B. eine E-Mail) über Ihren Entschluss, diesen Vertrag
          zu widerrufen, informieren. Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung
          über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
        </p>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Die vollständige Widerrufsbelehrung mit Muster-Widerrufsformular finden Sie auf unserer{' '}
          <a href="/widerruf" style={{ color: 'var(--nexo-cta, #1D7874)' }}>Widerrufsbelehrungs-Seite</a>.
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
          (1) Der Anbieter haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie für Schäden
          aus der Verletzung des Lebens, des Körpers oder der Gesundheit.
        </p>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          (2) Bei leichter Fahrlässigkeit haftet der Anbieter nur bei Verletzung einer wesentlichen
          Vertragspflicht (Kardinalpflicht). Eine Kardinalpflicht ist eine Pflicht, deren Erfüllung die
          ordnungsgemäße Durchführung des Vertrags überhaupt erst ermöglicht und auf deren Einhaltung
          der Vertragspartner regelmäßig vertrauen darf. Die Haftung ist in diesem Fall auf den
          vertragstypischen, vorhersehbaren Schaden begrenzt.
        </p>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          (3) Die in nexoen angezeigten Prognosen und Berechnungen basieren auf den von Ihnen eingegebenen
          Daten und dienen ausschließlich zur Orientierung. Der Anbieter übernimmt keine Haftung für die
          Richtigkeit der Prognosen oder für Entscheidungen, die auf Basis der Anwendung getroffen werden.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-xl" style={{ fontWeight: 600 }}>10. Änderungen der AGB</h2>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Wir behalten uns vor, diese AGB mit angemessener Vorankündigung von mindestens 30 Tagen zu ändern.
          Sie werden über wesentliche Änderungen per E-Mail informiert. Wesentliche Änderungen bedürfen
          Ihrer ausdrücklichen Zustimmung. Stimmen Sie den geänderten AGB nicht zu, haben Sie das Recht,
          Ihren Vertrag zum Zeitpunkt des Inkrafttretens der Änderungen zu kündigen.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-xl" style={{ fontWeight: 600 }}>11. Anwendbares Recht und Gerichtsstand</h2>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          (1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
          Bei Verbrauchern gilt diese Rechtswahl nur insoweit, als nicht der gewährte Schutz durch
          zwingende Bestimmungen des Rechts des Staates, in dem der Verbraucher seinen gewöhnlichen
          Aufenthalt hat, entzogen wird.
        </p>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          (2) Sofern der Nutzer Kaufmann ist, ist der Gerichtsstand der Sitz des Anbieters.
          Für Verbraucher gelten die gesetzlichen Gerichtsstände.
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
