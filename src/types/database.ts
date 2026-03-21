export type SubscriptionTier = 'trial' | 'active' | 'expired';
export type ThemePreference = 'light' | 'dark' | 'system';
export type MeterType = 'electricity' | 'gas' | 'water' | 'heating';
export type MeterUnit = 'kWh' | 'm3' | 'units';
export type CategorySlug = 'heizung' | 'kaltwasser' | 'warmwasser' | string;

export interface Profile {
  id: string;
  email: string;
  name: string | null;
  subscription_tier: SubscriptionTier;
  theme: ThemePreference;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  trial_ends_at: string | null;
  email_reminders_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreferences {
  id: string;
  user_id: string;
  consumption_alerts: boolean;
  monthly_summary: boolean;
  nachzahlung_warning: boolean;
  product_updates: boolean;
  created_at: string;
  updated_at: string;
}

export interface MeterCategory {
  id: string;
  user_id: string;
  slug: string;
  name: string;
  is_predefined: boolean;
  meter_type: string;
  unit: string;
  created_at: string;
}

export interface Meter {
  id: string;
  user_id: string;
  name: string;
  type: MeterType;
  unit: MeterUnit;
  conversion_factor: number;
  category_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Reading {
  id: string;
  meter_id: string;
  reading_date: string;
  value: number;
  created_at: string;
}

export interface Tariff {
  id: string;
  meter_id: string;
  name: string | null;
  arbeitspreis: number; // €/kWh or €/m³ or €/unit
  grundpreis: number; // €/month
  abschlag: number | null; // €/month user payment
  abwasser_preis: number; // €/m³ for water
  includes_vat: boolean;
  valid_from: string;
  valid_until: string | null;
  created_at: string;
}

// Heating specific types
export interface Room {
  id: string;
  meter_id: string;
  name: string;
  created_at: string;
}

export interface Radiator {
  id: string;
  room_id: string;
  name: string;
  created_at: string;
}

export interface RadiatorReading {
  id: string;
  radiator_id: string;
  reading_date: string;
  value: number;
  created_at: string;
}

// Extended types with relations
export interface RoomWithRadiators extends Room {
  radiators: RadiatorWithReadings[];
}

export interface RadiatorWithReadings extends Radiator {
  readings: RadiatorReading[];
}

export interface MeterWithReadings extends Meter {
  readings: Reading[];
}

export interface MeterWithTariff extends Meter {
  tariffs: Tariff[];
}

export interface MeterFull extends Meter {
  readings: Reading[];
  tariffs: Tariff[];
  rooms?: RoomWithRadiators[]; // Only for heating meters
}

// Heating billing setup (ista-style Heizkostenabrechnung) — linked to category, not meter
export interface HeatingBillingSetup {
  id: string;
  user_id: string;
  category_id: string;
  total_building_cost: number;
  grundkosten_percent: number;
  verbrauchskosten_percent: number;
  total_building_area: number;
  your_area: number;
  total_building_units: number;
  your_units: number | null;
  abschlag_monthly: number;
  created_at: string;
  updated_at: string;
}

export interface HeatingForecastResult {
  grundkosten: number;
  verbrauchskosten: number;
  yourAnnualCost: number;
  annualAbschlag: number;
  difference: number;
  differenceType: 'nachzahlung' | 'guthaben';
  grundkostenPercent: number;
  verbrauchskostenPercent: number;
  areaRatio: number;
  unitsRatio: number;
}

// Abrechnung setup (unified billing: Betriebskosten + Vorauszahlungen)
export interface AbrechnungSetup {
  id: string;
  user_id: string;
  abrechnungszeitraum_start: string | null;
  abrechnungszeitraum_end: string | null;
  kalte_betriebskosten_year: number;
  ista_nebenkosten_year: number;
  vorauszahlung_monthly: number;
  forecast_snapshot_amount: number | null;
  forecast_snapshot_updated_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ForecastConfidence {
  monthsElapsed: number;        // 0–12 (fractional), how far into the billing period
  dataSource: 'ista' | 'readings' | 'none'; // quality of consumption data
  hasBetriebskosten: boolean;   // whether kalte Betriebskosten are filled in
  hasHeizungData: boolean;
  hasWarmwasserData: boolean;
  accuracyPct: number;          // 30–90%, calculated estimate of forecast accuracy
}

export interface CombinedForecastResult {
  heizung: HeatingForecastResult | null;
  warmwasser: HeatingForecastResult | null;
  betriebskosten: number;
  istaNebenkostenYear: number;
  totalProjected: number;
  annualVorauszahlungen: number;
  difference: number;
  differenceType: 'nachzahlung' | 'guthaben';
  confidence: ForecastConfidence;
}

// ista EcoTrend monthly consumption data
export interface IstaConsumption {
  id: string;
  user_id: string;
  category_id: string;
  month: string;        // YYYY-MM
  units: number;        // HKV for heizung, m³ for warmwasser
  kwh: number | null;
  created_at: string;
  updated_at: string;
}

// Calculation result types
export interface ConsumptionResult {
  totalConsumption: number;
  dailyAverage: number;
  days: number;
  unit: MeterUnit;
}

export interface CostEstimate {
  monthlyCost: number;
  yearlyCost: number;
  monthlyEnergyCost: number;
  monthlyBaseCost: number;
}

export interface ForecastResult {
  projectedYearlyCost: number;
  projectedYearlyConsumption: number;
  minCost: number;
  maxCost: number;
  totalAbschlagPaid: number;
  difference: number;
  differenceType: 'nachzahlung' | 'guthaben';
}

// Helper functions for meter type labels
export const meterTypeLabels: Record<MeterType, string> = {
  electricity: 'Strom',
  gas: 'Gas',
  water: 'Wasser',
  heating: 'Heizung',
};

export const meterUnitLabels: Record<MeterUnit, string> = {
  kWh: 'Kilowattstunden',
  m3: 'Kubikmeter',
  units: 'Einheiten',
};

export const meterTypeColors: Record<MeterType, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  electricity: 'default',
  gas: 'secondary',
  water: 'outline',
  heating: 'destructive',
};

// Supabase Database type for type safety
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      meter_categories: {
        Row: MeterCategory;
        Insert: Omit<MeterCategory, 'id' | 'created_at'>;
        Update: Partial<Omit<MeterCategory, 'id' | 'user_id' | 'created_at'>>;
      };
      meters: {
        Row: Meter;
        Insert: Omit<Meter, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Meter, 'id' | 'user_id' | 'created_at'>>;
      };
      readings: {
        Row: Reading;
        Insert: Omit<Reading, 'id' | 'created_at'>;
        Update: Partial<Omit<Reading, 'id' | 'meter_id' | 'created_at'>>;
      };
      tariffs: {
        Row: Tariff;
        Insert: Omit<Tariff, 'id' | 'created_at'>;
        Update: Partial<Omit<Tariff, 'id' | 'meter_id' | 'created_at'>>;
      };
      rooms: {
        Row: Room;
        Insert: Omit<Room, 'id' | 'created_at'>;
        Update: Partial<Omit<Room, 'id' | 'meter_id' | 'created_at'>>;
      };
      radiators: {
        Row: Radiator;
        Insert: Omit<Radiator, 'id' | 'created_at'>;
        Update: Partial<Omit<Radiator, 'id' | 'room_id' | 'created_at'>>;
      };
      radiator_readings: {
        Row: RadiatorReading;
        Insert: Omit<RadiatorReading, 'id' | 'created_at'>;
        Update: Partial<Omit<RadiatorReading, 'id' | 'radiator_id' | 'created_at'>>;
      };
      notification_preferences: {
        Row: NotificationPreferences;
        Insert: Omit<NotificationPreferences, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<NotificationPreferences, 'id' | 'user_id' | 'created_at'>>;
      };
      heating_billing_setups: {
        Row: HeatingBillingSetup;
        Insert: Omit<HeatingBillingSetup, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<HeatingBillingSetup, 'id' | 'user_id' | 'category_id' | 'created_at'>>;
      };
      abrechnung_setup: {
        Row: AbrechnungSetup;
        Insert: Omit<AbrechnungSetup, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<AbrechnungSetup, 'id' | 'user_id' | 'created_at'>>;
      };
      ista_consumption: {
        Row: IstaConsumption;
        Insert: Omit<IstaConsumption, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<IstaConsumption, 'id' | 'user_id' | 'category_id' | 'created_at'>>;
      };
    };
  };
}
