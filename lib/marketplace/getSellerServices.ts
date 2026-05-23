import { getSellerProfile } from '@/lib/marketplace/getSeller';
import type { MarketplaceService } from '@/types/marketplace';

export async function getSellerServices(slug: string): Promise<MarketplaceService[]> {
  const profile = await getSellerProfile(slug);
  return profile?.services ?? [];
}
