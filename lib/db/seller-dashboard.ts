import 'server-only';

import { getCurrentProfile } from '@/lib/auth/get-current-user';
import {
  getMarketplaceSellerByUserId,
  listSellerOrders,
  listUserNotifications,
} from '@/lib/db/marketplace-unified';
import { getDbClient } from '@/lib/db/server';
import { dbSuccess, dbUnavailable, type DbResult } from '@/lib/db/result';
import {
  computeSellerSetupProgress,
  type SellerSetupInput,
  type SellerSetupTaskId,
} from '@/lib/seller/setup-progress';

/** Loose row typing — generated DB types may lag marketplace migrations */
type SellerRow = {
  id: string;
  slug: string;
  full_name: string;
  title: string;
  short_bio: string | null;
  about: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  rating: number | null;
  total_reviews: number | null;
  response_rate: number | null;
  seller_level: string | null;
  is_verified: boolean | null;
  user_id?: string;
};

type ServiceRow = {
  id: string;
  slug: string;
  title: string;
  price_from: number;
  currency: string | null;
  rating: number | null;
  review_count: number | null;
  is_featured: boolean | null;
  is_popular: boolean | null;
  seller_id: string | null;
};

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  price: number;
  currency: string | null;
  stock: number | null;
  rating: number | null;
  review_count: number | null;
  seller_id: string | null;
};

type ReviewRow = {
  id: string;
  client_name: string;
  client_country: string | null;
  rating: number;
  review_text: string;
  project_title: string | null;
  created_at: string;
  seller_id: string;
};

type ClientRow = {
  id: string;
  client_name: string;
  logo_url: string | null;
  seller_id: string;
};

type ConversationRow = {
  id: string;
  subject: string | null;
  buyer_id: string;
  last_message_at: string;
  order_id: string | null;
  seller_id: string;
};

type PayoutRow = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  payout_method: string | null;
  created_at: string;
  processed_at: string | null;
  seller_id: string;
  metadata: Record<string, unknown> | null;
};

type TransactionRow = {
  id: string;
  transaction_type: string;
  amount: number;
  currency: string | null;
  description: string | null;
  created_at: string;
};

export interface SellerDashboardStats {
  totalRevenue: number;
  activeOrders: number;
  totalOrders: number;
  completedOrders: number;
  pendingMilestones: number;
  walletBalance: number;
  pendingBalance: number;
  rating: number;
  totalReviews: number;
  responseRate: number;
  impressions: number;
  clicks: number;
  conversionRate: number;
  earningsThisMonth: number;
  pendingClearance: number;
}

export interface SellerDashboardOrder {
  id: string;
  orderNumber: string;
  title: string;
  status: string;
  amount: number;
  currency: string;
  createdAt: string;
  buyerLabel: string;
  deliveryDate: string | null;
}

export interface SellerDashboardService {
  id: string;
  slug: string;
  title: string;
  priceFrom: number;
  currency: string;
  rating: number;
  reviewCount: number;
  status: 'published' | 'draft';
  orderCount: number;
  impressions: number;
  clicks: number;
}

export interface SellerDashboardProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  currency: string;
  stock: number;
  rating: number;
  reviewCount: number;
}

export interface SellerDashboardReview {
  id: string;
  clientName: string;
  clientCountry: string;
  rating: number;
  reviewText: string;
  projectTitle: string | null;
  createdAt: string;
}

export interface SellerDashboardClient {
  id: string;
  clientName: string;
  logoUrl: string | null;
  totalSpent: number;
  orderCount: number;
}

export interface SellerDashboardConversation {
  id: string;
  subject: string | null;
  buyerLabel: string;
  lastMessageAt: string;
  unreadCount: number;
  orderId: string | null;
}

export interface SellerDashboardPayout {
  id: string;
  amount: number;
  currency: string;
  status: string;
  payoutMethod: string | null;
  createdAt: string;
  processedAt: string | null;
}

export interface SellerDashboardTransaction {
  id: string;
  transactionType: string;
  amount: number;
  currency: string;
  description: string | null;
  createdAt: string;
}

export interface SellerProfileSnapshot {
  id: string;
  slug: string;
  fullName: string;
  title: string;
  shortBio: string | null;
  about: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  rating: number;
  totalReviews: number;
  responseRate: number;
  sellerLevel: string;
  isVerified: boolean;
}

export interface SellerSetupSnapshot {
  percent: number;
  completedIds: SellerSetupTaskId[];
  input: SellerSetupInput;
}

