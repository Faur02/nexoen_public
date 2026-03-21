-- Zählerstands-Tracker Database Schema
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/YOUR_PROJECT/sql)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- Extended user profile (linked to Supabase Auth)
-- =====================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- METERS TABLE
-- User's electricity and gas meters
-- =====================================================
CREATE TABLE meters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('electricity', 'gas')),
  unit TEXT NOT NULL CHECK (unit IN ('kWh', 'm3')),
  conversion_factor DECIMAL(10,4) DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE meters ENABLE ROW LEVEL SECURITY;

-- Policies for meters
CREATE POLICY "Users can view their own meters"
  ON meters FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own meters"
  ON meters FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own meters"
  ON meters FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own meters"
  ON meters FOR DELETE
  USING (user_id = auth.uid());

-- Index for faster queries
CREATE INDEX idx_meters_user_id ON meters(user_id);

-- =====================================================
-- READINGS TABLE
-- Meter readings with date and value
-- =====================================================
CREATE TABLE readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meter_id UUID NOT NULL REFERENCES meters(id) ON DELETE CASCADE,
  reading_date DATE NOT NULL,
  value DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(meter_id, reading_date)
);

-- Enable RLS
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;

-- Policies for readings (through meter ownership)
CREATE POLICY "Users can view readings of their meters"
  ON readings FOR SELECT
  USING (
    meter_id IN (
      SELECT id FROM meters WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create readings for their meters"
  ON readings FOR INSERT
  WITH CHECK (
    meter_id IN (
      SELECT id FROM meters WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update readings of their meters"
  ON readings FOR UPDATE
  USING (
    meter_id IN (
      SELECT id FROM meters WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete readings of their meters"
  ON readings FOR DELETE
  USING (
    meter_id IN (
      SELECT id FROM meters WHERE user_id = auth.uid()
    )
  );

-- Indexes for faster queries
CREATE INDEX idx_readings_meter_id ON readings(meter_id);
CREATE INDEX idx_readings_date ON readings(reading_date);

-- =====================================================
-- TARIFFS TABLE
-- Pricing information for each meter
-- =====================================================
CREATE TABLE tariffs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meter_id UUID NOT NULL REFERENCES meters(id) ON DELETE CASCADE,
  name TEXT,
  arbeitspreis DECIMAL(10,4) NOT NULL,
  grundpreis DECIMAL(10,2) NOT NULL,
  abschlag DECIMAL(10,2),
  includes_vat BOOLEAN DEFAULT TRUE,
  valid_from DATE NOT NULL,
  valid_until DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tariffs ENABLE ROW LEVEL SECURITY;

-- Policies for tariffs (through meter ownership)
CREATE POLICY "Users can view tariffs of their meters"
  ON tariffs FOR SELECT
  USING (
    meter_id IN (
      SELECT id FROM meters WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create tariffs for their meters"
  ON tariffs FOR INSERT
  WITH CHECK (
    meter_id IN (
      SELECT id FROM meters WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update tariffs of their meters"
  ON tariffs FOR UPDATE
  USING (
    meter_id IN (
      SELECT id FROM meters WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete tariffs of their meters"
  ON tariffs FOR DELETE
  USING (
    meter_id IN (
      SELECT id FROM meters WHERE user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX idx_tariffs_meter_id ON tariffs(meter_id);
CREATE INDEX idx_tariffs_valid_from ON tariffs(valid_from);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to get the active tariff for a meter
CREATE OR REPLACE FUNCTION get_active_tariff(p_meter_id UUID)
RETURNS tariffs AS $$
  SELECT * FROM tariffs
  WHERE meter_id = p_meter_id
    AND valid_from <= CURRENT_DATE
    AND (valid_until IS NULL OR valid_until >= CURRENT_DATE)
  ORDER BY valid_from DESC
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Function to count user's meters (for free tier limit)
CREATE OR REPLACE FUNCTION count_user_meters(p_user_id UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM meters WHERE user_id = p_user_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- =====================================================
-- UPDATED_AT TRIGGER
-- Auto-update updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_meters_updated_at
  BEFORE UPDATE ON meters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
