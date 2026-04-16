'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { ProfileTab } from '@/components/settings/profile-tab';
import { SecurityTab } from '@/components/settings/security-tab';
import { AppearanceTab } from '@/components/settings/appearance-tab';
import { NotificationsTab } from '@/components/settings/notifications-tab';
import { SubscriptionTab } from '@/components/settings/subscription-tab';
import { DataExportTab } from '@/components/settings/data-export-tab';
import { AccountTab } from '@/components/settings/account-tab';
import { Profile, NotificationPreferences } from '@/types/database';
import { useEffect } from 'react';
import { sendAnalyticsEvent } from '@/lib/analytics';

interface SettingsClientProps {
  userId: string;
  email: string;
  createdAt: string;
  profile: Profile | null;
  notificationPreferences: NotificationPreferences;
}

const tabs = [
  { value: 'profil', label: 'Profil', icon: UserIcon },
  { value: 'sicherheit', label: 'Sicherheit', icon: LockIcon },
  { value: 'erscheinungsbild', label: 'Erscheinungsbild', icon: PaletteIcon },
  { value: 'benachrichtigungen', label: 'Benachrichtigungen', icon: BellIcon },
  { value: 'abonnement', label: 'Abonnement', icon: CreditCardIcon },
  { value: 'daten-export', label: 'Daten & Export', icon: DownloadIcon },
  { value: 'konto', label: 'Konto', icon: TrashIcon },
] as const;

type TabValue = (typeof tabs)[number]['value'];

