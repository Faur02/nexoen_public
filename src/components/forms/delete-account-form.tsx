'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { deleteAccount } from '@/lib/actions/profile';

interface DeleteAccountFormProps {
  userEmail: string;
}

export function DeleteAccountForm({ userEmail }: DeleteAccountFormProps) {
  const router = useRouter();
  const [confirmEmail, setConfirmEmail] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (confirmEmail !== userEmail) {
      setError('Die E-Mail-Adresse stimmt nicht überein');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await deleteAccount();
      router.push('/login?deleted=true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      setLoading(false);
    }
  };

  if (!showConfirm) {
    return (
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          Wenn Sie Ihr Konto löschen, werden alle Ihre Daten (Zähler, Zählerstände, Tarife)
          unwiderruflich entfernt. Diese Aktion kann nicht rückgängig gemacht werden.
        </p>
        <Button
          variant="outline"
          onClick={() => setShowConfirm(true)}
          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
        >
          Konto löschen
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Alert variant="destructive">
        <AlertDescription>
          <strong>Achtung:</strong> Diese Aktion kann nicht rückgängig gemacht werden.
          Alle Ihre Daten werden dauerhaft gelöscht.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="confirmEmail">
          Geben Sie Ihre E-Mail-Adresse ein um zu bestätigen: <strong>{userEmail}</strong>
        </Label>
        <Input
          id="confirmEmail"
          type="email"
          placeholder={userEmail}
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={loading || confirmEmail !== userEmail}
        >
          {loading ? 'Wird gelöscht...' : 'Endgültig löschen'}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setShowConfirm(false);
            setConfirmEmail('');
            setError(null);
          }}
          disabled={loading}
        >
          Abbrechen
        </Button>
      </div>
    </div>
  );
}
