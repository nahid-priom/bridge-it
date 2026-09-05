import { ROUTES } from '../routes';
import { buildCatalogHierarchyRedirects } from './catalog-redirects';

export const GOOGLE_SITE_VERIFICATION = 'f2F2jc6bDCd4G1gsde7UfIW83Bnow_32Kfr2Sv6HUtw';

/** Canonical production origin for sitemap/robots when env is unset or non-www. */
export const CANONICAL_ORIGIN = 'https://www.bridgeitpark.com';

/** Paths that must not appear in the sitemap / are blocked in robots */
export const NON_INDEXABLE_PATH_PREFIXES = [
  '/admin/',
  '/admin',
  '/dashboard/',
  '/dashboard',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/account/',
  '/seller-dashboard',
  '/seller/',
  '/sellers/',
  '/api/',
  '/cart',
  '/messages',
  '/unauthorized',
  '/auth/',
  '/demo/',
] as const;

/** Transactional flows — noindex via metadata; also blocked in robots.txt */
export const TRANSACTIONAL_PATH_PATTERNS = ['/*/order', '/*/quote'] as const;

/** Legacy marketplace routes — excluded from sitemap to avoid duplicate content */
export const LEGACY_MARKETPLACE_PREFIXES = [
  '/categories',
  '/products',
  '/services',
  '/search',
  '/sellers',
  '/solutions',
] as const;

/**
 * Slugs that must never be used as product/detail IDs under showroom dynamic segments.
 */
export const RESERVED_SLUGS = [
  'pricing',
  'privacy',
  'terms',
  'contact',
  'contact-us',
  'about',
  'portfolio',
  'search',
  'admin',
  'login',
  'signup',
  'explore',
  'consultation',
  'websites',
  'software',
  'creative-marketing',
  'marketing',
  'ecommerce',
  'demo',
  'order',
  'quote',
  'new',
  'edit',
  'category',
  'group',
  'page',
] as const;

export type ReservedSlug = (typeof RESERVED_SLUGS)[number];

export function isReservedSlug(slug: string | null | undefined): boolean {
  if (!slug) return false;
  return (RESERVED_SLUGS as readonly string[]).includes(slug.trim().toLowerCase());
}

export function assertNotReservedSlug(slug: string): void {
  if (isReservedSlug(slug)) {
    throw new Error(`Slug "${slug}" is reserved and cannot be used for a product page.`);
  }
}

/** Static public pages that should be indexed and listed in the sitemap */
export const PUBLIC_INDEXABLE_ROUTES = [
  ROUTES.home,
  ROUTES.explore,
  ROUTES.websites,
  ROUTES.softwareShowroom,
  ROUTES.creativeMarketingShowroom,
  ROUTES.portfolio,
  ROUTES.pricing,
  ROUTES.consultation,
  ROUTES.about,
  ROUTES.privacy,
  ROUTES.terms,
] as const;

export type StaticSitemapRoute = {
  path: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
};

/** Public marketing pages for Bridge IT Park */
export const STATIC_SITEMAP_ROUTES: StaticSitemapRoute[] = [
  { path: ROUTES.home, changeFrequency: 'daily', priority: 1 },
  { path: ROUTES.explore, changeFrequency: 'weekly', priority: 0.9 },
  { path: ROUTES.websites, changeFrequency: 'weekly', priority: 0.9 },
  { path: ROUTES.softwareShowroom, changeFrequency: 'weekly', priority: 0.9 },
  { path: ROUTES.creativeMarketingShowroom, changeFrequency: 'weekly', priority: 0.88 },
  { path: ROUTES.portfolio, changeFrequency: 'monthly', priority: 0.8 },
  { path: ROUTES.pricing, changeFrequency: 'monthly', priority: 0.78 },
  { path: ROUTES.consultation, changeFrequency: 'monthly', priority: 0.85 },
  { path: ROUTES.about, changeFrequency: 'monthly', priority: 0.75 },
  { path: ROUTES.privacy, changeFrequency: 'yearly', priority: 0.4 },
  { path: ROUTES.terms, changeFrequency: 'yearly', priority: 0.4 },
];

/**
 * Permanent redirects (source → destination). Single hop; no chains.
 * Consumed by next.config.ts.
 */
export const LEGACY_REDIRECTS: ReadonlyArray<{
  source: string;
  destination: string;
  permanent: boolean;
}> = [
  // Marketplace / solutions → websites showroom
  { source: '/solutions', destination: ROUTES.websites, permanent: true },
  { source: '/solutions/:path*', destination: ROUTES.websites, permanent: true },
  { source: '/products', destination: ROUTES.websites, permanent: true },
  { source: '/products/:path*', destination: ROUTES.websites, permanent: true },
  { source: '/services', destination: ROUTES.websites, permanent: true },
  { source: '/services/:path*', destination: ROUTES.websites, permanent: true },
  { source: '/categories', destination: ROUTES.websites, permanent: true },
  { source: '/categories/:path*', destination: ROUTES.websites, permanent: true },
  { source: '/search', destination: ROUTES.explore, permanent: true },
  { source: '/website', destination: ROUTES.websites, permanent: true },
  { source: '/web-design', destination: ROUTES.websites, permanent: true },
  { source: '/e-commerce', destination: ROUTES.websites, permanent: true },
  { source: '/ecommerce-websites', destination: ROUTES.websites, permanent: true },
  // Contact variants → consultation
  { source: '/contact', destination: ROUTES.consultation, permanent: true },
  { source: '/contact-us', destination: ROUTES.consultation, permanent: true },
  { source: '/free-demo', destination: ROUTES.consultation, permanent: true },
  { source: '/book-demo', destination: ROUTES.consultation, permanent: true },
  { source: '/consult', destination: ROUTES.consultation, permanent: true },
  // Hierarchical catalog flat→nested FIRST (more specific than catch-alls)
  ...buildCatalogHierarchyRedirects(),
  // Marketing aliases — /marketing is canonical
  { source: '/creative-marketing', destination: ROUTES.marketingShowroom, permanent: true },
  { source: '/creative-marketing/:path*', destination: '/marketing/:path*', permanent: true },
  { source: '/digital-marketing', destination: ROUTES.marketingShowroom, permanent: true },
  { source: '/creative', destination: ROUTES.marketingShowroom, permanent: true },
  // Software aliases
  { source: '/software-solutions', destination: ROUTES.softwareShowroom, permanent: true },
  { source: '/admin-software', destination: ROUTES.softwareShowroom, permanent: true },
  // Portfolio / pricing aliases
  { source: '/projects', destination: ROUTES.portfolio, permanent: true },
  { source: '/our-work', destination: ROUTES.portfolio, permanent: true },
  { source: '/packages', destination: ROUTES.pricing, permanent: true },
];

export const SOLUTION_DETAIL_PRIORITY = 0.85;
export const SOLUTION_CATEGORY_FILTER_PRIORITY = 0.8;

export const SITEMAP_REVALIDATE_SECONDS = 3600;
