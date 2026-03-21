import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createBillingPortalSession } from '@/lib/stripe/server';

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (!profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'Kein Stripe-Konto gefunden' },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const session = await createBillingPortalSession(
      profile.stripe_customer_id,
      `${appUrl}/settings?tab=abonnement`
    );

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Billing portal error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Fehler beim Erstellen der Billing-Portal-Session' },
      { status: 500 }
    );
  }
}
