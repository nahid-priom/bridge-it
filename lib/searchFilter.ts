import {
  SearchCatalogItem,
  SearchFilters,
  SearchListingItem,
  Service,
  Category,
  DEFAULT_SEARCH_FILTERS,
} from '@/types';

export { DEFAULT_SEARCH_FILTERS };

export type SearchSortOption = 'relevance' | 'popular' | 'rating' | 'price-low' | 'price-high' | 'newest';

function getListingResultType(service: Service): string {
  if (service.resultType) return service.resultType;
  if (service.category === 'courses') return 'course';
  if (service.category === 'digital-products') return 'digital-product';
  return 'service';
}

function matchesQuery(item: SearchCatalogItem, query: string, categories: Category[]): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  if (item.kind === 'seller') {
    return (
      item.title.toLowerCase().includes(q) ||
      (item.titleBn?.toLowerCase().includes(q) ?? false) ||
      item.description.toLowerCase().includes(q) ||
      item.sellerName.toLowerCase().includes(q) ||
      item.categoryName.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  const s = item.service;
  const cat = categories.find((c) => c.id === s.category);
  return (
    s.title.toLowerCase().includes(q) ||
    (s.titleBn?.toLowerCase().includes(q) ?? false) ||
    s.description.toLowerCase().includes(q) ||
    s.sellerName.toLowerCase().includes(q) ||
    s.category.toLowerCase().includes(q) ||
    (cat?.name.toLowerCase().includes(q) ?? false) ||
    (cat?.nameBn?.includes(q) ?? false) ||
    s.subcategory.toLowerCase().includes(q) ||
    s.tags.some((t) => t.toLowerCase().includes(q)) ||
    getListingResultType(s).includes(q)
  );
}

function parseDeliveryDays(deliveryTime: string): number | null {
  const lower = deliveryTime.toLowerCase();
  if (lower === 'instant') return 0;
  const match = lower.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

function matchesDeliveryFilter(deliveryTime: string, filter: SearchFilters['deliveryTime']): boolean {
  if (filter === 'all') return true;
  const days = parseDeliveryDays(deliveryTime);
  if (days === null) return true;
  switch (filter) {
    case 'instant':
      return days === 0;
    case '1-3':
      return days >= 1 && days <= 3;
    case '4-7':
      return days >= 4 && days <= 7;
    case '8-14':
      return days >= 8 && days <= 14;
    case '15+':
      return days >= 15;
    default:
      return true;
  }
}

function applyFilters(item: SearchCatalogItem, filters: SearchFilters): boolean {
  if (item.kind === 'seller') {
    if (filters.resultType !== 'all' && filters.resultType !== 'seller') return false;
    if (filters.category !== 'all' && item.category !== filters.category) return false;
    if (filters.verifiedOnly && !item.isVerified) return false;
    if (filters.featuredOnly && !item.isFeatured) return false;
    if (filters.protectedDemoOnly) return false;
    if (filters.escrowOnly || filters.instantOnly) return false;
    if (filters.minRating > 0 && item.rating < filters.minRating) return false;
    if (filters.location !== 'all' && !item.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.language !== 'all' && !item.language.toLowerCase().includes(filters.language.toLowerCase())) return false;
    return true;
  }

  const s = item.service;
  const resultType = getListingResultType(s);

  if (filters.resultType !== 'all' && filters.resultType !== resultType) return false;
  if (filters.category !== 'all' && s.category !== filters.category) return false;
  if (s.price < filters.priceMin || s.price > filters.priceMax) return false;
  if (!matchesDeliveryFilter(s.deliveryTime, filters.deliveryTime)) return false;
  if (filters.minRating > 0 && s.rating < filters.minRating) return false;
  if (filters.verifiedOnly && !s.isVerified) return false;
  if (filters.featuredOnly && !s.isFeatured && !s.popular) return false;
  if (filters.protectedDemoOnly && !s.hasProtectedDemo) return false;
  if (filters.escrowOnly && !s.escrowAvailable) return false;
  if (filters.instantOnly && !s.instantDelivery && s.deliveryTime.toLowerCase() !== 'instant') return false;
  if (filters.location !== 'all' && !(s.location ?? '').toLowerCase().includes(filters.location.toLowerCase())) return false;
  if (filters.language !== 'all' && !(s.language ?? '').toLowerCase().includes(filters.language.toLowerCase())) return false;

  return true;
}

export function filterSearchCatalog(
  catalog: SearchCatalogItem[],
  query: string,
  filters: SearchFilters,
  categories: Category[] = []
): SearchCatalogItem[] {
  return catalog.filter(
    (item) => matchesQuery(item, query, categories) && applyFilters(item, filters)
  );
}

export function getRecommendedResults(catalog: SearchCatalogItem[]): SearchCatalogItem[] {
  const featured = catalog.filter((item) => {
    if (item.kind === 'seller') return item.isFeatured;
    return item.service.isFeatured || item.service.popular;
  });
  if (featured.length >= 12) return featured.slice(0, 24);
  return catalog.slice(0, 24);
}

export function sortSearchResults(items: SearchCatalogItem[], sortBy: SearchSortOption): SearchCatalogItem[] {
  const sorted = [...items];
  const getPrice = (item: SearchCatalogItem) => (item.kind === 'listing' ? item.service.price : 0);
  const getRating = (item: SearchCatalogItem) =>
    item.kind === 'listing' ? item.service.rating : item.rating;
  const getReviews = (item: SearchCatalogItem) =>
    item.kind === 'listing' ? item.service.reviewCount : item.reviewCount;
  const isPopular = (item: SearchCatalogItem) =>
    item.kind === 'listing' ? item.service.popular || item.service.isFeatured : item.isFeatured;

  switch (sortBy) {
    case 'rating':
      sorted.sort((a, b) => getRating(b) - getRating(a));
      break;
    case 'price-low':
      sorted.sort((a, b) => getPrice(a) - getPrice(b));
      break;
    case 'price-high':
      sorted.sort((a, b) => getPrice(b) - getPrice(a));
      break;
    case 'newest':
      sorted.reverse();
      break;
    case 'popular':
      sorted.sort((a, b) => Number(isPopular(b)) - Number(isPopular(a)) || getReviews(b) - getReviews(a));
      break;
    default:
      sorted.sort((a, b) => Number(isPopular(b)) - Number(isPopular(a)) || getRating(b) - getRating(a));
  }
  return sorted;
}

export function getActiveFilterCount(filters: SearchFilters): number {
  let count = 0;
  if (filters.resultType !== 'all') count++;
  if (filters.category !== 'all') count++;
  if (filters.priceMin > 0 || filters.priceMax < 200000) count++;
  if (filters.deliveryTime !== 'all') count++;
  if (filters.minRating > 0) count++;
  if (filters.verifiedOnly) count++;
  if (filters.featuredOnly) count++;
  if (filters.protectedDemoOnly) count++;
  if (filters.location !== 'all') count++;
  if (filters.language !== 'all') count++;
  if (filters.escrowOnly) count++;
  if (filters.instantOnly) count++;
  return count;
}

export function listingFromItem(item: SearchCatalogItem): SearchListingItem | null {
  return item.kind === 'listing' ? item : null;
}
