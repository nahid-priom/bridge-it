import { buildPageMetadata } from '@/lib/metadata';
import { ClientDashboardOverviewPage } from '@/components/client-dashboard/pages/ClientDashboardOverviewPage';
import { getClientDashboardOverviewData } from '@/lib/db/client-dashboard';

export const metadata = buildPageMetadata({
  title: 'Client Dashboard',
  description: 'Manage projects, orders, payments, and sellers on Deshi Fiverr.',
  path: '/dashboard',
  noIndex: true,
});

export default async function DashboardOverviewRoute() {
  const data = await getClientDashboardOverviewData();
  return <ClientDashboardOverviewPage data={data} />;
}
