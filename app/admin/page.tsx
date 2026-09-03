import { buildPageMetadata } from '@/lib/metadata';
import { BRANDING } from '@/lib/config/branding';
import { getAdminDashboardData } from '@/lib/catalog/admin';
import { getAdminSellerApplications } from '@/lib/catalog/admin-seller-applications';
import { requireAdmin } from '@/lib/auth/require-admin';
import { AdminDashboardPage } from '@/components/admin/AdminDashboardPage';

export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: 'Admin Control Center',
  description: `${BRANDING.adminName} — platform administration.`,
  path: '/admin',
  noIndex: true,
});

export default async function AdminRoute() {
  await requireAdmin();
  const [data, sellerApplications] = await Promise.all([
    getAdminDashboardData(),
    getAdminSellerApplications(),
  ]);
  return <AdminDashboardPage data={data} sellerApplications={sellerApplications} />;
}
