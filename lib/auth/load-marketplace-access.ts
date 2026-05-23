import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';
import { getCurrentProfile } from '@/lib/auth/get-current-user';
import type { MarketplaceAccessContext } from '@/lib/auth/resolveMarketplaceAccess';
import type { AuthProfile, SellerApplicationStatus } from '@/lib/auth/types';
import type { UserRole } from '@/types/database.types';
import type { Database } from '@/types/database.types';
import { getMarketplaceSellerByUserId } from '@/lib/db/marketplace-unified';
import { getOwnSellerApplication } from '@/lib/db/seller-applications';

export async function loadMarketplaceAccessContext(): Promise<MarketplaceAccessContext> {
  const profile = await getCurrentProfile();
  if (!profile) {
    return { profile: null, sellerStatus: null, applicationStatus: null };
  }

  const [sellerRes, application] = await Promise.all([
    getMarketplaceSellerByUserId(profile.id),
    getOwnSellerApplication(profile.id),
  ]);

  return {
    profile,
    sellerStatus: sellerRes.data?.status ?? null,
    applicationStatus: (application?.status ?? null) as SellerApplicationStatus | null,
  };
}

/** Middleware-friendly: profile role + seller row from Supabase client. */
export async function loadMarketplaceAccessFromSupabase(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<MarketplaceAccessContext> {
  const { data: profileRow } = await supabase
    .from('profiles')
    .select('id, email, full_name, avatar_url, role, seller_id')
    .eq('id', userId)
    .maybeSingle();

  if (!profileRow) {
    return { profile: null, sellerStatus: null, applicationStatus: null };
  }

  const { data: sellerRow } = await supabase
    .from('marketplace_sellers')
    .select('status')
    .eq('user_id', userId)
    .maybeSingle();

  const { data: appRow } = await supabase
    .from('seller_applications')
    .select('status')
    .eq('user_id', userId)
    .maybeSingle();

  const profile: AuthProfile = {
    id: profileRow.id as string,
    email: (profileRow.email as string) ?? null,
    full_name: (profileRow.full_name as string) ?? null,
    avatar_url: (profileRow.avatar_url as string) ?? null,
    role: (profileRow.role as UserRole) ?? 'buyer',
    seller_id: (profileRow.seller_id as string) ?? null,
  };

  return {
    profile,
    sellerStatus: (sellerRow?.status as MarketplaceAccessContext['sellerStatus']) ?? null,
    applicationStatus: (appRow?.status as MarketplaceAccessContext['applicationStatus']) ?? null,
  };
}

export async function hasUnreadSellerApprovalNotification(
  userId: string
): Promise<boolean> {
  const { getDbClient } = await import('@/lib/db/server');
  const supabase = await getDbClient();
  if (!supabase) return false;

  const { data } = await supabase
    .from('marketplace_notifications')
    .select('id')
    .eq('user_id', userId)
    .eq('notification_type', 'seller_approved')
    .is('read_at', null)
    .limit(1);

  return (data?.length ?? 0) > 0;
}
