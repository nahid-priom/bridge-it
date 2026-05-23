import { getMarketplaceSellerBySlug, listMarketplaceSellerSummaries } from '@/lib/db/marketplaceSellers';
import { getDemoSellerProfile, listDemoSellerSummaries } from '@/data/demoSellers';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import type { MarketplaceSellerProfile, MarketplaceSellerSummary } from '@/types/marketplaceSeller';

export async function getSellerProfile(slug: string): Promise<MarketplaceSellerProfile | null> {
  if (isSupabaseConfigured()) {
    const result = await getMarketplaceSellerBySlug(slug);
    if (result.data) return result.data;
  }
  return getDemoSellerProfile(slug);
}

export async function getTopMarketplaceSellers(limit = 8): Promise<MarketplaceSellerSummary[]> {
  if (isSupabaseConfigured()) {
    const result = await listMarketplaceSellerSummaries(limit);
    if (result.data.length > 0) return result.data;
  }
  return listDemoSellerSummaries(limit);
}
