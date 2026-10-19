import type { MetadataRoute } from 'next';
import { getPortfolio, siteUrl } from '@/lib/data';
import { listPosts } from '@/lib/blog';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ projects, experience }, posts] = await Promise.all([getPortfolio(), listPosts()]);
  const base = siteUrl();
  return [
    { url: base, changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/blog`, changeFrequency: 'weekly', priority: 0.9 },
    ...projects.map((p) => ({ url: `${base}/projects/${p.id}`, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...experience.map((e) => ({ url: `${base}/experience/${e.id}`, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...posts.map((post) => ({ url: `${base}/blog/${post.id}`, changeFrequency: 'weekly' as const, priority: 0.8 })),
  ];
}
