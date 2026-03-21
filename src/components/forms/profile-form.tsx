'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { updateProfile } from '@/lib/actions/profile';

interface ProfileFormProps {
  userId: string;
  currentName: string;
}

export function ProfileForm({ userId, currentName }: ProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(currentName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateProfile(userId, { name: name.trim() || null });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>Profil erfolgreich aktualisiert!</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Ihr Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={loading} style={{ backgroundColor: 'var(--nexo-cta)', borderRadius: '4px' }}>
        {loading ? 'Wird gespeichert...' : 'Speichern'}
      </Button>
    </form>
  );
}
