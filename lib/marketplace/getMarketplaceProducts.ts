import {
  getMarketplaceProductBySlug,
  listMarketplaceProductCategories,
  listMarketplaceProducts,
} from '@/lib/db/marketplaceProducts';
import { getMarketplaceProductsFallbackData } from '@/data/marketplaceProductsFallback';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import type { MarketplaceProduct, MarketplaceProductHomeData } from '@/types/marketplaceProduct';

export async function getMarketplaceProductHomeData(): Promise<MarketplaceProductHomeData> {
  const fallback = getMarketplaceProductsFallbackData();

  if (!isSupabaseConfigured()) return fallback;

  const [categoriesResult, productsResult] = await Promise.all([
    listMarketplaceProductCategories(),
    listMarketplaceProducts(),
  ]);

  return {
    categories:
      categoriesResult.data.length > 0 ? categoriesResult.data : fallback.categories,
    products: productsResult.data.length > 0 ? productsResult.data : fallback.products,
  };
}

export function getPopularMarketplaceProducts(
  products: MarketplaceProduct[],
  limit = 12
): MarketplaceProduct[] {
  return [...products]
    .sort((a, b) => {
      const featured = Number(b.isFeatured) - Number(a.isFeatured);
      if (featured !== 0) return featured;
      const popular = Number(b.isPopular) - Number(a.isPopular);
      if (popular !== 0) return popular;
      return b.reviewCount - a.reviewCount;
    })
    .slice(0, limit);
}

export async function getMarketplaceProductBySlugResolved(
  slug: string
): Promise<MarketplaceProduct | null> {
  const fallback = getMarketplaceProductsFallbackData().products.find((p) => p.slug === slug);

  if (!isSupabaseConfigured()) return fallback ?? null;

  const result = await getMarketplaceProductBySlug(slug);
  return result.data ?? fallback ?? null;
}
