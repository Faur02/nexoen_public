'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { IstaConsumption } from '@/types/database';

export async function getIstaConsumptionByCategory(categoryId: string): Promise<IstaConsumption[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('ista_consumption')
    .select('*')
    .eq('user_id', user.id)
    .eq('category_id', categoryId)
    .order('month', { ascending: false }) as { data: IstaConsumption[] | null; error: Error | null };

  if (error || !data) return [];
  return data;
}

interface CreateIstaConsumptionInput {
  categoryId: string;
  month: string;
  units: number;
  kwh: number | null;
}

export async function createIstaConsumption(input: CreateIstaConsumptionInput): Promise<IstaConsumption> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht authentifiziert');

  // Validate YYYY-MM format
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(input.month)) {
    throw new Error('Ungültiges Monatsformat (YYYY-MM erwartet)');
  }
  if (!isFinite(input.units) || isNaN(input.units)) throw new Error('Ungültige Einheitenangabe');
  if (input.units < 0) throw new Error('Einheiten können nicht negativ sein');

  const { data, error } = await supabase
    .from('ista_consumption')
    .insert({
      user_id: user.id,
      category_id: input.categoryId,
      month: input.month,
      units: input.units,
      kwh: input.kwh,
    })
    .select()
    .single() as { data: IstaConsumption | null; error: { message: string; code?: string } | null };

  if (error) {
    if (error.code === '23505') {
      throw new Error('Für diesen Monat existiert bereits ein Eintrag');
    }
    throw new Error(error.message || 'Fehler beim Erstellen');
  }
  if (!data) throw new Error('Fehler beim Erstellen');

  revalidatePath('/dashboard');
  revalidatePath('/meters');
  revalidatePath('/abrechnung');
  return data;
}

interface UpdateIstaConsumptionInput {
  units: number;
  kwh: number | null;
}

export async function updateIstaConsumption(id: string, input: UpdateIstaConsumptionInput): Promise<IstaConsumption> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht authentifiziert');

  if (input.units < 0) throw new Error('Einheiten können nicht negativ sein');

  const { data, error } = await supabase
    .from('ista_consumption')
    .update({
      units: input.units,
      kwh: input.kwh,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single() as { data: IstaConsumption | null; error: Error | null };

  if (error || !data) throw new Error(error?.message || 'Fehler beim Aktualisieren');

  revalidatePath('/dashboard');
  revalidatePath('/meters');
  revalidatePath('/abrechnung');
  return data;
}

export async function deleteIstaConsumption(id: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht authentifiziert');

  const { error } = await supabase
    .from('ista_consumption')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw new Error(error.message || 'Fehler beim Löschen');

  revalidatePath('/dashboard');
  revalidatePath('/meters');
  revalidatePath('/abrechnung');
}
