import { listSellerApplicationsForAdmin } from '@/lib/db/seller-applications';

export async function getAdminSellerApplications() {
  return listSellerApplicationsForAdmin();
}
