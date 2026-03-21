-- nexoen — Complete RLS Migration
-- Run this in Supabase SQL Editor (safe to run on an existing database — all statements are idempotent)
-- Covers all tables added after the initial schema: meter_categories, heating_billing_setups, abrechnung_setup, ista_consumption
-- Also ensures missing columns exist on profiles and meters

-- =====================================================
-- 1. PROFILES — missing columns
-- =====================================================
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS email_reminders_enabled BOOLEAN NOT NULL DEFAULT true;

-- =====================================================
-- 2. METERS — missing column (category link)
-- =====================================================
ALTER TABLE meters
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES meter_categories(id) ON DELETE SET NULL;

-- =====================================================
-- 3. METER_CATEGORIES
-- =====================================================
CREATE TABLE IF NOT EXISTS meter_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  is_predefined BOOLEAN NOT NULL DEFAULT false,
  meter_type TEXT NOT NULL,
  unit TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, slug)
);

ALTER TABLE meter_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own meter categories" ON meter_categories;
CREATE POLICY "Users can view own meter categories"
  ON meter_categories FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create own meter categories" ON meter_categories;
CREATE POLICY "Users can create own meter categories"
  ON meter_categories FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own meter categories" ON meter_categories;
CREATE POLICY "Users can update own meter categories"
  ON meter_categories FOR UPDATE
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own meter categories" ON meter_categories;
CREATE POLICY "Users can delete own meter categories"
  ON meter_categories FOR DELETE
  USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_meter_categories_user_id ON meter_categories(user_id);

-- =====================================================
-- 4. HEATING_BILLING_SETUPS
-- =====================================================
CREATE TABLE IF NOT EXISTS heating_billing_setups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES meter_categories(id) ON DELETE CASCADE,
  total_building_cost NUMERIC NOT NULL DEFAULT 0,
  grundkosten_percent NUMERIC NOT NULL DEFAULT 30,
  verbrauchskosten_percent NUMERIC NOT NULL DEFAULT 70,
  total_building_area NUMERIC NOT NULL DEFAULT 0,
  your_area NUMERIC NOT NULL DEFAULT 0,
  total_building_units NUMERIC NOT NULL DEFAULT 0,
  your_units NUMERIC DEFAULT NULL,
  abschlag_monthly NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, category_id)
);

ALTER TABLE heating_billing_setups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own heating billing setups" ON heating_billing_setups;
CREATE POLICY "Users can view own heating billing setups"
  ON heating_billing_setups FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create own heating billing setups" ON heating_billing_setups;
CREATE POLICY "Users can create own heating billing setups"
  ON heating_billing_setups FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own heating billing setups" ON heating_billing_setups;
CREATE POLICY "Users can update own heating billing setups"
  ON heating_billing_setups FOR UPDATE
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own heating billing setups" ON heating_billing_setups;
CREATE POLICY "Users can delete own heating billing setups"
  ON heating_billing_setups FOR DELETE
  USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_heating_billing_user_id ON heating_billing_setups(user_id);

-- =====================================================
-- 5. ABRECHNUNG_SETUP
-- =====================================================
CREATE TABLE IF NOT EXISTS abrechnung_setup (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  abrechnungszeitraum_start DATE DEFAULT NULL,
  abrechnungszeitraum_end DATE DEFAULT NULL,
  kalte_betriebskosten_year NUMERIC NOT NULL DEFAULT 0,
  ista_nebenkosten_year NUMERIC NOT NULL DEFAULT 0,
  vorauszahlung_monthly NUMERIC NOT NULL DEFAULT 0,
  forecast_snapshot_amount NUMERIC DEFAULT NULL,
  forecast_snapshot_updated_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure columns exist if table was created from older schema
ALTER TABLE abrechnung_setup ADD COLUMN IF NOT EXISTS kalte_betriebskosten_year NUMERIC NOT NULL DEFAULT 0;
ALTER TABLE abrechnung_setup ADD COLUMN IF NOT EXISTS ista_nebenkosten_year NUMERIC NOT NULL DEFAULT 0;
ALTER TABLE abrechnung_setup ADD COLUMN IF NOT EXISTS vorauszahlung_monthly NUMERIC NOT NULL DEFAULT 0;
ALTER TABLE abrechnung_setup ADD COLUMN IF NOT EXISTS forecast_snapshot_amount NUMERIC DEFAULT NULL;
ALTER TABLE abrechnung_setup ADD COLUMN IF NOT EXISTS forecast_snapshot_updated_at TIMESTAMPTZ DEFAULT NULL;

ALTER TABLE abrechnung_setup ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own abrechnung setup" ON abrechnung_setup;
CREATE POLICY "Users can view own abrechnung setup"
  ON abrechnung_setup FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create own abrechnung setup" ON abrechnung_setup;
CREATE POLICY "Users can create own abrechnung setup"
  ON abrechnung_setup FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own abrechnung setup" ON abrechnung_setup;
CREATE POLICY "Users can update own abrechnung setup"
  ON abrechnung_setup FOR UPDATE
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own abrechnung setup" ON abrechnung_setup;
CREATE POLICY "Users can delete own abrechnung setup"
  ON abrechnung_setup FOR DELETE
  USING (user_id = auth.uid());

-- =====================================================
-- 6. ISTA_CONSUMPTION
-- =====================================================
CREATE TABLE IF NOT EXISTS ista_consumption (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES meter_categories(id) ON DELETE CASCADE,
  month TEXT NOT NULL, -- YYYY-MM
  units NUMERIC NOT NULL DEFAULT 0,
  kwh NUMERIC DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, category_id, month)
);

ALTER TABLE ista_consumption ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own ista consumption" ON ista_consumption;
CREATE POLICY "Users can view own ista consumption"
  ON ista_consumption FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create own ista consumption" ON ista_consumption;
CREATE POLICY "Users can create own ista consumption"
  ON ista_consumption FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own ista consumption" ON ista_consumption;
CREATE POLICY "Users can update own ista consumption"
  ON ista_consumption FOR UPDATE
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own ista consumption" ON ista_consumption;
CREATE POLICY "Users can delete own ista consumption"
  ON ista_consumption FOR DELETE
  USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_ista_consumption_user_id ON ista_consumption(user_id);
CREATE INDEX IF NOT EXISTS idx_ista_consumption_category ON ista_consumption(category_id);

-- =====================================================
-- DONE
-- All tables have RLS enabled with user-scoped policies.
-- =====================================================
