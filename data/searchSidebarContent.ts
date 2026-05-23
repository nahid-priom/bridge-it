import { MAIN_MARKETPLACE_CATEGORIES } from '@/constants/mainMarketplaceCategories';

/** Trending service searches for /search sidebar */
export const TRENDING_SERVICES = MAIN_MARKETPLACE_CATEGORIES.map((c) => ({
  label: c.name,
  count: c.serviceCount,
  href: `/search?category=${c.slug}`,
}));

export const POPULAR_TAGS = [
  'web development',
  'mobile app',
  'SEO',
  'logo design',
  'WordPress',
  'Shopify',
  'API integration',
  'UI design',
  'chatbot',
  'automation',
] as const;
