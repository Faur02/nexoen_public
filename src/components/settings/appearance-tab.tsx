'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import * as Sentry from '@sentry/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { updateThemePreference } from '@/lib/actions/profile';
import { ThemePreference } from '@/types/database';

const themes: { value: ThemePreference; label: string; description: string }[] = [
  { value: 'light', label: 'Hell', description: 'Helles Erscheinungsbild' },
  { value: 'dark', label: 'Dunkel', description: 'Dunkles Erscheinungsbild' },
  { value: 'system', label: 'System', description: 'Automatisch basierend auf Systemeinstellung' },
];

export function AppearanceTab() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = async (newTheme: ThemePreference) => {
    setTheme(newTheme);
    try {
      await updateThemePreference(newTheme);
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <Card style={{ borderRadius: '4px', boxShadow: 'var(--nexo-card-shadow)' }}>
      <CardHeader>
        <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 400, color: 'var(--nexo-text-primary)' }}>Erscheinungsbild</CardTitle>
        <CardDescription className="font-body">
          Wählen Sie Ihr bevorzugtes Farbschema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {themes.map((t) => {
            const isActive = theme === t.value;
            return (
              <button
                key={t.value}
                onClick={() => handleThemeChange(t.value)}
                className="text-left rounded border-2 p-4 transition-all"
                style={{
                  borderColor: isActive ? 'var(--nexo-cta)' : 'var(--nexo-border)',
                  backgroundColor: isActive ? 'color-mix(in srgb, var(--nexo-cta) 5%, transparent)' : 'transparent',
                }}
              >
                {/* Theme preview */}
                <div
                  className="mb-3 rounded border overflow-hidden h-20"
                  style={{
                    backgroundColor: t.value === 'dark' ? '#1a1725' : t.value === 'light' ? '#F7F6FB' : undefined,
                    background: t.value === 'system'
                      ? 'linear-gradient(135deg, #F7F6FB 50%, #1a1725 50%)'
                      : undefined,
                  }}
                >
                  <div className="p-2 h-full flex flex-col gap-1">
                    <div
                      className="h-2 w-8 rounded-sm"
                      style={{ backgroundColor: t.value === 'dark' ? '#e8e4ef' : '#2d2a3e', opacity: 0.6 }}
                    />
                    <div
                      className="h-1.5 w-12 rounded-sm"
                      style={{ backgroundColor: t.value === 'dark' ? '#e8e4ef' : '#2d2a3e', opacity: 0.3 }}
                    />
                    <div className="flex gap-1 mt-auto">
                      <div
                        className="h-3 w-6 rounded-sm"
                        style={{ backgroundColor: t.value === 'dark' ? '#252237' : '#ffffff' }}
                      />
                      <div
                        className="h-3 w-6 rounded-sm"
                        style={{ backgroundColor: t.value === 'dark' ? '#252237' : '#ffffff' }}
                      />
                    </div>
                  </div>
                </div>
                <p className="font-medium text-sm" style={{ color: 'var(--nexo-text-primary)' }}>
                  {t.label}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--nexo-text-secondary)' }}>
                  {t.description}
                </p>
                {isActive && (
                  <div className="mt-2 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" style={{ color: 'var(--nexo-cta)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs font-medium" style={{ color: 'var(--nexo-cta)' }}>Aktiv</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
