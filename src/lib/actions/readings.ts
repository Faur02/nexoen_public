'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { Reading } from '@/types/database';
import { toUserError } from '@/lib/utils/errors';

export async function getReadings(meterId: string): Promise<Reading[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Verify meter belongs to authenticated user
  const { data: meterCheck } = await supabase
    .from('meters')
    .select('id')
    .eq('id', meterId)
    .eq('user_id', user.id)
    .single();
  if (!meterCheck) return [];

  const { data, error } = await supabase
    .from('readings')
    .select('*')
    .eq('meter_id', meterId)
    .order('reading_date', { ascending: false }) as { data: Reading[] | null; error: { code?: string; message: string } | null };

  if (error) {
    throw new Error(toUserError(error));
  }

  return data || [];
}

interface CreateReadingInput {
  meterId: string;
  readingDate: string;
  value: number;
}

export async function createReading(input: CreateReadingInput): Promise<Reading> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht authentifiziert');

  // Verify meter belongs to authenticated user
  const { data: meterCheck } = await supabase
    .from('meters')
    .select('id')
    .eq('id', input.meterId)
    .eq('user_id', user.id)
    .single();
  if (!meterCheck) throw new Error('Nicht autorisiert');

  // Validate numeric value
  if (!isFinite(input.value) || isNaN(input.value)) {
    throw new Error('Ungültiger Zählerstand');
  }

  // Reject future dates
  const today = new Date().toISOString().split('T')[0];
  if (input.readingDate > today) {
    throw new Error('Das Ablesedatum darf nicht in der Zukunft liegen');
  }

  // Validate that the reading value is not less than the previous reading
  const { data: previousReadings } = await supabase
    .from('readings')
    .select('value, reading_date')
    .eq('meter_id', input.meterId)
    .lt('reading_date', input.readingDate)
    .order('reading_date', { ascending: false })
    .limit(1) as { data: { value: number; reading_date: string }[] | null };

  if (previousReadings && previousReadings.length > 0) {
    if (input.value < previousReadings[0].value) {
      throw new Error(
        `Der Zählerstand (${input.value}) kann nicht kleiner sein als der vorherige Stand (${previousReadings[0].value})`
      );
    }
  }

  const { data, error } = await supabase
    .from('readings')
    .insert({
      meter_id: input.meterId,
      reading_date: input.readingDate,
      value: input.value,
    })
    .select()
    .single() as { data: Reading | null; error: { code?: string; message: string } | null };

  if (error) {
    if (error.code === '23505') {
      throw new Error('Für dieses Datum existiert bereits ein Zählerstand');
    }
    throw new Error(toUserError(error));
  }

  if (!data) {
    throw new Error('Fehler beim Speichern des Zählerstands');
  }

  revalidatePath('/dashboard');
  revalidatePath('/meters');
  revalidatePath(`/meters/${input.meterId}`);

  return data;
}

export async function updateReading(
  id: string,
  input: { readingDate?: string; value?: number }
): Promise<Reading> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht authentifiziert');

  // Ownership check: verify the reading belongs to the authenticated user
  const { data: existing } = await supabase
    .from('readings')
    .select('meter_id, meters!inner(user_id)')
    .eq('id', id)
    .single() as { data: { meter_id: string; meters: { user_id: string } } | null };

  if (!existing || (existing.meters as unknown as { user_id: string }).user_id !== user.id) {
    throw new Error('Nicht autorisiert');
  }

  if (input.value !== undefined) {
    if (!isFinite(input.value) || isNaN(input.value)) throw new Error('Ungültiger Zählerstand');
  }
  if (input.readingDate !== undefined) {
    const today = new Date().toISOString().split('T')[0];
    if (input.readingDate > today) throw new Error('Das Ablesedatum darf nicht in der Zukunft liegen');
  }

  const { data, error } = await supabase
    .from('readings')
    .update({
      reading_date: input.readingDate,
      value: input.value,
    })
    .eq('id', id)
    .select()
    .single() as { data: Reading | null; error: { code?: string; message: string } | null };

  if (error || !data) {
    throw new Error(error ? toUserError(error) : 'Fehler beim Aktualisieren des Zählerstands');
  }

  revalidatePath('/dashboard');
  revalidatePath('/meters');
  revalidatePath(`/meters/${existing.meter_id}`);

  return data;
}

export async function deleteReading(id: string, meterId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht authentifiziert');

  // Ownership check: verify the reading belongs to the authenticated user
  const { data: existing } = await supabase
    .from('readings')
    .select('meter_id, meters!inner(user_id)')
    .eq('id', id)
    .single() as { data: { meter_id: string; meters: { user_id: string } } | null };

  if (!existing || (existing.meters as unknown as { user_id: string }).user_id !== user.id) {
    throw new Error('Nicht autorisiert');
  }

  const { error } = await supabase
    .from('readings')
    .delete()
    .eq('id', id) as { error: { code?: string; message: string } | null };

  if (error) {
    throw new Error(toUserError(error));
  }

  revalidatePath('/dashboard');
  revalidatePath('/meters');
  revalidatePath(`/meters/${existing.meter_id}`);
}
