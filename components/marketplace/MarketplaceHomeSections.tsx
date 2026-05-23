import { BrowsePopularCategories } from '@/components/marketplace/BrowsePopularCategories';
import { CategoryServiceRow } from '@/components/marketplace/CategoryServiceRow';
import { PopularProductsRow } from '@/components/marketplace/PopularProductsRow';
import { MARKETPLACE_HOME_ROWS } from '@/lib/marketplace/constants';
import { groupServicesByRow } from '@/lib/marketplace/getMarketplaceData';
import { getPopularMarketplaceProducts } from '@/lib/marketplace/getMarketplaceProducts';
import type { MarketplaceHomeData } from '@/types/marketplace';
import type { MarketplaceProduct } from '@/types/marketplaceProduct';

type MarketplaceHomeSectionsProps = {
  data: MarketplaceHomeData;
  popularProducts: MarketplaceProduct[];
};

export function MarketplaceHomeSections({
  data,
  popularProducts,
}: MarketplaceHomeSectionsProps) {
  return (
    <div className="marketplace-home-sections">
      <BrowsePopularCategories categories={data.categories} />
      {MARKETPLACE_HOME_ROWS.map((rowConfig) => (
        <CategoryServiceRow
          key={rowConfig.rowGroup}
          config={rowConfig}
          services={groupServicesByRow(data.services, rowConfig.rowGroup)}
        />
      ))}
      <PopularProductsRow products={popularProducts} />
    </div>
  );
}
