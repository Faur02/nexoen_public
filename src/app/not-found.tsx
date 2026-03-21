import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: 'var(--nexo-bg, #F9FAFB)' }}
    >
      <div className="text-center max-w-md">
        <p
          className="font-heading text-8xl font-bold mb-6"
          style={{ color: 'var(--nexo-cta, #1D7874)', lineHeight: 1 }}
        >
          404
        </p>
        <h1
          className="font-heading text-2xl mb-3"
          style={{ color: 'var(--nexo-text-primary, #1F2937)', fontWeight: 400 }}
        >
          Seite nicht gefunden
        </h1>
        <p
          className="font-body text-base mb-8"
          style={{ color: 'var(--nexo-text-secondary, #6B7280)', lineHeight: '1.6' }}
        >
          Die gesuchte Seite existiert nicht oder wurde verschoben.
        </p>
        <Link
          href="/"
          className="font-body font-medium text-white px-8 py-3 inline-block"
          style={{
            backgroundColor: 'var(--nexo-cta, #1D7874)',
            borderRadius: '4px',
            fontSize: '16px',
            textDecoration: 'none',
          }}
        >
          Zur Startseite
        </Link>
      </div>
    </div>
  );
}
