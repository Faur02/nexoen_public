import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createCheckoutSession, createCustomer } from '@/lib/stripe/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
    }

    // Only accept userId from body for identity verification — never trust client-supplied stripeCustomerId
    const body = await request.json();
    const { userId } = body;

    if (userId !== user.id) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe ist noch nicht konfiguriert. Bitte kontaktieren Sie den Support.' },
        { status: 500 }
      );
    }

    const priceId = process.env.STRIPE_ANNUAL_PRICE_ID;
    if (!priceId) {
      return NextResponse.json(
        { error: 'Keine Preiskonfiguration gefunden. Bitte kontaktieren Sie den Support.' },
        { status: 500 }
      );
    }

    // Always fetch stripeCustomerId from the database — never trust client-supplied value
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    let customerId = profile?.stripe_customer_id ?? null;

    if (!customerId) {
      // Always use server-verified email and name, never client-supplied
      const customer = await createCustomer(user.email!, user.user_metadata?.name);
      customerId = customer.id;

      // Write directly here — not a user-callable server action
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (updateError) {
        console.error('Failed to save stripe_customer_id:', updateError.message);
        // Non-fatal: checkout can still proceed
      }
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const session = await createCheckoutSession(
      customerId,
      priceId,
      `${appUrl}/settings?tab=abonnement&success=true`,
      `${appUrl}/settings?tab=abonnement&canceled=true`
    );

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Checkout error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Fehler beim Erstellen der Checkout-Session' },
      { status: 500 }
    );
  }
}
