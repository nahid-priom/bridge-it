import { getDbClient } from '@/lib/db/server';
import { dbError, dbSuccess, dbUnavailable, type DbResult } from '@/lib/db/result';
import type { MarketplaceProduct, MarketplaceProductCategory } from '@/types/marketplaceProduct';

type DbCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_featured: boolean;
};

type DbProduct = {
  id: string;
  slug: string;
  category_id: string;
  name: string;
  short_description: string | null;
  full_description: string | null;
  thumbnail_url: string | null;
  cover_image_path: string | null;
  cover_image_alt: string | null;
  cover_image_prompt: string | null;
  cover_image_updated_at: string | null;
  gallery: string[] | null;
  price: number;
  compare_price: number | null;
  currency: string;
  stock: number;
  brand: string | null;
  sku: string | null;
  tags: string[] | null;
  specifications: Record<string, string> | null;
  is_featured: boolean;
  is_popular: boolean;
  rating: number;
  review_count: number;
  marketplace_product_categories: { slug: string; name: string } | null;
};

function mapCategory(row: DbCategory): MarketplaceProductCategory {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    icon: row.icon,
    sortOrder: row.sort_order,
    isFeatured: row.is_featured,
  };
}

function mapProduct(row: DbProduct): MarketplaceProduct {
  const cat = row.marketplace_product_categories;
  return {
    id: row.id,
    slug: row.slug,
    categoryId: row.category_id,
    categorySlug: cat?.slug ?? '',
    categoryName: cat?.name ?? '',
    name: row.name,
    shortDescription: row.short_description,
    fullDescription: row.full_description,
    thumbnailUrl: row.thumbnail_url,
    coverImagePath: row.cover_image_path,
    coverImageAlt: row.cover_image_alt,
    coverImagePrompt: row.cover_image_prompt,
    coverImageUpdatedAt: row.cover_image_updated_at,
    gallery: row.gallery ?? [],
    price: row.price,
    comparePrice: row.compare_price,
    currency: row.currency,
    stock: row.stock,
    brand: row.brand,
    sku: row.sku,
    tags: row.tags ?? [],
    specifications: row.specifications ?? {},
    isFeatured: row.is_featured,
    isPopular: row.is_popular,
    rating: Number(row.rating),
    reviewCount: row.review_count,
  };
}

export async function listMarketplaceProductCategories(): Promise<
  DbResult<MarketplaceProductCategory[]>
> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable([]);

  const { data, error } = await supabase
    .from('marketplace_product_categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) return dbError([], error.message);
  return dbSuccess((data as DbCategory[]).map(mapCategory));
}

export async function listMarketplaceProducts(): Promise<DbResult<MarketplaceProduct[]>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable([]);

  const { data, error } = await supabase
    .from('marketplace_products')
    .select(
      `
      *,
      marketplace_product_categories ( slug, name )
    `
    )
    .order('is_featured', { ascending: false })
    .order('is_popular', { ascending: false });

  if (error) return dbError([], error.message);
  return dbSuccess((data as DbProduct[]).map(mapProduct));
}

export async function getMarketplaceProductBySlug(
  slug: string
): Promise<DbResult<MarketplaceProduct | null>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable(null);

  const { data, error } = await supabase
    .from('marketplace_products')
    .select(
      `
      *,
      marketplace_product_categories ( slug, name )
    `
    )
    .eq('slug', slug)
    .maybeSingle();

  if (error) return dbError(null, error.message);
  if (!data) return dbSuccess(null);
  return dbSuccess(mapProduct(data as DbProduct));
}
