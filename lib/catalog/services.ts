import { getServiceBySlug, listProductSlugs } from '@/lib/db/products';
import { listReviewsByProductId } from '@/lib/db/reviews';
import { listActiveCategories } from '@/lib/db/categories';
import {
  mapCategoryRow,
  mapDbProductToService,
  mapDbReviewToServiceReview,
  SERVICE_PRODUCT_TYPES,
} from '@/lib/db/mappers';
import type { Review, Service } from '@/types';

export async function fetchServiceBySlug(slug: string): Promise<Service | null> {
  const result = await getServiceBySlug(slug);
  if (!result.data) return null;
  return mapDbProductToService(result.data);
}

export async function fetchServiceReviewsBySlug(
  slug: string,
  limit = 4
): Promise<Review[]> {
  const product = await getServiceBySlug(slug);
  if (!product.data) return [];
  const legacyId = (product.data.metadata as { legacyId?: string })?.legacyId ?? product.data.id;
  const reviews = await listReviewsByProductId(product.data.id, { limit });
  return reviews.data.map((r) => mapDbReviewToServiceReview(r, legacyId));
}

export async function listAllServiceSlugs(): Promise<string[]> {
  const result = await listProductSlugs(SERVICE_PRODUCT_TYPES);
  return result.data;
}

export async function fetchCategoriesForServices() {
  const { data } = await listActiveCategories();
  return data.map((row) => mapCategoryRow(row, 0));
}
