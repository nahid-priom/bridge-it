import { getDbClient } from '@/lib/db/server';
import { dbError, dbSuccess, dbUnavailable, type DbResult } from '@/lib/db/result';
import type { DbReview } from '@/types/database.types';

export type ListReviewsOptions = {
  limit?: number;
  minRating?: number;
};

export async function listReviewsByProductId(
  productId: string,
  options: ListReviewsOptions = {}
): Promise<DbResult<DbReview[]>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable([]);

  const { limit = 6, minRating = 0 } = options;

  let query = supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (minRating > 0) query = query.gte('rating', minRating);

  const { data, error } = await query;
  if (error) return dbError([], error.message);
  return dbSuccess(data ?? []);
}

export async function listReviewsByProductSlug(
  productSlug: string,
  options: ListReviewsOptions = {}
): Promise<DbResult<DbReview[]>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable([]);

  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id')
    .eq('slug', productSlug)
    .eq('status', 'active')
    .maybeSingle();

  if (productError) return dbError([], productError.message);
  if (!product) return dbSuccess([]);

  return listReviewsByProductId(product.id, options);
}

export async function listRecentReviews(
  limit = 12
): Promise<DbResult<(DbReview & { products?: { slug: string; title: string } | null })[]>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable([]);

  const { data, error } = await supabase
    .from('reviews')
    .select('*, products ( slug, title )')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) return dbError([], error.message);
  return dbSuccess(data ?? []);
}

export async function getSellerReviewStats(sellerId: string): Promise<
  DbResult<{ avgRating: number; count: number }>
> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable({ avgRating: 0, count: 0 });

  const { data: products } = await supabase
    .from('products')
    .select('id')
    .eq('seller_id', sellerId);

  const ids = (products ?? []).map((p) => p.id);
  if (!ids.length) return dbSuccess({ avgRating: 0, count: 0 });

  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('rating')
    .in('product_id', ids);

  if (error) return dbError({ avgRating: 0, count: 0 }, error.message);
  const count = reviews?.length ?? 0;
  const avg =
    count > 0
      ? (reviews!.reduce((s, r) => s + Number(r.rating), 0) / count)
      : 0;
  return dbSuccess({ avgRating: Math.round(avg * 10) / 10, count });
}
