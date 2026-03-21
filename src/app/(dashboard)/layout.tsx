import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardNav } from '@/components/layout/dashboard-nav';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { Profile } from '@/types/database';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single() as { data: Profile | null };

  return (
    <div className="min-h-screen bg-nexo-lavender dark:bg-background">
      <DashboardHeader user={user} profile={profile} />
      <div className="flex">
        <DashboardNav subscription={profile?.subscription_tier || 'trial'} />
        <main className="flex-1 min-h-[calc(100vh-4rem)] bg-nexo-lavender dark:bg-background p-6 pb-20 lg:p-10 lg:pb-10 overflow-x-hidden min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
