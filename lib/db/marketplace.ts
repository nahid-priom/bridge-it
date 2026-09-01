import { getDbClient } from '@/lib/db/server';
import { dbError, dbSuccess, dbUnavailable, type DbResult } from '@/lib/db/result';
import type { MarketplaceCategory, MarketplaceService } from '@/types/marketplace';

type DbMarketplaceCategory = {
  id: string;
  slug: string;
  name: string;
  subtitle: string | null;
  description: string | null;
  icon: string | null;
  service_count: number;
  sort_order: number;
  is_featured: boolean;
};

type DbMarketplaceService = {
  id: string;
  category_id: string;
  slug: string;
  title: string;
  short_description: string | null;
  seller_id: string | null;
  seller_slug: string | null;
  seller_name: string;
  seller_level: string | null;
  seller_avatar_url: string | null;
  thumbnail_type: string;
  thumbnail_url: string | null;
  cover_image_path: string | null;
  cover_image_alt: string | null;
  cover_image_prompt: string | null;
  cover_image_updated_at: string | null;
  price_from: number;
  currency: string;
  delivery_days: number | null;
  rating: number;
  review_count: number;
  tags: string[] | null;
  row_group: string;
  is_popular: boolean;
  is_featured: boolean;
  sort_order: number;
  marketplace_categories: { slug: string; name: string } | null;
  marketplace_sellers: { city: string | null; rating: number } | null;
};

function mapCategory(row: DbMarketplaceCategory): MarketplaceCategory {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    subtitle: row.subtitle,
    description: row.description,
    icon: row.icon,
    serviceCount: row.service_count,
    sortOrder: row.sort_order,
    isFeatured: row.is_featured,
  };
}

function mapService(row: DbMarketplaceService): MarketplaceService {
  const cat = row.marketplace_categories;
  return {
    id: row.id,
    categoryId: row.category_id,
    categorySlug: cat?.slug ?? '',
    categoryName: cat?.name ?? '',
    slug: row.slug,
    title: row.title,
    shortDescription: row.short_description,
    sellerId: row.seller_id,
    sellerSlug: row.seller_slug,
    sellerName: row.seller_name,
    sellerLevel: row.seller_level,
    sellerAvatarUrl: row.seller_avatar_url,
    sellerRating: row.marketplace_sellers?.rating
      ? Number(row.marketplace_sellers.rating)
      : Number(row.rating),
    sellerCity: row.marketplace_sellers?.city ?? null,
    thumbnailType: row.thumbnail_type === 'image' ? 'image' : 'gradient',
    thumbnailUrl: row.thumbnail_url,
    coverImagePath: row.cover_image_path,
    coverImageAlt: row.cover_image_alt,
    coverImagePrompt: row.cover_image_prompt,
    coverImageUpdatedAt: row.cover_image_updated_at,
    priceFrom: row.price_from,
    currency: row.currency,
    deliveryDays: row.delivery_days,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    tags: row.tags ?? [],
    rowGroup: row.row_group as MarketplaceService['rowGroup'],
    isPopular: row.is_popular,
    isFeatured: row.is_featured,
    sortOrder: row.sort_order,
  };
}

export async function listMarketplaceCategories(): Promise<DbResult<MarketplaceCategory[]>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable([]);

  const { data, error } = await supabase
    .from('marketplace_categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) return dbError([], error.message);
  return dbSuccess((data as DbMarketplaceCategory[]).map(mapCategory));
}

export async function listMarketplaceServices(): Promise<DbResult<MarketplaceService[]>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable([]);

  const { data, error } = await supabase
    .from('marketplace_services')
    .select(
      `
      *,
      marketplace_categories ( slug, name ),
      marketplace_sellers ( city, rating )
    `
    )
    .order('sort_order', { ascending: true });

  if (error) return dbError([], error.message);
  return dbSuccess((data as DbMarketplaceService[]).map(mapService));
}
