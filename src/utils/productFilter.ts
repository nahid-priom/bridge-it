import { Service, SearchFilters, ProductCategoryFilter } from '../types';
import type { SearchSortOption } from './searchFilter';

const PRODUCT_CATEGORIES: Service['category'][] = ['digital-products', 'courses'];

const PRODUCT_TAG_KEYWORDS: Record<ProductCategoryFilter, string[]> = {
  all: [],
  'digital-products': ['digital', 'download', 'assets'],
  courses: ['course', 'learning', 'training'],
  templates: ['template', 'canva', 'notion', 'excel'],
  scripts: ['script', 'automation', 'plugin'],
  'ui-kits': ['ui', 'figma', 'kit', 'dashboard'],
  'marketing-assets': ['marketing', 'ads', 'social', 'lut', 'preset'],
};

export function isProductListing(service: Service): boolean {
  if (PRODUCT_CATEGORIES.includes(service.category)) return true;
  if (service.resultType === 'digital-product' || service.resultType === 'course') return true;
  const tags = service.tags.join(' ').toLowerCase();
  return (
    tags.includes('template') ||
    tags.includes('download') ||
    tags.includes('digital') ||
    tags.includes('course') ||
    tags.includes('ui kit') ||
    tags.includes('script')
  );
}

export function getProductListings(services: Service[]): Service[] {
  return services.filter(isProductListing);
}

function matchesProductCategory(service: Service, filter: ProductCategoryFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'digital-products') return service.category === 'digital-products' || service.resultType === 'digital-product';
  if (filter === 'courses') return service.category === 'courses' || service.resultType === 'course';
  const keywords = PRODUCT_TAG_KEYWORDS[filter];
  const haystack = `${service.title} ${service.subcategory} ${service.tags.join(' ')}`.toLowerCase();
  return keywords.some((k) => haystack.includes(k));
}

export function filterProducts(
  products: Service[],
  productCategory: ProductCategoryFilter,
  filters: SearchFilters
): Service[] {
  return products.filter((s) => {
    if (!matchesProductCategory(s, productCategory)) return false;
    if (filters.category !== 'all' && s.category !== filters.category) return false;
    if (s.price < filters.priceMin || s.price > filters.priceMax) return false;
    if (filters.minRating > 0 && s.rating < filters.minRating) return false;
    if (filters.verifiedOnly && !s.isVerified) return false;
    if (filters.featuredOnly && !s.isFeatured && !s.popular) return false;
    if (filters.protectedDemoOnly && !s.hasProtectedDemo) return false;
    if (filters.instantOnly && !s.instantDelivery && s.deliveryTime.toLowerCase() !== 'instant') return false;
    if (filters.location !== 'all' && !(s.location ?? '').toLowerCase().includes(filters.location.toLowerCase())) return false;
    return true;
  });
}

export function sortProducts(products: Service[], sortBy: SearchSortOption): Service[] {
  const sorted = [...products];
  switch (sortBy) {
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case 'price-low':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      sorted.reverse();
      break;
    case 'popular':
      sorted.sort(
        (a, b) =>
          Number(b.popular || b.isFeatured) - Number(a.popular || a.isFeatured) ||
          b.reviewCount - a.reviewCount
      );
      break;
    default:
      sorted.sort(
        (a, b) =>
          Number(b.isFeatured || b.popular) - Number(a.isFeatured || a.popular) ||
          b.rating - a.rating
      );
  }
  return sorted;
}
