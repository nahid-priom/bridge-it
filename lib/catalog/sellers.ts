import { getSellerBySlug, listPublicSellers, listSellerSlugs } from '@/lib/db/sellers';
import { listProductsFiltered } from '@/lib/db/products';
import { getSellerReviewStats } from '@/lib/db/reviews';
import { listActiveCategories } from '@/lib/db/categories';
import {
  mapCategoryRow,
  mapDbProductToService,
  mapDbSellerToSeller,
  SERVICE_PRODUCT_TYPES,
} from '@/lib/db/mappers';
import type { Seller, Service } from '@/types';

export async function fetchSellerBySlug(slug: string): Promise<Seller | null> {
  const result = await getSellerBySlug(slug);
  if (!result.data) return null;
  return mapDbSellerToSeller(result.data);
}

export async function fetchSellerServices(slug: string, limit = 24): Promise<Service[]> {
  const seller = await getSellerBySlug(slug);
  if (!seller.data) return [];

  const products = await listProductsFiltered({
    sellerId: seller.data.id,
    productTypes: SERVICE_PRODUCT_TYPES,
    limit,
  });

  return products.data.map((row) =>
    mapDbProductToService(row as import('@/types/database.types').ProductWithRelations)
  );
}

export async function fetchTopSellers(limit = 8): Promise<Seller[]> {
  const result = await listPublicSellers(limit);
  return result.data.map(mapDbSellerToSeller);
}

export async function listAllSellerSlugs(): Promise<string[]> {
  const result = await listSellerSlugs();
  return result.data;
}

export async function fetchSellerWithStats(slug: string) {
  const seller = await fetchSellerBySlug(slug);
  if (!seller) return null;
  const sellerRow = await getSellerBySlug(slug);
  const stats = sellerRow.data
    ? await getSellerReviewStats(sellerRow.data.id)
    : { data: { avgRating: seller.rating, count: seller.reviewCount } };
  const services = await fetchSellerServices(slug);
  return {
    seller: {
      ...seller,
      rating: stats.data.avgRating || seller.rating,
      reviewCount: stats.data.count || seller.reviewCount,
    },
    services,
  };
}

export async function fetchCategoriesForSellers() {
  const { data } = await listActiveCategories();
  return data.map((row) => mapCategoryRow(row, 0));
}

export async function resolveSellerSlugByLegacyId(
  legacyId: string
): Promise<string | undefined> {
  const sellers = await listPublicSellers(100);
  const match = sellers.data.find((s) => s.id === legacyId);
  if (match) return match.slug;
  return undefined;
}
