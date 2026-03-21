'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { NexoenLogo } from '@/components/layout/nexoen-logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Profile } from '@/types/database';

interface DashboardHeaderProps {
  user: User;
  profile: Profile | null;
}

export function DashboardHeader({ user, profile }: DashboardHeaderProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const initials = profile?.name
    ? profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : user.email?.[0].toUpperCase() || '?';

  return (
    <header className="sticky top-0 z-50 w-full bg-card border-b border-border/40">
      <div className="flex h-16 items-center justify-between px-4 sm:px-8">
        <Link href="/dashboard" className="flex items-center">
          <NexoenLogo />
        </Link>

        <div className="flex items-center gap-3">
          {profile?.subscription_tier === 'active' ? (
            <span className="inline-flex items-center rounded px-3 py-1.5 text-xs font-medium tracking-wide text-white" style={{ backgroundColor: '#0f0f0f' }}>
              Jahresabo
            </span>
          ) : profile?.subscription_tier === 'expired' ? (
            <Link href="/settings?tab=abonnement">
              <Button variant="outline" size="sm" className="px-4 text-xs font-medium">
                Abo aktivieren
              </Button>
            </Link>
          ) : null}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative h-10 w-10 rounded-full bg-nexo-yellow flex items-center justify-center text-nexo-dark font-semibold text-sm transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-nexo-purple">
                {initials}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 rounded shadow-lg border-border/50" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {profile?.name || 'Benutzer'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings">Einstellungen</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                Abmelden
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
