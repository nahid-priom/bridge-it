import { redirect } from 'next/navigation';
import type { AuthProfile } from '@/lib/auth/types';
import type { SellerApplicationRow } from '@/lib/db/seller-applications';
import {
  resolveSellerAccess,
  resolveSellerOnboardingRedirect,
  type MarketplaceAccessContext,
} from '@/lib/auth/resolveMarketplaceAccess';

/** @deprecated Use resolveSellerOnboardingRedirect with MarketplaceAccessContext */
export function sellerOnboardingRedirect(profile: AuthProfile): string | null {
  return resolveSellerOnboardingRedirect({
    profile,
    sellerStatus: profile.role === 'seller' ? 'active' : null,
    applicationStatus: null,
  });
}

export function sellerApplicationGate(
  application: SellerApplicationRow | null
): { allowForm: boolean; showPending: boolean; showRejected: boolean; showActivating: boolean } {
  if (!application) {
    return { allowForm: true, showPending: false, showRejected: false, showActivating: false };
  }
  if (application.status === 'approved') {
    return { allowForm: false, showPending: false, showRejected: false, showActivating: true };
  }
  if (application.status === 'rejected') {
    return { allowForm: true, showPending: false, showRejected: true, showActivating: false };
  }
  if (application.status === 'pending' || application.status === 'needs_review') {
    return { allowForm: false, showPending: true, showRejected: false, showActivating: false };
  }
  return { allowForm: true, showPending: false, showRejected: false, showActivating: false };
}

/** @deprecated Use resolveSellerAccess */
export function sellerDashboardRedirectForApplication(
  ctx: MarketplaceAccessContext
): string | null {
  const resolution = resolveSellerAccess(ctx);
  if (resolution.canAccessSellerDashboard) return null;
  return resolution.redirectTo;
}

export function redirectIfSellerOnboardingComplete(ctx: MarketplaceAccessContext) {
  const dest = resolveSellerOnboardingRedirect(ctx);
  if (dest) redirect(dest);
}