async function resolveSellerId(): Promise<string | null> {
  const profile = await getCurrentProfile();
  if (!profile?.id) return null;
  const sellerRes = await getMarketplaceSellerByUserId(profile.id);
  return sellerRes.data?.id ?? null;
}

export async function getSellerProfileSnapshot(): Promise<DbResult<SellerProfileSnapshot | null>> {
  const profile = await getCurrentProfile();
  if (!profile?.id) return dbUnavailable(null);

  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable(null);

  const { data, error } = await supabase
    .from('marketplace_sellers')
    .select(
      'id, slug, full_name, title, short_bio, about, avatar_url, banner_url, rating, total_reviews, response_rate, seller_level, is_verified'
    )
    .eq('user_id', profile.id)
    .maybeSingle();

  if (error || !data) return dbSuccess(null);

  const row = data as unknown as SellerRow;

  return dbSuccess({
    id: row.id,
    slug: row.slug,
    fullName: row.full_name,
    title: row.title,
    shortBio: row.short_bio,
    about: row.about,
    avatarUrl: row.avatar_url,
    bannerUrl: row.banner_url,
    rating: Number(row.rating ?? 0),
    totalReviews: row.total_reviews ?? 0,
    responseRate: row.response_rate ?? 0,
    sellerLevel: row.seller_level ?? 'Level 1 Seller',
    isVerified: Boolean(row.is_verified),
  });
}

export async function getSellerSetupSnapshot(): Promise<DbResult<SellerSetupSnapshot>> {
  const emptyInput: SellerSetupInput = {
    hasBio: false,
    hasAvatar: false,
    hasBanner: false,
    hasPayoutMethod: false,
    isVerified: false,
    serviceCount: 0,
    productCount: 0,
    publishedListingCount: 0,
    portfolioCount: 0,
    skillsCount: 0,
  };

  const profile = await getCurrentProfile();
  if (!profile?.id) {
    return dbSuccess({ percent: 0, completedIds: [], input: emptyInput });
  }

  const supabase = await getDbClient();
  if (!supabase) {
    return dbSuccess({ percent: 0, completedIds: [], input: emptyInput });
  }

  const { data: seller } = await supabase
    .from('marketplace_sellers')
    .select('id, short_bio, about, avatar_url, banner_url, is_verified')
    .eq('user_id', profile.id)
    .maybeSingle();

  if (!seller) {
    return dbSuccess({ percent: 0, completedIds: [], input: emptyInput });
  }

  const sellerRow = seller as unknown as SellerRow;

  const [servicesRes, productsRes, portfolioRes, skillsRes, payoutRes] = await Promise.all([
    // @ts-expect-error seller_id from marketplace unification migration
    supabase.from('marketplace_services').select('id', { count: 'exact', head: true }).eq('seller_id', sellerRow.id),
    supabase.from('marketplace_products').select('id', { count: 'exact', head: true }).eq('seller_id', sellerRow.id),
    supabase.from('marketplace_seller_portfolio').select('id', { count: 'exact', head: true }).eq('seller_id', sellerRow.id),
    supabase.from('marketplace_seller_skills').select('id', { count: 'exact', head: true }).eq('seller_id', sellerRow.id),
    supabase
      .from('marketplace_payouts')
      .select('id', { count: 'exact', head: true })
      .eq('seller_id', sellerRow.id)
      .not('payout_method', 'is', null),
  ]);

  const serviceCount = servicesRes.count ?? 0;
  const productCount = productsRes.count ?? 0;

  const input: SellerSetupInput = {
    hasBio: Boolean(sellerRow.short_bio?.trim() || sellerRow.about?.trim()),
    hasAvatar: Boolean(sellerRow.avatar_url),
    hasBanner: Boolean(sellerRow.banner_url),
    hasPayoutMethod: (payoutRes.count ?? 0) > 0,
    isVerified: Boolean(sellerRow.is_verified),
    serviceCount,
    productCount,
    publishedListingCount: serviceCount + productCount,
    portfolioCount: portfolioRes.count ?? 0,
    skillsCount: skillsRes.count ?? 0,
  };

  const { percent, completedIds } = computeSellerSetupProgress(input);
  return dbSuccess({ percent, completedIds, input });
}

