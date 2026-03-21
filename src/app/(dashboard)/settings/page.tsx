import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Profile } from '@/types/database';
import { getNotificationPreferences } from '@/lib/actions/notifications';
import { SettingsClient } from './settings-client';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const [profileResult, notificationPreferences] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single() as unknown as Promise<{ data: Profile | null }>,
    getNotificationPreferences(user.id),
  ]);
  const profile = profileResult.data;

  return (
    <Suspense>
      <SettingsClient
        userId={user.id}
        email={user.email || ''}
        createdAt={user.created_at}
        profile={profile}
        notificationPreferences={notificationPreferences}
      />
    </Suspense>
  );
}
