import dynamic from 'next/dynamic';
import { buildPageMetadata } from '@/lib/metadata';
import { PageLoading } from '@/components/PageLoading';

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

export default function AdminRoute() {
  return <AdminDashboardPage />;
}
