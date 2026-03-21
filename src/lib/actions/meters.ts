'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { Meter, MeterType, MeterUnit, MeterFull, Reading, Tariff, SubscriptionTier } from '@/types/database';
import { hasAccess, getEffectiveTier } from '@/lib/config/tiers';

export async function getMeters(): Promise<Meter[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Nicht authentifiziert');
  }

  const { data, error } = await supabase
    .from('meters')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false }) as { data: Meter[] | null; error: Error | null };

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getMetersByCategory(categoryId: string): Promise<Meter[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('meters')
    .select('*')
    .eq('user_id', user.id)
    .eq('category_id', categoryId)
    .order('created_at', { ascending: false }) as { data: Meter[] | null; error: Error | null };

  if (error) {
    return [];
  }

  return data || [];
}

/**
 * Ensure each predefined category has exactly one meter.
 * Auto-creates meters for categories that don't have one yet.
 * Returns a map of category_id → meter.
 */
export async function ensurePredefinedMeters(
  predefinedCategories: { id: string; slug: string; name: string; meter_type: string; unit: string }[]
): Promise<Map<string, Meter>> {
  const result = new Map<string, Meter>();

  for (const cat of predefinedCategories) {
    const meters = await getMetersByCategory(cat.id);
    if (meters.length > 0) {
      result.set(cat.id, meters[0]);
    } else {
      // Auto-create meter for this predefined category
      const meterType: MeterType = cat.slug === 'heizung' ? 'heating' : 'water';
      const meterUnit: MeterUnit = cat.slug === 'heizung' ? 'units' : 'm3';
      const meter = await createMeterInternal({
        name: cat.name,
        type: meterType,
        unit: meterUnit,
        categoryId: cat.id,
      });
      result.set(cat.id, meter);
    }
  }

  return result;
}

/**
 * Internal meter creation that bypasses subscription limits.
 * Used for auto-creating predefined category meters.
 */
async function createMeterInternal(input: CreateMeterInput): Promise<Meter> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht authentifiziert');

  const { data, error } = await supabase
    .from('meters')
    .insert({
      user_id: user.id,
      name: input.name,
      type: input.type,
      unit: input.unit,
      conversion_factor: input.conversionFactor || 1.0,
      category_id: input.categoryId || null,
    })
    .select()
    .single() as { data: Meter | null; error: Error | null };

  if (error || !data) throw new Error(error?.message || 'Fehler beim Erstellen des Zählers');
  return data;
}

export async function getMeter(id: string): Promise<Meter | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('meters')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single() as { data: Meter | null; error: Error | null };

  if (error) {
    return null;
  }

  return data;
}

export async function getMeterWithDetails(id: string): Promise<MeterFull | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: meter, error: meterError } = await supabase
    .from('meters')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single() as { data: Meter | null; error: Error | null };

  if (meterError || !meter) {
    return null;
  }

  const { data: readings } = await supabase
    .from('readings')
    .select('*')
    .eq('meter_id', id)
    .order('reading_date', { ascending: false }) as { data: Reading[] | null };

  const { data: tariffs } = await supabase
    .from('tariffs')
    .select('*')
    .eq('meter_id', id)
    .order('valid_from', { ascending: false }) as { data: Tariff[] | null };

  return {
    ...meter,
    readings: readings || [],
    tariffs: tariffs || [],
  };
}

interface CreateMeterInput {
  name: string;
  type: MeterType;
  unit: MeterUnit;
  conversionFactor?: number;
  categoryId?: string;
}

