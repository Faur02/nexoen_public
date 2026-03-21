import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog – Nebenkosten & Heizkosten einfach verstehen | nexoen',
  description: 'Tipps, Checklisten und Erklärungen rund um Nebenkostenabrechnung, Heizkosten und Mietrecht. Für Mieter in Deutschland – damit dich keine Nachzahlung überrascht.',
  alternates: {
    canonical: 'https://nexoen.de/blog',
  },
  openGraph: {
    title: 'Blog – Nebenkosten & Heizkosten einfach verstehen | nexoen',
    description: 'Tipps, Checklisten und Erklärungen rund um Nebenkostenabrechnung, Heizkosten und Mietrecht. Für Mieter in Deutschland.',
    type: 'website',
    locale: 'de_DE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog – Nebenkosten & Heizkosten einfach verstehen | nexoen',
    description: 'Tipps, Checklisten und Erklärungen rund um Nebenkostenabrechnung, Heizkosten und Mietrecht.',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
