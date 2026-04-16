'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { Tariff } from '@/types/database';

export async function getTariffs(meterId: string): Promise<Tariff[]> {
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
    .from('tariffs')
    .select('*')
    .eq('meter_id', meterId)
    .order('valid_from', { ascending: false }) as { data: Tariff[] | null; error: Error | null };

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getActiveTariff(meterId: string): Promise<Tariff | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Verify meter belongs to authenticated user
  const { data: meterCheck } = await supabase
    .from('meters')
    .select('id')
    .eq('id', meterId)
    .eq('user_id', user.id)
    .single();
  if (!meterCheck) return null;

  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('tariffs')
    .select('*')
    .eq('meter_id', meterId)
    .lte('valid_from', today)
    .or(`valid_until.is.null,valid_until.gte.${today}`)
    .order('valid_from', { ascending: false })
    .limit(1)
    .single() as { data: Tariff | null; error: Error | null };

  if (error) {
    return null;
  }

  return data;
}

interface CreateTariffInput {
  meterId: string;
  name?: string;
  arbeitspreis: number;
  grundpreis: number;
  abschlag?: number;
  abwasserPreis?: number;
  includesVat?: boolean;
  validFrom: string;
  validUntil?: string;
}

export async function createTariff(input: CreateTariffInput): Promise<Tariff> {
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

  // Numeric range validation
  if (!isFinite(input.arbeitspreis) || !isFinite(input.grundpreis)) throw new Error('Ungültige Preisangaben');
  if (input.arbeitspreis < 0 || input.arbeitspreis > 10) throw new Error('Arbeitspreis muss zwischen 0 und 10 €/kWh liegen');
  if (input.grundpreis < 0 || input.grundpreis > 500) throw new Error('Grundpreis muss zwischen 0 und 500 €/Monat liegen');
  if (input.abschlag !== undefined && input.abschlag !== null && (input.abschlag < 0 || input.abschlag > 10000)) throw new Error('Abschlag muss zwischen 0 und 10.000 € liegen');
  if (input.abwasserPreis !== undefined && (input.abwasserPreis < 0 || input.abwasserPreis > 50)) throw new Error('Abwasserpreis muss zwischen 0 und 50 €/m³ liegen');

  // If there's an existing active tariff, end it the day before the new one starts
  const { data: existingTariff } = await supabase
    .from('tariffs')
    .select('*')
    .eq('meter_id', input.meterId)
    .is('valid_until', null)
    .single() as { data: Tariff | null };

  if (existingTariff) {
    const newValidFrom = new Date(input.validFrom);
    const endDate = new Date(newValidFrom);
    endDate.setDate(endDate.getDate() - 1);

    const { error: updateError } = await supabase
      .from('tariffs')
      .update({ valid_until: endDate.toISOString().split('T')[0] })
      .eq('id', existingTariff.id);

    if (updateError) {
      throw new Error('Bestehender Tarif konnte nicht aktualisiert werden: ' + updateError.message);
    }
  }

  const { data, error } = await supabase
    .from('tariffs')
    .insert({
      meter_id: input.meterId,
      name: input.name || null,
      arbeitspreis: input.arbeitspreis,
      grundpreis: input.grundpreis,
      abschlag: input.abschlag || null,
      abwasser_preis: input.abwasserPreis || 0,
      includes_vat: input.includesVat ?? true,
      valid_from: input.validFrom,
      valid_until: input.validUntil || null,
    })
    .select()
    .single() as { data: Tariff | null; error: Error | null };

  if (error || !data) {
    throw new Error(error?.message || 'Fehler beim Erstellen des Tarifs');
  }

  revalidatePath('/dashboard');
  revalidatePath('/meters');
  revalidatePath(`/meters/${input.meterId}`);

  return data;
}

export async function updateTariff(
  id: string,
  input: Partial<Omit<CreateTariffInput, 'meterId'>>
): Promise<Tariff> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht authentifiziert');

  // Numeric range validation (only for provided values)
  if (input.arbeitspreis !== undefined && (input.arbeitspreis < 0 || input.arbeitspreis > 10)) throw new Error('Arbeitspreis muss zwischen 0 und 10 €/kWh liegen');
  if (input.grundpreis !== undefined && (input.grundpreis < 0 || input.grundpreis > 500)) throw new Error('Grundpreis muss zwischen 0 und 500 €/Monat liegen');
  if (input.abschlag !== undefined && input.abschlag !== null && (input.abschlag < 0 || input.abschlag > 10000)) throw new Error('Abschlag muss zwischen 0 und 10.000 € liegen');

  // Verify ownership: tariff must belong to a meter owned by this user
  const { data: tariff } = await supabase
    .from('tariffs')
    .select('meter_id, meters!inner(user_id)')
    .eq('id', id)
    .single() as { data: { meter_id: string; meters: { user_id: string } } | null };
  if (!tariff) throw new Error('Tarif nicht gefunden');
  if ((tariff.meters as unknown as { user_id: string }).user_id !== user.id) throw new Error('Nicht autorisiert');

  const { data, error } = await supabase
    .from('tariffs')
    .update({
      name: input.name,
      arbeitspreis: input.arbeitspreis,
      grundpreis: input.grundpreis,
      abschlag: input.abschlag,
      includes_vat: input.includesVat,
      valid_from: input.validFrom,
      valid_until: input.validUntil,
    })
    .eq('id', id)
    .select()
    .single() as { data: Tariff | null; error: Error | null };

  if (error || !data) {
    throw new Error(error?.message || 'Fehler beim Aktualisieren des Tarifs');
  }

  revalidatePath('/dashboard');
  revalidatePath('/meters');
  revalidatePath(`/meters/${tariff.meter_id}`);

  return data;
}

export async function deleteTariff(id: string, _meterId?: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht authentifiziert');

  // Verify ownership: tariff must belong to a meter owned by this user
  const { data: tariff } = await supabase
    .from('tariffs')
    .select('meter_id, meters!inner(user_id)')
    .eq('id', id)
    .single() as { data: { meter_id: string; meters: { user_id: string } } | null };

  if (!tariff) throw new Error('Tarif nicht gefunden');
  if ((tariff.meters as unknown as { user_id: string }).user_id !== user.id) throw new Error('Nicht autorisiert');

  const { error } = await supabase
    .from('tariffs')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/dashboard');
  revalidatePath('/meters');
  revalidatePath(`/meters/${tariff.meter_id}`);
}
