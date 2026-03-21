-- =====================================================
-- RLS Performance Fix: replace auth.uid() with (select auth.uid())
-- This prevents PostgreSQL from re-evaluating auth.uid() for every row.
-- Safe to run on live database — drops and recreates policies only.
-- =====================================================

-- ── profiles ────────────────────────────────────────
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE USING ((select auth.uid()) = id);

-- ── meters ──────────────────────────────────────────
DROP POLICY IF EXISTS "Users can view their own meters" ON meters;
CREATE POLICY "Users can view their own meters"
  ON meters FOR SELECT USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create their own meters" ON meters;
CREATE POLICY "Users can create their own meters"
  ON meters FOR INSERT WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update their own meters" ON meters;
CREATE POLICY "Users can update their own meters"
  ON meters FOR UPDATE USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own meters" ON meters;
CREATE POLICY "Users can delete their own meters"
  ON meters FOR DELETE USING (user_id = (select auth.uid()));

-- ── readings ────────────────────────────────────────
DROP POLICY IF EXISTS "Users can view readings of their meters" ON readings;
CREATE POLICY "Users can view readings of their meters"
  ON readings FOR SELECT
  USING (meter_id IN (SELECT id FROM meters WHERE user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can create readings for their meters" ON readings;
CREATE POLICY "Users can create readings for their meters"
  ON readings FOR INSERT
  WITH CHECK (meter_id IN (SELECT id FROM meters WHERE user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can update readings of their meters" ON readings;
CREATE POLICY "Users can update readings of their meters"
  ON readings FOR UPDATE
  USING (meter_id IN (SELECT id FROM meters WHERE user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can delete readings of their meters" ON readings;
CREATE POLICY "Users can delete readings of their meters"
  ON readings FOR DELETE
  USING (meter_id IN (SELECT id FROM meters WHERE user_id = (select auth.uid())));

-- ── tariffs ─────────────────────────────────────────
DROP POLICY IF EXISTS "Users can view tariffs of their meters" ON tariffs;
CREATE POLICY "Users can view tariffs of their meters"
  ON tariffs FOR SELECT
  USING (meter_id IN (SELECT id FROM meters WHERE user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can create tariffs for their meters" ON tariffs;
CREATE POLICY "Users can create tariffs for their meters"
  ON tariffs FOR INSERT
  WITH CHECK (meter_id IN (SELECT id FROM meters WHERE user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can update tariffs of their meters" ON tariffs;
CREATE POLICY "Users can update tariffs of their meters"
  ON tariffs FOR UPDATE
  USING (meter_id IN (SELECT id FROM meters WHERE user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can delete tariffs of their meters" ON tariffs;
CREATE POLICY "Users can delete tariffs of their meters"
  ON tariffs FOR DELETE
  USING (meter_id IN (SELECT id FROM meters WHERE user_id = (select auth.uid())));

-- ── rooms ───────────────────────────────────────────
DROP POLICY IF EXISTS "Users can view rooms of their meters" ON rooms;
CREATE POLICY "Users can view rooms of their meters"
  ON rooms FOR SELECT
  USING (meter_id IN (SELECT id FROM meters WHERE user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can create rooms for their meters" ON rooms;
CREATE POLICY "Users can create rooms for their meters"
  ON rooms FOR INSERT
  WITH CHECK (meter_id IN (SELECT id FROM meters WHERE user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can update rooms of their meters" ON rooms;
CREATE POLICY "Users can update rooms of their meters"
  ON rooms FOR UPDATE
  USING (meter_id IN (SELECT id FROM meters WHERE user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can delete rooms of their meters" ON rooms;
CREATE POLICY "Users can delete rooms of their meters"
  ON rooms FOR DELETE
  USING (meter_id IN (SELECT id FROM meters WHERE user_id = (select auth.uid())));

-- ── radiators ───────────────────────────────────────
DROP POLICY IF EXISTS "Users can view radiators of their rooms" ON radiators;
CREATE POLICY "Users can view radiators of their rooms"
  ON radiators FOR SELECT
  USING (room_id IN (SELECT r.id FROM rooms r JOIN meters m ON r.meter_id = m.id WHERE m.user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can create radiators for their rooms" ON radiators;
CREATE POLICY "Users can create radiators for their rooms"
  ON radiators FOR INSERT
  WITH CHECK (room_id IN (SELECT r.id FROM rooms r JOIN meters m ON r.meter_id = m.id WHERE m.user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can update radiators of their rooms" ON radiators;
CREATE POLICY "Users can update radiators of their rooms"
  ON radiators FOR UPDATE
  USING (room_id IN (SELECT r.id FROM rooms r JOIN meters m ON r.meter_id = m.id WHERE m.user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can delete radiators of their rooms" ON radiators;
CREATE POLICY "Users can delete radiators of their rooms"
  ON radiators FOR DELETE
  USING (room_id IN (SELECT r.id FROM rooms r JOIN meters m ON r.meter_id = m.id WHERE m.user_id = (select auth.uid())));

-- ── radiator_readings ───────────────────────────────
DROP POLICY IF EXISTS "Users can view radiator readings" ON radiator_readings;
CREATE POLICY "Users can view radiator readings"
  ON radiator_readings FOR SELECT
  USING (radiator_id IN (SELECT rad.id FROM radiators rad JOIN rooms r ON rad.room_id = r.id JOIN meters m ON r.meter_id = m.id WHERE m.user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can create radiator readings" ON radiator_readings;
CREATE POLICY "Users can create radiator readings"
  ON radiator_readings FOR INSERT
  WITH CHECK (radiator_id IN (SELECT rad.id FROM radiators rad JOIN rooms r ON rad.room_id = r.id JOIN meters m ON r.meter_id = m.id WHERE m.user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can update radiator readings" ON radiator_readings;
CREATE POLICY "Users can update radiator readings"
  ON radiator_readings FOR UPDATE
  USING (radiator_id IN (SELECT rad.id FROM radiators rad JOIN rooms r ON rad.room_id = r.id JOIN meters m ON r.meter_id = m.id WHERE m.user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can delete radiator readings" ON radiator_readings;
CREATE POLICY "Users can delete radiator readings"
  ON radiator_readings FOR DELETE
  USING (radiator_id IN (SELECT rad.id FROM radiators rad JOIN rooms r ON rad.room_id = r.id JOIN meters m ON r.meter_id = m.id WHERE m.user_id = (select auth.uid())));

-- ── meter_categories ────────────────────────────────
DROP POLICY IF EXISTS "Users can view own meter categories" ON meter_categories;
CREATE POLICY "Users can view own meter categories"
  ON meter_categories FOR SELECT USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create own meter categories" ON meter_categories;
CREATE POLICY "Users can create own meter categories"
  ON meter_categories FOR INSERT WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own meter categories" ON meter_categories;
CREATE POLICY "Users can update own meter categories"
  ON meter_categories FOR UPDATE USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own meter categories" ON meter_categories;
CREATE POLICY "Users can delete own meter categories"
  ON meter_categories FOR DELETE USING (user_id = (select auth.uid()));

-- ── heating_billing_setups ──────────────────────────
DROP POLICY IF EXISTS "Users can view own heating billing setups" ON heating_billing_setups;
CREATE POLICY "Users can view own heating billing setups"
  ON heating_billing_setups FOR SELECT USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create own heating billing setups" ON heating_billing_setups;
CREATE POLICY "Users can create own heating billing setups"
  ON heating_billing_setups FOR INSERT WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own heating billing setups" ON heating_billing_setups;
CREATE POLICY "Users can update own heating billing setups"
  ON heating_billing_setups FOR UPDATE USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own heating billing setups" ON heating_billing_setups;
CREATE POLICY "Users can delete own heating billing setups"
  ON heating_billing_setups FOR DELETE USING (user_id = (select auth.uid()));

-- ── abrechnung_setup ────────────────────────────────
DROP POLICY IF EXISTS "Users can view own abrechnung setup" ON abrechnung_setup;
CREATE POLICY "Users can view own abrechnung setup"
  ON abrechnung_setup FOR SELECT USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create own abrechnung setup" ON abrechnung_setup;
CREATE POLICY "Users can create own abrechnung setup"
  ON abrechnung_setup FOR INSERT WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own abrechnung setup" ON abrechnung_setup;
CREATE POLICY "Users can update own abrechnung setup"
  ON abrechnung_setup FOR UPDATE USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own abrechnung setup" ON abrechnung_setup;
CREATE POLICY "Users can delete own abrechnung setup"
  ON abrechnung_setup FOR DELETE USING (user_id = (select auth.uid()));

-- ── ista_consumption ────────────────────────────────
DROP POLICY IF EXISTS "Users can view own ista consumption" ON ista_consumption;
CREATE POLICY "Users can view own ista consumption"
  ON ista_consumption FOR SELECT USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create own ista consumption" ON ista_consumption;
CREATE POLICY "Users can create own ista consumption"
  ON ista_consumption FOR INSERT WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own ista consumption" ON ista_consumption;
CREATE POLICY "Users can update own ista consumption"
  ON ista_consumption FOR UPDATE USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own ista consumption" ON ista_consumption;
CREATE POLICY "Users can delete own ista consumption"
  ON ista_consumption FOR DELETE USING (user_id = (select auth.uid()));

-- =====================================================
-- DONE — all 46 policies updated
-- =====================================================
