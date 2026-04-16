import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nexoen.de';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/blog', '/blog/', '/impressum', '/datenschutz', '/agb', '/kuendigen', '/widerruf', '/login', '/register', '/forgot-password'],
        disallow: ['/dashboard', '/meters', '/abrechnung', '/reports', '/settings', '/upgrade', '/api/', '/monitoring'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
