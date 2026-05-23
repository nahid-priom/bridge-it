import { filterAndSortProducts } from '@/lib/products/filter';
import type { ProductsPageState } from './url';

/** Filter and sort demo products from URL-driven state. */
export function filterProductsListing(state: ProductsPageState) {
  return filterAndSortProducts(state);
}
