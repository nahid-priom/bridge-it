import { listActiveCategories } from '@/lib/db/categories';
import { getFeaturedProducts, getPromotedProducts } from '@/lib/db/products';
import { listPublicSellers } from '@/lib/db/sellers';
import { listRecentReviews } from '@/lib/db/reviews';
import {
  mapCategoryRow,
  mapDbProductToService,
  mapDbSellerToSeller,
  SERVICE_PRODUCT_TYPES,
} from '@/lib/db/mappers';
import type { Category, Service, Seller } from '@/types';
import type { PlatformTestimonial } from '@/types';
import { BRANDING } from '@/lib/config/branding';

export async function getHomeCategories(limit = 12): Promise<Category[]> {
  const { data } = await listActiveCategories();
  return data.slice(0, limit).map((row, i) => mapCategoryRow(row, 100 + i * 20));
}

export async function getHomeFeaturedServices(limit = 8): Promise<Service[]> {
  const featured = await getFeaturedProducts(limit);
  const rows = featured.data.filter((r) =>
    SERVICE_PRODUCT_TYPES.includes(r.product_type as (typeof SERVICE_PRODUCT_TYPES)[number])
  );
  return rows.slice(0, limit).map((row) =>
    mapDbProductToService(row as import('@/types/database.types').ProductWithRelations)
  );
}

export async function getHomePromotedServices(limit = 4) {
  const promoted = await getPromotedProducts(limit);
  return promoted.data.slice(0, limit).map((row) => ({
    slug: row.slug,
    title: row.title,
    image: row.image_url,
    price: Number(row.price),
    sellerName: (row as { sellers?: { name: string } }).sellers?.name ?? '',
  }));
}

export async function getHomeTopSellers(limit = 8): Promise<Seller[]> {
  const { data } = await listPublicSellers(limit);
  return data.map(mapDbSellerToSeller);
}

export async function getHomeTestimonials(limit = 6): Promise<PlatformTestimonial[]> {
  const { data } = await listRecentReviews(limit);
  const accents = ['#FF6B6B', '#8B5CF6', '#06D6A0', '#F59E0B', '#EC4899', '#3B82F6'];
  return data.map((review, i) => ({
    id: review.id,
    name: review.reviewer_name,
    role: (review.products as { title?: string } | null)?.title ?? `${BRANDING.appName} Client`,
    comment: review.comment,
    rating: Number(review.rating),
    accentColor: accents[i % accents.length],
    avatarUrl: review.reviewer_avatar ?? undefined,
  }));
}
