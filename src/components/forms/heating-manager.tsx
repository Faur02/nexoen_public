'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { HelpTooltip } from '@/components/ui/help-tooltip';
import {
  createRoom,
  deleteRoom,
  createRadiator,
  deleteRadiator,
  createBulkRadiatorReadings,
} from '@/lib/actions/heating';
import { RoomWithRadiators } from '@/types/database';

interface HeatingManagerProps {
  meterId: string;
  rooms: RoomWithRadiators[];
}

export function HeatingManager({ meterId, rooms }: HeatingManagerProps) {
  const router = useRouter();
  const [newRoomName, setNewRoomName] = useState('');
  const [newRadiatorName, setNewRadiatorName] = useState<Record<string, string>>({});
  const [readingDate, setReadingDate] = useState(new Date().toISOString().split('T')[0]);
  const [radiatorValues, setRadiatorValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [expandedRooms, setExpandedRooms] = useState<Set<string>>(new Set()); // collapsed by default
  const [confirmDeleteRoom, setConfirmDeleteRoom] = useState<string | null>(null);
  const [confirmDeleteRadiator, setConfirmDeleteRadiator] = useState<string | null>(null);

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await createRoom({ meterId, name: newRoomName.trim() });
      setNewRoomName('');
      setSuccess('Raum hinzugefügt!');
      setTimeout(() => setSuccess(null), 3000);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Hinzufügen');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteRoom(roomId, meterId);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Löschen');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRadiator = async (roomId: string) => {
    const name = newRadiatorName[roomId]?.trim();
    if (!name) return;
    setLoading(true);
    setError(null);
    try {
      await createRadiator({ roomId, name, meterId });
      setNewRadiatorName(prev => ({ ...prev, [roomId]: '' }));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Hinzufügen');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRadiator = async (radiatorId: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteRadiator(radiatorId, meterId);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Löschen');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAllReadings = async () => {
    const readings = Object.entries(radiatorValues)
      .filter(([_, value]) => value.trim() !== '')
      .map(([radiatorId, value]) => ({ radiatorId, value: parseFloat(value) }));
    if (readings.length === 0) {
      setError('Bitte mindestens einen Wert eingeben');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await createBulkRadiatorReadings({ meterId, readingDate, readings });
      setRadiatorValues({});
      setSuccess('Alle Werte gespeichert!');
      setTimeout(() => setSuccess(null), 3000);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern');
    } finally {
      setLoading(false);
    }
  };

  const toggleRoom = (roomId: string) => {
    setExpandedRooms(prev => {
      const next = new Set(prev);
      if (next.has(roomId)) next.delete(roomId);
      else next.add(roomId);
      return next;
    });
  };

  const allRadiators = rooms.flatMap(room =>
    room.radiators.map(rad => ({ ...rad, roomName: room.name }))
  );

  const cardStyle = {
    borderRadius: '4px',
    boxShadow: 'var(--nexo-card-shadow)',
    border: 'none',
  };

  return (
    <div className="space-y-4">
      <ConfirmDialog
        open={confirmDeleteRoom !== null}
        title="Raum löschen?"
        description="Der Raum und alle Heizkörper darin werden unwiderruflich gelöscht."
        confirmLabel="Löschen"
        onConfirm={() => { const id = confirmDeleteRoom!; setConfirmDeleteRoom(null); handleDeleteRoom(id); }}
        onCancel={() => setConfirmDeleteRoom(null)}
      />
      <ConfirmDialog
        open={confirmDeleteRadiator !== null}
        title="Heizkörper löschen?"
        confirmLabel="Löschen"
        onConfirm={() => { const id = confirmDeleteRadiator!; setConfirmDeleteRadiator(null); handleDeleteRadiator(id); }}
        onCancel={() => setConfirmDeleteRadiator(null)}
      />
      {error && (
        <Alert variant="destructive" style={{ borderRadius: '4px' }}>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert style={{ borderRadius: '4px', borderColor: 'var(--nexo-cta)', backgroundColor: 'var(--nexo-guthaben-bg)' }}>
          <AlertDescription style={{ color: 'var(--nexo-cta)' }}>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">

        {/* LEFT: Rooms list + inline add room — shows second on mobile */}
        <div className="order-2 md:order-1 flex flex-col">
          <Card style={cardStyle} className="h-full">
            <CardHeader>
              <CardTitle style={{ fontFamily: 'var(--font-heading)', fontSize: '18px' }}>
                Räume &amp; Heizkörper
              </CardTitle>
              <CardDescription className="font-body">
                {rooms.length} {rooms.length === 1 ? 'Raum' : 'Räume'} · {allRadiators.length} Heizkörper
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Rooms accordion — collapsed by default */}
              {rooms.map((room) => (
                <div
                  key={room.id}
                  style={{ borderRadius: '4px', border: '1px solid var(--nexo-border)', overflow: 'hidden' }}
                >
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    style={{ padding: '11px 14px', transition: 'background-color 0.15s ease' }}
                    onClick={() => toggleRoom(room.id)}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--nexo-hover-bg)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div className="flex items-center gap-2">
                      <svg width="13" height="13" viewBox="0 0 16 16" fill="none"
                        style={{
                          transform: expandedRooms.has(room.id) ? 'rotate(90deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease',
                          flexShrink: 0,
                        }}
                      >
                        <path d="M6 4L10 8L6 12" stroke="var(--nexo-text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span style={{ fontWeight: 600, fontSize: '14px' }}>{room.name}</span>
                      <span style={{ fontSize: '12px', color: 'var(--nexo-text-secondary)' }}>
                        ({room.radiators.length} Hk)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); setConfirmDeleteRoom(room.id); }}
                      disabled={loading}
                      style={{ borderRadius: '4px', color: '#EF4444', fontSize: '12px' }}
                    >
                      Löschen
                    </Button>
                  </div>

                  {expandedRooms.has(room.id) && (
                    <div style={{ borderTop: '1px solid var(--nexo-border)', padding: '12px 14px', backgroundColor: 'var(--nexo-surface)' }} className="space-y-2">
                      {room.radiators.map((radiator) => (
                        <div
                          key={radiator.id}
                          className="flex items-center justify-between"
                          style={{
                            backgroundColor: 'var(--nexo-card-bg)',
                            padding: '9px 12px',
                            borderRadius: '4px',
                            border: '1px solid var(--nexo-border)',
                          }}
                        >
                          <div>
                            <span style={{ fontWeight: 500, fontSize: '13px' }}>{radiator.name}</span>
                            {radiator.readings.length > 0 && (
                              <span style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--nexo-text-secondary)' }}>
                                (Letzter Wert: {radiator.readings[0].value})
                              </span>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setConfirmDeleteRadiator(radiator.id)}
                            disabled={loading}
                            style={{ borderRadius: '4px', color: '#EF4444', fontSize: '12px' }}
                          >
                            Entfernen
                          </Button>
                        </div>
                      ))}
                      <div className="flex gap-2" style={{ paddingTop: '4px' }}>
                        <Input
                          placeholder="Neuer Heizkörper (z.B. Fenster links)"
                          value={newRadiatorName[room.id] || ''}
                          onChange={(e) => setNewRadiatorName(prev => ({ ...prev, [room.id]: e.target.value }))}
                          disabled={loading}
                          style={{ borderRadius: '4px' }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleAddRadiator(room.id)}
                          disabled={loading || !newRadiatorName[room.id]?.trim()}
                          style={{ borderRadius: '4px', borderColor: 'var(--nexo-cta)', color: 'var(--nexo-cta)', whiteSpace: 'nowrap' }}
                        >
                          + Hk
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Inline add room */}
              <div style={rooms.length > 0 ? { borderTop: '1px solid var(--nexo-border)', paddingTop: '12px' } : {}}>
                <form onSubmit={handleAddRoom} className="flex gap-2">
                  <Input
                    placeholder="z.B. Wohnzimmer"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    disabled={loading}
                    style={{ borderRadius: '4px' }}
                  />
                  <Button
                    type="submit"
                    disabled={loading || !newRoomName.trim()}
                    style={{ backgroundColor: 'var(--nexo-cta)', borderRadius: '4px', whiteSpace: 'nowrap' }}
                  >
                    + Raum
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: Werte erfassen — shows first on mobile */}
        <div className="order-1 md:order-2 flex flex-col">
          {allRadiators.length > 0 ? (
            <Card style={cardStyle} className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center" style={{ fontFamily: 'var(--font-heading)', fontSize: '18px' }}>
                  Werte erfassen
                  <HelpTooltip text="Lesen Sie die Werte von jedem Heizkostenverteiler ab und tragen Sie sie hier ein. Die Werte finden Sie auf dem Display des Geräts am Heizkörper." />
                </CardTitle>
                <CardDescription className="font-body">
                  Tragen Sie die aktuellen Werte aller Heizkörper ein
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="readingDate" className="flex items-center">
                    Datum
                    <HelpTooltip text="Das Datum der Ablesung. Alle Werte werden mit diesem Datum gespeichert." />
                  </Label>
                  <Input
                    id="readingDate"
                    type="date"
                    value={readingDate}
                    onChange={(e) => setReadingDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    style={{ borderRadius: '4px' }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-6 sm:gap-y-6">
                  {rooms.map((room) => (
                    room.radiators.length > 0 && (
                      <div key={room.id}>
                        <p className="font-body" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--nexo-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>
                          {room.name}
                        </p>
                        <div className="space-y-3">
                          {room.radiators.map((radiator) => (
                            <div key={radiator.id} className="flex items-center gap-2">
                              <Label style={{ minWidth: '50px', fontSize: '13px', flexShrink: 0 }}>{radiator.name}</Label>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder={radiator.readings.length > 0 ? `${radiator.readings[0].value}` : 'Wert'}
                                value={radiatorValues[radiator.id] || ''}
                                onChange={(e) => setRadiatorValues(prev => ({ ...prev, [radiator.id]: e.target.value }))}
                                style={{ borderRadius: '4px' }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>

                <div style={{ borderTop: '1px solid var(--nexo-border)', paddingTop: '20px' }}>
                  <Button
                    onClick={handleSaveAllReadings}
                    disabled={loading || Object.values(radiatorValues).every(v => !v.trim())}
                    style={{ backgroundColor: 'var(--nexo-cta)', borderRadius: '4px' }}
                  >
                    {loading ? 'Wird gespeichert...' : 'Alle Werte speichern'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div style={{
              backgroundColor: 'var(--nexo-card-bg)',
              borderRadius: '4px',
              boxShadow: 'var(--nexo-card-shadow)',
              padding: '32px 24px',
              textAlign: 'center',
            }}>
              <p className="font-body" style={{ fontSize: '14px', color: 'var(--nexo-text-secondary)' }}>Noch keine Heizkörper angelegt.</p>
              <p className="font-body" style={{ fontSize: '12px', color: 'var(--nexo-text-muted)', marginTop: '4px' }}>
                Fügen Sie links Räume und Heizkörper hinzu.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