export async function createMeter(input: CreateMeterInput): Promise<Meter> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Nicht authentifiziert');
  }

  // Check subscription access
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier, trial_ends_at')
    .eq('id', user.id)
    .single() as { data: { subscription_tier: SubscriptionTier; trial_ends_at: string | null } | null };

  const rawTier: SubscriptionTier = profile?.subscription_tier ?? 'expired';
  const tier = getEffectiveTier(rawTier, profile?.trial_ends_at ?? null);

  if (!hasAccess(tier)) {
    throw new Error('Bitte aktiviere dein Abonnement, um Zähler hinzuzufügen.');
  }

  // Name validation
  const trimmedName = input.name?.trim() ?? '';
  if (!trimmedName) throw new Error('Name darf nicht leer sein');
  if (trimmedName.length > 100) throw new Error('Name darf maximal 100 Zeichen lang sein');

  const insertData: Record<string, unknown> = {
    user_id: user.id,
    name: trimmedName,
    type: input.type,
    unit: input.unit,
    conversion_factor: input.conversionFactor || 1.0,
  };
  if (input.categoryId) {
    insertData.category_id = input.categoryId;
  }

  const { data, error } = await supabase
    .from('meters')
    .insert(insertData)
    .select()
    .single() as { data: Meter | null; error: Error | null };

  if (error || !data) {
    throw new Error(error?.message || 'Fehler beim Erstellen des Zählers');
  }

  revalidatePath('/dashboard');
  revalidatePath('/meters');

  return data;
}

export async function updateMeter(
  id: string,
  input: Partial<CreateMeterInput>
): Promise<Meter> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht authentifiziert');

  // Name validation (only if being updated)
  let updatedName = input.name;
  if (updatedName !== undefined) {
    const trimmed = updatedName.trim();
    if (!trimmed) throw new Error('Name darf nicht leer sein');
    if (trimmed.length > 100) throw new Error('Name darf maximal 100 Zeichen lang sein');
    updatedName = trimmed;
  }

  const { data, error } = await supabase
    .from('meters')
    .update({
      name: updatedName,
      type: input.type,
      unit: input.unit,
      conversion_factor: input.conversionFactor,
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single() as { data: Meter | null; error: Error | null };

  if (error || !data) {
    throw new Error(error?.message || 'Fehler beim Aktualisieren des Zählers');
  }

  revalidatePath('/dashboard');
  revalidatePath('/meters');
  revalidatePath(`/meters/${id}`);

  return data;
}

export async function deleteMeter(id: string): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht authentifiziert');

  const { error } = await supabase
    .from('meters')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/dashboard');
  revalidatePath('/meters');
}

export interface MeterReportData {
  id: string;
  name: string;
  type: MeterType;
  unit: MeterUnit;
  readings: { reading_date: string; value: number }[];
  tariff: {
    arbeitspreis: number;
    grundpreis: number;
    abschlag: number | null;
  } | null;
  totalConsumption: number;
  dailyAverage: number;
  monthlyEstimate: number;
  yearlyEstimate: number;
}

/**
 * Get meters with report data for the reports page
 */
