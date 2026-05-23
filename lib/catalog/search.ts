import { searchMarketplaceProducts } from '@/lib/db/search';
import { listPublicSellers } from '@/lib/db/sellers';
import { listActiveCategories } from '@/lib/db/categories';
import {
  mapDbProductToService,
  mapDbSellerToSeller,
  mapSellerToSearchItem,
  mapProductToSearchListing,
  mapCategoryRow,
} from '@/lib/db/mappers';
import { toHomeCategoryId } from '@/lib/catalog/category-keys';
import type { SearchCatalogItem } from '@/types';

export async function buildSearchCatalogFromDb(
  query = '',
  limit = 120
): Promise<SearchCatalogItem[]> {
  const [searchResult, sellersResult, categoriesResult] = await Promise.all([
    searchMarketplaceProducts({ query, limit }),
    listPublicSellers(40),
    listActiveCategories(),
  ]);

  const categoryMap = new Map(
    categoriesResult.data.map((c) => [c.key, mapCategoryRow(c, 0)])
  );

  const listings: SearchCatalogItem[] = searchResult.data.map((row) => {
    const service = mapDbProductToService(
      row as import('@/types/database.types').ProductWithRelations
    );
    const homeKey = toHomeCategoryId(
      (row as { categories?: { key: string } }).categories?.key ?? service.category
    );
    if (categoryMap.has(homeKey) || service.category) {
      service.category = homeKey as typeof service.category;
    }
    return mapProductToSearchListing(service);
  });

  const sellers: SearchCatalogItem[] = sellersResult.data.map((row) => {
    const seller = mapDbSellerToSeller(row);
    const catName =
      categoryMap.get(row.category_key ?? '')?.name ??
      categoryMap.get(toHomeCategoryId(row.category_key ?? ''))?.name ??
      row.category_key ??
      '';
    return mapSellerToSearchItem(seller, catName);
  });

  return [...listings, ...sellers];
}
