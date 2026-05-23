import type { Product, ProductFilterState } from '@/types/product';
import type { SearchSortOption } from '@/lib/searchFilter';
import { products } from '@/data/products';

function deliveryMatches(product: Product, filter: ProductFilterState['filters']): boolean {
  const d = filter.deliveryTime;
  if (d === 'all') return true;
  const t = product.deliveryTime.toLowerCase();
  if (d === 'instant') return t.includes('instant');
  if (d === '1-3') return t.includes('1 day') || t.includes('2 day') || t.includes('3 day');
  if (d === '4-7') return t.includes('5 day') || t.includes('7 day');
  if (d === '8-14') return t.includes('10 day') || t.includes('14 day');
  if (d === '15+') return false;
  return true;
}

function matchesQuery(product: Product, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    product.title,
    product.shortDescription,
    product.sellerName,
    product.categoryLabel,
    ...product.tags,
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
}

export function filterProducts(list: Product[], state: ProductFilterState): Product[] {
  return list.filter((p) => {
    if (state.categoryKey && p.categoryKey !== state.categoryKey) return false;
    if (!matchesQuery(p, state.q)) return false;
    if (p.price < state.filters.priceMin || p.price > state.filters.priceMax) return false;
    if (state.filters.minRating > 0 && p.rating < state.filters.minRating) return false;
    if (state.filters.featuredOnly && !p.isFeatured) return false;
    if (state.filters.promotedOnly && !p.isPromoted) return false;
    if (
      state.filters.sellerLevel !== 'all' &&
      p.sellerLevel !== state.filters.sellerLevel
    ) {
      return false;
    }
    if (state.filters.verifiedOnly && p.sellerLevel !== 'Top Rated') return false;
    if (!deliveryMatches(p, state.filters)) return false;
    return true;
  });
}

export function sortProducts(list: Product[], sortBy: SearchSortOption): Product[] {
  const sorted = [...list];
  switch (sortBy) {
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
      break;
    case 'price-low':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      sorted.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
      break;
    case 'popular':
      sorted.sort(
        (a, b) =>
          Number(b.isPromoted || b.isFeatured) - Number(a.isPromoted || a.isFeatured) ||
          b.reviews - a.reviews
      );
      break;
    default:
      sorted.sort(
        (a, b) =>
          Number(b.isFeatured) - Number(a.isFeatured) || b.rating - a.rating || b.reviews - a.reviews
      );
  }
  return sorted;
}

export function filterAndSortProducts(state: ProductFilterState): Product[] {
  return sortProducts(filterProducts(products, state), state.sort);
}
