import { ROUTES } from '@/lib/routes';
import { isMainCategorySlug } from '@/constants/mainMarketplaceCategories';
import type { MarketplaceService } from '@/types/marketplace';
import type {
  MarketplaceBudgetFilter,
  MarketplaceDeliveryFilter,
  MarketplaceRatingFilter,
  MarketplaceSearchParams,
  MarketplaceSortOption,
} from '@/lib/search/types';

export const DEFAULT_SEARCH_PARAMS: MarketplaceSearchParams = {
  q: '',
  category: 'all',
  sort: 'recommended',
  budget: 'all',
  delivery: 'all',
  rating: 'all',
  page: 1,
};

export function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function formatQueryLabel(query: string): string {
  const trimmed = query.trim();
  if (!trimmed) return 'All Services';
  return trimmed
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function parseSearchParams(
  params: URLSearchParams | Record<string, string | string[] | undefined>
): MarketplaceSearchParams {
  const get = (key: string): string => {
    if (params instanceof URLSearchParams) {
      return params.get(key) ?? '';
    }
    const raw = params[key];
    if (Array.isArray(raw)) return raw[0] ?? '';
    return raw ?? '';
  };

  const category = get('category');
  const sort = get('sort') as MarketplaceSortOption;
  const budget = get('budget') as MarketplaceBudgetFilter;
  const delivery = get('delivery') as MarketplaceDeliveryFilter;
  const rating = get('rating') as MarketplaceRatingFilter;

  return {
    q: get('q').trim(),
    category: category && (category === 'all' || isMainCategorySlug(category)) ? category : 'all',
    sort: isValidSort(sort) ? sort : 'recommended',
    budget: isValidBudget(budget) ? budget : 'all',
    delivery: isValidDelivery(delivery) ? delivery : 'all',
    rating: isValidRating(rating) ? rating : 'all',
    page: Math.max(1, parseInt(get('page') || '1', 10) || 1),
  };
}

function isValidSort(v: string): v is MarketplaceSortOption {
  return ['recommended', 'top-rated', 'price-low', 'price-high', 'fast-delivery'].includes(v);
}

function isValidBudget(v: string): v is MarketplaceBudgetFilter {
  return ['all', 'under-15k', '15k-50k', '50k-150k', '150k-plus'].includes(v);
}

function isValidDelivery(v: string): v is MarketplaceDeliveryFilter {
  return ['all', '1-7', '8-21', '22-plus'].includes(v);
}

function isValidRating(v: string): v is MarketplaceRatingFilter {
  return ['all', '4.5', '4.7', '4.9'].includes(v);
}

export function buildSearchUrl(state: Partial<MarketplaceSearchParams>): string {
  const merged = { ...DEFAULT_SEARCH_PARAMS, ...state };
  const params = new URLSearchParams();

  if (merged.q.trim()) params.set('q', merged.q.trim());
  if (merged.category && merged.category !== 'all') params.set('category', merged.category);
  if (merged.sort !== 'recommended') params.set('sort', merged.sort);
  if (merged.budget !== 'all') params.set('budget', merged.budget);
  if (merged.delivery !== 'all') params.set('delivery', merged.delivery);
  if (merged.rating !== 'all') params.set('rating', merged.rating);
  if (merged.page > 1) params.set('page', String(merged.page));

  const qs = params.toString();
  return qs ? `${ROUTES.search}?${qs}` : ROUTES.search;
}

const WEBSITE_QUERY =
  /\b(website|web\s*site|wordpress|landing\s*page|ecommerce|e-?commerce|shopify|nextjs|next\.js|portfolio|web\s*dev)/i;

function isWebsiteQuery(query: string): boolean {
  return WEBSITE_QUERY.test(query);
}

function isWebRelatedService(service: MarketplaceService): boolean {
  if (service.categorySlug === 'web-development') return true;
  const blob = normalizeSearchText(
    `${service.title} ${service.shortDescription ?? ''} ${service.tags.join(' ')}`
  );
  return /\b(website|wordpress|landing|ecommerce|shopify|nextjs|portfolio|web)\b/.test(blob);
}

function isSoftwareQuery(query: string): boolean {
  return /\b(erp|crm|pos|saas|software|inventory|hrm|school\s*management)\b/i.test(query);
}

function isSoftwareRelated(service: MarketplaceService): boolean {
  return service.categorySlug === 'software-development';
}

function isAppQuery(query: string): boolean {
  return /\b(app|android|ios|flutter|react\s*native|mobile)\b/i.test(query);
}

function isAppRelated(service: MarketplaceService): boolean {
  return service.categorySlug === 'app-development';
}

/** Relevance score — 0 means exclude when query is non-empty */
export function scoreServiceMatch(service: MarketplaceService, rawQuery: string): number {
  const query = normalizeSearchText(rawQuery);
  if (!query) return 1;

  const tokens = query.split(' ').filter((t) => t.length > 1);
  const title = normalizeSearchText(service.title);
  const category = normalizeSearchText(service.categoryName);
  const categorySlug = service.categorySlug;
  const tags = service.tags.map(normalizeSearchText);
  const seller = normalizeSearchText(service.sellerName);
  const sellerSlugNorm = service.sellerSlug
    ? normalizeSearchText(service.sellerSlug.replace(/-/g, ' '))
    : '';
  const desc = normalizeSearchText(service.shortDescription ?? '');

  let score = 0;

  if (title === query) score += 100;
  else if (title.includes(query)) score += 85;

  if (tokens.length > 0 && tokens.every((t) => title.includes(t))) score += 70;

  if (category.includes(query) || query.includes(categorySlug.replace(/-/g, ' '))) score += 55;
  if (tokens.some((t) => categorySlug.includes(t))) score += 45;

  for (const tag of tags) {
    if (tag === query || tag.includes(query)) score += 40;
    if (tokens.every((t) => tag.includes(t))) score += 35;
  }

  for (const token of tokens) {
    if (title.includes(token)) score += 22;
    if (desc.includes(token)) score += 14;
    if (tags.some((tag) => tag.includes(token))) score += 18;
    if (seller.includes(token)) score += 12;
    if (sellerSlugNorm.includes(token)) score += 15;
  }

  if (sellerSlugNorm && (sellerSlugNorm.includes(query) || query.includes(sellerSlugNorm))) {
    score += 50;
  }

  if (isWebsiteQuery(rawQuery) && !isWebRelatedService(service)) {
    score = Math.floor(score * 0.15);
  }
  if (isSoftwareQuery(rawQuery) && !isSoftwareRelated(service)) {
    score = Math.floor(score * 0.2);
  }
  if (isAppQuery(rawQuery) && !isAppRelated(service)) {
    score = Math.floor(score * 0.2);
  }

  return score;
}

function matchesBudget(price: number, budget: MarketplaceBudgetFilter): boolean {
  switch (budget) {
    case 'under-15k':
      return price < 15000;
    case '15k-50k':
      return price >= 15000 && price <= 50000;
    case '50k-150k':
      return price > 50000 && price <= 150000;
    case '150k-plus':
      return price > 150000;
    default:
      return true;
  }
}

function matchesDelivery(days: number | null, delivery: MarketplaceDeliveryFilter): boolean {
  if (delivery === 'all' || days == null) return true;
  if (delivery === '1-7') return days <= 7;
  if (delivery === '8-21') return days >= 8 && days <= 21;
  return days >= 22;
}

function matchesRating(rating: number, filter: MarketplaceRatingFilter): boolean {
  if (filter === 'all') return true;
  return rating >= parseFloat(filter);
}

export function filterMarketplaceServices(
  services: MarketplaceService[],
  params: MarketplaceSearchParams
): MarketplaceService[] {
  let list = [...services];

  if (params.category !== 'all') {
    list = list.filter((s) => s.categorySlug === params.category);
  }

  list = list.filter(
    (s) =>
      matchesBudget(s.priceFrom, params.budget) &&
      matchesDelivery(s.deliveryDays, params.delivery) &&
      matchesRating(s.rating, params.rating)
  );

  const query = params.q.trim();
  if (query) {
    list = list
      .map((s) => ({ s, score: scoreServiceMatch(s, query) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ s }) => s);
  } else {
    list = sortMarketplaceServices(list, params.sort);
  }

  return list;
}

export function sortMarketplaceServices(
  services: MarketplaceService[],
  sort: MarketplaceSortOption
): MarketplaceService[] {
  const list = [...services];
  switch (sort) {
    case 'top-rated':
      return list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case 'price-low':
      return list.sort((a, b) => a.priceFrom - b.priceFrom);
    case 'price-high':
      return list.sort((a, b) => b.priceFrom - a.priceFrom);
    case 'fast-delivery':
      return list.sort(
        (a, b) => (a.deliveryDays ?? 999) - (b.deliveryDays ?? 999)
      );
    case 'recommended':
    default:
      return list.sort((a, b) => {
        const featured = Number(b.isFeatured) - Number(a.isFeatured);
        if (featured !== 0) return featured;
        const popular = Number(b.isPopular) - Number(a.isPopular);
        if (popular !== 0) return popular;
        return b.reviewCount - a.reviewCount;
      });
  }
}

export function paginateServices<T>(items: T[], page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    totalPages,
    page: safePage,
    total: items.length,
  };
}

export const SEARCH_PAGE_SIZE = 12;

export function buildPaginationItems(
  page: number,
  totalPages: number
): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const items: (number | 'ellipsis')[] = [1];
  if (page > 3) items.push('ellipsis');
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  for (let i = start; i <= end; i++) items.push(i);
  if (page < totalPages - 2) items.push('ellipsis');
  items.push(totalPages);
  return items;
}
