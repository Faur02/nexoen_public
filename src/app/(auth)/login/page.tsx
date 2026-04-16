'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { NexoenLogo } from '@/components/layout/nexoen-logo';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const raw = searchParams.get('redirect') || '/dashboard';
  // Reject anything that isn't a plain relative path (blocks //, /\, data:, javascript:, etc.)
  const redirect = /^\/[^/\\]/.test(raw) || raw === '/dashboard' ? raw : '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [magicLinkMode, setMagicLinkMode] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('E-Mail oder Passwort ist falsch.');
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    });

    if (error) {
      setError('Fehler beim Senden des Links. Bitte versuchen Sie es erneut.');
      setLoading(false);
      return;
    }

    setMagicLinkSent(true);
    setLoading(false);
  };

  if (magicLinkSent) {
    return (
      <>
        <div className="flex justify-center">
          <NexoenLogo large />
        </div>
        <Card style={{ borderRadius: '4px', boxShadow: 'var(--nexo-card-shadow)' }}>
          <CardHeader className="text-center">
            <CardTitle className="font-heading text-2xl" style={{ fontWeight: 400, color: 'var(--nexo-text-primary)' }}>
              E-Mail gesendet
            </CardTitle>
            <CardDescription>
              Wir haben Ihnen einen Login-Link an <strong>{email}</strong> gesendet.
              Bitte überprüfen Sie Ihren Posteingang.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button
              variant="link"
              onClick={() => { setMagicLinkSent(false); setMagicLinkMode(false); }}
              style={{ color: 'var(--nexo-cta)' }}
            >
              Zurück zum Login
            </Button>
          </CardFooter>
        </Card>
      </>
    );
  }

  if (magicLinkMode) {
    return (
      <>
        <div className="flex justify-center">
          <NexoenLogo large />
        </div>

        <Card style={{ borderRadius: '4px', boxShadow: 'var(--nexo-card-shadow)' }}>
          <CardHeader className="text-center">
            <CardTitle className="font-heading text-2xl" style={{ fontWeight: 400, color: 'var(--nexo-text-primary)' }}>
              Magic Link
            </CardTitle>
            <CardDescription className="font-body">
              Wir senden Ihnen einen einmaligen Login-Link per E-Mail.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleMagicLink} className="space-y-4">
              {error && (
                <Alert variant="destructive" style={{ borderRadius: '4px' }}>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

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
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11"
                style={{ backgroundColor: 'var(--nexo-cta)', borderRadius: '4px' }}
                disabled={loading}
              >
                {loading ? 'Wird gesendet...' : 'Link senden'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <Button
              variant="link"
              onClick={() => { setMagicLinkMode(false); setError(null); }}
              style={{ color: 'var(--nexo-cta)' }}
            >
              Mit Passwort anmelden
            </Button>
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
            Anmelden
          </CardTitle>
          <CardDescription className="font-body">
            Melden Sie sich bei Ihrem Konto an
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive" style={{ borderRadius: '4px' }}>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Passwort</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm hover:underline"
                  style={{ color: 'var(--nexo-cta)' }}
                >
                  Passwort vergessen?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ borderRadius: '4px' }}
                className="h-11"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11"
              style={{ backgroundColor: 'var(--nexo-cta)', borderRadius: '4px' }}
              disabled={loading}
            >
              {loading ? 'Wird angemeldet...' : 'Anmelden'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-card px-2 text-muted-foreground">oder</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-11"
            style={{ borderRadius: '4px' }}
            onClick={() => { setMagicLinkMode(true); setError(null); }}
            disabled={loading}
          >
            Magic Link per E-Mail senden
          </Button>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Noch kein Konto?{' '}
            <Link href="/register" className="hover:underline font-medium" style={{ color: 'var(--nexo-text-primary)' }}>
              Jetzt registrieren
            </Link>
          </p>
        </CardFooter>
      </Card>
    </>
  );
}

function LoginLoading() {
  return (
    <>
      <div className="flex justify-center">
        <NexoenLogo large />
      </div>
      <Card style={{ borderRadius: '4px', boxShadow: 'var(--nexo-card-shadow)' }}>
        <CardHeader className="text-center">
          <CardTitle className="font-heading text-2xl" style={{ fontWeight: 400, color: 'var(--nexo-text-primary)' }}>
            Anmelden
          </CardTitle>
          <CardDescription>Laden...</CardDescription>
        </CardHeader>
      </Card>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  );
}
