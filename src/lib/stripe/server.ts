import Stripe from 'stripe';

let _stripe: Stripe | null = null;

function getStripeServer(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-01-28.clover',
      typescript: true,
    });
  }
  return _stripe;
}

/**
 * Create a Stripe checkout session for Pro subscription
 */
export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  const session = await getStripeServer().checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
  });

  return session;
}

/**
 * Create a Stripe customer
 */
export async function createCustomer(email: string, name?: string) {
  const customer = await getStripeServer().customers.create({
    email,
    name: name || undefined,
  });

  return customer;
}

/**
 * Create a billing portal session
 */
export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
) {
  const session = await getStripeServer().billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

/**
 * Get subscription status
 */
export async function getSubscription(subscriptionId: string) {
  const subscription = await getStripeServer().subscriptions.retrieve(subscriptionId);
  return subscription;
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  const subscription = await getStripeServer().subscriptions.cancel(subscriptionId);
  return subscription;
}
