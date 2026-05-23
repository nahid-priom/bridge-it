import {
  fetchProductBySlug,
  fetchSimilarProducts,
} from '@/lib/catalog/products';

export { fetchProductBySlug as getProductBySlug };

export async function getSimilarProducts(
  product: import('@/types/product').Product,
  limit = 8
) {
  return fetchSimilarProducts(product, limit);
}

export function truncateDescription(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trim()}…`;
}
