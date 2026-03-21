'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { Room, Radiator, RadiatorReading, RoomWithRadiators } from '@/types/database';

// =====================================================
// ROOMS
// =====================================================

export async function getRooms(meterId: string): Promise<Room[]> {
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
    .from('rooms')
    .select('*')
    .eq('meter_id', meterId)
    .order('created_at', { ascending: true }) as { data: Room[] | null; error: Error | null };

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getRoomsWithRadiators(meterId: string): Promise<RoomWithRadiators[]> {
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

  // Get all rooms for this meter
  const { data: rooms, error: roomsError } = await supabase
    .from('rooms')
    .select('*')
    .eq('meter_id', meterId)
    .order('created_at', { ascending: true }) as { data: Room[] | null; error: Error | null };

  if (roomsError) {
    throw new Error(roomsError.message);
  }

  if (!rooms || rooms.length === 0) {
    return [];
  }

  // Get all radiators for these rooms
  const roomIds = rooms.map(r => r.id);
  const { data: radiators, error: radiatorsError } = await supabase
    .from('radiators')
    .select('*')
    .in('room_id', roomIds)
    .order('created_at', { ascending: true }) as { data: Radiator[] | null; error: Error | null };

  if (radiatorsError) {
    throw new Error(radiatorsError.message);
  }

  // Get all readings for these radiators
  const radiatorIds = radiators?.map(r => r.id) || [];
  let readings: RadiatorReading[] = [];

  if (radiatorIds.length > 0) {
    const { data: readingsData, error: readingsError } = await supabase
      .from('radiator_readings')
      .select('*')
      .in('radiator_id', radiatorIds)
      .order('reading_date', { ascending: false }) as { data: RadiatorReading[] | null; error: Error | null };

    if (readingsError) {
      throw new Error(readingsError.message);
    }
    readings = readingsData || [];
  }

  // Build the nested structure
  const roomsWithRadiators: RoomWithRadiators[] = rooms.map(room => ({
    ...room,
    radiators: (radiators || [])
      .filter(rad => rad.room_id === room.id)
      .map(rad => ({
        ...rad,
        readings: readings.filter(r => r.radiator_id === rad.id),
      })),
  }));

  return roomsWithRadiators;
}

interface CreateRoomInput {
  meterId: string;
  name: string;
}

async function assertMeterOwnership(supabase: Awaited<ReturnType<typeof createClient>>, meterId: string, userId: string): Promise<void> {
  const { data } = await supabase.from('meters').select('id').eq('id', meterId).eq('user_id', userId).single();
  if (!data) throw new Error('Nicht autorisiert');
}

export async function createRoom(input: CreateRoomInput): Promise<Room> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht authentifiziert');
  await assertMeterOwnership(supabase, input.meterId, user.id);

  const trimmedName = input.name.trim();
  if (!trimmedName) throw new Error('Name darf nicht leer sein');
  if (trimmedName.length > 100) throw new Error('Name darf maximal 100 Zeichen lang sein');

  const { data, error } = await supabase
    .from('rooms')
    .insert({
      meter_id: input.meterId,
      name: trimmedName,
    })
    .select()
    .single() as { data: Room | null; error: Error | null };

  if (error || !data) {
    throw new Error(error?.message || 'Fehler beim Erstellen des Raums');
  }

  revalidatePath(`/meters/${input.meterId}`);

  return data;
}

export async function updateRoom(id: string, name: string, meterId: string): Promise<Room> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht authentifiziert');
  await assertMeterOwnership(supabase, meterId, user.id);

  const trimmedName = name.trim();
  if (!trimmedName) throw new Error('Name darf nicht leer sein');
  if (trimmedName.length > 100) throw new Error('Name darf maximal 100 Zeichen lang sein');

  const { data, error } = await supabase
    .from('rooms')
    .update({ name: trimmedName })
    .eq('id', id)
    .select()
    .single() as { data: Room | null; error: Error | null };

  if (error || !data) {
    throw new Error(error?.message || 'Fehler beim Aktualisieren des Raums');
  }

  revalidatePath(`/meters/${meterId}`);

  return data;
}

