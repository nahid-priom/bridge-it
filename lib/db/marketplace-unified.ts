import 'server-only';

import { getDbClient } from '@/lib/db/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { dbError, dbSuccess, dbUnavailable, type DbResult } from '@/lib/db/result';
import type {
  MarketplaceAnalyticsSnapshot,
  MarketplaceMilestoneRow,
  MarketplaceNotificationRow,
  MarketplaceOrderRow,
  MarketplaceSellerAccount,
  MarketplaceTransactionRow,
  MarketplaceWalletRow,
} from '@/types/marketplace-unified';

export async function getMarketplaceSellerByUserId(
  userId: string
): Promise<DbResult<MarketplaceSellerAccount | null>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable(null);

  const { data, error } = await supabase
    .from('marketplace_sellers')
    .select(
      'id, user_id, slug, full_name, title, avatar_url, status, rating, total_orders, is_verified, is_featured'
    )
    .eq('user_id', userId)
    .maybeSingle();

  if (error) return dbError(null, error.message);
  if (!data) return dbSuccess(null);

  return dbSuccess({
    id: data.id,
    userId: data.user_id,
    slug: data.slug,
    fullName: data.full_name,
    title: data.title,
    avatarUrl: data.avatar_url,
    status: (data.status ?? 'active') as MarketplaceSellerAccount['status'],
    rating: Number(data.rating ?? 0),
    totalOrders: data.total_orders ?? 0,
    isVerified: Boolean(data.is_verified),
    isFeatured: Boolean(data.is_featured),
  });
}

export async function getMarketplaceSellerByLegacyOrUser(opts: {
  sellerId?: string | null;
  userId?: string | null;
}): Promise<DbResult<MarketplaceSellerAccount | null>> {
  if (opts.userId) {
    const byUser = await getMarketplaceSellerByUserId(opts.userId);
    if (byUser.data) return byUser;
  }

  if (!opts.sellerId) return dbSuccess(null);

  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable(null);

  const { data, error } = await supabase
    .from('marketplace_sellers')
    .select(
      'id, user_id, slug, full_name, title, avatar_url, status, rating, total_orders, is_verified, is_featured'
    )
    .or(`id.eq.${opts.sellerId},legacy_seller_id.eq.${opts.sellerId}`)
    .maybeSingle();

  if (error) return dbError(null, error.message);
  if (!data) return dbSuccess(null);

  return dbSuccess({
    id: data.id,
    userId: data.user_id,
    slug: data.slug,
    fullName: data.full_name,
    title: data.title,
    avatarUrl: data.avatar_url,
    status: (data.status ?? 'active') as MarketplaceSellerAccount['status'],
    rating: Number(data.rating ?? 0),
    totalOrders: data.total_orders ?? 0,
    isVerified: Boolean(data.is_verified),
    isFeatured: Boolean(data.is_featured),
  });
}

export async function listBuyerOrders(
  buyerId: string,
  limit = 50
): Promise<DbResult<MarketplaceOrderRow[]>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable([]);

  const { data, error } = await supabase
    .from('marketplace_orders')
    .select('*')
    .eq('buyer_id', buyerId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) return dbError([], error.message);
  return dbSuccess((data ?? []) as MarketplaceOrderRow[]);
}

export async function listSellerOrders(
  marketplaceSellerId: string,
  limit = 50
): Promise<DbResult<MarketplaceOrderRow[]>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable([]);

  const { data, error } = await supabase
    .from('marketplace_orders')
    .select('*')
    .eq('seller_id', marketplaceSellerId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) return dbError([], error.message);
  return dbSuccess((data ?? []) as MarketplaceOrderRow[]);
}

export async function listOrderMilestones(
  orderId: string
): Promise<DbResult<MarketplaceMilestoneRow[]>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable([]);

  const { data, error } = await supabase
    .from('marketplace_milestones')
    .select('*')
    .eq('order_id', orderId)
    .order('sort_order');

  if (error) return dbError([], error.message);
  return dbSuccess((data ?? []) as MarketplaceMilestoneRow[]);
}

export async function getOrCreateBuyerWallet(
  buyerId: string
): Promise<DbResult<MarketplaceWalletRow>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable({} as MarketplaceWalletRow);

  const { data: existing } = await supabase
    .from('marketplace_wallets')
    .select('*')
    .eq('owner_id', buyerId)
    .eq('owner_type', 'buyer')
    .maybeSingle();

  if (existing) return dbSuccess(existing as MarketplaceWalletRow);

  const { data, error } = await supabase
    .from('marketplace_wallets')
    .insert({ owner_id: buyerId, owner_type: 'buyer' })
    .select('*')
    .single();

  if (error) return dbError({} as MarketplaceWalletRow, error.message);
  return dbSuccess(data as MarketplaceWalletRow);
}