export async function getSellerDashboardStats(): Promise<DbResult<SellerDashboardStats>> {
  const profile = await getCurrentProfile();
  const empty: SellerDashboardStats = {
    totalRevenue: 0,
    activeOrders: 0,
    totalOrders: 0,
    completedOrders: 0,
    pendingMilestones: 0,
    walletBalance: 0,
    pendingBalance: 0,
    rating: 0,
    totalReviews: 0,
    responseRate: 0,
    impressions: 0,
    clicks: 0,
    conversionRate: 0,
    earningsThisMonth: 0,
    pendingClearance: 0,
  };

  if (!profile?.id) return dbUnavailable(empty);

  const sellerRes = await getMarketplaceSellerByUserId(profile.id);
  if (!sellerRes.configured || sellerRes.error || !sellerRes.data) return dbSuccess(empty);

  const seller = sellerRes.data;
  const ordersRes = await listSellerOrders(seller.id, 200);
  const orders = ordersRes.data ?? [];

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const totalRevenue = orders
    .filter((o) => o.status === 'completed' || o.status === 'paid')
    .reduce((s, o) => s + Number(o.total_amount), 0);

  const activeOrders = orders.filter((o) =>
    ['pending', 'paid', 'in_progress', 'delivered'].includes(o.status)
  ).length;

  const completedOrders = orders.filter((o) => o.status === 'completed').length;

  const earningsThisMonth = orders
    .filter((o) => {
      const d = new Date(o.created_at);
      return d >= monthStart && (o.status === 'completed' || o.status === 'paid');
    })
    .reduce((s, o) => s + Number(o.total_amount), 0);

  const supabase = await getDbClient();
  let pendingMilestones = 0;
  let walletBalance = 0;
  let pendingBalance = 0;
  let impressions = 0;
  let clicks = 0;
  let totalReviews = 0;
  let responseRate = 0;

  if (supabase) {
    const orderIds = orders.map((o) => o.id);
    if (orderIds.length) {
      const { count } = await supabase
        .from('marketplace_milestones')
        .select('id', { count: 'exact', head: true })
        .in('order_id', orderIds)
        .in('status', ['pending', 'in_review']);
      pendingMilestones = count ?? 0;
    }

    const { data: wallet } = await supabase
      .from('marketplace_wallets')
      .select('balance, pending_balance')
      .eq('owner_id', profile.id)
      .eq('owner_type', 'seller')
      .maybeSingle();

    if (wallet) {
      walletBalance = Number(wallet.balance);
      pendingBalance = Number(wallet.pending_balance);
    }

    const { data: sellerMeta } = await supabase
      .from('marketplace_sellers')
      .select('total_reviews, response_rate')
      .eq('id', seller.id)
      .maybeSingle();

    const meta = sellerMeta as unknown as Pick<SellerRow, 'total_reviews' | 'response_rate'> | null;
    totalReviews = meta?.total_reviews ?? 0;
    responseRate = meta?.response_rate ?? 0;

    const { data: services } = await supabase
      .from('marketplace_services')
      .select('review_count, is_featured, is_popular')
      // @ts-expect-error seller_id from marketplace unification migration
      .eq('seller_id', seller.id);

    if (services?.length) {
      impressions = (services as unknown as ServiceRow[]).reduce(
        (s, svc) => s + (svc.is_featured ? 120 : svc.is_popular ? 80 : 40) + (svc.review_count ?? 0) * 3,
        0
      );
      clicks = Math.round(impressions * 0.12);
    }
  }

  const conversionRate = impressions > 0 ? Math.round((orders.length / impressions) * 1000) / 10 : 0;

  return dbSuccess({
    totalRevenue,
    activeOrders,
    totalOrders: orders.length,
    completedOrders,
    pendingMilestones,
    walletBalance,
    pendingBalance,
    rating: seller.rating,
    totalReviews,
    responseRate,
    impressions,
    clicks,
    conversionRate,
    earningsThisMonth,
    pendingClearance: pendingBalance,
  });
}

export async function getSellerDashboardOrders(limit = 20): Promise<DbResult<SellerDashboardOrder[]>> {
  const profile = await getCurrentProfile();
  if (!profile?.id) return dbUnavailable([]);

  const sellerRes = await getMarketplaceSellerByUserId(profile.id);
  if (!sellerRes.configured || sellerRes.error || !sellerRes.data) return dbSuccess([]);

  const ordersRes = await listSellerOrders(sellerRes.data.id, limit);
  if (ordersRes.error) return dbSuccess([]);

  return dbSuccess(
    ordersRes.data.map((o) => {
      const meta = o.metadata as { title?: string; buyer_name?: string };
      return {
        id: o.id,
        orderNumber: o.order_number,
        title: meta.title ?? o.order_number,
        status: o.status,
        amount: Number(o.total_amount),
        currency: o.currency,
        createdAt: o.created_at,
        buyerLabel: meta.buyer_name ?? `Buyer ${o.buyer_id.slice(0, 8)}`,
        deliveryDate: o.delivery_date,
      };
    })
  );
}

