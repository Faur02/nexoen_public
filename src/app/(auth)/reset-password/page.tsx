'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { NexoenLogo } from '@/components/layout/nexoen-logo';
import { updatePassword } from '@/lib/actions/profile';

const rules = [
  { key: 'length', label: 'Mindestens 8 Zeichen', test: (p: string) => p.length >= 8 },
  { key: 'upper', label: 'Ein Großbuchstabe (A–Z)', test: (p: string) => /[A-Z]/.test(p) },
  { key: 'lower', label: 'Ein Kleinbuchstabe (a–z)', test: (p: string) => /[a-z]/.test(p) },
  { key: 'number', label: 'Eine Zahl (0–9)', test: (p: string) => /[0-9]/.test(p) },
  { key: 'special', label: 'Ein Sonderzeichen (!@#$...)', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ruleResults = useMemo(() => rules.map(r => ({ ...r, passed: r.test(newPassword) })), [newPassword]);
  const allPassed = ruleResults.every(r => r.passed);
  const passedCount = ruleResults.filter(r => r.passed).length;
  const strengthLabel = passedCount <= 1 ? 'Schwach' : passedCount <= 3 ? 'Mittel' : passedCount <= 4 ? 'Stark' : 'Sehr stark';
  const strengthColor = passedCount <= 1 ? 'var(--nexo-nachzahlung-text)' : passedCount <= 3 ? '#E6A65C' : 'var(--nexo-guthaben-text)';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!allPassed) {
      setError('Bitte erfüllen Sie alle Passwort-Anforderungen.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein.');
      return;
    }

    setLoading(true);
    const result = await updatePassword(newPassword);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    router.push('/dashboard');
  };

  return (
    <>
      <div className="flex justify-center">
        <NexoenLogo large />
      </div>

      <Card style={{ borderRadius: '4px', boxShadow: 'var(--nexo-card-shadow)' }}>
        <CardHeader className="text-center">
          <CardTitle className="font-heading text-2xl" style={{ fontWeight: 400, color: 'var(--nexo-text-primary)' }}>
            Neues Passwort
          </CardTitle>
          <CardDescription className="font-body">
            Wählen Sie ein neues Passwort für Ihr Konto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Neues Passwort</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Neues Passwort eingeben"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ borderRadius: '4px' }}
                className="h-11"
                autoComplete="new-password"
                required
                autoFocus
              />

              {newPassword.length > 0 && (
                <div className="space-y-2" style={{ marginTop: '8px' }}>
                  <div className="flex items-center gap-2">
                    <div style={{ height: '4px', borderRadius: '2px', flex: 1, backgroundColor: 'var(--nexo-progress-bg)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(passedCount / rules.length) * 100}%`, backgroundColor: strengthColor, borderRadius: '2px', transition: 'width 0.2s ease, background-color 0.2s ease' }} />
                    </div>
                    <span className="font-body" style={{ fontSize: '12px', color: strengthColor, minWidth: '70px', textAlign: 'right' }}>
                      {strengthLabel}
                    </span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {ruleResults.map((r) => (
                      <li key={r.key} className="font-body" style={{ fontSize: '13px', lineHeight: '22px', color: r.passed ? 'var(--nexo-guthaben-text)' : 'var(--nexo-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '14px', width: '16px', textAlign: 'center' }}>{r.passed ? '✓' : '•'}</span>
                        {r.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Passwort wiederholen"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ borderRadius: '4px' }}
                className="h-11"
                autoComplete="new-password"
                required
              />
              {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                <p className="font-body" style={{ fontSize: '13px', color: 'var(--nexo-nachzahlung-text)', marginTop: '4px' }}>
                  Die Passwörter stimmen nicht überein.
                </p>
              )}
            </div>

            {error && (
              <Alert variant="destructive" style={{ borderRadius: '4px' }}>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-11"
              style={{ backgroundColor: 'var(--nexo-cta)', borderRadius: '4px' }}
              disabled={loading || !allPassed || newPassword !== confirmPassword}
            >
              {loading ? 'Wird gespeichert...' : 'Passwort speichern'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
