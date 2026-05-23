import 'server-only';

import { sellerCustomUrl } from '@/lib/config/branding';
import { listOrdersForSeller, getSellerOrderStats } from '@/lib/db/orders';
import { listPublicSellers } from '@/lib/db/sellers';
import { getSellerReviewStats } from '@/lib/db/reviews';
import type {
  DashboardOrderView,
  DashboardPageData,
  DashboardStatView,
} from '@/types/dashboard';

export type { DashboardOrderView, DashboardPageData, DashboardStatView };

function formatBdt(amount: number): string {
  return `৳${Math.round(amount).toLocaleString('en-BD')}`;
}

function formatOrderDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function shortOrderId(id: string): string {
  return `ORD-${id.replace(/-/g, '').slice(0, 6).toUpperCase()}`;
}

export async function getDashboardPageData(): Promise<DashboardPageData | null> {
  const demoSlug = process.env.DEMO_SELLER_SLUG?.trim();
  const { data: sellers } = await listPublicSellers(20);
  if (!sellers.length) return null;

  const seller = demoSlug
    ? sellers.find((s) => s.slug === demoSlug) ?? sellers[0]
    : sellers[0];

  const [ordersResult, statsResult, reviewsResult] = await Promise.all([
    listOrdersForSeller(seller.id, 12),
    getSellerOrderStats(seller.id),
    getSellerReviewStats(seller.id),
  ]);

  const orderStats = statsResult.data;
  const reviewStats = reviewsResult.data;
  const recentOrders: DashboardOrderView[] = ordersResult.data.map((o) => ({
    id: shortOrderId(o.id),
    service: o.product_title ?? 'Service',
    buyer: o.buyer_label,
    amount: formatBdt(o.total_amount),
    status: o.status,
    date: formatOrderDate(o.created_at),
  }));

  const stats: DashboardStatView[] = [
    {
      label: 'Total Revenue',
      value: formatBdt(orderStats.totalRevenue),
      change: orderStats.totalOrders > 0 ? `${orderStats.totalOrders} orders` : '—',
    },
    {
      label: 'Active Orders',
      value: String(orderStats.activeOrders),
      change: orderStats.activeOrders > 0 ? 'In progress' : '—',
    },
    {
      label: 'Total Reviews',
      value: String(reviewStats.count || seller.review_count),
      change:
        reviewStats.count > 0
          ? `${reviewStats.avgRating.toFixed(1)} avg`
          : seller.rating
            ? `${Number(seller.rating).toFixed(1)}★`
            : '—',
    },
    {
      label: 'Completed Projects',
      value: String(seller.completed_projects ?? 0),
      change: seller.response_time ? seller.response_time : '—',
    },
  ];

  return {
    sellerSlug: seller.slug,
    customUrl: sellerCustomUrl(seller.slug),
    stats,
    recentOrders,
  };
}
