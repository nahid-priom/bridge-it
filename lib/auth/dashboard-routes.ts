import type { UserRole } from '@/types/database.types';
import { resolveDashboardRoute } from '@/lib/auth/resolveMarketplaceAccess';
import { ROUTES } from '@/lib/routes';

export type DashboardMode = 'buyer' | 'seller';

/** Primary dashboard path from role only (no mode switcher). */
export function getDashboardPathForRole(role: UserRole | null | undefined): string {
  return resolveDashboardRoute(role);
}

/** Resolves href when sellers can switch between buyer and seller dashboards. */
export function resolveDashboardHref(
  role: UserRole | null | undefined,
  mode: DashboardMode = 'seller'
): string {
  if (role === 'admin') return ROUTES.admin;
  if (role === 'seller') {
    return mode === 'buyer' ? ROUTES.dashboard : ROUTES.sellerDashboard;
  }
  return ROUTES.dashboard;
}

export function defaultDashboardModeForRole(role: UserRole | null | undefined): DashboardMode {
  if (role === 'seller') return 'seller';
  return 'buyer';
}

export function dashboardLabelForRole(role: UserRole | null | undefined): string {
  if (role === 'admin') return 'Admin Dashboard';
  if (role === 'seller') return 'Seller Dashboard';
  return 'Dashboard';
}

export function canAccessBuyerDashboard(role: UserRole | null | undefined): boolean {
  return role === 'buyer' || role === 'seller';
}

export function canAccessSellerDashboard(role: UserRole | null | undefined): boolean {
  return role === 'seller' || role === 'admin';
}
