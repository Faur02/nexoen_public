import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Presse | nexoen',
  description: 'Presseinformationen, Screenshots und Kontakt für Medienanfragen zu nexoen — der deutschen SaaS-App für Nebenkostenabrechnungen.',
  alternates: {
    canonical: 'https://nexoen.de/presse',
  },
  openGraph: {
    title: 'Presse | nexoen',
    description: 'Presseinformationen und Kontakt für Medienanfragen.',
    url: 'https://nexoen.de/presse',
  },
};

export default function PresseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
