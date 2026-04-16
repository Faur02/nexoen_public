'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-destructive">Fehler aufgetreten</CardTitle>
          <CardDescription>
            Es ist ein unerwarteter Fehler aufgetreten.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {error.message || 'Ein unbekannter Fehler ist aufgetreten.'}
          </p>
          <div className="flex gap-2">
            <Button onClick={reset} variant="default">
              Erneut versuchen
            </Button>
            <Button onClick={() => window.location.href = '/dashboard'} variant="outline">
              Zum Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
