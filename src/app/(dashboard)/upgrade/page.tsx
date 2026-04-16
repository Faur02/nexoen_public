import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function UpgradePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  redirect('/settings?tab=abonnement');
}
