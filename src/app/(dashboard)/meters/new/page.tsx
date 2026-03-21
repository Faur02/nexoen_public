import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { SubscriptionTier } from '@/types/database';
import { hasAccess, getEffectiveTier } from '@/lib/config/tiers';
import { NewMeterForm } from './new-meter-form';

const cardShadow = 'var(--nexo-card-shadow)';

export default async function NewMeterPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier, trial_ends_at')
    .eq('id', user.id)
    .single() as { data: { subscription_tier: SubscriptionTier; trial_ends_at: string | null } | null };

  const rawTier: SubscriptionTier = profile?.subscription_tier ?? 'expired';
  const tier = getEffectiveTier(rawTier, profile?.trial_ends_at ?? null);
  const atLimit = !hasAccess(tier);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/meters"
          className="font-heading inline-block"
          style={{
            fontSize: '16px',
            color: 'var(--nexo-cta)',
            fontWeight: 400,
            opacity: 0.7,
            textDecoration: 'none',
          }}
        >
          &larr; Zurück zu Zähler
        </Link>
      </div>

      <h1
        className="font-heading text-3xl lg:text-5xl"
        style={{
          lineHeight: '120%',
          fontWeight: 400,
          color: 'var(--nexo-text-primary)',
        }}
      >
        Neuen Zähler anlegen
      </h1>
      <p
        className="font-body text-base lg:text-xl"
        style={{
          marginTop: '16px',
          lineHeight: '140%',
          color: 'var(--nexo-text-secondary)',
          marginBottom: '32px',
        }}
      >
        Fügen Sie einen Zähler für Strom oder Gas hinzu
      </p>

      {atLimit ? (
        <div
          className="p-5 sm:p-8"
          style={{
            borderRadius: '4px',
            boxShadow: cardShadow,
            backgroundColor: 'var(--nexo-card-bg)',
            maxWidth: 520,
          }}
        >
          <p className="font-heading" style={{ fontSize: '22px', fontWeight: 400, color: 'var(--nexo-text-primary)', marginBottom: 8 }}>
            Testphase abgelaufen
          </p>
          <p className="font-body" style={{ fontSize: '14px', color: 'var(--nexo-text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
            Um Strom- und Gas-Zähler hinzuzufügen, aktiviere dein nexoen-Jahresabo.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
            {[
              { icon: '⚡', text: 'Strom-Zähler hinzufügen & Jahresprognose' },
              { icon: '🔥', text: 'Gas-Zähler hinzufügen & Jahresprognose' },
              { icon: '📊', text: 'Heizkostenrechner — simuliere deine Ersparnisse' },
              { icon: '📅', text: 'Geschätzte Kosten pro Monat (aus Monatsdaten)' },
              { icon: '📄', text: 'PDF-Bericht exportieren' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '16px', width: 24, textAlign: 'center' }}>{icon}</span>
                <span className="font-body" style={{ fontSize: '13px', color: 'var(--nexo-text-primary)' }}>{text}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <p className="font-heading" style={{ margin: 0, fontSize: '28px', fontWeight: 400, color: 'var(--nexo-text-primary)' }}>
              19,99 €
            </p>
            <span className="font-body" style={{ fontSize: '13px', color: 'var(--nexo-text-muted)' }}>/Jahr</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <Link href="/settings?tab=abonnement">
              <button style={{ backgroundColor: 'var(--nexo-cta)', color: '#fff', borderRadius: '4px', padding: '11px 28px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                Abo aktivieren →
              </button>
            </Link>
            <Link href="/meters">
              <button style={{ backgroundColor: 'transparent', color: 'var(--nexo-text-muted)', borderRadius: '4px', padding: '11px 20px', fontSize: '14px', border: '1px solid var(--nexo-border)', cursor: 'pointer' }}>
                Zurück
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <NewMeterForm />
      )}
    </div>
  );
}
