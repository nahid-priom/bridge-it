import { getDbClient } from '@/lib/db/server';
import { dbError, dbSuccess, dbUnavailable, type DbResult } from '@/lib/db/result';
import { SERVICE_PRODUCT_TYPES } from '@/lib/db/mappers';

const SEARCH_SELECT = `
  id, slug, title, short_description, description, price, rating, reviews_count,
  delivery_time, image_url, badge, seller_level, is_featured, is_promoted,
  product_type, category_id, seller_id,
  categories ( key, label, slug ),
  sellers ( slug, name ),
  product_tags ( tag )
`;

export type MarketplaceSearchOptions = {
  query: string;
  limit?: number;
  categoryKey?: string;
};

export async function searchMarketplaceProducts(
  options: MarketplaceSearchOptions
): Promise<DbResult<Record<string, unknown>[]>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable([]);

  const trimmed = options.query.trim();
  const limit = options.limit ?? 80;

  let categoryId: string | undefined;
  if (options.categoryKey && options.categoryKey !== 'all') {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('key', options.categoryKey)
      .maybeSingle();
    categoryId = cat?.id;
  }

  if (!trimmed) {
    let query = supabase
      .from('products')
      .select(SEARCH_SELECT)
      .eq('status', 'active')
      .order('is_promoted', { ascending: false })
      .order('rating', { ascending: false })
      .limit(limit);

    if (categoryId) query = query.eq('category_id', categoryId);
    const { data, error } = await query;
    if (error) return dbError([], error.message);
    return dbSuccess(data ?? []);
  }

  let query = supabase
    .from('products')
    .select(SEARCH_SELECT)
    .eq('status', 'active')
    .textSearch('search_vector', trimmed, { type: 'websearch', config: 'english' })
    .limit(limit);

  if (categoryId) query = query.eq('category_id', categoryId);

  const { data, error } = await query;

  if (error) {
    let fallback = supabase
      .from('products')
      .select(SEARCH_SELECT)
      .eq('status', 'active')
      .or(
        `title.ilike.%${trimmed}%,short_description.ilike.%${trimmed}%,description.ilike.%${trimmed}%`
      )
      .limit(limit);
    if (categoryId) fallback = fallback.eq('category_id', categoryId);
    const fallbackResult = await fallback;
    if (fallbackResult.error) return dbError([], fallbackResult.error.message);
    return dbSuccess(fallbackResult.data ?? []);
  }

  return dbSuccess(data ?? []);
}

export async function searchProductTags(
  tagQuery: string,
  limit = 20
): Promise<DbResult<string[]>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable([]);

  const trimmed = tagQuery.trim();
  if (!trimmed) return dbSuccess([]);

  const { data, error } = await supabase
    .from('product_tags')
    .select('tag')
    .ilike('tag', `%${trimmed}%`)
    .limit(limit);

  if (error) return dbError([], error.message);
  return dbSuccess([...new Set((data ?? []).map((row) => row.tag))]);
}

export async function listServicesForSearch(limit = 100) {
  return searchMarketplaceProducts({
    query: '',
    limit,
  });
}

export { SERVICE_PRODUCT_TYPES };
