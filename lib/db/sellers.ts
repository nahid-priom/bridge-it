import { getDbClient } from '@/lib/db/server';
import { dbError, dbSuccess, dbUnavailable, type DbResult } from '@/lib/db/result';
import type { DbSeller } from '@/types/database.types';

function mapMarketplaceSellerToDbSeller(row: Record<string, unknown>): DbSeller {
  return {
    id: row.id as string,
    user_id: (row.user_id as string) ?? null,
    slug: row.slug as string,
    name: row.full_name as string,
    tagline: (row.title as string) ?? null,
    avatar_url: (row.avatar_url as string) ?? null,
    cover_image_url: (row.banner_url as string) ?? null,
    description: (row.about as string) ?? null,
    location: (row.city as string) ?? null,
    category_key: (row.primary_category_slug as string) ?? null,
    rating: Number(row.rating ?? 0),
    review_count: Number(row.total_reviews ?? 0),
    verified: Boolean(row.is_verified),
    seller_level: (row.seller_level as string) ?? 'Level 1 Seller',
    completed_projects: Number(row.total_orders ?? 0),
    response_time: (row.response_time as string) ?? null,
    joined_at: (row.member_since as string) ?? new Date().toISOString(),
    is_public: row.is_public !== false,
    status: row.status === 'suspended' ? 'suspended' : 'active',
    created_at: (row.created_at as string) ?? new Date().toISOString(),
    updated_at: (row.updated_at as string) ?? new Date().toISOString(),
  };
}

export async function listPublicSellers(
  limit = 50
): Promise<DbResult<DbSeller[]>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable([]);

  const { data, error } = await supabase
    .from('marketplace_sellers')
    .select('*')
    .eq('is_public', true)
    .in('status', ['active'])
    .order('rating', { ascending: false })
    .limit(limit);

  if (error) {
    const legacy = await supabase
      .from('sellers')
      .select('*')
      .eq('is_public', true)
      .eq('status', 'active')
      .order('rating', { ascending: false })
      .limit(limit);
    if (legacy.error) return dbError([], legacy.error.message);
    return dbSuccess(legacy.data ?? []);
  }

  return dbSuccess((data ?? []).map((r) => mapMarketplaceSellerToDbSeller(r)));
}

export async function getSellerBySlug(
  slug: string
): Promise<DbResult<DbSeller | null>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable(null);

  const { data, error } = await supabase
    .from('marketplace_sellers')
    .select('*')
    .eq('slug', slug)
    .eq('is_public', true)
    .eq('status', 'active')
    .maybeSingle();

  if (error || !data) {
    const legacy = await supabase
      .from('sellers')
      .select('*')
      .eq('slug', slug)
      .eq('is_public', true)
      .eq('status', 'active')
      .maybeSingle();
    if (legacy.error) return dbError(null, legacy.error.message);
    return dbSuccess(legacy.data);
  }

  return dbSuccess(mapMarketplaceSellerToDbSeller(data));
}

export async function getSellerById(
  id: string
): Promise<DbResult<DbSeller | null>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable(null);

  const { data, error } = await supabase
    .from('marketplace_sellers')
    .select('*')
    .or(`id.eq.${id},legacy_seller_id.eq.${id}`)
    .maybeSingle();

  if (error || !data) {
    const legacy = await supabase.from('sellers').select('*').eq('id', id).maybeSingle();
    if (legacy.error) return dbError(null, legacy.error.message);
    return dbSuccess(legacy.data);
  }

  return dbSuccess(mapMarketplaceSellerToDbSeller(data));
}

export async function listSellerSlugs(): Promise<DbResult<string[]>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable([]);

  const { data, error } = await supabase
    .from('marketplace_sellers')
    .select('slug')
    .eq('is_public', true)
    .eq('status', 'active')
    .limit(500);

  if (error) {
    const legacy = await supabase
      .from('sellers')
      .select('slug')
      .eq('is_public', true)
      .eq('status', 'active')
      .limit(500);
    if (legacy.error) return dbError([], legacy.error.message);
    return dbSuccess((legacy.data ?? []).map((r) => r.slug));
  }

  return dbSuccess((data ?? []).map((r) => r.slug));
}
