import type { AuthProfile } from '@/lib/auth/types';
import {
  resolveBecomeSellerPath,
  type MarketplaceAccessContext,
} from '@/lib/auth/resolveMarketplaceAccess';

export function becomeSellerPath(profile: AuthProfile | null): string {
  if (!profile) {
    return resolveBecomeSellerPath({ profile: null, sellerStatus: null, applicationStatus: null });
  }
  const ctx: MarketplaceAccessContext = {
    profile,
    sellerStatus: profile.role === 'seller' ? 'active' : null,
    applicationStatus: null,
  };
  return resolveBecomeSellerPath(ctx);
}

/** Prefer loadMarketplaceAccessContext + resolveBecomeSellerPath on the server. */
export function becomeSellerPathFromContext(ctx: MarketplaceAccessContext): string {
  return resolveBecomeSellerPath(ctx);
}
