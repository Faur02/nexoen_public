'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { NotificationPreferences } from '@/types/database';

const defaultPreferences: Omit<NotificationPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
  consumption_alerts: false,
  monthly_summary: false,
  nachzahlung_warning: true,
  product_updates: false,
};

function makeDefaults(userId: string): NotificationPreferences {
  return {
    id: '',
    user_id: userId,
    ...defaultPreferences,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function getNotificationPreferences(userId: string): Promise<NotificationPreferences> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id !== userId) {
    return makeDefaults(userId);
  }

  try {
    // Try to fetch existing preferences
    const { data: existing, error: fetchError } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single() as { data: NotificationPreferences | null; error: any };

    if (existing) {
      return existing;
    }

    // If table exists but no row, try to create defaults
    if (fetchError && fetchError.code === 'PGRST116') {
      // No rows found - try inserting
      const { data: created } = await supabase
        .from('notification_preferences')
        .insert({
          user_id: userId,
          ...defaultPreferences,
        })
        .select()
        .single() as { data: NotificationPreferences | null };

      if (created) {
        return created;
      }
    }

    // Fallback to defaults if anything fails
    return makeDefaults(userId);
  } catch {
    // Table might not exist yet - return defaults gracefully
    return makeDefaults(userId);
  }
}

export async function updateNotificationPreferences(
  prefs: Partial<Pick<NotificationPreferences, 'consumption_alerts' | 'monthly_summary' | 'nachzahlung_warning' | 'product_updates'>>
): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Nicht angemeldet');
  }

  try {
    // Upsert to handle case where preferences don't exist yet
    const { error } = await supabase
      .from('notification_preferences')
      .upsert({
        user_id: user.id,
        ...prefs,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (error) {
      console.error('Notification preferences update error:', error);
      throw new Error('Benachrichtigungseinstellungen konnten nicht gespeichert werden.');
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes('konnten nicht')) {
      throw err;
    }
    // Table might not exist yet — not a user error
    console.error('notification_preferences table may not exist yet');
    throw new Error('Benachrichtigungstabelle ist noch nicht eingerichtet. Bitte führen Sie die Datenbank-Migration aus.');
  }

  revalidatePath('/settings');
}
