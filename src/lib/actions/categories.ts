'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { MeterCategory } from '@/types/database';

const PREDEFINED_CATEGORIES = [
  { slug: 'heizung', name: 'Heizung', meter_type: 'heating', unit: 'units' },
  { slug: 'kaltwasser', name: 'Kaltwasser', meter_type: 'cold_water', unit: 'm3' },
  { slug: 'warmwasser', name: 'Warmwasser', meter_type: 'warm_water', unit: 'm3' },
] as const;

/**
 * Ensure the 3 predefined categories exist for the current user.
 * Called as a fallback for users who signed up before the trigger was added.
 */
export async function ensurePredefinedCategories(): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  for (const cat of PREDEFINED_CATEGORIES) {
    await supabase
      .from('meter_categories')
      .upsert(
        {
          user_id: user.id,
          slug: cat.slug,
          name: cat.name,
          is_predefined: true,
          meter_type: cat.meter_type,
          unit: cat.unit,
        },
        { onConflict: 'user_id,slug' }
      );
  }
}

/**
 * Get all meter categories for the current user.
 * Predefined categories are returned first, then custom ones sorted by creation date.
 */
export async function getUserCategories(): Promise<MeterCategory[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Nicht authentifiziert');
  }

  const { data, error } = await supabase
    .from('meter_categories')
    .select('*')
    .eq('user_id', user.id)
    .order('is_predefined', { ascending: false })
    .order('created_at', { ascending: true }) as { data: MeterCategory[] | null; error: Error | null };

  if (error) throw new Error(error.message);
  const categories = data || [];

  // If no predefined categories exist, create them (fallback for existing users)
  if (!categories.some(c => c.is_predefined)) {
    await ensurePredefinedCategories();
    const { data: refetched } = await supabase
      .from('meter_categories')
      .select('*')
      .eq('user_id', user.id)
      .order('is_predefined', { ascending: false })
      .order('created_at', { ascending: true }) as { data: MeterCategory[] | null };
    return refetched || [];
  }

  return categories;
}

/**
 * Get a single category by ID.
 */
export async function getCategory(id: string): Promise<MeterCategory | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('meter_categories')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single() as { data: MeterCategory | null; error: Error | null };

  if (error) return null;
  return data;
}

/**
 * Get a category by its slug for the current user.
 */
export async function getCategoryBySlug(slug: string): Promise<MeterCategory | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('meter_categories')
    .select('*')
    .eq('user_id', user.id)
    .eq('slug', slug)
    .single() as { data: MeterCategory | null; error: Error | null };

  if (error) return null;
  return data;
}

interface CreateCategoryInput {
  name: string;
  meterType: string;
  unit: string;
}

/**
 * Create a custom (non-predefined) category.
 */
export async function createCategory(input: CreateCategoryInput): Promise<MeterCategory> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Nicht authentifiziert');
  }

  // Name validation
  const trimmedName = input.name.trim();
  if (!trimmedName) throw new Error('Name darf nicht leer sein');
  if (trimmedName.length > 100) throw new Error('Name darf maximal 100 Zeichen lang sein');

  // Generate slug from name (lowercase, replace spaces with hyphens)
  const slug = trimmedName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const { data, error } = await supabase
    .from('meter_categories')
    .insert({
      user_id: user.id,
      slug,
      name: trimmedName,
      is_predefined: false,
      meter_type: input.meterType,
      unit: input.unit,
    })
    .select()
    .single() as { data: MeterCategory | null; error: Error | null };

  if (error || !data) {
    throw new Error(error?.message || 'Fehler beim Erstellen der Kategorie');
  }

  revalidatePath('/meters');
  return data;
}

/**
 * Delete a custom category. Predefined categories cannot be deleted.
 */
export async function deleteCategory(id: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Nicht authentifiziert');
  }

  // Check that the category is not predefined
  const { data: category } = await supabase
    .from('meter_categories')
    .select('is_predefined')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!category) {
    throw new Error('Kategorie nicht gefunden');
  }

  if (category.is_predefined) {
    throw new Error('Vordefinierte Kategorien können nicht gelöscht werden');
  }

  const { error } = await supabase
    .from('meter_categories')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/meters');
}
