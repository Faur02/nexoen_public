-- Settings Page Redesign: Database Migration
-- Run this after the initial schema migrations

-- 1. Update subscription_tier CHECK constraint to include 'plus'
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_subscription_tier_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_subscription_tier_check
  CHECK (subscription_tier IN ('free', 'plus', 'pro'));

-- 2. Add theme column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS theme TEXT NOT NULL DEFAULT 'system';
ALTER TABLE profiles ADD CONSTRAINT profiles_theme_check
  CHECK (theme IN ('light', 'dark', 'system'));

-- 3. Create notification_preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  consumption_alerts BOOLEAN NOT NULL DEFAULT false,
  monthly_summary BOOLEAN NOT NULL DEFAULT false,
  nachzahlung_warning BOOLEAN NOT NULL DEFAULT true,
  product_updates BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RLS policies for notification_preferences
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notification preferences"
  ON notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification preferences"
  ON notification_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notification preferences"
  ON notification_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notification preferences"
  ON notification_preferences FOR DELETE
  USING (auth.uid() = user_id);
