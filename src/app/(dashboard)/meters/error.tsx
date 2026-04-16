'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function MetersError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') console.error('Meters error:', error);
  }, [error]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Zähler</h1>
        <p className="text-muted-foreground">
          Verwalten Sie Ihre Energiezähler
        </p>
      </div>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Fehler beim Laden</CardTitle>
          <CardDescription>
            Die Zählerdaten konnten nicht geladen werden.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {error.message || 'Bitte versuchen Sie es erneut.'}
          </p>
          <div className="flex gap-2">
            <Button onClick={reset}>
              Erneut versuchen
            </Button>
            <Link href="/dashboard">
              <Button variant="outline">
                Zum Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
