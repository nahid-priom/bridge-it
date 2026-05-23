import type { AuthProfile, SellerApplicationStatus } from '@/lib/auth/types';
import { ROUTES } from '@/lib/routes';
import type { UserRole } from '@/types/database.types';

export type MarketplaceSellerStatus = 'pending' | 'active' | 'suspended' | 'inactive';

/** Single source of truth inputs for marketplace routing. */
export type MarketplaceAccessContext = {
  profile: AuthProfile | null;
  sellerStatus: MarketplaceSellerStatus | null;
  applicationStatus: SellerApplicationStatus | null;
};

export type SellerAccessResolution = {
  canAccessSellerDashboard: boolean;
  redirectTo: string | null;
  onboardingView: 'form' | 'pending' | 'rejected' | 'activating' | null;
};

export function isSellerFullyActivated(ctx: MarketplaceAccessContext): boolean {
  return ctx.profile?.role === 'seller' && ctx.sellerStatus === 'active';
}

/** Role → primary dashboard (no mode switcher). */
export function resolveDashboardRoute(role: UserRole | null | undefined): string {
  if (role === 'admin') return ROUTES.admin;
  if (role === 'seller') return ROUTES.sellerDashboard;
  return ROUTES.dashboard;
}

export function resolveAdminAccess(ctx: MarketplaceAccessContext): {
  canAccess: boolean;
  redirectTo: string | null;
} {
  if (ctx.profile?.role === 'admin') {
    return { canAccess: true, redirectTo: null };
  }
  return { canAccess: false, redirectTo: '/unauthorized' };
}

export function resolveClientAccess(ctx: MarketplaceAccessContext): {
  canAccess: boolean;
  redirectTo: string | null;
} {
  const role = ctx.profile?.role;
  if (role === 'buyer' || role === 'seller' || role === 'admin') {
    return { canAccess: true, redirectTo: null };
  }
  return { canAccess: false, redirectTo: '/unauthorized' };
}

/**
 * Seller dashboard: profiles.role === 'seller' AND marketplace_sellers.status === 'active'.
 * Onboarding routes use application status when not fully activated.
 */
export function resolveSellerAccess(ctx: MarketplaceAccessContext): SellerAccessResolution {
  const role = ctx.profile?.role;

  if (role === 'admin') {
    return { canAccessSellerDashboard: true, redirectTo: null, onboardingView: null };
  }

  if (isSellerFullyActivated(ctx)) {
    return { canAccessSellerDashboard: true, redirectTo: null, onboardingView: null };
  }

  const app = ctx.applicationStatus;

  if (app === 'pending' || app === 'needs_review') {
    return {
      canAccessSellerDashboard: false,
      redirectTo: ROUTES.sellerOnboarding,
      onboardingView: 'pending',
    };
  }

  if (app === 'rejected') {
    return {
      canAccessSellerDashboard: false,
      redirectTo: ROUTES.sellerOnboarding,
      onboardingView: 'rejected',
    };
  }

  if (app === 'approved') {
    return {
      canAccessSellerDashboard: false,
      redirectTo: ROUTES.sellerOnboarding,
      onboardingView: 'activating',
    };
  }

  return {
    canAccessSellerDashboard: false,
    redirectTo: ROUTES.sellerOnboarding,
    onboardingView: 'form',
  };
}

/** Where onboarding page should send the user, if anywhere. */
export function resolveSellerOnboardingRedirect(ctx: MarketplaceAccessContext): string | null {
  if (!ctx.profile) return null;
  if (ctx.profile.role === 'admin') return ROUTES.admin;
  if (isSellerFullyActivated(ctx)) return ROUTES.sellerDashboard;
  return null;
}

/** Navbar / CTA path for "become a seller" or seller hub. */
export function resolveBecomeSellerPath(ctx: MarketplaceAccessContext): string {
  if (!ctx.profile) return `/login?next=${encodeURIComponent(ROUTES.sellerOnboarding)}`;
  if (ctx.profile.role === 'admin') return ROUTES.admin;
  if (isSellerFullyActivated(ctx)) return ROUTES.sellerDashboard;
  return ROUTES.sellerOnboarding;
}

export function resolveAuthLandingPath(role: UserRole | null | undefined): string {
  return resolveDashboardRoute(role);
}
