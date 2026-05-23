import { getDbClient } from '@/lib/db/server';
import { dbError, dbSuccess, dbUnavailable, type DbResult } from '@/lib/db/result';
import { normalizeProductCategoryKey } from '@/lib/catalog/category-keys';
import { SERVICE_PRODUCT_TYPES } from '@/lib/db/mappers';
import type { SearchSortOption } from '@/lib/searchFilter';
import type {
  DbProductListItem,
  ProductType,
  ProductWithRelations,
} from '@/types/database.types';

const PRODUCT_LIST_COLUMNS =
  'id, slug, title, short_description, description, category_id, seller_id, price, old_price, rating, reviews_count, delivery_time, image_url, badge, seller_level, is_featured, is_promoted, product_type, status, created_at, updated_at';

const PRODUCT_LIST_WITH_RELATIONS = `
  ${PRODUCT_LIST_COLUMNS},
  categories ( key, label, slug ),
  sellers ( slug, name, seller_level ),
  product_tags ( tag )
`;

const PRODUCT_DETAIL_SELECT = `
  ${PRODUCT_LIST_COLUMNS},
  metadata,
  categories ( key, label, slug ),
  sellers ( slug, name, seller_level ),
  product_tags ( tag ),
  product_images ( url, sort_order, is_primary )
`;

export type ListProductsOptions = {
  limit?: number;
  offset?: number;
  featuredOnly?: boolean;
  promotedOnly?: boolean;
  categoryId?: string;
  categoryKey?: string;
  sellerId?: string;
  sellerSlug?: string;
  productTypes?: ProductType[];
  productType?: ProductType;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  deliveryTime?: 'all' | 'instant' | '1-3' | '4-7' | '8-14' | '15+';
  sellerLevel?: string;
  featuredFilter?: boolean;
  promotedFilter?: boolean;
  verifiedOnly?: boolean;
  sort?: SearchSortOption;
};

function deliveryFilterSql(delivery: ListProductsOptions['deliveryTime']): string | null {
  if (!delivery || delivery === 'all') return null;
  if (delivery === 'instant') return 'delivery_time.ilike.%instant%';
  if (delivery === '1-3') return 'delivery_time.ilike.%1 day%,delivery_time.ilike.%2 day%,delivery_time.ilike.%3 day%';
  if (delivery === '4-7') return 'delivery_time.ilike.%5 day%,delivery_time.ilike.%7 day%';
  if (delivery === '8-14') return 'delivery_time.ilike.%10 day%,delivery_time.ilike.%14 day%';
  return null;
}

function applySort<T extends { order: (col: string, opts: { ascending: boolean }) => T }>(
  query: T,
  sort: SearchSortOption = 'popular'
): T {
  switch (sort) {
    case 'rating':
      return query.order('rating', { ascending: false }).order('reviews_count', { ascending: false });
    case 'price-low':
      return query.order('price', { ascending: true });
    case 'price-high':
      return query.order('price', { ascending: false });
    case 'newest':
      return query.order('created_at', { ascending: false });
    case 'popular':
      return query
        .order('is_promoted', { ascending: false })
        .order('is_featured', { ascending: false })
        .order('reviews_count', { ascending: false });
    default:
      return query
        .order('is_featured', { ascending: false })
        .order('rating', { ascending: false })
        .order('reviews_count', { ascending: false });
  }
}

export async function listProductsFiltered(
  options: ListProductsOptions = {}
): Promise<DbResult<(DbProductListItem & Partial<ProductWithRelations>)[]>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable([]);

  const {
    limit = 120,
    offset = 0,
    categoryId,
    categoryKey,
    sellerId,
    sellerSlug,
    productTypes,
    productType = 'product',
    q,
    minPrice = 0,
    maxPrice = 200000,
    minRating = 0,
    deliveryTime = 'all',
    sellerLevel,
    featuredFilter,
    promotedFilter,
    verifiedOnly,
    sort = 'popular',
  } = options;

  let resolvedCategoryId = categoryId;
  if (!resolvedCategoryId && categoryKey) {
    const normalized = normalizeProductCategoryKey(categoryKey);
    const key = normalized ?? categoryKey;
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('key', key)
      .maybeSingle();
    resolvedCategoryId = cat?.id;
  }

  let resolvedSellerId = sellerId;
  if (!resolvedSellerId && sellerSlug) {
    const { data: seller } = await supabase
      .from('sellers')
      .select('id')
      .eq('slug', sellerSlug)
      .maybeSingle();
    resolvedSellerId = seller?.id;
  }

  const types = productTypes ?? (productType ? [productType] : ['product']);

  let query = supabase
    .from('products')
    .select(PRODUCT_LIST_WITH_RELATIONS)
    .eq('status', 'active')
    .in('product_type', types)
    .gte('price', minPrice)
    .lte('price', maxPrice);

  if (resolvedCategoryId) query = query.eq('category_id', resolvedCategoryId);
  if (resolvedSellerId) query = query.eq('seller_id', resolvedSellerId);
  if (minRating > 0) query = query.gte('rating', minRating);
  if (featuredFilter) query = query.eq('is_featured', true);
  if (promotedFilter) query = query.eq('is_promoted', true);
  if (verifiedOnly) query = query.eq('seller_level', 'Top Rated');
  if (sellerLevel && sellerLevel !== 'all') query = query.eq('seller_level', sellerLevel);

  const deliveryOr = deliveryFilterSql(deliveryTime);
  if (deliveryOr) query = query.or(deliveryOr);

  const trimmed = q?.trim() ?? '';
  if (trimmed) {
    query = query.or(
      `title.ilike.%${trimmed}%,short_description.ilike.%${trimmed}%,description.ilike.%${trimmed}%`
    );
  }

  query = applySort(query, sort);
  query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;
  if (error) return dbError([], error.message);
  return dbSuccess((data ?? []) as (DbProductListItem & Partial<ProductWithRelations>)[]);
}

