import { requireAuth } from '@/lib/auth/require-auth';
import { ClientDashboardLayout } from '@/components/client-dashboard/ClientDashboardLayout';

export default async function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireAuth('/dashboard');

  return <ClientDashboardLayout authProfile={profile}>{children}</ClientDashboardLayout>;
}
