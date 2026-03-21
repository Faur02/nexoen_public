import type { SubscriptionTier } from '@/types/database';

/**
 * Returns true if the user has full app access (trial or active subscriber).
 * Expired users see soft-locked features with an inline CTA.
 */
export function hasAccess(tier: SubscriptionTier): boolean {
  return tier === 'trial' || tier === 'active';
}

/**
 * Returns the effective tier, applying a lazy expiry check.
 * If the user is on 'trial' but trial_ends_at is in the past, returns 'expired'.
 * Use this everywhere instead of reading subscription_tier directly.
 */
export function getEffectiveTier(tier: SubscriptionTier, trialEndsAt: string | null): SubscriptionTier {
  if (tier === 'trial' && trialEndsAt && new Date(trialEndsAt) < new Date()) {
    return 'expired';
  }
  return tier;
}

/** Human-readable label for the subscription state. */
export function getTierLabel(tier: SubscriptionTier): string {
  switch (tier) {
    case 'trial':   return 'Testphase';
    case 'active':  return 'nexoen Jahresabo';
    case 'expired': return 'Testphase abgelaufen';
  }
}
