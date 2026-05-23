import { requireSeller } from '@/lib/auth/require-seller';
import { SellerDashboardLayout } from '@/components/seller-dashboard/SellerDashboardLayout';

export default async function SellerDashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireSeller();

  return <SellerDashboardLayout authProfile={profile}>{children}</SellerDashboardLayout>;
}
