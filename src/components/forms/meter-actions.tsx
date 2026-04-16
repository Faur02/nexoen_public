'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteMeter } from '@/lib/actions/meters';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Meter } from '@/types/database';

interface MeterActionsProps {
  meter: Meter;
}

export function MeterActions({ meter }: MeterActionsProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      await deleteMeter(meter.id);
      router.push('/meters');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Löschen des Zählers');
      setDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <ConfirmDialog
        open={confirmOpen}
        title={`Zähler "${meter.name}" löschen?`}
        description="Alle Zählerstände und Tarife werden ebenfalls gelöscht."
        confirmLabel="Löschen"
        onConfirm={() => { setConfirmOpen(false); handleDelete(); }}
        onCancel={() => setConfirmOpen(false)}
      />
      {error && (
        <Alert variant="destructive" style={{ borderRadius: '4px', padding: '8px 12px' }}>
          <AlertDescription style={{ fontSize: '13px' }}>{error}</AlertDescription>
        </Alert>
      )}
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={deleting} style={{ borderRadius: '4px' }}>
          {deleting ? 'Wird gelöscht...' : 'Aktionen'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="text-red-600"
          onClick={() => setConfirmOpen(true)}
        >
          Zähler löschen
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  );
}
