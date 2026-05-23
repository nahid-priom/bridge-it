import { listMarketplaceCategories, listMarketplaceServices } from '@/lib/db/marketplace';
import { getMarketplaceFallbackData } from '@/data/marketplaceFallbackData';
import { getDemoServicesWithSellers } from '@/data/demoSellers';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import type { MarketplaceHomeData, MarketplaceRowGroup, MarketplaceService } from '@/types/marketplace';

function fallbackHomeData(): MarketplaceHomeData {
  const raw = getMarketplaceFallbackData();
  return { categories: raw.categories, services: getDemoServicesWithSellers() };
}

export async function getMarketplaceHomeData(): Promise<MarketplaceHomeData> {
  const fallback = fallbackHomeData();

  if (!isSupabaseConfigured()) {
    return fallback;
  }

  const [categoriesResult, servicesResult] = await Promise.all([
    listMarketplaceCategories(),
    listMarketplaceServices(),
  ]);

  const categories =
    categoriesResult.data.length > 0 ? categoriesResult.data : fallback.categories;
  const services =
    servicesResult.data.length > 0 ? servicesResult.data : fallback.services;

  return { categories, services };
}

export function groupServicesByRow(
  services: MarketplaceService[],
  rowGroup: MarketplaceRowGroup
): MarketplaceService[] {
  return services
    .filter((s) => s.rowGroup === rowGroup)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getBrowseCategories(
  categories: MarketplaceHomeData['categories']
): MarketplaceHomeData['categories'] {
  return [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
}
