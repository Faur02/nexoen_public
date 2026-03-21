-- =====================================================
-- nexoen Pricing Overhaul Migration
-- Run in Supabase SQL Editor AFTER deploying the code
-- =====================================================

-- 1. Add trial_ends_at column
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS trial_ends_at timestamptz;

-- 2. Drop old tier check constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_subscription_tier_check;

-- 3. Migrate existing data FIRST (before adding the new constraint)
--    Paid users (plus/pro) → active
UPDATE profiles SET subscription_tier = 'active'
  WHERE subscription_tier IN ('plus', 'pro');
--    Free users → trial with a 14-day grace period from now
UPDATE profiles SET subscription_tier = 'trial', trial_ends_at = NOW() + INTERVAL '14 days'
  WHERE subscription_tier = 'free';

-- 4. Now add the new constraint (data is already clean)
ALTER TABLE profiles ADD CONSTRAINT profiles_subscription_tier_check
  CHECK (subscription_tier IN ('trial', 'active', 'expired'));

-- 5. Clear old Stripe IDs (old account deleted — these are now invalid)
UPDATE profiles SET
  stripe_customer_id = NULL,
  stripe_subscription_id = NULL;

-- 6. Update the handle_new_user trigger to set trial on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name, subscription_tier, trial_ends_at)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    'trial',
    NOW() + INTERVAL '14 days'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verify the migration
SELECT id, subscription_tier, trial_ends_at, stripe_customer_id FROM profiles LIMIT 10;
