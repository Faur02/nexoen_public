-- Zählerstands-Tracker Schema Update
-- Adds: Water (Wasser) and Heating (Heizung) support
-- Run this in Supabase SQL Editor

-- =====================================================
-- UPDATE METERS TABLE
-- Add new meter types: water, heating
-- =====================================================
ALTER TABLE meters
DROP CONSTRAINT IF EXISTS meters_type_check;

ALTER TABLE meters
ADD CONSTRAINT meters_type_check
CHECK (type IN ('electricity', 'gas', 'water', 'heating'));

-- Update unit constraint to include water units
ALTER TABLE meters
DROP CONSTRAINT IF EXISTS meters_unit_check;

ALTER TABLE meters
ADD CONSTRAINT meters_unit_check
CHECK (unit IN ('kWh', 'm3', 'units'));

-- =====================================================
-- ROOMS TABLE (for heating)
-- Each heating meter can have multiple rooms
-- =====================================================
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meter_id UUID NOT NULL REFERENCES meters(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Policies for rooms (through meter ownership)
CREATE POLICY "Users can view rooms of their meters"
  ON rooms FOR SELECT
  USING (
    meter_id IN (
      SELECT id FROM meters WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create rooms for their meters"
  ON rooms FOR INSERT
  WITH CHECK (
    meter_id IN (
      SELECT id FROM meters WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update rooms of their meters"
  ON rooms FOR UPDATE
  USING (
    meter_id IN (
      SELECT id FROM meters WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete rooms of their meters"
  ON rooms FOR DELETE
  USING (
    meter_id IN (
      SELECT id FROM meters WHERE user_id = auth.uid()
    )
  );

-- Index
CREATE INDEX IF NOT EXISTS idx_rooms_meter_id ON rooms(meter_id);

-- =====================================================
-- RADIATORS TABLE (for heating)
-- Each room can have multiple radiators
-- =====================================================
CREATE TABLE IF NOT EXISTS radiators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g., "Heizkörper 1", "Fenster links"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE radiators ENABLE ROW LEVEL SECURITY;

-- Policies for radiators (through room -> meter ownership)
CREATE POLICY "Users can view radiators of their rooms"
  ON radiators FOR SELECT
  USING (
    room_id IN (
      SELECT r.id FROM rooms r
      JOIN meters m ON r.meter_id = m.id
      WHERE m.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create radiators for their rooms"
  ON radiators FOR INSERT
  WITH CHECK (
    room_id IN (
      SELECT r.id FROM rooms r
      JOIN meters m ON r.meter_id = m.id
      WHERE m.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update radiators of their rooms"
  ON radiators FOR UPDATE
  USING (
    room_id IN (
      SELECT r.id FROM rooms r
      JOIN meters m ON r.meter_id = m.id
      WHERE m.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete radiators of their rooms"
  ON radiators FOR DELETE
  USING (
    room_id IN (
      SELECT r.id FROM rooms r
      JOIN meters m ON r.meter_id = m.id
      WHERE m.user_id = auth.uid()
    )
  );

-- Index
CREATE INDEX IF NOT EXISTS idx_radiators_room_id ON radiators(room_id);

-- =====================================================
-- RADIATOR READINGS TABLE
-- Track readings for each radiator
-- =====================================================
CREATE TABLE IF NOT EXISTS radiator_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  radiator_id UUID NOT NULL REFERENCES radiators(id) ON DELETE CASCADE,
  reading_date DATE NOT NULL,
  value DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(radiator_id, reading_date)
);

-- Enable RLS
ALTER TABLE radiator_readings ENABLE ROW LEVEL SECURITY;

-- Policies for radiator readings
CREATE POLICY "Users can view radiator readings"
  ON radiator_readings FOR SELECT
  USING (
    radiator_id IN (
      SELECT rad.id FROM radiators rad
      JOIN rooms r ON rad.room_id = r.id
      JOIN meters m ON r.meter_id = m.id
      WHERE m.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create radiator readings"
  ON radiator_readings FOR INSERT
  WITH CHECK (
    radiator_id IN (
      SELECT rad.id FROM radiators rad
      JOIN rooms r ON rad.room_id = r.id
      JOIN meters m ON r.meter_id = m.id
      WHERE m.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update radiator readings"
  ON radiator_readings FOR UPDATE
  USING (
    radiator_id IN (
      SELECT rad.id FROM radiators rad
      JOIN rooms r ON rad.room_id = r.id
      JOIN meters m ON r.meter_id = m.id
      WHERE m.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete radiator readings"
  ON radiator_readings FOR DELETE
  USING (
    radiator_id IN (
      SELECT rad.id FROM radiators rad
      JOIN rooms r ON rad.room_id = r.id
      JOIN meters m ON r.meter_id = m.id
      WHERE m.user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_radiator_readings_radiator_id ON radiator_readings(radiator_id);
CREATE INDEX IF NOT EXISTS idx_radiator_readings_date ON radiator_readings(reading_date);

-- =====================================================
-- UPDATE TARIFFS TABLE
-- Add water-specific fields
-- =====================================================
ALTER TABLE tariffs
ADD COLUMN IF NOT EXISTS abwasser_preis DECIMAL(10,4) DEFAULT 0;

-- =====================================================
-- DONE
-- =====================================================
