import Link from 'next/link';
import { LegalFooter } from '@/components/layout/legal-footer';
import { NexoenLogo } from '@/components/layout/nexoen-logo';

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--nexo-bg, #F9FAFB)' }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: 'var(--nexo-card-bg, #FFFFFF)',
          borderBottom: '1px solid var(--nexo-border, #E5E7EB)',
          padding: '16px 32px',
        }}
      >
        <Link href="/"><NexoenLogo /></Link>
      </header>

      {/* Content */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm mb-8 opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: 'var(--nexo-text-primary, #1F2937)', textDecoration: 'none' }}
        >
          ← Zurück zur Startseite
        </Link>
        {children}
      </main>

      <LegalFooter />
    </div>
  );
}
