export const metadata = {
  title: 'Widerrufsbelehrung – nexoen',
};

export default function WiderrufsPage() {
  return (
    <article className="space-y-8 font-body" style={{ color: 'var(--nexo-text-primary, #1F2937)' }}>
      <div>
        <h1 className="font-heading text-3xl mb-2" style={{ fontWeight: 400 }}>Widerrufsbelehrung</h1>
        <p className="text-sm" style={{ color: 'var(--nexo-text-secondary, #6B7280)' }}>
          Stand: März 2026
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="font-heading text-xl" style={{ fontWeight: 600 }}>Widerrufsrecht</h2>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.
          Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses.
        </p>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Um Ihr Widerrufsrecht auszuüben, müssen Sie uns
        </p>
        <div className="rounded-[4px] p-4" style={{ background: 'var(--nexo-bg, #F9FAFB)', border: '1px solid var(--nexo-border, #E5E7EB)' }}>
          <p style={{ lineHeight: '1.8' }}>
            [YOUR NAME]<br />
            [YOUR STREET ADDRESS]<br />
            [YOUR ZIP CODE] [YOUR CITY]<br />
            E-Mail: <a href="mailto:support@nexoen.de" style={{ color: 'var(--nexo-cta, #1D7874)' }}>support@nexoen.de</a>
          </p>
        </div>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder eine E-Mail)
          über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Zur Wahrung der Widerrufsfrist
          reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der
          Widerrufsfrist absenden.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-xl" style={{ fontWeight: 600 }}>Folgen des Widerrufs</h2>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten
          haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die
          Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung
          verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt
          haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall
          werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-xl" style={{ fontWeight: 600 }}>Muster-Widerrufsformular</h2>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          (Wenn Sie den Vertrag widerrufen wollen, füllen Sie bitte dieses Formular aus und senden
          Sie es per E-Mail an{' '}
          <a href="mailto:support@nexoen.de" style={{ color: 'var(--nexo-cta, #1D7874)' }}>support@nexoen.de</a>.)
        </p>
        <div className="rounded-[4px] p-4 space-y-2" style={{ background: 'var(--nexo-bg, #F9FAFB)', border: '1px solid var(--nexo-border, #E5E7EB)', fontFamily: 'monospace', fontSize: '14px' }}>
          <p>An: [YOUR NAME], [YOUR STREET ADDRESS], [YOUR ZIP CODE] [YOUR CITY], support@yourdomain.de</p>
          <p style={{ marginTop: '12px' }}>
            Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf
            der folgenden Dienstleistung: nexoen Jahresabonnement
          </p>
          <p style={{ marginTop: '12px' }}>Bestellt am (*): ___________________________</p>
          <p>Name des/der Verbraucher(s): ___________________________</p>
          <p>Anschrift des/der Verbraucher(s): ___________________________</p>
          <p style={{ marginTop: '12px' }}>Datum und Unterschrift (nur bei Mitteilung auf Papier): ___________________________</p>
          <p style={{ marginTop: '12px', fontSize: '12px', color: 'var(--nexo-text-secondary, #6B7280)' }}>(*) Unzutreffendes streichen.</p>
        </div>
      </section>
    </article>
  );
}
