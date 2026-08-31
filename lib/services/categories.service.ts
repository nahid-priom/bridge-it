import type { BitpCategory } from '@/types/bitp';
import { getServerClient, getAdminClient } from '@/lib/services/client';

export async function getActiveCategories(): Promise<BitpCategory[]> {
  const supabase = await getServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[categories.service] getActiveCategories', error.message);
    return [];
  }
  return (data ?? []) as BitpCategory[];
}

export async function getCategoryBySlug(slug: string): Promise<BitpCategory | null> {
  const supabase = await getServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    console.error('[categories.service] getCategoryBySlug', error.message);
    return null;
  }
  return data as BitpCategory | null;
}

export async function getAllCategoriesAdmin(): Promise<BitpCategory[]> {
  const supabase = await getServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) return [];
  return (data ?? []) as BitpCategory[];
}

export async function upsertCategoryAdmin(
  input: Partial<BitpCategory> & Pick<BitpCategory, 'name' | 'slug'>
): Promise<{ data: BitpCategory | null; error: string | null }> {
  const supabase = await getAdminClient();
  if (!supabase) return { data: null, error: 'Supabase not configured' };

  const payload = {
    ...input,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('categories')
    .upsert(payload, { onConflict: 'slug' })
    .select('*')
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as BitpCategory, error: null };
}

export async function deleteCategoryAdmin(id: string): Promise<{ error: string | null }> {
  const supabase = await getAdminClient();
  if (!supabase) return { error: 'Supabase not configured' };

  const { count } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('category_id', id);

  if ((count ?? 0) > 0) {
    return { error: 'Cannot delete category with existing products.' };
  }

  const { error } = await supabase.from('categories').delete().eq('id', id);
  return { error: error?.message ?? null };
}
