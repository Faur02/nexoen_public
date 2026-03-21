'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { NotificationPreferences, SubscriptionTier } from '@/types/database';
import { hasAccess } from '@/lib/config/tiers';
import { updateNotificationPreferences } from '@/lib/actions/notifications';
import { updateEmailReminderSettings } from '@/lib/actions/profile';

interface NotificationsTabProps {
  preferences: NotificationPreferences;
  subscriptionTier: SubscriptionTier;
  emailRemindersEnabled: boolean;
}

interface NotificationToggle {
  key: keyof Pick<NotificationPreferences, 'consumption_alerts' | 'monthly_summary' | 'nachzahlung_warning' | 'product_updates'>;
  label: string;
  description: string;
  gated: boolean;
}

const toggles: NotificationToggle[] = [
  {
    key: 'consumption_alerts',
    label: 'Verbrauchswarnungen',
    description: 'Erhalten Sie eine Warnung, wenn Ihr Verbrauch ungewöhnlich hoch ist',
    gated: true,
  },
  {
    key: 'monthly_summary',
    label: 'Monatliche Zusammenfassung',
    description: 'Erhalten Sie eine monatliche Übersicht Ihrer Verbräuche per E-Mail',
    gated: true,
  },
  {
    key: 'nachzahlung_warning',
    label: 'Nachzahlungs-Warnung',
    description: 'Warnung bei drohender Nachzahlung basierend auf Ihrem Abschlag',
    gated: true,
  },
  {
    key: 'product_updates',
    label: 'Produkt-Updates',
    description: 'Neuigkeiten über neue Funktionen und Verbesserungen',
    gated: false,
  },
];

export function NotificationsTab({ preferences, subscriptionTier, emailRemindersEnabled }: NotificationsTabProps) {
  const [prefs, setPrefs] = useState(preferences);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [remindersEnabled, setRemindersEnabled] = useState(emailRemindersEnabled);
  const [savingReminders, setSavingReminders] = useState(false);

  const handleToggle = async (key: NotificationToggle['key'], value: boolean) => {
    setSaving(key);
    setError(null);
    const previousPrefs = { ...prefs };
    setPrefs({ ...prefs, [key]: value });

    try {
      await updateNotificationPreferences({ [key]: value });
    } catch (err) {
      setPrefs(previousPrefs);
      setError(err instanceof Error ? err.message : 'Einstellung konnte nicht gespeichert werden');
    } finally {
      setSaving(null);
    }
  };

  const handleRemindersToggle = async (value: boolean) => {
    setSavingReminders(true);
    setError(null);
    const previous = remindersEnabled;
    setRemindersEnabled(value);
    try {
      await updateEmailReminderSettings(value);
    } catch (err) {
      setRemindersEnabled(previous);
      setError(err instanceof Error ? err.message : 'Einstellung konnte nicht gespeichert werden');
    } finally {
      setSavingReminders(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Monthly reading reminders — available to all users */}
      <Card style={{ borderRadius: '4px', boxShadow: 'var(--nexo-card-shadow)' }}>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 400, color: 'var(--nexo-text-primary)' }}>Monatliche Erinnerungen</CardTitle>
          <CardDescription className="font-body">
            nexoen erinnert dich am 1. eines Monats per E-Mail, deine Zählerstände einzutragen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" style={{ borderRadius: '4px', marginBottom: '16px' }}>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <Label htmlFor="email_reminders" className="text-sm font-medium" style={{ color: 'var(--nexo-text-primary)' }}>
                Ablesungs-Erinnerungen aktivieren
              </Label>
              <p className="text-xs mt-0.5" style={{ color: 'var(--nexo-text-muted)' }}>
                E-Mail am 1. des Monats mit Erinnerung zur Ablesung und aktuellem Prognosestand
              </p>
            </div>
            <Switch
              id="email_reminders"
              checked={remindersEnabled}
              onCheckedChange={handleRemindersToggle}
              disabled={savingReminders}
            />
          </div>
        </CardContent>
      </Card>

      {/* Advanced notifications — tier gated */}
      <Card style={{ borderRadius: '4px', boxShadow: 'var(--nexo-card-shadow)' }}>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 400, color: 'var(--nexo-text-primary)' }}>Erweiterte Benachrichtigungen</CardTitle>
          <CardDescription className="font-body">
            Verwalten Sie Ihre E-Mail-Benachrichtigungen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {toggles.map((toggle) => {
              const isLocked = toggle.gated && !hasAccess(subscriptionTier);

              return (
                <div key={toggle.key} className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor={toggle.key}
                        className="text-sm font-medium"
                        style={{ color: isLocked ? 'var(--nexo-text-muted)' : 'var(--nexo-text-primary)' }}
                      >
                        {toggle.label}
                      </Label>
                      {isLocked && (
                        <span
                          className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded"
                          style={{ backgroundColor: 'var(--nexo-cta)', color: '#FFFFFF' }}
                        >
                          Abo erforderlich
                        </span>
                      )}
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--nexo-text-muted)' }}>
                      {toggle.description}
                    </p>
                  </div>
                  <Switch
                    id={toggle.key}
                    checked={prefs[toggle.key]}
                    onCheckedChange={(value) => handleToggle(toggle.key, value)}
                    disabled={isLocked || saving === toggle.key}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
