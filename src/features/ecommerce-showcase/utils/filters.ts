import { formatBdt } from '@/lib/format/currency';
import { CATALOG_PACKAGE_TIERS, PRICE_FILTERS } from '../config/constants';
import type { EcommerceProjectCard, ShowcaseListFilters } from '../types';

export type { ShowcaseListFilters };

export function formatStartingPrice(amount: number, currency = 'BDT'): string {
  if (currency === 'BDT') return `Starting ${formatBdt(amount)}`;
  return `Starting ${currency} ${amount.toLocaleString()}`;
}

export function formatCatalogTierPrice(tier: (typeof CATALOG_PACKAGE_TIERS)[number]): string {
  return `${formatBdt(tier.price)}${tier.plus ? '+' : ''}`;
}

export function catalogTierForPackage(pkg: { name: string }, index: number) {
  const name = pkg.name.toLowerCase();
  if (name.includes('landing')) return CATALOG_PACKAGE_TIERS[0];
  if (name.includes('premium') || name.includes('custom')) return CATALOG_PACKAGE_TIERS[2];
  if (name.includes('website') || name.includes('e-commerce') || name.includes('ecommerce') || name.includes('business')) {
    return CATALOG_PACKAGE_TIERS[1];
  }
  return CATALOG_PACKAGE_TIERS[Math.min(index, CATALOG_PACKAGE_TIERS.length - 1)];
}

export function primaryTech(stack: string[]): string | null {
  return stack[0] ?? null;
}

function priceBounds(price?: string | null): { minPrice?: number; maxPrice?: number } {
  const match = PRICE_FILTERS.find((item) => item.id === price);
  if (!match || match.id === 'all') return {};
  return {
    minPrice: 'minPrice' in match ? match.minPrice : undefined,
    maxPrice: 'maxPrice' in match ? match.maxPrice : undefined,
  };
}

/** Comma-separated filter values. Empty / "all" means no constraint. */
export function parseFilterList(value?: string | null): string[] {
  if (!value) return [];
  return [...new Set(value.split(',').map((part) => part.trim()).filter((part) => part && part !== 'all'))];
}

export function serializeFilterList(values: string[]): string | undefined {
  const clean = [...new Set(values.map((value) => value.trim()).filter((value) => value && value !== 'all'))];
  return clean.length ? clean.join(',') : undefined;
}

export function toggleFilterValue(current: string[], id: string): string[] {
  if (id === 'all') return [];
  return current.includes(id) ? current.filter((value) => value !== id) : [...current, id];
}

export function parseShowcaseFilters(searchParams: URLSearchParams): ShowcaseListFilters {
  const price = searchParams.get('price')?.trim() || undefined;
  const bounds = priceBounds(price);
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const view = serializeFilterList(parseFilterList(searchParams.get('view') || searchParams.get('page')));
  const category = serializeFilterList(parseFilterList(searchParams.get('category')));
  return {
    q: searchParams.get('q')?.trim() || undefined,
    category,
    tech: searchParams.get('tech')?.trim() || undefined,
    view,
    page: view,
    industry: searchParams.get('industry')?.trim() || undefined,
    websiteType: searchParams.get('type')?.trim() || undefined,
    price,
    minPrice: minPrice ? Number(minPrice) : bounds.minPrice,
    maxPrice: maxPrice ? Number(maxPrice) : bounds.maxPrice,
  };
}

export function showcaseQueryString(filters: ShowcaseListFilters): string {
  const params = new URLSearchParams();
  if (filters.q) params.set('q', filters.q);
  if (filters.category) params.set('category', filters.category);
  if (filters.tech) params.set('tech', filters.tech);
  const view = filters.view || filters.page;
  if (view && view !== 'all') params.set('view', view);
  if (filters.price && filters.price !== 'all') params.set('price', filters.price);
  if (filters.industry) params.set('industry', filters.industry);
  if (filters.websiteType) params.set('type', filters.websiteType);
  if (!filters.price) {
    if (filters.minPrice != null) params.set('minPrice', String(filters.minPrice));
    if (filters.maxPrice != null) params.set('maxPrice', String(filters.maxPrice));
  }
  if (filters.offset) params.set('offset', String(filters.offset));
  if (filters.limit) params.set('limit', String(filters.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export function filterProjectCards(
  items: EcommerceProjectCard[],
  filters: Pick<ShowcaseListFilters, 'q' | 'category' | 'view' | 'page'>
) {
  const q = filters.q?.trim().toLowerCase();
  const categories = parseFilterList(filters.category);
  const views = parseFilterList(filters.view || filters.page);
  return items.filter((project) => {
    if (categories.length > 0 && !categories.includes(project.category_slug ?? '')) return false;
    if (views.length > 0) {
      const types = project.page_types ?? [];
      if (!views.some((view) => types.includes(view))) return false;
    }
    if (q) {
      const haystack = [
        project.title,
        project.category_name,
        project.category_slug,
        project.industry,
        project.short_description,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export function websitesUrl(filters: ShowcaseListFilters = {}): string {
  return `/websites${showcaseQueryString(filters)}`;
}

export function websiteDetailUrl(slug: string): string {
  return `/websites/${slug}`;
}

export function categoryUrl(slug: string): string {
  return `/ecommerce/${slug}`;
}
