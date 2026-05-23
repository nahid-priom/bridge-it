import 'server-only';

import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { dbError, dbSuccess, dbUnavailable, type DbResult } from '@/lib/db/result';

export interface SellerOrderRow {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  product_title: string | null;
  buyer_label: string;
}

async function resolveMarketplaceSellerId(
  supabase: NonNullable<ReturnType<typeof createAdminSupabaseClient>>,
  sellerId: string
): Promise<string | null> {
  const { data } = await supabase
    .from('marketplace_sellers')
    .select('id')
    .or(`id.eq.${sellerId},legacy_seller_id.eq.${sellerId},user_id.eq.${sellerId}`)
    .maybeSingle();
  return data?.id ?? sellerId;
}

export async function listOrdersForSeller(
  sellerId: string,
  limit = 12
): Promise<DbResult<SellerOrderRow[]>> {
  const supabase = createAdminSupabaseClient();
  if (!supabase) return dbUnavailable([]);

  const marketplaceSellerId = await resolveMarketplaceSellerId(supabase, sellerId);

  const { data, error } = await supabase
    .from('marketplace_orders')
    .select('id, status, total_amount, created_at, buyer_id, metadata, order_number')
    .eq('seller_id', marketplaceSellerId!)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    const legacy = await supabase
      .from('orders')
      .select(
        `id, status, total_amount, created_at, buyer_id, products ( title )`
      )
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (legacy.error) return dbError([], legacy.error.message);
    const rows: SellerOrderRow[] = (legacy.data ?? []).map((o) => {
      const product = o.products as { title?: string } | null;
      return {
        id: o.id,
        status: o.status,
        total_amount: Number(o.total_amount),
        created_at: o.created_at,
        product_title: product?.title ?? null,
        buyer_label: `Buyer ${String(o.buyer_id).slice(0, 8)}`,
      };
    });
    return dbSuccess(rows);
  }

  const rows: SellerOrderRow[] = (data ?? []).map((o) => {
    const meta = o.metadata as { title?: string } | null;
    return {
      id: o.id,
      status: o.status,
      total_amount: Number(o.total_amount),
      created_at: o.created_at,
      product_title: meta?.title ?? o.order_number,
      buyer_label: `Buyer ${String(o.buyer_id).slice(0, 8)}`,
    };
  });

  return dbSuccess(rows);
}

export async function getSellerOrderStats(sellerId: string): Promise<
  DbResult<{
    totalRevenue: number;
    activeOrders: number;
    totalOrders: number;
  }>
> {
  const supabase = createAdminSupabaseClient();
  if (!supabase) return dbUnavailable({ totalRevenue: 0, activeOrders: 0, totalOrders: 0 });

  const marketplaceSellerId = await resolveMarketplaceSellerId(supabase, sellerId);

  const { data, error } = await supabase
    .from('marketplace_orders')
    .select('status, total_amount')
    .eq('seller_id', marketplaceSellerId!);

  if (error) {
    const legacy = await supabase
      .from('orders')
      .select('status, total_amount')
      .eq('seller_id', sellerId);
    if (legacy.error) {
      return dbError({ totalRevenue: 0, activeOrders: 0, totalOrders: 0 }, legacy.error.message);
    }
    const orders = legacy.data ?? [];
    const totalRevenue = orders
      .filter((o) => o.status === 'completed')
      .reduce((sum, o) => sum + Number(o.total_amount), 0);
    const activeOrders = orders.filter((o) =>
      ['pending', 'in-progress', 'review'].includes(o.status)
    ).length;
    return dbSuccess({
      totalRevenue,
      activeOrders,
      totalOrders: orders.length,
    });
  }

  const orders = data ?? [];
  const totalRevenue = orders
    .filter((o) => o.status === 'completed' || o.status === 'paid')
    .reduce((sum, o) => sum + Number(o.total_amount), 0);
  const activeOrders = orders.filter((o) =>
    ['pending', 'paid', 'in_progress', 'delivered'].includes(o.status)
  ).length;

  return dbSuccess({
    totalRevenue,
    activeOrders,
    totalOrders: orders.length,
  });
}
