import dynamic from 'next/dynamic';
import { buildPageMetadata } from '@/lib/metadata';
import { PageLoading } from '@/components/PageLoading';
import { PageBreadcrumbJsonLd } from '@/components/seo/PageBreadcrumbJsonLd';

export const metadata = buildPageMetadata({
  title: 'Seller Dashboard',
  description: 'Manage your Bridge seller dashboard, orders, and listings.',
  path: '/dashboard',
  noIndex: true,
});

const Dashboard = dynamic(
  () => import('@/components/Dashboard').then((m) => ({ default: m.Dashboard })),
  { loading: () => <PageLoading /> }
);

export default function DashboardRoute() {
  return (
    <>
      <PageBreadcrumbJsonLd path="/dashboard" />
      <Dashboard />
    </>
  );
}
