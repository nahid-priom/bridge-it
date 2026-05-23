import { getDbClient } from '@/lib/db/server';
import { dbError, dbSuccess, dbUnavailable, type DbResult } from '@/lib/db/result';
import type { DbCategory } from '@/types/database.types';

export async function listActiveCategories(): Promise<DbResult<DbCategory[]>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable([]);

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) return dbError([], error.message);
  return dbSuccess(data ?? []);
}

export async function getCategoryByKey(
  key: string
): Promise<DbResult<DbCategory | null>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable(null);

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('key', key)
    .eq('is_active', true)
    .maybeSingle();

  if (error) return dbError(null, error.message);
  return dbSuccess(data);
}

export async function getCategoryBySlug(
  slug: string
): Promise<DbResult<DbCategory | null>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable(null);

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) return dbError(null, error.message);
  return dbSuccess(data);
}

export async function listProductCategoryRows(): Promise<DbResult<DbCategory[]>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable([]);

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) return dbError([], error.message);
  return dbSuccess(data ?? []);
}
