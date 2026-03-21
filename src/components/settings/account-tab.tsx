'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DeleteAccountForm } from '@/components/forms/delete-account-form';

interface AccountTabProps {
  userEmail: string;
  createdAt: string;
}

export function AccountTab({ userEmail, createdAt }: AccountTabProps) {
  return (
    <div className="space-y-6">
      <Card style={{ borderRadius: '4px', boxShadow: 'var(--nexo-card-shadow)' }}>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 400, color: 'var(--nexo-text-primary)' }}>Kontoinformationen</CardTitle>
          <CardDescription className="font-body">Allgemeine Informationen zu Ihrem Konto</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-start gap-3">
              <span style={{ color: 'var(--nexo-text-secondary)', flexShrink: 0 }}>E-Mail</span>
              <span className="font-medium text-right break-all" style={{ color: 'var(--nexo-text-primary)' }}>{userEmail}</span>
            </div>
            <div className="flex justify-between items-start gap-3">
              <span style={{ color: 'var(--nexo-text-secondary)', flexShrink: 0 }}>Konto erstellt am</span>
              <span className="font-medium text-right" style={{ color: 'var(--nexo-text-primary)' }}>
                {new Date(createdAt).toLocaleDateString('de-DE')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card style={{ borderRadius: '4px', boxShadow: 'var(--nexo-card-shadow)', borderColor: 'rgba(232, 93, 93, 0.2)' }}>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 400, color: '#dc2626' }}>Konto löschen</CardTitle>
          <CardDescription className="font-body">
            Entfernen Sie Ihr Konto und alle zugehörigen Daten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeleteAccountForm userEmail={userEmail} />
        </CardContent>
      </Card>
    </div>
  );
}
