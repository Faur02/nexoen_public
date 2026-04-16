import Link from 'next/link';

export const metadata = {
  title: 'Vertrag kündigen – nexoen',
};

export default function KuendigenPage() {
  return (
    <article className="space-y-8 font-body" style={{ color: 'var(--nexo-text-primary, #1F2937)' }}>
      <div>
        <h1 className="font-heading text-3xl mb-2" style={{ fontWeight: 400 }}>Verträge hier kündigen</h1>
        <p className="text-sm" style={{ color: 'var(--nexo-text-secondary, #6B7280)' }}>
          Gemäß § 312k BGB
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="font-heading text-xl" style={{ fontWeight: 600 }}>Ihr Vertrag</h2>
        <div className="rounded-[4px] p-4 space-y-1" style={{ background: 'var(--nexo-bg, #F9FAFB)', border: '1px solid var(--nexo-border, #E5E7EB)' }}>
          <p><strong>Produkt:</strong> nexoen Jahresabonnement</p>
          <p><strong>Anbieter:</strong> [YOUR NAME], [YOUR STREET ADDRESS], [YOUR ZIP CODE] [YOUR CITY]</p>
          <p><strong>Preis:</strong> 19,99 € / Jahr</p>
          <p><strong>Laufzeit:</strong> 1 Jahr, automatische Verlängerung</p>
          <p><strong>Kündigungsfrist:</strong> Jederzeit zum Ende des Abrechnungszeitraums</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-xl" style={{ fontWeight: 600 }}>Kündigung durchführen</h2>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Um Ihr Abonnement zu kündigen, melden Sie sich in Ihrem nexoen-Konto an und gehen Sie zu
          Einstellungen → Abonnement. Dort können Sie Ihr Abonnement direkt über das Stripe-Kundenportal
          kündigen. Die Kündigung wird zum Ende des laufenden Abrechnungszeitraums wirksam.
        </p>

        <Link
          href="/settings?tab=abonnement"
          style={{
            display: 'inline-block',
            backgroundColor: '#EF4444',
            color: '#FFFFFF',
            padding: '12px 28px',
            borderRadius: '4px',
            fontWeight: 600,
            fontSize: '16px',
            textDecoration: 'none',
          }}
        >
          Jetzt kündigen →
        </Link>

        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7', fontSize: '14px' }}>
          Sie werden zur Anmeldeseite weitergeleitet, falls Sie noch nicht eingeloggt sind.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-xl" style={{ fontWeight: 600 }}>Kündigung per E-Mail</h2>
        <p style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Alternativ können Sie Ihre Kündigung auch per E-Mail einreichen:
        </p>
        <div className="rounded-[4px] p-4" style={{ background: 'var(--nexo-bg, #F9FAFB)', border: '1px solid var(--nexo-border, #E5E7EB)' }}>
          <p><strong>E-Mail:</strong>{' '}
            <a href="mailto:support@nexoen.de?subject=Kündigung%20nexoen%20Jahresabonnement&body=Hiermit%20kündige%20ich%20mein%20nexoen%20Jahresabonnement%20zum%20nächstmöglichen%20Termin.%0A%0AName%3A%0AE-Mail-Adresse%20des%20Kontos%3A%0ADatum%3A" style={{ color: 'var(--nexo-cta, #1D7874)' }}>support@nexoen.de</a>
          </p>
          <p className="text-sm mt-2" style={{ color: 'var(--nexo-text-secondary, #6B7280)' }}>
            Bitte geben Sie in Ihrer E-Mail Ihren Namen und die E-Mail-Adresse Ihres nexoen-Kontos an.
            Sie erhalten eine Bestätigung innerhalb von 48 Stunden.
          </p>
        </div>
      </section>

      <section className="space-y-2">
        <p className="text-sm" style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.7' }}>
          Hinweis: Nach der Kündigung bleibt Ihr Konto bis zum Ende des bezahlten Zeitraums voll nutzbar.
          Das kostenlose Konto (mit eingeschränktem Funktionsumfang) bleibt dauerhaft erhalten.
          Wenn Sie Ihr Konto und alle Daten löschen möchten, können Sie dies unter Einstellungen → Konto tun.
        </p>
      </section>
    </article>
  );
}