export async function deleteRoom(id: string, meterId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht authentifiziert');
  await assertMeterOwnership(supabase, meterId, user.id);

  const { error } = await supabase
    .from('rooms')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/meters/${meterId}`);
}

// =====================================================
// RADIATORS
// =====================================================

interface CreateRadiatorInput {
  roomId: string;
  name: string;
  meterId: string; // for revalidation
}

export async function createRadiator(input: CreateRadiatorInput): Promise<Radiator> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht authentifiziert');
  await assertMeterOwnership(supabase, input.meterId, user.id);

  const trimmedName = input.name.trim();
  if (!trimmedName) throw new Error('Name darf nicht leer sein');
  if (trimmedName.length > 100) throw new Error('Name darf maximal 100 Zeichen lang sein');

  const { data, error } = await supabase
    .from('radiators')
    .insert({
      room_id: input.roomId,
      name: trimmedName,
    })
    .select()
    .single() as { data: Radiator | null; error: Error | null };

  if (error || !data) {
    throw new Error(error?.message || 'Fehler beim Erstellen des Heizkörpers');
  }

  revalidatePath(`/meters/${input.meterId}`);

  return data;
}

export async function updateRadiator(id: string, name: string, meterId: string): Promise<Radiator> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht authentifiziert');
  await assertMeterOwnership(supabase, meterId, user.id);

  const trimmedName = name.trim();
  if (!trimmedName) throw new Error('Name darf nicht leer sein');
  if (trimmedName.length > 100) throw new Error('Name darf maximal 100 Zeichen lang sein');

  const { data, error } = await supabase
    .from('radiators')
    .update({ name: trimmedName })
    .eq('id', id)
    .select()
    .single() as { data: Radiator | null; error: Error | null };

  if (error || !data) {
    throw new Error(error?.message || 'Fehler beim Aktualisieren des Heizkörpers');
  }

  revalidatePath(`/meters/${meterId}`);

  return data;
}

export async function deleteRadiator(id: string, meterId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht authentifiziert');
  await assertMeterOwnership(supabase, meterId, user.id);

  const { error } = await supabase
    .from('radiators')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/meters/${meterId}`);
}

// =====================================================
// RADIATOR READINGS
// =====================================================

interface CreateRadiatorReadingInput {
  radiatorId: string;
  readingDate: string;
  value: number;
  meterId: string; // for revalidation
}

export async function createRadiatorReading(input: CreateRadiatorReadingInput): Promise<RadiatorReading> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht authentifiziert');
  await assertMeterOwnership(supabase, input.meterId, user.id);

  const { data, error } = await supabase
    .from('radiator_readings')
    .insert({
      radiator_id: input.radiatorId,
      reading_date: input.readingDate,
      value: input.value,
    })
    .select()
    .single() as { data: RadiatorReading | null; error: { code?: string; message: string } | null };

  if (error) {
    if (error.code === '23505') {
      throw new Error('Für dieses Datum existiert bereits ein Wert');
    }
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error('Fehler beim Speichern der Ablesung');
  }

  revalidatePath('/dashboard');
  revalidatePath(`/meters/${input.meterId}`);

  return data;
}

export async function updateRadiatorReading(
  id: string,
  input: { readingDate?: string; value?: number },
  meterId: string
): Promise<RadiatorReading> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht authentifiziert');
  await assertMeterOwnership(supabase, meterId, user.id);

  const { data, error } = await supabase
    .from('radiator_readings')
    .update({
      reading_date: input.readingDate,
      value: input.value,
    })
    .eq('id', id)
    .select()
    .single() as { data: RadiatorReading | null; error: Error | null };

  if (error || !data) {
    throw new Error(error?.message || 'Fehler beim Aktualisieren der Ablesung');
  }

  revalidatePath('/dashboard');
  revalidatePath(`/meters/${meterId}`);

  return data;
}

export async function deleteRadiatorReading(id: string, meterId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht authentifiziert');
  await assertMeterOwnership(supabase, meterId, user.id);

  const { error } = await supabase
    .from('radiator_readings')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/dashboard');
  revalidatePath(`/meters/${meterId}`);
}

// Bulk create readings for all radiators at once (for convenience)
interface BulkRadiatorReadingInput {
  meterId: string;
  readingDate: string;
  readings: { radiatorId: string; value: number }[];
}

export async function createBulkRadiatorReadings(input: BulkRadiatorReadingInput): Promise<RadiatorReading[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht authentifiziert');
  await assertMeterOwnership(supabase, input.meterId, user.id);

  const insertData = input.readings.map(r => ({
    radiator_id: r.radiatorId,
    reading_date: input.readingDate,
    value: r.value,
  }));

  const { data, error } = await supabase
    .from('radiator_readings')
    .insert(insertData)
    .select() as { data: RadiatorReading[] | null; error: { code?: string; message: string } | null };

  if (error) {
    if (error.code === '23505') {
      throw new Error('Für dieses Datum existieren bereits Werte');
    }
    throw new Error(error.message);
  }

  revalidatePath('/dashboard');
  revalidatePath(`/meters/${input.meterId}`);

  return data || [];
}
