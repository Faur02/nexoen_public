'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { AbrechnungSetup } from '@/types/database';
import { toUserError } from '@/lib/utils/errors';

export async function getAbrechnungSetup(): Promise<AbrechnungSetup | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('abrechnung_setup')
    .select('*')
    .eq('user_id', user.id)
    .single() as { data: AbrechnungSetup | null; error: Error | null };

  return data;
}

interface UpsertAbrechnungSetupInput {
  abrechnungszeitraumStart: string | null;
  abrechnungszeitraumEnd: string | null;
  kalteBetriebskostenYear: number;
  istaNebenkostenYear: number;
  vorauszahlungMonthly: number;
}

export async function upsertAbrechnungSetup(input: UpsertAbrechnungSetupInput): Promise<AbrechnungSetup> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht authentifiziert');

  if (input.kalteBetriebskostenYear < 0) throw new Error('Kalte Betriebskosten können nicht negativ sein');
  if (input.kalteBetriebskostenYear > 100000) throw new Error('Kalte Betriebskosten sind unrealistisch hoch');
  if (input.istaNebenkostenYear < 0) throw new Error('ista Nebenkosten können nicht negativ sein');
  if (input.istaNebenkostenYear > 100000) throw new Error('ista Nebenkosten sind unrealistisch hoch');
  if (input.vorauszahlungMonthly < 0) throw new Error('Vorauszahlung kann nicht negativ sein');
  if (input.vorauszahlungMonthly > 10000) throw new Error('Vorauszahlung ist unrealistisch hoch');

  const { data: existing } = await supabase
    .from('abrechnung_setup')
    .select('id')
    .eq('user_id', user.id)
    .single();

  let result;

  if (existing) {
    const { data, error } = await supabase
      .from('abrechnung_setup')
      .update({
        abrechnungszeitraum_start: input.abrechnungszeitraumStart,
        abrechnungszeitraum_end: input.abrechnungszeitraumEnd,
        kalte_betriebskosten_year: input.kalteBetriebskostenYear,
        ista_nebenkosten_year: input.istaNebenkostenYear,
        vorauszahlung_monthly: input.vorauszahlungMonthly,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .single() as { data: AbrechnungSetup | null; error: { code?: string; message: string } | null };

    if (error || !data) throw new Error(error ? toUserError(error) : 'Fehler beim Aktualisieren');
    result = data;
  } else {
    const { data, error } = await supabase
      .from('abrechnung_setup')
      .insert({
        user_id: user.id,
        abrechnungszeitraum_start: input.abrechnungszeitraumStart,
        abrechnungszeitraum_end: input.abrechnungszeitraumEnd,
        kalte_betriebskosten_year: input.kalteBetriebskostenYear,
        ista_nebenkosten_year: input.istaNebenkostenYear,
        vorauszahlung_monthly: input.vorauszahlungMonthly,
      })
      .select()
      .single() as { data: AbrechnungSetup | null; error: { code?: string; message: string } | null };

    if (error || !data) throw new Error(error ? toUserError(error) : 'Fehler beim Erstellen');
    result = data;
  }

  revalidatePath('/abrechnung');
  revalidatePath('/dashboard');
  return result;
}

export async function updateForecastSnapshot(amount: number): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from('abrechnung_setup')
    .update({
      forecast_snapshot_amount: amount,
      forecast_snapshot_updated_at: new Date().toISOString(),
    })
    .eq('user_id', user.id);

  if (error && process.env.NODE_ENV !== 'production') {
    console.error('updateForecastSnapshot failed:', error.message);
  }
}
