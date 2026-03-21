'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { HeatingBillingSetup } from '@/types/database';

export async function getHeatingBillingSetup(categoryId: string): Promise<HeatingBillingSetup | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('heating_billing_setups')
    .select('*')
    .eq('category_id', categoryId)
    .eq('user_id', user.id)
    .single() as { data: HeatingBillingSetup | null; error: Error | null };

  return data;
}

interface UpsertHeatingBillingInput {
  categoryId: string;
  totalBuildingCost: number;
  grundkostenPercent: number;
  verbrauchskostenPercent: number;
  totalBuildingArea: number;
  yourArea: number;
  totalBuildingUnits: number;
  yourUnits: number | null;
  abschlagMonthly: number;
}

export async function upsertHeatingBillingSetup(input: UpsertHeatingBillingInput): Promise<HeatingBillingSetup> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Nicht authentifiziert');
  }

  // Server-side validation
  if (input.totalBuildingCost <= 0) throw new Error('Gesamtkosten müssen positiv sein');
  if (input.totalBuildingArea <= 0) throw new Error('Gesamtfläche muss positiv sein');
  if (input.yourArea <= 0) throw new Error('Wohnfläche muss positiv sein');
  if (input.yourArea > input.totalBuildingArea) throw new Error('Wohnfläche kann nicht größer als Gesamtfläche sein');
  if (input.totalBuildingUnits <= 0) throw new Error('Gesamt-Einheiten müssen positiv sein');
  if (input.abschlagMonthly < 0) throw new Error('Abschlag kann nicht negativ sein');
  if (Math.abs(input.grundkostenPercent + input.verbrauchskostenPercent - 100) > 0.01) {
    throw new Error('Grundkosten + Verbrauchskosten müssen zusammen 100% ergeben');
  }

  // Check if setup already exists
  const { data: existing } = await supabase
    .from('heating_billing_setups')
    .select('id')
    .eq('category_id', input.categoryId)
    .single();

  let result;

  if (existing) {
    // Update
    const { data, error } = await supabase
      .from('heating_billing_setups')
      .update({
        total_building_cost: input.totalBuildingCost,
        grundkosten_percent: input.grundkostenPercent,
        verbrauchskosten_percent: input.verbrauchskostenPercent,
        total_building_area: input.totalBuildingArea,
        your_area: input.yourArea,
        total_building_units: input.totalBuildingUnits,
        your_units: input.yourUnits,
        abschlag_monthly: input.abschlagMonthly,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .single() as { data: HeatingBillingSetup | null; error: Error | null };

    if (error || !data) {
      throw new Error(error?.message || 'Fehler beim Aktualisieren der Abrechnungsdaten');
    }
    result = data;
  } else {
    // Insert
    const { data, error } = await supabase
      .from('heating_billing_setups')
      .insert({
        user_id: user.id,
        category_id: input.categoryId,
        total_building_cost: input.totalBuildingCost,
        grundkosten_percent: input.grundkostenPercent,
        verbrauchskosten_percent: input.verbrauchskostenPercent,
        total_building_area: input.totalBuildingArea,
        your_area: input.yourArea,
        total_building_units: input.totalBuildingUnits,
        your_units: input.yourUnits,
        abschlag_monthly: input.abschlagMonthly,
      })
      .select()
      .single() as { data: HeatingBillingSetup | null; error: Error | null };

    if (error || !data) {
      throw new Error(error?.message || 'Fehler beim Erstellen der Abrechnungsdaten');
    }
    result = data;
  }

  revalidatePath('/dashboard');
  revalidatePath('/meters');
  revalidatePath('/abrechnung');

  return result;
}

export async function deleteHeatingBillingSetup(categoryId: string): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Nicht authentifiziert');
  }

  const { error } = await supabase
    .from('heating_billing_setups')
    .delete()
    .eq('category_id', categoryId)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/dashboard');
  revalidatePath('/meters');
  revalidatePath('/abrechnung');
}
