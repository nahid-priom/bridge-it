import type { CatalogCategoryRoot } from '../../types';

/** Explore listing grids: 2-up mobile, up to 4-up desktop. */
export const CATALOG_LISTING_GRID_CLASS =
  'grid grid-cols-2 gap-3 min-w-0 sm:gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-4';

export type CatalogSidebarIndustry = {
  slug: string;
  name: string;
};

export type CatalogExploreChromeProps = {
  activeRoot: CatalogCategoryRoot;
  activeIndustrySlug?: string | null;
  industries: CatalogSidebarIndustry[];
};

export const CATALOG_MOTHER_NAV: Array<{
  root: CatalogCategoryRoot;
  label: string;
  href: string;
  title: string;
}> = [
  {
    root: 'websites',
    label: 'Website Templates',
    href: '/websites',
    title: 'Browse website templates',
  },
  {
    root: 'software',
    label: 'Software Solutions',
    href: '/software',
    title: 'Browse software solutions',
  },
  {
    root: 'marketing',
    label: 'Digital Marketing',
    href: '/marketing',
    title: 'Browse digital marketing services',
  },
];

export const SOFTWARE_PRICE_FILTERS = [
  { id: 'under-25k', label: 'Under ৳25,000', min: undefined, max: 24999 },
  { id: '25-50k', label: '৳25,000 – ৳50,000', min: 25000, max: 50000 },
  { id: '50-100k', label: '৳50,000 – ৳1,00,000', min: 50000, max: 100000 },
  { id: '100k-plus', label: '৳1,00,000+', min: 100000, max: undefined },
] as const;

export type SoftwarePriceFilterId = (typeof SOFTWARE_PRICE_FILTERS)[number]['id'];

export function parseSoftwarePriceParam(value: string | null | undefined): SoftwarePriceFilterId | null {
  const v = (value ?? '').trim();
  return SOFTWARE_PRICE_FILTERS.some((f) => f.id === v) ? (v as SoftwarePriceFilterId) : null;
}

export function softwarePriceBounds(id: SoftwarePriceFilterId | null): {
  minPrice?: number;
  maxPrice?: number;
} {
  if (!id) return {};
  const match = SOFTWARE_PRICE_FILTERS.find((f) => f.id === id);
  if (!match) return {};
  return {
    minPrice: match.min,
    maxPrice: match.max,
  };
}

export const SOFTWARE_BUSINESS_SIZE_OPTIONS = [
  { id: 'small', label: 'Small Business' },
  { id: 'growing', label: 'Growing Business' },
  { id: 'professional', label: 'Professional' },
  { id: 'enterprise', label: 'Enterprise' },
] as const;

export type SoftwareBusinessSizeId = (typeof SOFTWARE_BUSINESS_SIZE_OPTIONS)[number]['id'];

export const SOFTWARE_SORT_OPTIONS = [
  { id: 'popular', label: 'Popular' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: Low to High' },
] as const;

export type SoftwareSortId = (typeof SOFTWARE_SORT_OPTIONS)[number]['id'];

export function parseSoftwareBusinessSizeParam(
  value: string | null | undefined
): SoftwareBusinessSizeId[] {
  if (!value?.trim()) return [];
  const allowed = new Set(SOFTWARE_BUSINESS_SIZE_OPTIONS.map((o) => o.id));
  return value
    .split(',')
    .map((part) => part.trim())
    .filter((part): part is SoftwareBusinessSizeId => allowed.has(part as SoftwareBusinessSizeId));
}

export function serializeSoftwareBusinessSizes(sizes: SoftwareBusinessSizeId[]): string {
  return sizes.slice().sort().join(',');
}

export function parseSoftwareSortParam(value: string | null | undefined): SoftwareSortId {
  const v = (value ?? '').trim();
  if (v === 'newest' || v === 'price-asc') return v;
  return 'popular';
}

export function catalogSearchPlaceholder(
  root: CatalogCategoryRoot,
  industryName?: string | null
): string {
  const industry = industryName?.trim();
  if (root === 'websites') {
    return industry ? `Search ${industry} templates...` : 'Search templates...';
  }
  if (root === 'software') {
    return industry ? `Search ${industry} software...` : 'Search software...';
  }
  return industry ? `Search ${industry} services...` : 'Search marketing services...';
}

export function industryLinkTitle(root: CatalogCategoryRoot, name: string): string {
  if (root === 'websites') return `${name} Website Templates`;
  if (root === 'software') return `${name} Software`;
  return `${name} Marketing`;
}
