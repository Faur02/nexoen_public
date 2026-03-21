import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'nexoen – Nebenkosten im Blick',
    short_name: 'nexoen',
    description: 'Verfolge deine Nebenkosten, Heizkosten und Zählerstände das ganze Jahr. Erkenne frühzeitig ob eine Nachzahlung droht.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1D7874',
    orientation: 'portrait-primary',
    categories: ['utilities', 'finance'],
    lang: 'de',
    dir: 'ltr',
    scope: '/',
    prefer_related_applications: false,
  };
}