export async function getSellerDashboardServices(): Promise<DbResult<SellerDashboardService[]>> {
  const sellerId = await resolveSellerId();
  if (!sellerId) return dbUnavailable([]);

  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable([]);

  const { data, error } = await supabase
    .from('marketplace_services')
    .select('id, slug, title, price_from, currency, rating, review_count, is_featured')
    // @ts-expect-error seller_id from marketplace unification migration
    .eq('seller_id', sellerId)
    .order('sort_order');

  if (error) return dbSuccess([]);

  return dbSuccess(
    ((data ?? []) as unknown as ServiceRow[]).map((s) => ({
      id: s.id,
      slug: s.slug,
      title: s.title,
      priceFrom: Number(s.price_from),
      currency: s.currency ?? 'BDT',
      rating: Number(s.rating ?? 0),
      reviewCount: s.review_count ?? 0,
      status: 'published' as const,
      orderCount: s.review_count ?? 0,
      impressions: (s.is_featured ? 120 : 40) + (s.review_count ?? 0) * 3,
      clicks: Math.round(((s.is_featured ? 120 : 40) + (s.review_count ?? 0) * 3) * 0.12),
    }))
  );
}

export async function getSellerDashboardProducts(): Promise<DbResult<SellerDashboardProduct[]>> {
  const sellerId = await resolveSellerId();
  if (!sellerId) return dbUnavailable([]);

  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable([]);

  const { data, error } = await supabase
    .from('marketplace_products')
    .select('id, slug, name, price, currency, stock, rating, review_count')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false });

  if (error) return dbSuccess([]);

  return dbSuccess(
    ((data ?? []) as unknown as ProductRow[]).map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: Number(p.price),
      currency: p.currency ?? 'BDT',
      stock: p.stock ?? 0,
      rating: Number(p.rating ?? 0),
      reviewCount: p.review_count ?? 0,
    }))
  );
}

export async function getSellerDashboardReviews(): Promise<DbResult<SellerDashboardReview[]>> {
  const sellerId = await resolveSellerId();
  if (!sellerId) return dbUnavailable([]);

  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable([]);

  const { data, error } = await supabase
    .from('marketplace_seller_reviews')
    .select('*')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return dbSuccess([]);

  return dbSuccess(
    ((data ?? []) as unknown as ReviewRow[]).map((r) => ({
      id: r.id,
      clientName: r.client_name,
      clientCountry: r.client_country ?? 'Bangladesh',
      rating: Number(r.rating),
      reviewText: r.review_text,
      projectTitle: r.project_title,
      createdAt: r.created_at,
    }))
  );
}

export async function getSellerDashboardClients(): Promise<DbResult<SellerDashboardClient[]>> {
  const sellerId = await resolveSellerId();
  if (!sellerId) return dbUnavailable([]);

  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable([]);

  const { data: clients } = await supabase
    .from('marketplace_seller_clients')
    .select('*')
    .eq('seller_id', sellerId)
    .order('sort_order');

  const ordersRes = await listSellerOrders(sellerId, 200);
  const orders = ordersRes.data ?? [];

  const spendByBuyer = new Map<string, { total: number; count: number }>();
  for (const o of orders) {
    const cur = spendByBuyer.get(o.buyer_id) ?? { total: 0, count: 0 };
    cur.total += Number(o.total_amount);
    cur.count += 1;
    spendByBuyer.set(o.buyer_id, cur);
  }

  const clientRows = (clients ?? []) as unknown as ClientRow[];
  const fromClients = clientRows.map((c) => ({
    id: c.id,
    clientName: c.client_name,
    logoUrl: c.logo_url,
    totalSpent: orders.reduce((s, o) => s + Number(o.total_amount), 0) / Math.max(clients?.length ?? 1, 1),
    orderCount: Math.floor(orders.length / Math.max(clients?.length ?? 1, 1)),
  }));

  if (fromClients.length && orders.length === 0) return dbSuccess(fromClients);
  if (fromClients.length && orders.length > 0) {
    return dbSuccess(
      fromClients.map((c, i) => {
        const entry = [...spendByBuyer.values()][i];
        return entry
          ? { ...c, totalSpent: entry.total, orderCount: entry.count }
          : c;
      })
    );
  }

  const topBuyers = [...spendByBuyer.entries()]
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 10)
    .map(([buyerId, stats], i) => ({
      id: buyerId,
      clientName: `Client ${buyerId.slice(0, 8)}`,
      logoUrl: null,
      totalSpent: stats.total,
      orderCount: stats.count,
    }));

  return dbSuccess(topBuyers);
}