export async function getMetersForReports(): Promise<MeterReportData[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Nicht authentifiziert');
  }

  const { data: meters } = await supabase
    .from('meters')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false }) as { data: Meter[] | null };

  if (!meters || meters.length === 0) {
    return [];
  }

  const meterIds = meters.map(m => m.id);

  // Batch fetch all readings and tariffs
  const [readingsResult, tariffsResult] = await Promise.all([
    supabase
      .from('readings')
      .select('id, meter_id, reading_date, value')
      .in('meter_id', meterIds)
      .order('reading_date', { ascending: true }) as unknown as Promise<{ data: Reading[] | null }>,
    supabase
      .from('tariffs')
      .select('*')
      .in('meter_id', meterIds)
      .order('valid_from', { ascending: false }) as unknown as Promise<{ data: Tariff[] | null }>
  ]);

  const allReadings = readingsResult.data || [];
  const allTariffs = tariffsResult.data || [];

  // Group by meter
  const readingsByMeter = new Map<string, Reading[]>();
  for (const reading of allReadings) {
    const existing = readingsByMeter.get(reading.meter_id) || [];
    existing.push(reading);
    readingsByMeter.set(reading.meter_id, existing);
  }

  const tariffByMeter = new Map<string, Tariff>();
  for (const tariff of allTariffs) {
    if (!tariffByMeter.has(tariff.meter_id)) {
      tariffByMeter.set(tariff.meter_id, tariff);
    }
  }

  return meters.map(meter => {
    const readings = readingsByMeter.get(meter.id) || [];
    const tariff = tariffByMeter.get(meter.id) || null;

    let totalConsumption = 0;
    let dailyAverage = 0;

    if (readings.length >= 2) {
      const first = readings[0];
      const last = readings[readings.length - 1];
      totalConsumption = last.value - first.value;
      const days = Math.round(
        (new Date(last.reading_date).getTime() - new Date(first.reading_date).getTime()) /
        (1000 * 60 * 60 * 24)
      );
      dailyAverage = days > 0 ? totalConsumption / days : 0;
    }

    const monthlyConsumption = dailyAverage * 30;
    const monthlyEstimate = tariff
      ? monthlyConsumption * tariff.arbeitspreis + tariff.grundpreis
      : 0;
    const yearlyEstimate = monthlyEstimate * 12;

    return {
      id: meter.id,
      name: meter.name,
      type: meter.type,
      unit: meter.unit,
      readings: readings.map(r => ({ reading_date: r.reading_date, value: r.value })),
      tariff: tariff ? {
        arbeitspreis: tariff.arbeitspreis,
        grundpreis: tariff.grundpreis,
        abschlag: tariff.abschlag,
      } : null,
      totalConsumption,
      dailyAverage,
      monthlyEstimate,
      yearlyEstimate,
    };
  });
}

/**
 * Get all meters with their readings and active tariffs in a single batch query
 * This avoids the N+1 query problem by fetching all data at once
 */
export async function getMetersWithDetailsAndTariffs(): Promise<{
  meter: Meter;
  readings: Reading[];
  tariff: Tariff | null;
}[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Nicht authentifiziert');
  }

  const today = new Date().toISOString().split('T')[0];

  // Fetch all meters with their readings and tariffs in parallel
  const { data: meters, error: metersError } = await supabase
    .from('meters')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false }) as { data: Meter[] | null; error: Error | null };

  if (metersError || !meters) {
    return [];
  }

  if (meters.length === 0) {
    return [];
  }

  const meterIds = meters.map(m => m.id);

  // Batch fetch all readings and tariffs for all meters
  const [readingsResult, tariffsResult] = await Promise.all([
    supabase
      .from('readings')
      .select('*')
      .in('meter_id', meterIds)
      .order('reading_date', { ascending: false }) as unknown as Promise<{ data: Reading[] | null }>,
    supabase
      .from('tariffs')
      .select('*')
      .in('meter_id', meterIds)
      .lte('valid_from', today)
      .or(`valid_until.is.null,valid_until.gte.${today}`)
      .order('valid_from', { ascending: false }) as unknown as Promise<{ data: Tariff[] | null }>
  ]);

  const allReadings = readingsResult.data || [];
  const allTariffs = tariffsResult.data || [];

  // Group readings and tariffs by meter_id
  const readingsByMeter = new Map<string, Reading[]>();
  for (const reading of allReadings) {
    const existing = readingsByMeter.get(reading.meter_id) || [];
    existing.push(reading);
    readingsByMeter.set(reading.meter_id, existing);
  }

  const tariffByMeter = new Map<string, Tariff>();
  for (const tariff of allTariffs) {
    // Only keep the first (most recent) tariff for each meter
    if (!tariffByMeter.has(tariff.meter_id)) {
      tariffByMeter.set(tariff.meter_id, tariff);
    }
  }

  return meters.map(meter => ({
    meter,
    readings: readingsByMeter.get(meter.id) || [],
    tariff: tariffByMeter.get(meter.id) || null,
  }));
}