export function SettingsClient({
  userId,
  email,
  createdAt,
  profile,
  notificationPreferences,
}: SettingsClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get('tab') as TabValue | null;
  const currentTab: TabValue = tabParam || 'profil';
  // On mobile: no tab param = show the menu list
  const hasExplicitTab = searchParams.has('tab');

  const currentTabLabel = tabs.find(t => t.value === currentTab)?.label || '';

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      sendAnalyticsEvent('purchase', {
        currency: 'EUR',
        value: 19.99,
        items: [{ item_name: 'nexoen Plus Jahresabo', price: 19.99 }],
      });
    }
  }, [searchParams]);

  const handleDesktopTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);
    router.push(`/settings?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="animate-fade-in-up">

      {/* ── Mobile header ─────────────────────────────────────────── */}
      <div className="lg:hidden mb-6">
        {hasExplicitTab ? (
          /* Content view: back button + section title */
          <div>
            <button
              onClick={() => router.push('/settings', { scroll: false } as Parameters<typeof router.push>[1])}
              className="flex items-center gap-1.5 mb-4 font-body"
              style={{ fontSize: '14px', color: 'var(--nexo-cta)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Einstellungen
            </button>
            <h1 className="font-heading" style={{ fontSize: '28px', fontWeight: 400, color: 'var(--nexo-text-primary)', lineHeight: '120%' }}>
              {currentTabLabel}
            </h1>
          </div>
        ) : (
          /* Menu view: main title */
          <div>
            <h1 className="font-heading" style={{ fontSize: '36px', fontWeight: 400, color: 'var(--nexo-text-primary)', lineHeight: '120%' }}>
              Einstellungen
            </h1>
            <p className="font-body mt-2" style={{ fontSize: '15px', color: 'var(--nexo-text-secondary)' }}>
              Profil und Kontoeinstellungen
            </p>
          </div>
        )}
      </div>

      {/* ── Desktop header ────────────────────────────────────────── */}
      <div className="hidden lg:block mb-8">
        <h1 className="font-heading" style={{ fontSize: '48px', lineHeight: '120%', fontWeight: 400, color: 'var(--nexo-text-primary)' }}>
          Einstellungen
        </h1>
        <p className="font-body" style={{ marginTop: '16px', fontSize: '20px', lineHeight: '140%', color: 'var(--nexo-text-secondary)' }}>
          Verwalten Sie Ihr Profil und Ihre Kontoeinstellungen
        </p>
      </div>

      {/* ── Mobile: menu list (no tab selected) ──────────────────── */}
      {!hasExplicitTab && (
        <div className="lg:hidden space-y-2">
          {tabs.map((tab, i) => (
            <button
              key={tab.value}
              onClick={() => router.push(`/settings?tab=${tab.value}`, { scroll: false } as Parameters<typeof router.push>[1])}
              className="w-full flex items-center justify-between font-body transition-opacity active:opacity-60"
              style={{
                backgroundColor: 'var(--nexo-card-bg)',
                borderRadius: '4px',
                boxShadow: 'var(--nexo-card-shadow)',
                border: '1px solid var(--nexo-border)',
                padding: '14px 16px',
                cursor: 'pointer',
                // danger zone: last item (Konto/delete) gets a subtle red tint
                ...(i === tabs.length - 1 ? { borderColor: 'rgba(239,68,68,0.2)' } : {}),
              }}
            >
              <div className="flex items-center gap-3">
                <span style={{ color: i === tabs.length - 1 ? '#EF4444' : 'var(--nexo-text-secondary)' }}>
                  <tab.icon />
                </span>
                <span style={{ fontSize: '16px', fontWeight: 500, color: i === tabs.length - 1 ? '#EF4444' : 'var(--nexo-text-primary)' }}>
                  {tab.label}
                </span>
              </div>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                style={{ color: 'var(--nexo-text-muted)', flexShrink: 0 }}>
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          ))}

          {/* Legal links in menu view */}
          <div className="flex gap-6 flex-wrap pt-4" style={{ borderTop: '1px solid var(--nexo-border)' }}>
            <a href="/impressum" className="font-body text-sm opacity-50 hover:opacity-80 transition-opacity" style={{ color: 'var(--nexo-text-primary)' }}>Impressum</a>
            <a href="/datenschutz" className="font-body text-sm opacity-50 hover:opacity-80 transition-opacity" style={{ color: 'var(--nexo-text-primary)' }}>Datenschutz</a>
            <a href="/agb" className="font-body text-sm opacity-50 hover:opacity-80 transition-opacity" style={{ color: 'var(--nexo-text-primary)' }}>AGB</a>
          </div>
        </div>
      )}

      {/* ── Tab content (mobile: only when tab selected; desktop: always) ── */}
      <div className={!hasExplicitTab ? 'hidden lg:block' : ''}>
        <Tabs value={currentTab} onValueChange={handleDesktopTabChange}>
          <TabsContent value="profil">
            <ProfileTab
              userId={userId}
              email={email}
              createdAt={createdAt}
              profile={profile}
            />
          </TabsContent>

          <TabsContent value="sicherheit">
            <SecurityTab />
          </TabsContent>

          <TabsContent value="erscheinungsbild">
            <AppearanceTab />
          </TabsContent>

          <TabsContent value="benachrichtigungen">
            <NotificationsTab
              preferences={notificationPreferences}
              subscriptionTier={profile?.subscription_tier || 'trial'}
              emailRemindersEnabled={profile?.email_reminders_enabled ?? true}
            />
          </TabsContent>

          <TabsContent value="abonnement">
            <SubscriptionTab
              currentTier={profile?.subscription_tier || 'trial'}
              trialEndsAt={profile?.trial_ends_at || null}
              userId={userId}
              hasStripeSubscription={!!profile?.stripe_subscription_id}
              cancelAtPeriodEnd={profile?.cancel_at_period_end ?? false}
              subscriptionEndsAt={profile?.subscription_ends_at ?? null}
            />
          </TabsContent>

          <TabsContent value="daten-export">
            <DataExportTab />
          </TabsContent>

          <TabsContent value="konto">
            <AccountTab userEmail={email} createdAt={createdAt} />
          </TabsContent>
        </Tabs>

        {/* Legal links — desktop sidebar handles these, mobile menu view has them above */}
        <div className="hidden lg:flex mt-10 pt-6 gap-6 flex-wrap" style={{ borderTop: '1px solid var(--nexo-border)' }}>
          <a href="/impressum" className="font-body text-sm opacity-50 hover:opacity-80 transition-opacity" style={{ color: 'var(--nexo-text-primary)' }}>Impressum</a>
          <a href="/datenschutz" className="font-body text-sm opacity-50 hover:opacity-80 transition-opacity" style={{ color: 'var(--nexo-text-primary)' }}>Datenschutz</a>
          <a href="/agb" className="font-body text-sm opacity-50 hover:opacity-80 transition-opacity" style={{ color: 'var(--nexo-text-primary)' }}>AGB</a>
        </div>
      </div>
    </div>
  );
}

// Icon components
function UserIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function PaletteIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r="1.5" />
      <circle cx="17.5" cy="10.5" r="1.5" />
      <circle cx="8.5" cy="7.5" r="1.5" />
      <circle cx="6.5" cy="12.5" r="1.5" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function CreditCardIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
