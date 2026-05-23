import { queryProductsListing } from '@/lib/catalog/products';
import type { ProductsPageState } from './url';

/** Filter and sort products from Supabase using URL-driven state. */
export async function filterProductsListing(state: ProductsPageState) {
  return queryProductsListing(state);
}
