import { redirect } from 'next/navigation';
import { loadMarketplaceAccessContext } from '@/lib/auth/load-marketplace-access';
import { resolveSellerAccess } from '@/lib/auth/resolveMarketplaceAccess';
import { safeNextPath } from '@/lib/auth/redirect';
import { ROUTES } from '@/lib/routes';
import type { AuthProfile } from '@/lib/auth/types';

export async function requireSeller(next?: string): Promise<AuthProfile> {
  const ctx = await loadMarketplaceAccessContext();
  const profile = ctx.profile;

  if (!profile) {
    const dest = safeNextPath(next, ROUTES.sellerDashboard);
    redirect(`/login?next=${encodeURIComponent(dest)}`);
  }

  const resolution = resolveSellerAccess(ctx);
  if (resolution.canAccessSellerDashboard) {
    return profile;
  }

  redirect(resolution.redirectTo ?? ROUTES.sellerOnboarding);
}
