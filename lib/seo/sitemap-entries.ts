import type { MetadataRoute } from 'next';
import { ROUTES, solutionsUrl } from '@/lib/routes';
import { SITE_URL } from '@/lib/site';
import {
  SOLUTION_CATEGORY_FILTER_PRIORITY,
  SOLUTION_DETAIL_PRIORITY,
  STATIC_SITEMAP_ROUTES,
} from '@/lib/seo/config';
import { getActiveCategories } from '@/lib/services/categories.service';
import { getPublishedProductSitemapEntries } from '@/lib/services/products.service';

function toAbsoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL.replace(/\/$/, '')}${normalized}`;
}

function entry(
  path: string,
  options: {
    lastModified?: Date | string;
    changeFrequency?: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority?: number;
  } = {}
): MetadataRoute.Sitemap[number] {
  const lastModified = options.lastModified
    ? new Date(options.lastModified)
    : new Date();

  return {
    url: toAbsoluteUrl(path),
    lastModified,
    changeFrequency: options.changeFrequency ?? 'weekly',
    priority: options.priority ?? 0.7,
  };
}

export async function buildSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([
    getActiveCategories(),
    getPublishedProductSitemapEntries(),
  ]);

  const staticEntries = STATIC_SITEMAP_ROUTES.map((route) =>
    entry(route.path, {
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })
  );

  const categoryFilterEntries = categories.map((category) =>
    entry(solutionsUrl(category.slug), {
      lastModified: category.updated_at,
      changeFrequency: 'weekly',
      priority: SOLUTION_CATEGORY_FILTER_PRIORITY,
    })
  );

  const solutionEntries = products.map((product) =>
    entry(ROUTES.solution(product.slug), {
      lastModified: product.updated_at,
      changeFrequency: 'weekly',
      priority: SOLUTION_DETAIL_PRIORITY,
    })
  );

  return [...staticEntries, ...categoryFilterEntries, ...solutionEntries];
}
