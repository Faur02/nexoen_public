import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { adminClient as supabaseAdmin } from '@/lib/supabase/admin';

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-01-28.clover',
  });
}

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Webhook handler error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!customerId || !subscriptionId) {
    throw new Error(`Missing customer (${customerId}) or subscription (${subscriptionId}) in checkout session`);
  }

  // Find the user by stripe_customer_id
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (profileError || !profile) {
    throw new Error(`Could not find profile for customer ${customerId}: ${profileError?.message}`);
  }

  const { error: updateError } = await supabaseAdmin
    .from('profiles')
    .update({
      subscription_tier: 'active',
      stripe_subscription_id: subscriptionId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', profile.id);

  if (updateError) {
    throw new Error(`Failed to update profile ${profile.id} subscription: ${updateError.message}`);
  }

  console.log('Subscription activated');
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const status = subscription.status;

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!profile) {
    throw new Error(`Could not find profile for customer: ${customerId}`);
  }

  // active/trialing → keep active; past_due → grace period, keep active; canceled/unpaid → expired
  let tier: 'active' | 'expired';
  if (status === 'active' || status === 'trialing' || status === 'past_due') {
    tier = 'active';
  } else {
    tier = 'expired';
  }

  const { error: updateError } = await supabaseAdmin
    .from('profiles')
    .update({
      subscription_tier: tier,
      updated_at: new Date().toISOString(),
    })
    .eq('id', profile.id);

  if (updateError) {
    throw new Error(`Failed to update subscription tier for ${profile.id}: ${updateError.message}`);
  }

  console.log(`Subscription updated to ${tier} (Stripe status: ${status})`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!profile) {
    throw new Error(`Could not find profile for customer: ${customerId}`);
  }

  const { error: updateError } = await supabaseAdmin
    .from('profiles')
    .update({
      subscription_tier: 'expired',
      stripe_subscription_id: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', profile.id);

  if (updateError) {
    throw new Error(`Failed to downgrade profile ${profile.id}: ${updateError.message}`);
  }

  console.log('Subscription cancelled, set to expired');
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!profile) {
    // Non-critical: log but don't throw — Stripe will still retry the payment
    console.error('Could not find profile for customer:', customerId);
    return;
  }

  console.warn(`Payment failed for user ${profile.id}, customer ${customerId}`);
}