export async function listWalletTransactions(
  walletId: string,
  limit = 30
): Promise<DbResult<MarketplaceTransactionRow[]>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable([]);

  const { data, error } = await supabase
    .from('marketplace_transactions')
    .select('*')
    .eq('wallet_id', walletId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) return dbError([], error.message);
  return dbSuccess((data ?? []) as MarketplaceTransactionRow[]);
}

export async function listUserNotifications(
  userId: string,
  limit = 30
): Promise<DbResult<MarketplaceNotificationRow[]>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable([]);

  const { data, error } = await supabase
    .from('marketplace_notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) return dbError([], error.message);
  return dbSuccess((data ?? []) as MarketplaceNotificationRow[]);
}

export async function fetchMarketplaceAnalytics(): Promise<
  DbResult<MarketplaceAnalyticsSnapshot>
> {
  const supabase = createAdminSupabaseClient();
  const empty: MarketplaceAnalyticsSnapshot = {
    gmv: 0,
    orderCount: 0,
    activeSellers: 0,
    activeBuyers: 0,
    revenue: 0,
    topCategories: [],
  };

  if (!supabase) return dbUnavailable(empty);

  const [ordersRes, sellersRes, buyersRes, servicesRes] = await Promise.all([
    supabase.from('marketplace_orders').select('total_amount, status'),
    supabase
      .from('marketplace_sellers')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active'),
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'buyer'),
    supabase.from('marketplace_services').select('category_slug'),
  ]);

  const orders = ordersRes.data ?? [];
  const gmv = orders.reduce((s, o) => s + Number(o.total_amount), 0);
  const revenue = orders
    .filter((o) => o.status === 'completed' || o.status === 'paid')
    .reduce((s, o) => s + Number(o.total_amount), 0);

  const catCount: Record<string, number> = {};
  for (const svc of servicesRes.data ?? []) {
    const slug = (svc as { category_slug?: string }).category_slug ?? 'general';
    catCount[slug] = (catCount[slug] ?? 0) + 1;
  }

  const topCategories = Object.entries(catCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([slug, count]) => ({ slug, name: slug.replace(/-/g, ' '), count }));

  return dbSuccess({
    gmv,
    orderCount: orders.length,
    activeSellers: sellersRes.count ?? 0,
    activeBuyers: buyersRes.count ?? 0,
    revenue,
    topCategories,
  });
}

export async function createMarketplaceNotification(input: {
  userId: string;
  title: string;
  body?: string;
  notificationType: string;
  metadata?: Record<string, unknown>;
}): Promise<DbResult<MarketplaceNotificationRow | null>> {
  const supabase = createAdminSupabaseClient();
  if (!supabase) return dbUnavailable(null);

  const { data, error } = await supabase
    .from('marketplace_notifications')
    .insert({
      user_id: input.userId,
      title: input.title,
      body: input.body ?? null,
      notification_type: input.notificationType,
      metadata: input.metadata ?? {},
    } as never)
    .select('*')
    .single();

  if (error) return dbError(null, error.message);
  return dbSuccess(data as MarketplaceNotificationRow);
}

export async function upsertMarketplaceSellerFromApplication(input: {
  userId: string;
  slug: string;
  displayName: string;
  businessName: string;
  bio: string;
  location: string | null;
  categoryFocus: string;
  applicationId: string;
}): Promise<DbResult<{ id: string }>> {
  const supabase = createAdminSupabaseClient();
  if (!supabase) return dbUnavailable({ id: '' });

  const { data, error } = await supabase
    .from('marketplace_sellers')
    .upsert(
      {
        user_id: input.userId,
        slug: input.slug,
        full_name: input.displayName,
        username: input.slug.split('-')[0],
        title: input.businessName || input.displayName,
        short_bio: input.bio?.slice(0, 200) ?? null,
        about: input.bio,
        city: input.location,
        primary_category_slug: input.categoryFocus,
        status: 'active',
        is_public: true,
        is_verified: false,
        application_id: input.applicationId,
      } as never,
      { onConflict: 'user_id' }
    )
    .select('id')
    .single();

  if (error || !data) return dbError({ id: '' }, error?.message ?? 'Failed to create seller');
  return dbSuccess({ id: data.id });
}
