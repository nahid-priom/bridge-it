import {
  fetchAdminStats,
  fetchAdminSellers,
  fetchAdminCategories,
  fetchAdminOrders,
  fetchFeaturedItems,
  fetchVerificationQueue,
} from '@/lib/db/admin';
import type {
  AdminActivity,
  AdminDashboardData,
  AdminPendingAction,
  AdminStats,
} from '@/types/admin';

export type { AdminDashboardData };

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const [stats, sellers, categories, orders, featured, verificationQueue] = await Promise.all([
    fetchAdminStats(),
    fetchAdminSellers(),
    fetchAdminCategories(),
    fetchAdminOrders(),
    fetchFeaturedItems(),
    fetchVerificationQueue(),
  ]);

  const activities: AdminActivity[] = verificationQueue.slice(0, 5).map((v) => ({
    id: v.id,
    type: 'verification' as const,
    title: 'New seller application',
    description: `${v.sellerName} submitted verification documents`,
    time: v.submittedDate,
  }));

  const pendingActions: AdminPendingAction[] = [
    ...(stats.pendingSellerApplications > 0
      ? [
          {
            id: 'pa-applications',
            label: 'Seller applications pending review',
            count: stats.pendingSellerApplications,
            section: 'seller-applications' as const,
            priority: 'high' as const,
          },
        ]
      : []),
    ...(stats.pendingVerification > 0
      ? [
          {
            id: 'pa-verification',
            label: 'Seller verifications pending',
            count: stats.pendingVerification,
            section: 'seller-verification' as const,
            priority: 'medium' as const,
          },
        ]
      : []),
  ];

  const topCategories = categories.slice(0, 4).map((c) => ({
    id: c.id,
    name: c.nameEn,
    nameBn: c.nameBn,
    orders: c.serviceCount,
    revenue: c.serviceCount * 3500,
    growth: '+12%',
  }));

  const topSellers = sellers.slice(0, 4).map((s) => ({
    id: s.id,
    name: s.name,
    company: s.company,
    revenue: s.revenue,
    orders: s.totalOrders,
    rating: s.rating,
  }));

  return {
    stats,
    activities,
    pendingActions,
    sellers,
    customers: [],
    orders,
    disputes: [],
    categories,
    featured,
    verificationQueue,
    notifications: [],
    topCategories,
    topSellers,
    monthlyRevenueData: [320, 380, 410, 395, 450, 520, 480, 560, 610, 580, 640, stats.totalRevenue / 1000 || 720],
    orderGrowthData: [120, 145, 132, 168, 190, 175, 210, 225, 240, 218, 265, stats.totalOrders || 290],
  };
}

