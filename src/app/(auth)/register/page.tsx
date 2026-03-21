'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { NexoenLogo } from '@/components/layout/nexoen-logo';
import { sendAnalyticsEvent } from '@/lib/analytics';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      return;
    }

    if (password.length < 8) {
      setError('Passwort muss mindestens 8 Zeichen lang sein');
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError('Registrierung fehlgeschlagen. Bitte prüfen Sie Ihre Eingaben und versuchen Sie es erneut.');
      setLoading(false);
      return;
    }

    sendAnalyticsEvent('sign_up', { method: 'email' });
    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <>
        <div className="flex justify-center">
          <NexoenLogo large />
        </div>
        <Card style={{ borderRadius: '4px', boxShadow: 'var(--nexo-card-shadow)' }}>
          <CardHeader className="text-center">
            <CardTitle className="font-heading text-2xl" style={{ fontWeight: 400, color: 'var(--nexo-text-primary)' }}>
              Registrierung erfolgreich
            </CardTitle>
            <CardDescription>
              Wir haben Ihnen eine Bestätigungs-E-Mail an <strong>{email}</strong> gesendet.
              Bitte klicken Sie auf den Link in der E-Mail, um Ihr Konto zu aktivieren.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Link href="/login">
              <Button
                variant="link"
                style={{ color: 'var(--nexo-cta)' }}
              >
                Zurück zum Login
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </>
    );
  }

  return (
    <>
      <div className="flex justify-center">
        <NexoenLogo large />
      </div>

      <Card style={{ borderRadius: '4px', boxShadow: 'var(--nexo-card-shadow)' }}>
        <CardHeader className="text-center">
          <CardTitle className="font-heading text-2xl" style={{ fontWeight: 400, color: 'var(--nexo-text-primary)' }}>
            Konto erstellen
          </CardTitle>
          <CardDescription className="font-body">
            Starte deine persönliche Nebenkosten-Analyse.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <Alert variant="destructive" style={{ borderRadius: '4px' }}>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Max Mustermann"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ borderRadius: '4px' }}
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="ihre@email.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ borderRadius: '4px' }}
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mindestens 8 Zeichen"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ borderRadius: '4px' }}
                className="h-11"
                required
              />
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
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-16" style={{ paddingTop: '8px' }}>
              <Button
                type="submit"
                className="w-full sm:w-auto h-11 px-8"
                style={{ backgroundColor: 'var(--nexo-cta)', borderRadius: '4px' }}
                disabled={loading}
              >
                {loading ? 'Wird registriert...' : 'Registrieren'}
              </Button>

              <Link
                href="/?step=3"
                className="font-heading"
                style={{
                  fontSize: '16px',
                  color: 'var(--nexo-cta)',
                  fontWeight: 400,
                  letterSpacing: '0.02em',
                  opacity: 0.7,
                  transition: 'opacity 0.2s ease',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
              >
                &larr; Zurück
              </Link>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-3 justify-center">
          <p className="text-xs text-center text-muted-foreground px-4">
            Mit der Registrierung akzeptieren Sie unsere{' '}
            <Link href="/agb" className="underline hover:no-underline" style={{ color: 'var(--nexo-cta)' }}>
              AGB
            </Link>{' '}
            und bestätigen, dass Sie unsere{' '}
            <Link href="/datenschutz" className="underline hover:no-underline" style={{ color: 'var(--nexo-cta)' }}>
              Datenschutzerklärung
            </Link>{' '}
            gelesen haben.
          </p>
          <p className="text-sm text-muted-foreground">
            Schon ein Konto?{' '}
            <Link href="/login" className="hover:underline font-medium" style={{ color: 'var(--nexo-text-primary)' }}>
              Anmelden
            </Link>
          </p>
        </CardFooter>
      </Card>
    </>
  );
}
