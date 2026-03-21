import { MetadataRoute } from 'next';
import { posts } from '@/lib/blog/posts';

const BASE_URL = 'https://nexoen.de';

const DE_MONTHS: Record<string, string> = {
  'Jan': '01', 'Feb': '02', 'März': '03', 'Apr': '04',
  'Mai': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
  'Sep': '09', 'Okt': '10', 'Nov': '11', 'Dez': '12',
};

function parseDeDate(date: string): Date {
  const match = date.match(/(\d+)\.\s+(\w+)\.?\s+(\d{4})/);
  if (!match) return new Date();
  const [, day, month, year] = match;
  const mm = DE_MONTHS[month] ?? '01';
  return new Date(`${year}-${mm}-${day.padStart(2, '0')}`);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const blogPosts: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: parseDeDate(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogPosts,
    {
      url: `${BASE_URL}/impressum`,
      lastModified: new Date('2026-03-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/datenschutz`,
      lastModified: new Date('2026-03-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/agb`,
      lastModified: new Date('2026-03-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