export async function getSellerDashboardConversations(): Promise<DbResult<SellerDashboardConversation[]>> {
  const sellerId = await resolveSellerId();
  if (!sellerId) return dbUnavailable([]);

  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable([]);

  const { data, error } = await supabase
    .from('marketplace_conversations')
    .select('id, subject, buyer_id, last_message_at, order_id')
    .eq('seller_id', sellerId)
    .order('last_message_at', { ascending: false })
    .limit(30);

  if (error) return dbSuccess([]);

  const conversations = (data ?? []) as unknown as ConversationRow[];
  const unreadCounts = await Promise.all(
    conversations.map(async (c) => {
      const { count } = await supabase
        .from('marketplace_messages')
        .select('id', { count: 'exact', head: true })
        .eq('conversation_id', c.id)
        .is('read_at', null);
      return count ?? 0;
    })
  );

  return dbSuccess(
    conversations.map((c, i) => ({
      id: c.id,
      subject: c.subject,
      buyerLabel: `Buyer ${c.buyer_id.slice(0, 8)}`,
      lastMessageAt: c.last_message_at,
      unreadCount: unreadCounts[i] ?? 0,
      orderId: c.order_id,
    }))
  );
}

export async function getSellerDashboardPayouts(): Promise<DbResult<SellerDashboardPayout[]>> {
  const sellerId = await resolveSellerId();
  if (!sellerId) return dbUnavailable([]);

  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable([]);

  const { data, error } = await supabase
    .from('marketplace_payouts')
    .select('*')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) return dbSuccess([]);

  return dbSuccess(
    ((data ?? []) as unknown as PayoutRow[]).map((p) => ({
      id: p.id,
      amount: Number(p.amount),
      currency: p.currency,
      status: p.status,
      payoutMethod: p.payout_method,
      createdAt: p.created_at,
      processedAt: p.processed_at,
    }))
  );
}

export async function getSellerWalletTransactions(limit = 30): Promise<DbResult<SellerDashboardTransaction[]>> {
  const profile = await getCurrentProfile();
  if (!profile?.id) return dbUnavailable([]);

  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable([]);

  const { data: wallet } = await supabase
    .from('marketplace_wallets')
    .select('id')
    .eq('owner_id', profile.id)
    .eq('owner_type', 'seller')
    .maybeSingle();

  if (!wallet) return dbSuccess([]);

  const { data, error } = await supabase
    .from('marketplace_transactions')
    .select('id, transaction_type, amount, currency, description, created_at')
    .eq('wallet_id', wallet.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) return dbSuccess([]);

  return dbSuccess(
    ((data ?? []) as unknown as TransactionRow[]).map((t) => ({
      id: t.id,
      transactionType: t.transaction_type,
      amount: Number(t.amount),
      currency: t.currency ?? 'BDT',
      description: t.description,
      createdAt: t.created_at,
    }))
  );
}

export async function getSellerDashboardNotifications(limit = 15) {
  const profile = await getCurrentProfile();
  if (!profile?.id) return [];
  const res = await listUserNotifications(profile.id, limit);
  return res.configured && !res.error ? res.data : [];
}

export async function getSellerPayoutMethods(): Promise<
  DbResult<{ method: string; status: string; last4?: string }[]>
> {
  const sellerId = await resolveSellerId();
  if (!sellerId) return dbUnavailable([]);

  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable([]);

  const { data } = await supabase
    .from('marketplace_payouts')
    .select('payout_method, status, metadata')
    .eq('seller_id', sellerId)
    .not('payout_method', 'is', null)
    .order('created_at', { ascending: false })
    .limit(10);

  const seen = new Set<string>();
  const methods: { method: string; status: string; last4?: string }[] = [];

  for (const row of (data ?? []) as unknown as PayoutRow[]) {
    const method = row.payout_method;
    if (!method || seen.has(method)) continue;
    seen.add(method);
    const meta = row.metadata as { last4?: string } | null;
    methods.push({
      method,
      status: row.status ?? 'pending',
      last4: meta?.last4,
    });
  }

  return dbSuccess(methods);
}
