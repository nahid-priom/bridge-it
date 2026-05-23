import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import type {
  AdminCategory,
  AdminOrder,
  AdminSeller,
  AdminStats,
  FeaturedItem,
  VerificationRequest,
} from '@/types/admin';
import { getCategoryStyle } from '@/lib/catalog/category-styles';

export async function fetchAdminStats(): Promise<AdminStats> {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return {
      totalSellers: 0,
      totalCustomers: 0,
      totalOrders: 0,
      totalRevenue: 0,
      pendingVerification: 0,
      activeDisputes: 0,
      platformCommission: 0,
      escrowBalance: 0,
    };
  }

  const [sellers, products, orders, profiles] = await Promise.all([
    supabase.from('sellers').select('id', { count: 'exact', head: true }),
    supabase.from('products').select('price', { count: 'exact' }).eq('status', 'active'),
    supabase.from('orders').select('total_amount', { count: 'exact' }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
  ]);

  const revenue = (orders.data ?? []).reduce((s, o) => s + Number(o.total_amount), 0);
  const pendingVerification =
    (
      await supabase
        .from('sellers')
        .select('id', { count: 'exact', head: true })
        .eq('verified', false)
    ).count ?? 0;

  return {
    totalSellers: sellers.count ?? 0,
    totalCustomers: profiles.count ?? 0,
    totalOrders: orders.count ?? 0,
    totalRevenue: revenue,
    pendingVerification,
    activeDisputes: 0,
    platformCommission: Math.round(revenue * 0.15),
    escrowBalance: Math.round(revenue * 0.2),
  };
}

export async function fetchAdminSellers(): Promise<AdminSeller[]> {
  const supabase = createAdminSupabaseClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from('sellers')
    .select('id, name, tagline, category_key, status, rating, review_count, verified')
    .order('rating', { ascending: false })
    .limit(100);

  const productCounts = await supabase.from('products').select('seller_id');
  const countBySeller: Record<string, number> = {};
  for (const row of productCounts.data ?? []) {
    countBySeller[row.seller_id] = (countBySeller[row.seller_id] ?? 0) + 1;
  }

  return (data ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    company: s.tagline ?? s.name,
    category: s.category_key ?? 'General',
    status: (s.status === 'active' ? 'active' : 'suspended') as AdminSeller['status'],
    totalOrders: countBySeller[s.id] ?? s.review_count,
    revenue: (countBySeller[s.id] ?? 0) * 15000,
    rating: Number(s.rating),
    featured: s.verified,
  }));
}

export async function fetchAdminCategories(): Promise<AdminCategory[]> {
  const supabase = createAdminSupabaseClient();
  if (!supabase) return [];

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order');

  const { data: products } = await supabase.from('products').select('category_id');
  const countByCat: Record<string, number> = {};
  for (const p of products ?? []) {
    countByCat[p.category_id] = (countByCat[p.category_id] ?? 0) + 1;
  }

  return (categories ?? []).map((c) => {
    const style = getCategoryStyle(c.key);
    return {
      id: c.id,
      icon: c.icon,
      nameEn: c.label,
      nameBn: style.nameBn ?? c.label,
      serviceCount: countByCat[c.id] ?? 0,
      sellerCount: Math.max(1, Math.floor((countByCat[c.id] ?? 0) / 5)),
      featured: c.is_active,
    };
  });
}

export async function fetchAdminOrders(): Promise<AdminOrder[]> {
  const supabase = createAdminSupabaseClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from('orders')
    .select('id, status, total_amount, buyer_id, seller_id, product_id, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  return (data ?? []).map((o) => ({
    id: o.id.slice(0, 8).toUpperCase(),
    customer: o.buyer_id.slice(0, 8),
    seller: o.seller_id.slice(0, 8),
    service: o.product_id?.slice(0, 8) ?? 'Product',
    amount: Number(o.total_amount),
    paymentStatus: 'completed' as const,
    escrowStatus: o.status === 'completed' ? 'released' : 'held',
    deliveryStatus: o.status as AdminOrder['deliveryStatus'],
    disputeStatus: 'pending' as const,
  }));
}

export async function fetchFeaturedItems(): Promise<FeaturedItem[]> {
  const supabase = createAdminSupabaseClient();
  if (!supabase) return [];

  const { data: products } = await supabase
    .from('products')
    .select('id, title, slug, is_featured, is_promoted, sellers ( name )')
    .or('is_featured.eq.true,is_promoted.eq.true')
    .limit(20);

  return (products ?? []).map((p) => ({
    id: p.id,
    type: 'service' as const,
    name: p.title,
    subtitle: (p.sellers as { name: string } | null)?.name ?? '',
    placement: 'homepage' as const,
    promotionStatus: 'active' as const,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
  }));
}

export async function fetchVerificationQueue(): Promise<VerificationRequest[]> {
  const supabase = createAdminSupabaseClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from('sellers')
    .select('id, name, tagline, category_key, verified, status, created_at')
    .eq('verified', false)
    .limit(20);

  return (data ?? []).map((s) => ({
    id: s.id,
    sellerName: s.name,
    company: s.tagline ?? s.name,
    category: s.category_key ?? 'General',
    documentsStatus: 'partial' as const,
    profileCompletion: 70,
    riskLevel: 'medium' as const,
    submittedDate: s.created_at?.slice(0, 10) ?? '',
    status: 'pending' as const,
  }));
}

export async function insertAdminAuditLog(input: {
  action: string;
  tableName: string;
  recordId?: string;
  payload?: Record<string, unknown>;
  adminId?: string;
}) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) return { error: 'Supabase not configured' };

  const { error } = await supabase.from('admin_audit_logs').insert({
    admin_id: input.adminId ?? null,
    action: input.action,
    table_name: input.tableName,
    record_id: input.recordId ?? null,
    payload: (input.payload ?? {}) as import('@/types/database.types').Json,
  });

  return { error: error?.message ?? null };
}
