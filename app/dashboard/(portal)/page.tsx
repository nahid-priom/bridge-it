import { buildPageMetadata } from '@/lib/metadata';
import { BitpDashboardOverview } from '@/components/client-dashboard/BitpDashboardOverview';
import { getBitpDashboardOverview } from '@/lib/services/dashboard.service';
import { getCurrentProfile } from '@/lib/auth/get-current-user';

export const metadata = buildPageMetadata({
  title: 'Dashboard',
  path: '/dashboard',
  noIndex: true,
});

export default async function DashboardOverviewRoute() {
  const [data, profile] = await Promise.all([
    getBitpDashboardOverview(),
    getCurrentProfile(),
  ]);

  return (
    <BitpDashboardOverview
      totalOrders={data.totalOrders}
      activeProjects={data.activeProjects}
      pendingPayments={data.pendingPayments}
      completedProjects={data.completedProjects}
      recentOrders={data.recentOrders}
      userName={profile?.full_name ?? undefined}
    />
  );
}
