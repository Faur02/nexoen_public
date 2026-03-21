'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PasswordForm } from '@/components/forms/password-form';

export function SecurityTab() {
  return (
    <Card style={{ borderRadius: '4px', boxShadow: 'var(--nexo-card-shadow)' }}>
      <CardHeader>
        <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 400, color: 'var(--nexo-text-primary)' }}>Passwort ändern</CardTitle>
        <CardDescription className="font-body">Aktualisieren Sie Ihr Passwort</CardDescription>
      </CardHeader>
      <CardContent>
        <PasswordForm />
      </CardContent>
    </Card>
  );
}
