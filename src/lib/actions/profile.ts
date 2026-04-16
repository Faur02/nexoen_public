'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
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

    if (error && process.env.NODE_ENV !== 'production') {
      console.error('Theme update error:', error.message);
      // Don't throw — theme still works client-side via next-themes
    }
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Failed to persist theme preference:', err instanceof Error ? err.message : err);
    }
    // Theme still works client-side, so don't block the user
  }

  revalidatePath('/settings');
}

export async function deleteAccount(): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht angemeldet');

  const uid = user.id;

  // Delete the auth user using service role.
  // Supabase cascades automatically: auth.users → profiles → meters, categories,
  // billing setups, ista_consumption, abrechnung_setup, notification_preferences,
  // and all their children (readings, tariffs, rooms, radiators, radiator_readings).
  const { error } = await getAdminClient().auth.admin.deleteUser(uid);
  if (error) throw new Error('Fehler beim Löschen des Kontos: ' + error.message);

  // Sign out after successful deletion to clear the session cookie
  await supabase.auth.signOut();
}
