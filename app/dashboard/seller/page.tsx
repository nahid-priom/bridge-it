import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/routes';

export default function LegacySellerDashboardRedirect() {
  redirect(ROUTES.sellerDashboard);
}
