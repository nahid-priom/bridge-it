import type { MetadataRoute } from 'next';
import { buildSitemapEntries } from '@/lib/seo/sitemap-entries';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemapEntries();
}