export async function listActiveProducts(
  options: ListProductsOptions = {}
): Promise<DbResult<DbProductListItem[]>> {
  return listProductsFiltered(options) as Promise<DbResult<DbProductListItem[]>>;
}

export async function getProductBySlug(
  slug: string
): Promise<DbResult<ProductWithRelations | null>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable(null);

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_DETAIL_SELECT)
    .eq('slug', slug)
    .eq('status', 'active')
    .maybeSingle();

  if (error) return dbError(null, error.message);
  return dbSuccess((data as ProductWithRelations | null) ?? null);
}

export async function getServiceBySlug(
  slug: string
): Promise<DbResult<ProductWithRelations | null>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable(null);

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_DETAIL_SELECT)
    .eq('slug', slug)
    .eq('status', 'active')
    .in('product_type', SERVICE_PRODUCT_TYPES)
    .maybeSingle();

  if (error) return dbError(null, error.message);
  return dbSuccess((data as ProductWithRelations | null) ?? null);
}

export async function getProductById(
  id: string
): Promise<DbResult<ProductWithRelations | null>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable(null);

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_DETAIL_SELECT)
    .eq('id', id)
    .eq('status', 'active')
    .maybeSingle();

  if (error) return dbError(null, error.message);
  return dbSuccess((data as ProductWithRelations | null) ?? null);
}

export async function getSimilarProducts(
  productId: string,
  categoryId: string,
  tags: string[],
  excludeSlug: string,
  limit = 8
): Promise<DbResult<(DbProductListItem & Partial<ProductWithRelations>)[]>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable([]);

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_LIST_WITH_RELATIONS)
    .eq('status', 'active')
    .eq('category_id', categoryId)
    .neq('slug', excludeSlug)
    .order('is_promoted', { ascending: false })
    .order('is_featured', { ascending: false })
    .order('rating', { ascending: false })
    .limit(limit * 3);

  if (error) return dbError([], error.message);

  const tagSet = new Set(tags.map((t) => t.toLowerCase()));
  const scored = (data ?? []).map((row) => {
    const rowTags =
      (row as ProductWithRelations).product_tags?.map((t) => t.tag.toLowerCase()) ?? [];
    const shared = rowTags.filter((t) => tagSet.has(t)).length;
    let score = shared * 12;
    if (row.is_promoted) score += 8;
    if (row.is_featured) score += 5;
    score += Number(row.rating) * 2;
    return { row, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return dbSuccess(scored.slice(0, limit).map((s) => s.row));
}

export async function getFeaturedProducts(
  limit = 12
): Promise<DbResult<(DbProductListItem & Partial<ProductWithRelations>)[]>> {
  return listProductsFiltered({
    limit,
    featuredFilter: true,
    productTypes: [...SERVICE_PRODUCT_TYPES, 'product'],
    sort: 'popular',
  });
}

export async function getPromotedProducts(
  limit = 12
): Promise<DbResult<(DbProductListItem & Partial<ProductWithRelations>)[]>> {
  return listProductsFiltered({
    limit,
    promotedFilter: true,
    productTypes: [...SERVICE_PRODUCT_TYPES, 'product'],
    sort: 'popular',
  });
}

export async function listProductSlugs(
  productTypes?: ProductType[]
): Promise<DbResult<string[]>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable([]);

  let query = supabase.from('products').select('slug').eq('status', 'active');
  if (productTypes?.length) query = query.in('product_type', productTypes);

  const { data, error } = await query.limit(500);
  if (error) return dbError([], error.message);
  return dbSuccess((data ?? []).map((r) => r.slug));
}

export async function getCategoryProductCounts(): Promise<DbResult<Record<string, number>>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable({ all: 0 });

  const { data, error } = await supabase
    .from('products')
    .select('category_id, categories ( key )')
    .eq('status', 'active')
    .eq('product_type', 'product');

  if (error) return dbError({ all: 0 }, error.message);

  const counts: Record<string, number> = { all: data?.length ?? 0 };
  for (const row of data ?? []) {
    const key = (row.categories as { key: string } | null)?.key;
    if (key) counts[key] = (counts[key] ?? 0) + 1;
  }
  return dbSuccess(counts);
}
