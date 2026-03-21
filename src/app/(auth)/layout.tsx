import Link from 'next/link';
import { LegalFooter } from '@/components/layout/legal-footer';
import { NexoenLogo } from '@/components/layout/nexoen-logo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header — white bar */}
      <header
        style={{
          backgroundColor: 'var(--nexo-card-bg)',
          borderBottom: '1px solid var(--nexo-border)',
          padding: '16px 32px',
        }}
      >
        <Link href="/"><NexoenLogo /></Link>
      </header>

      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 animate-fade-in-up">
          {children}
        </div>
      </div>

      <LegalFooter />
    </div>
  );
}
