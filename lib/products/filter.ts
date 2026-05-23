import type { Product, ProductFilterState } from '@/types/product';
import type { SearchSortOption } from '@/lib/searchFilter';

/** Client-side filter for already-fetched product lists (e.g. cart previews). */
export function filterProducts(list: Product[], state: ProductFilterState): Product[] {
  return list.filter((p) => {
    if (state.categoryKey && p.categoryKey !== state.categoryKey) return false;
    const q = state.q.trim().toLowerCase();
    if (q) {
      const haystack = [p.title, p.shortDescription, p.sellerName, p.categoryLabel, ...p.tags]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (p.price < state.filters.priceMin || p.price > state.filters.priceMax) return false;
    if (state.filters.minRating > 0 && p.rating < state.filters.minRating) return false;
    if (state.filters.featuredOnly && !p.isFeatured) return false;
    if (state.filters.promotedOnly && !p.isPromoted) return false;
    if (state.filters.sellerLevel !== 'all' && p.sellerLevel !== state.filters.sellerLevel) {
      return false;
    }
    if (state.filters.verifiedOnly && p.sellerLevel !== 'Top Rated') return false;
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
          Number(b.isFeatured) - Number(a.isFeatured) ||
          b.rating - a.rating ||
          b.reviews - a.reviews
      );
  }
  return sorted;
}

export function filterAndSortProducts(list: Product[], state: ProductFilterState): Product[] {
  return sortProducts(filterProducts(list, state), state.sort);
}
