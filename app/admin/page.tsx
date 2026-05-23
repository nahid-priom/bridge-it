import dynamic from 'next/dynamic';
import { buildPageMetadata } from '@/lib/metadata';
import { PageLoading } from '@/components/PageLoading';
import { getAdminDashboardData } from '@/lib/catalog/admin';
import { getAdminSellerApplications } from '@/lib/catalog/admin-seller-applications';
import { requireAdmin } from '@/lib/auth/require-admin';

export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: 'Admin Control Center',
  description: 'Bridge marketplace administration.',
  path: '/admin',
  noIndex: true,
});

const AdminDashboardPage = dynamic(
  () =>
    import('@/components/admin/AdminDashboardPage').then((m) => ({
      default: m.AdminDashboardPage,
    })),
  {
    loading: () => (
      <div className="min-h-screen bg-bridge-dark flex items-center justify-center">
        <PageLoading variant="minimal" />
      </div>
    ),
  }
);

export default async function AdminRoute() {
  await requireAdmin();
  const [data, sellerApplications] = await Promise.all([
    getAdminDashboardData(),
    getAdminSellerApplications(),
  ]);
  return <AdminDashboardPage data={data} sellerApplications={sellerApplications} />;
}
