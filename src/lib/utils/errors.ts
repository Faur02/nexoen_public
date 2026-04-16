export function toUserError(error: { code?: string; message: string }): string {
  if (error.code === '23505') return 'Dieser Eintrag existiert bereits.';
  if (error.code === '23503') return 'Ungültige Referenz – verknüpfte Daten fehlen.';
  if (error.code === '42501') return 'Zugriff verweigert.';
  return 'Ein Datenbankfehler ist aufgetreten. Bitte versuchen Sie es erneut.';
}
