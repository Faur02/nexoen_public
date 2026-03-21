'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { adminClient } from '@/lib/supabase/admin';
import { Profile, ThemePreference } from '@/types/database';

interface UpdateProfileInput {
  name: string | null;
}

export async function updateProfile(userId: string, input: UpdateProfileInput): Promise<Profile> {
  const supabase = await createClient();

  // Verify the user is updating their own profile
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id !== userId) {
    throw new Error('Nicht autorisiert');
  }

  // Validate name
  if (input.name !== null) {
    const trimmed = input.name.trim();
    if (trimmed.length === 0) {
      input = { name: null };
    } else if (trimmed.length > 100) {
      throw new Error('Name darf maximal 100 Zeichen lang sein');
    } else {
      input = { name: trimmed };
    }
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      name: input.name,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single() as { data: Profile | null; error: Error | null };

  if (error || !data) {
    throw new Error(error?.message || 'Fehler beim Aktualisieren des Profils');
  }

  revalidatePath('/settings');
  revalidatePath('/dashboard');

  return data;
}

export async function updatePassword(newPassword: string): Promise<{ error: string } | null> {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes('password') && (msg.includes('character') || msg.includes('contain'))) {
      return { error: 'Das Passwort muss Groß- und Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten.' };
    }
    if (msg.includes('same password') || msg.includes('different')) {
      return { error: 'Das neue Passwort muss sich vom bisherigen unterscheiden.' };
    }
    return { error: 'Fehler beim Ändern des Passworts. Bitte versuchen Sie es erneut.' };
  }

  return null;
}


export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id !== userId) {
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single() as { data: Profile | null; error: Error | null };

  if (error) {
    return null;
  }

  return data;
}

export async function updateEmailReminderSettings(enabled: boolean): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht angemeldet');

  const { error } = await supabase
    .from('profiles')
    .update({
      email_reminders_enabled: enabled,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    throw new Error('Fehler beim Speichern der Erinnerungseinstellung');
  }

  revalidatePath('/settings');
}

export async function updateThemePreference(theme: ThemePreference): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Nicht angemeldet');
  }

  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        theme,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      console.error('Theme update error:', error);
      // Don't throw for missing column — theme still works client-side via next-themes
    }
  } catch (err) {
    console.error('Failed to persist theme preference:', err);
    // Theme still works client-side, so don't block the user
  }

  revalidatePath('/settings');
}

export async function deleteAccount(): Promise<void> {
  const supabase = await createClient();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Nicht angemeldet');
  }

  const uid = user.id;

  // Delete all user data in correct order (children before parents)
  // 1. Delete meters — cascades to readings, tariffs, rooms, radiators, radiator_readings
  const { error: metersError } = await supabase.from('meters').delete().eq('user_id', uid);
  if (metersError) throw new Error('Fehler beim Löschen der Zähler');

  // 2. Delete orphaned tables not linked to meters (parallel, order doesn't matter)
  const parallelDeletes = await Promise.all([
    supabase.from('ista_consumption').delete().eq('user_id', uid),
    supabase.from('heating_billing_setups').delete().eq('user_id', uid),
    supabase.from('abrechnung_setup').delete().eq('user_id', uid),
    supabase.from('meter_categories').delete().eq('user_id', uid),
    supabase.from('notification_preferences').delete().eq('user_id', uid),
  ]);
  const failedDelete = parallelDeletes.find(r => r.error);
  if (failedDelete) throw new Error('Fehler beim Löschen der Benutzerdaten');

  // 3. Delete profile row
  const { error: profileError } = await supabase.from('profiles').delete().eq('id', uid);
  if (profileError) throw new Error('Fehler beim Löschen des Profils');

  // 4. Sign out current session
  await supabase.auth.signOut();

  // 5. Delete the auth user (requires service role)
  await adminClient.auth.admin.deleteUser(uid);
}
