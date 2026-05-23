import { getDbClient } from '@/lib/db/server';
import { dbError, dbSuccess, dbUnavailable, type DbResult } from '@/lib/db/result';
import type { DbSeller } from '@/types/database.types';

export async function listPublicSellers(
  limit = 50
): Promise<DbResult<DbSeller[]>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable([]);

  const { data, error } = await supabase
    .from('sellers')
    .select('*')
    .eq('is_public', true)
    .eq('status', 'active')
    .order('rating', { ascending: false })
    .limit(limit);

  if (error) return dbError([], error.message);
  return dbSuccess(data ?? []);
}

export async function getSellerBySlug(
  slug: string
): Promise<DbResult<DbSeller | null>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable(null);

  const { data, error } = await supabase
    .from('sellers')
    .select('*')
    .eq('slug', slug)
    .eq('is_public', true)
    .eq('status', 'active')
    .maybeSingle();

  if (error) return dbError(null, error.message);
  return dbSuccess(data);
}

export async function getSellerById(
  id: string
): Promise<DbResult<DbSeller | null>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable(null);

  const { data, error } = await supabase
    .from('sellers')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) return dbError(null, error.message);
  return dbSuccess(data);
}

export async function listSellerSlugs(): Promise<DbResult<string[]>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable([]);

  const { data, error } = await supabase
    .from('sellers')
    .select('slug')
    .eq('is_public', true)
    .eq('status', 'active')
    .limit(500);

  if (error) return dbError([], error.message);
  return dbSuccess((data ?? []).map((r) => r.slug));
}
