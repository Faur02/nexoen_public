import Link from 'next/link';

export function LegalFooter() {
  return (
    <footer
      className="w-full py-4 px-8 flex items-center justify-center gap-6 text-sm"
      style={{
        borderTop: '1px solid var(--nexo-border, #E5E7EB)',
        color: 'var(--nexo-text-secondary, #6B7280)',
      }}
    >
      <Link
        href="/impressum"
        className="hover:underline transition-opacity opacity-70 hover:opacity-100"
        style={{ color: 'inherit' }}
      >
        Impressum
      </Link>
      <span style={{ opacity: 0.3 }}>·</span>
      <Link
        href="/datenschutz"
        className="hover:underline transition-opacity opacity-70 hover:opacity-100"
        style={{ color: 'inherit' }}
      >
        Datenschutz
      </Link>
      <span style={{ opacity: 0.3 }}>·</span>
      <Link
        href="/agb"
        className="hover:underline transition-opacity opacity-70 hover:opacity-100"
        style={{ color: 'inherit' }}
      >
        AGB
      </Link>
    </footer>
  );
}
