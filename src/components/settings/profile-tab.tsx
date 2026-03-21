'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileForm } from '@/components/forms/profile-form';
import { Profile, SubscriptionTier } from '@/types/database';

interface ProfileTabProps {
  userId: string;
  email: string;
  createdAt: string;
  profile: Profile | null;
}

const tierLabels: Record<SubscriptionTier, string> = {
  trial:   'Testphase',
  active:  'Jahresabo',
  expired: 'Abgelaufen',
};

const tierColors: Record<SubscriptionTier, { bg: string; text: string }> = {
  trial:   { bg: 'var(--nexo-cta)', text: '#FFFFFF' },
  active:  { bg: 'var(--nexo-text-primary)', text: '#FFFFFF' },
  expired: { bg: 'var(--nexo-surface)', text: 'var(--nexo-text-secondary)' },
};

export function ProfileTab({ userId, email, createdAt, profile }: ProfileTabProps) {
  const tier = profile?.subscription_tier || 'trial';
  const colors = tierColors[tier];

  return (
    <div className="space-y-6">
      <Card style={{ borderRadius: '4px', boxShadow: 'var(--nexo-card-shadow)' }}>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 400, color: 'var(--nexo-text-primary)' }}>Konto-Status</CardTitle>
          <CardDescription className="font-body">Ihre aktuelle Mitgliedschaft</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-medium break-all" style={{ color: 'var(--nexo-text-primary)' }}>
                {email}
              </p>
              <p className="text-sm" style={{ color: 'var(--nexo-text-secondary)' }}>
                Mitglied seit {new Date(createdAt).toLocaleDateString('de-DE')}
              </p>
            </div>
            <span
              className="inline-flex items-center px-3 py-1 text-xs font-medium"
              style={{
                borderRadius: '4px',
                backgroundColor: colors.bg,
                color: colors.text,
              }}
            >
              {tierLabels[tier]}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card style={{ borderRadius: '4px', boxShadow: 'var(--nexo-card-shadow)' }}>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 400, color: 'var(--nexo-text-primary)' }}>Profil</CardTitle>
          <CardDescription className="font-body">Aktualisieren Sie Ihren Namen</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm userId={userId} currentName={profile?.name || ''} />
        </CardContent>
      </Card>
    </div>
  );
}
