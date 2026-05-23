import { getDbClient } from '@/lib/db/server';
import { dbError, dbSuccess, dbUnavailable, type DbResult } from '@/lib/db/result';
import {
  mapMarketplaceSeller,
  mapSellerClient,
  mapSellerPortfolio,
  mapSellerReview,
  mapSellerSkill,
  mapSellerSummary,
  mapSellerVerification,
  type DbMarketplaceSellerRow,
} from '@/lib/marketplace/mapSeller';
import type {
  MarketplaceSellerProfile,
  MarketplaceSellerSummary,
} from '@/types/marketplaceSeller';
import { listMarketplaceServices } from '@/lib/db/marketplace';
import type { MarketplaceService } from '@/types/marketplace';

export async function listMarketplaceSellerSummaries(
  limit = 10
): Promise<DbResult<MarketplaceSellerSummary[]>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable([]);

  const { data, error } = await supabase
    .from('marketplace_sellers')
    .select('*')
    .order('is_featured', { ascending: false })
    .order('rating', { ascending: false })
    .limit(limit);

  if (error) return dbError([], error.message);
  return dbSuccess((data as unknown as DbMarketplaceSellerRow[]).map(mapSellerSummary));
}

export async function getMarketplaceSellerBySlug(
  slug: string
): Promise<DbResult<MarketplaceSellerProfile | null>> {
  const supabase = await getDbClient();
  if (!supabase) return dbUnavailable(null);

  const { data: sellerRow, error: sellerError } = await supabase
    .from('marketplace_sellers')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (sellerError) return dbError(null, sellerError.message);
  if (!sellerRow) return dbSuccess(null);

  const sellerId = (sellerRow as unknown as DbMarketplaceSellerRow).id;

  const [skillsRes, reviewsRes, portfolioRes, verificationsRes, clientsRes, servicesRes] =
    await Promise.all([
      supabase
        .from('marketplace_seller_skills')
        .select('*')
        .eq('seller_id', sellerId)
        .order('sort_order'),
      supabase
        .from('marketplace_seller_reviews')
        .select('*')
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false }),
      supabase
        .from('marketplace_seller_portfolio')
        .select('*')
        .eq('seller_id', sellerId)
        .order('sort_order'),
      supabase
        .from('marketplace_seller_verifications')
        .select('*')
        .eq('seller_id', sellerId),
      supabase
        .from('marketplace_seller_clients')
        .select('*')
        .eq('seller_id', sellerId)
        .order('sort_order'),
      listMarketplaceServices(),
    ]);

  const services = servicesRes.data.filter((s) => s.sellerSlug === slug);

  return dbSuccess({
    seller: mapMarketplaceSeller(sellerRow as unknown as DbMarketplaceSellerRow),
    skills: (skillsRes.data ?? []).map(mapSellerSkill),
    reviews: (reviewsRes.data ?? []).map(mapSellerReview),
    portfolio: (portfolioRes.data ?? []).map(mapSellerPortfolio),
    verifications: (verificationsRes.data ?? []).map(mapSellerVerification),
    clients: (clientsRes.data ?? []).map(mapSellerClient),
    services,
  });
}

export function filterServicesBySeller(
  services: MarketplaceService[],
  sellerSlug: string
): MarketplaceService[] {
  return services.filter((s) => s.sellerSlug === sellerSlug);
}
