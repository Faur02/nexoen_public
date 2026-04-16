'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SubscriptionTier } from '@/types/database';
import { hasAccess } from '@/lib/config/tiers';

interface NavItem {
  title: string;
  href: string;
  proOnly?: boolean;
  icon: React.ReactNode;
}

const iconSize = 20;
const iconStroke = 1.8;
const subIconSize = 18;
const subIconStroke = 1.7;

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={iconStroke} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
  },
  {
    title: 'Zähler',
    href: '/meters',
    icon: (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={iconStroke} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
        <path d="M12 2v10l7.07 7.07" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: 'Abrechnung',
    href: '/abrechnung',
    icon: (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={iconStroke} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
        <path d="M8 7h8" />
        <path d="M8 11h8" />
        <path d="M8 15h5" />
      </svg>
    ),
  },
  {
    title: 'Anleitung',
    href: '/anleitung',
    icon: (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={iconStroke} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    title: 'Berichte',
    href: '/reports',
    proOnly: true,
    icon: (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={iconStroke} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    ),
  },
  {
    title: 'Einstellungen',
    href: '/settings',
    icon: (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={iconStroke} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

interface SettingsSubItem {
  value: string;
  label: string;
  icon: React.ReactNode;
}

const settingsSubItems: SettingsSubItem[] = [
  {
    value: 'profil',
    label: 'Profil',
    icon: (
      <svg width={subIconSize} height={subIconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={subIconStroke} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    value: 'sicherheit',
    label: 'Sicherheit',
    icon: (
      <svg width={subIconSize} height={subIconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={subIconStroke} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    value: 'erscheinungsbild',
    label: 'Erscheinungsbild',
    icon: (
      <svg width={subIconSize} height={subIconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={subIconStroke} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r="1.5" />
        <circle cx="17.5" cy="10.5" r="1.5" />
        <circle cx="8.5" cy="7.5" r="1.5" />
        <circle cx="6.5" cy="12.5" r="1.5" />
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
      </svg>
    ),
  },
  {
    value: 'benachrichtigungen',
    label: 'Benachrichtigungen',
    icon: (
      <svg width={subIconSize} height={subIconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={subIconStroke} strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  {
    value: 'abonnement',
    label: 'Abonnement',
    icon: (
      <svg width={subIconSize} height={subIconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={subIconStroke} strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    value: 'daten-export',
    label: 'Daten & Export',
    icon: (
      <svg width={subIconSize} height={subIconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={subIconStroke} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
  },
  {
    value: 'konto',
    label: 'Konto',
    icon: (
      <svg width={subIconSize} height={subIconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={subIconStroke} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    ),
  },
];

interface DashboardNavProps {
  subscription: SubscriptionTier;
}

function DashboardNavInner({ subscription }: DashboardNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isOnSettings = pathname === '/settings' || pathname.startsWith('/settings/');
  const currentSettingsTab = searchParams.get('tab') || 'profil';

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden lg:flex flex-col w-60 min-h-[calc(100vh-4rem)] pt-8 pl-6 pr-4 bg-card border-r border-border/40">
        <div className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const isLocked = item.proOnly && !hasAccess(subscription);

            return (
              <div key={item.href}>
                <Link
                  href={isLocked ? '/settings?tab=abonnement' : item.href}
                  className={cn(
                    'flex items-center gap-3 py-2 text-lg transition-all duration-200',
                    isActive ? 'font-bold' : 'opacity-60 hover:opacity-100',
                    isLocked && 'opacity-50'
                  )}
                  style={{ color: 'var(--nexo-text-primary)' }}
                >
                  {item.icon}
                  {item.title}
                </Link>
                {/* Settings sub-navigation */}
                {item.href === '/settings' && isOnSettings && (
                  <div className="ml-3 mt-1 mb-1 pl-4 border-l-2 space-y-0.5" style={{ borderColor: 'var(--nexo-border)' }}>
                    {settingsSubItems.map((sub) => {
                      const isSubActive = currentSettingsTab === sub.value;
                      const href = sub.value === 'profil' ? '/settings' : `/settings?tab=${sub.value}`;
                      return (
                        <Link
                          key={sub.value}
                          href={href}
                          className={cn(
                            'flex items-center gap-2.5 py-1.5 text-sm transition-all duration-200 rounded-[4px] px-2',
                            isSubActive
                              ? 'font-semibold shadow-sm'
                              : 'opacity-60 hover:opacity-100'
                          )}
                          style={{
                            color: 'var(--nexo-text-primary)',
                            backgroundColor: isSubActive ? 'var(--nexo-card-bg)' : undefined,
                          }}
                        >
                          {sub.icon}
                          {sub.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legal links — bottom of sidebar */}
        <div className="pb-6 pt-4 flex flex-col gap-1">
          <Link href="/impressum" className="font-body text-xs transition-opacity opacity-40 hover:opacity-70" style={{ color: 'var(--nexo-text-primary)' }}>Impressum</Link>
          <Link href="/datenschutz" className="font-body text-xs transition-opacity opacity-40 hover:opacity-70" style={{ color: 'var(--nexo-text-primary)' }}>Datenschutz</Link>
          <Link href="/agb" className="font-body text-xs transition-opacity opacity-40 hover:opacity-70" style={{ color: 'var(--nexo-text-primary)' }}>AGB</Link>
        </div>
      </nav>

      {/* Mobile bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex lg:hidden h-16 bg-card border-t border-border/40">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const isLocked = item.proOnly && !hasAccess(subscription);

          return (
            <Link
              key={item.href}
              href={isLocked ? '/settings?tab=abonnement' : item.href}
              className="flex-1 flex flex-col items-center justify-center gap-1 transition-colors duration-200"
              style={{ color: isActive ? 'var(--nexo-cta)' : 'var(--nexo-text-secondary)' }}
            >
              {item.icon}
              <span className="text-[10px] sm:text-[11px] font-medium leading-none truncate max-w-full px-0.5">{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export function DashboardNav({ subscription }: DashboardNavProps) {
  return (
    <Suspense fallback={null}>
      <DashboardNavInner subscription={subscription} />
    </Suspense>
  );
}
