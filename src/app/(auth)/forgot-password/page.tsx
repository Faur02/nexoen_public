'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { NexoenLogo } from '@/components/layout/nexoen-logo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

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
              E-Mail gesendet
            </CardTitle>
            <CardDescription>
              Wir haben Ihnen einen Link zum Zurücksetzen Ihres Passworts an{' '}
              <strong>{email}</strong> gesendet.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Link href="/login">
              <Button variant="link" style={{ color: 'var(--nexo-cta)' }}>
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
            Passwort zurücksetzen
          </CardTitle>
          <CardDescription className="font-body">
            Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum
            Zurücksetzen Ihres Passworts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleReset} className="space-y-4">
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
          <Link href="/login">
            <Button variant="link" style={{ color: 'var(--nexo-cta)' }}>
              Zurück zum Login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </>
  );
}
