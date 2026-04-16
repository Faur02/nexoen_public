'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReportsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') console.error('Reports error:', error);
  }, [error]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Berichte</h1>
        <p className="text-muted-foreground">
          Erstellen Sie PDF-Berichte Ihrer Energiedaten
        </p>
      </div>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Fehler beim Laden</CardTitle>
          <CardDescription>
            Die Berichtsdaten konnten nicht geladen werden.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {error.message || 'Bitte versuchen Sie es erneut.'}
          </p>
          <Button onClick={reset}>
            Erneut versuchen
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
