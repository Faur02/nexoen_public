'use server';

import { createClient } from '@/lib/supabase/server';
import { Meter, Reading, Tariff, HeatingBillingSetup, AbrechnungSetup, IstaConsumption, NotificationPreferences, Room, Radiator, RadiatorReading } from '@/types/database';

export interface ProfileExport {
  name: string | null;
  email: string;
  subscription_tier: string;
  theme: string;
  trial_ends_at: string | null;
  email_reminders_enabled: boolean;
  created_at: string;
}

export interface ExportData {
  profile: ProfileExport | null;
  meters: Meter[];
  readings: Reading[];
  tariffs: Tariff[];
  rooms: Room[];
  radiators: Radiator[];
  radiatorReadings: RadiatorReading[];
  heatingBillingSetups: HeatingBillingSetup[];
  abrechnungSetup: AbrechnungSetup | null;
  istaConsumption: IstaConsumption[];
  notificationPreferences: NotificationPreferences | null;
}

export async function getExportData(): Promise<ExportData> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Nicht angemeldet');
  }

  const [
    profileResult,
    metersResult,
    heatingBillingResult,
    abrechnungResult,
    istaResult,
    notifResult,
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('name, email, subscription_tier, theme, trial_ends_at, email_reminders_enabled, created_at')
      .eq('id', user.id)
      .single() as unknown as Promise<{ data: ProfileExport | null }>,
    supabase
      .from('meters')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }) as unknown as Promise<{ data: Meter[] | null }>,
    supabase
      .from('heating_billing_setups')
      .select('*')
      .eq('user_id', user.id) as unknown as Promise<{ data: HeatingBillingSetup[] | null }>,
    supabase
      .from('abrechnung_setup')
      .select('*')
      .eq('user_id', user.id)
      .single() as unknown as Promise<{ data: AbrechnungSetup | null }>,
    supabase
      .from('ista_consumption')
      .select('*')
      .eq('user_id', user.id)
      .order('month', { ascending: true }) as unknown as Promise<{ data: IstaConsumption[] | null }>,
    supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single() as unknown as Promise<{ data: NotificationPreferences | null }>,
  ]);

  const meters = metersResult.data || [];
  const meterIds = meters.map(m => m.id);

  const [readingsResult, tariffsResult, roomsResult] = meterIds.length > 0
    ? await Promise.all([
        supabase
          .from('readings')
          .select('*')
          .in('meter_id', meterIds)
          .order('reading_date', { ascending: true }) as unknown as Promise<{ data: Reading[] | null }>,
        supabase
          .from('tariffs')
          .select('*')
          .in('meter_id', meterIds)
          .order('valid_from', { ascending: false }) as unknown as Promise<{ data: Tariff[] | null }>,
        supabase
          .from('rooms')
          .select('*')
          .in('meter_id', meterIds)
          .order('created_at', { ascending: true }) as unknown as Promise<{ data: Room[] | null }>,
      ])
    : [{ data: [] }, { data: [] }, { data: [] }];

  const rooms = (roomsResult as { data: Room[] | null }).data || [];
  const roomIds = rooms.map(r => r.id);

  const [radiatorsResult] = roomIds.length > 0
    ? await Promise.all([
        supabase
          .from('radiators')
          .select('*')
          .in('room_id', roomIds)
          .order('created_at', { ascending: true }) as unknown as Promise<{ data: Radiator[] | null }>,
      ])
    : [{ data: [] }];

  const radiators = (radiatorsResult as { data: Radiator[] | null }).data || [];
  const radiatorIds = radiators.map(r => r.id);

  const [radiatorReadingsResult] = radiatorIds.length > 0
    ? await Promise.all([
        supabase
          .from('radiator_readings')
          .select('*')
          .in('radiator_id', radiatorIds)
          .order('reading_date', { ascending: true }) as unknown as Promise<{ data: RadiatorReading[] | null }>,
      ])
    : [{ data: [] }];

  return {
    profile: profileResult.data,
    meters,
    readings: (readingsResult as { data: Reading[] | null }).data || [],
    tariffs: (tariffsResult as { data: Tariff[] | null }).data || [],
    rooms,
    radiators,
    radiatorReadings: (radiatorReadingsResult as { data: RadiatorReading[] | null }).data || [],
    heatingBillingSetups: heatingBillingResult.data || [],
    abrechnungSetup: abrechnungResult.data,
    istaConsumption: istaResult.data || [],
    notificationPreferences: notifResult.data,
  };
}
