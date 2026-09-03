import type { MetadataRoute } from 'next';
import { ROUTES } from '@/lib/routes';
import { STATIC_SITEMAP_ROUTES } from '@/lib/seo/config';
import { listCategories, listProjectCards } from '@/src/features/ecommerce-showcase/api/projects';

const CANONICAL_ORIGIN = 'https://www.bridgeitpark.com';

function toAbsoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${CANONICAL_ORIGIN}${normalized}`;
}

function entry(
  path: string,
  options: {
    lastModified?: Date | string;
    changeFrequency?: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority?: number;
  } = {}
): MetadataRoute.Sitemap[number] {
  const lastModified = options.lastModified ? new Date(options.lastModified) : new Date();
  return {
    url: toAbsoluteUrl(path),
    lastModified,
    changeFrequency: options.changeFrequency ?? 'weekly',
    priority: options.priority ?? 0.7,
  };
}

async function listAllPublishedProjectCards() {
  const pageSize = 100;
  let offset = 0;
  const items: Awaited<ReturnType<typeof listProjectCards>>['items'] = [];
  let total = Infinity;

  while (offset < total) {
    const result = await listProjectCards({ limit: pageSize, offset });
    total = result.total;
    items.push(...result.items);
    if (result.items.length < pageSize) break;
    offset += pageSize;
  }

  return items;
}

export async function buildSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const [categories, projects] = await Promise.all([listCategories(), listAllPublishedProjectCards()]);

  const staticEntries = STATIC_SITEMAP_ROUTES.map((route) =>
    entry(route.path, {
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })
  );

  const categoryEntries = categories.map((category) =>
    entry(ROUTES.ecommerceCategory(category.slug), {
      lastModified: category.updated_at,
      changeFrequency: 'weekly',
      priority: 0.88,
    })
  );

  const projectEntries = projects.map((project) =>
    entry(ROUTES.website(project.slug), {
      lastModified: project.updated_at,
      changeFrequency: 'weekly',
      priority: 0.9,
    })
  );

  return [...staticEntries, ...categoryEntries, ...projectEntries];
}
