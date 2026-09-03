import { ROUTES } from '@/lib/routes';

/** Paths that must not appear in the sitemap */
export const NON_INDEXABLE_PATH_PREFIXES = [
  '/admin',
  '/dashboard',
  '/login',
  '/signup',
  '/seller-dashboard',
  '/seller/',
  '/sellers/',
  '/api/',
  '/cart',
  '/messages',
  '/unauthorized',
  '/auth/',
  '/_next/',
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
] as const;

export type StaticSitemapRoute = {
  path: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
};

/** Public marketing pages for Bridge IT Park */
export const STATIC_SITEMAP_ROUTES: StaticSitemapRoute[] = [
  { path: ROUTES.home, changeFrequency: 'daily', priority: 1 },
  { path: ROUTES.websites, changeFrequency: 'daily', priority: 0.95 },
  { path: ROUTES.consultation, changeFrequency: 'monthly', priority: 0.85 },
  { path: ROUTES.about, changeFrequency: 'monthly', priority: 0.75 },
];

export const SOLUTION_DETAIL_PRIORITY = 0.9;
export const SOLUTION_CATEGORY_FILTER_PRIORITY = 0.88;

export const SITEMAP_REVALIDATE_SECONDS = 3600;
