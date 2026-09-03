import { formatBdt } from '@/lib/format/currency';
import { PRICE_FILTERS } from '../config/constants';
import type { EcommerceProjectCard, ShowcaseListFilters } from '../types';

export type { ShowcaseListFilters };

export function formatStartingPrice(amount: number, currency = 'BDT'): string {
  if (currency === 'BDT') return `Starting ${formatBdt(amount)}`;
  return `Starting ${currency} ${amount.toLocaleString()}`;
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

export function parseShowcaseFilters(searchParams: URLSearchParams): ShowcaseListFilters {
  const price = searchParams.get('price')?.trim() || undefined;
  const bounds = priceBounds(price);
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const view = searchParams.get('view')?.trim() || undefined;
  const page = searchParams.get('page')?.trim() || undefined;
  return {
    q: searchParams.get('q')?.trim() || undefined,
    category: searchParams.get('category')?.trim() || undefined,
    tech: searchParams.get('tech')?.trim() || undefined,
    view,
    page: view || page,
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
  const view = filters.view || filters.page;
  return items.filter((project) => {
    if (filters.category && project.category_slug !== filters.category) return false;
    if (view && view !== 'all') {
      const types = project.page_types ?? [];
      if (!types.includes(view)) return false;
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
