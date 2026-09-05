import type { MetadataRoute } from 'next';
import { ROUTES } from '@/lib/routes';
import { SITE_URL } from '@/lib/site';
import {
  CANONICAL_ORIGIN,
  STATIC_SITEMAP_ROUTES,
  SOLUTION_DETAIL_PRIORITY,
  SOLUTION_CATEGORY_FILTER_PRIORITY,
} from '@/lib/seo/config';
import { listCategories, listProjectCards } from '@/src/features/ecommerce-showcase/api/projects';
import { listSoftwareProjectCards } from '@/src/features/software-showcase/api/projects';
import { listCreativeMarketingCards } from '@/src/features/creative-marketing-showcase/api/projects';
import { listIndustries } from '@/src/features/catalog/api/industries';
import { industryPath } from '@/src/features/catalog/utils/paths';
import type { CatalogCategoryRoot } from '@/src/features/catalog/types';

function canonicalOrigin(): string {
  try {
    const fromEnv = new URL(SITE_URL).origin;
    if (fromEnv.includes('localhost') || fromEnv.includes('127.0.0.1')) {
      return CANONICAL_ORIGIN;
    }
    return fromEnv.replace('://bridgeitpark.com', '://www.bridgeitpark.com');
  } catch {
    return CANONICAL_ORIGIN;
  }
}

function toAbsoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${canonicalOrigin()}${normalized}`;
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

async function listAllPublishedSoftwareCards() {
  const pageSize = 48;
  let page = 1;
  const items: Awaited<ReturnType<typeof listSoftwareProjectCards>>['items'] = [];
  let total = Infinity;

  while ((page - 1) * pageSize < total) {
    const result = await listSoftwareProjectCards({ page, pageSize });
    total = result.total;
    items.push(...result.items);
    if (result.items.length < pageSize) break;
    page += 1;
  }

  return items;
}

async function listAllPublishedCreativeCards() {
  const pageSize = 48;
  let page = 1;
  const items: Awaited<ReturnType<typeof listCreativeMarketingCards>>['items'] = [];
  let total = Infinity;

  while ((page - 1) * pageSize < total) {
    const result = await listCreativeMarketingCards({ page, pageSize });
    total = result.total;
    items.push(...result.items);
    if (result.items.length < pageSize) break;
    page += 1;
  }

  return items;
}

async function listAllIndustries(root: CatalogCategoryRoot) {
  return listIndustries(root);
}

export async function buildSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const [
    categories,
    projects,
    softwareProjects,
    creativeProjects,
    softwareIndustries,
    websiteIndustries,
    marketingIndustries,
  ] = await Promise.all([
    listCategories(),
    listAllPublishedProjectCards(),
    listAllPublishedSoftwareCards(),
    listAllPublishedCreativeCards(),
    listAllIndustries('software'),
    listAllIndustries('websites'),
    listAllIndustries('marketing'),
  ]);

  const staticEntries = STATIC_SITEMAP_ROUTES.map((route) =>
    entry(route.path, {
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })
  );

  const industryEntries = [
    ...softwareIndustries.map((ind) =>
      entry(industryPath('software', ind.slug), {
        lastModified: ind.updated_at,
        changeFrequency: 'weekly' as const,
        priority: SOLUTION_CATEGORY_FILTER_PRIORITY,
      })
    ),
    ...websiteIndustries.map((ind) =>
      entry(industryPath('websites', ind.slug), {
        lastModified: ind.updated_at,
        changeFrequency: 'weekly' as const,
        priority: SOLUTION_CATEGORY_FILTER_PRIORITY,
      })
    ),
    ...marketingIndustries.map((ind) =>
      entry(industryPath('marketing', ind.slug), {
        lastModified: ind.updated_at,
        changeFrequency: 'weekly' as const,
        priority: SOLUTION_CATEGORY_FILTER_PRIORITY,
      })
    ),
  ];

  // Fallback website industries from ecommerce categories if catalog_industries empty
  const websiteIndustrySlugs = new Set(websiteIndustries.map((i) => i.slug));
  const categoryEntries = categories
    .filter((category) => !websiteIndustrySlugs.has(category.slug))
    .map((category) =>
      entry(ROUTES.websiteIndustry(category.slug), {
        lastModified: category.updated_at,
        changeFrequency: 'weekly',
        priority: SOLUTION_CATEGORY_FILTER_PRIORITY,
      })
    );

  const projectEntries = projects.map((project) =>
    entry(
      project.canonical_path ||
        (project.industry_slug
          ? ROUTES.websiteProduct(project.industry_slug, project.slug)
          : ROUTES.website(project.slug)),
      {
        lastModified: project.updated_at,
        changeFrequency: 'weekly',
        priority: SOLUTION_DETAIL_PRIORITY,
      }
    )
  );

  const softwareEntries = softwareProjects.map((project) =>
    entry(
      project.canonical_path ||
        (project.industry_slug
          ? ROUTES.softwareProduct(project.industry_slug, project.slug)
          : ROUTES.softwareSolution(project.slug)),
      {
        lastModified: project.updated_at,
        changeFrequency: 'weekly',
        priority: SOLUTION_DETAIL_PRIORITY,
      }
    )
  );

  const creativeEntries = creativeProjects.map((project) =>
    entry(
      project.canonical_path ||
        (project.industry_slug
          ? ROUTES.marketingProduct(project.industry_slug, project.slug)
          : ROUTES.marketingShowroom),
      {
        lastModified: project.updated_at,
        changeFrequency: 'weekly',
        priority: SOLUTION_DETAIL_PRIORITY,
      }
    )
  );

  return [
    ...staticEntries,
    ...industryEntries,
    ...categoryEntries,
    ...projectEntries,
    ...softwareEntries,
    ...creativeEntries,
  ];
}
