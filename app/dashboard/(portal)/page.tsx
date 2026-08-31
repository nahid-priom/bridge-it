import { buildPageMetadata } from '@/lib/metadata';
import { BitpDashboardOverview } from '@/components/client-dashboard/BitpDashboardOverview';
import { getBitpDashboardOverview } from '@/lib/services/dashboard.service';

export const metadata = buildPageMetadata({
  title: 'Dashboard | Bridge IT Park',
  path: '/dashboard',
  noIndex: true,
});

export default async function DashboardOverviewRoute() {
  const data = await getBitpDashboardOverview();
  return (
    <BitpDashboardOverview
      totalOrders={data.totalOrders}
      activeProjects={data.activeProjects}
      pendingPayments={data.pendingPayments}
      completedProjects={data.completedProjects}
      recentOrders={data.recentOrders}
    />
  );
}
