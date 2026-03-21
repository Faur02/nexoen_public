export function NexoenLogo({ large = false, light = false }: { large?: boolean; light?: boolean }) {
  const fontSize = large ? '1.75rem' : '1.1rem';
  const textColor = light ? '#FFFFFF' : '#0f172a';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        lineHeight: 1,
        fontFamily: 'var(--font-outfit, Outfit, sans-serif)',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        fontSize,
      }}
    >
      <span style={{ color: textColor }}>nexo</span>
      <span style={{ color: '#0d9488' }}>en</span>
    </span>
  );
}
