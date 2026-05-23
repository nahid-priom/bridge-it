import { SearchCatalogItem } from '@/types';
import { allMarketplaceServices, allSellers } from './services';
import { categories } from './categories';

export function buildSearchCatalog(): SearchCatalogItem[] {
  const listings: SearchCatalogItem[] = allMarketplaceServices.map((service) => ({
    kind: 'listing' as const,
    service,
  }));

  const sellers: SearchCatalogItem[] = allSellers.map((seller) => {
    const cat = categories.find((c) => c.id === seller.category);
    return {
      kind: 'seller' as const,
      id: `seller-result-${seller.id}`,
      title: seller.name,
      titleBn: seller.name,
      description: seller.description,
      thumbnail: seller.coverImage,
      category: seller.category,
      categoryName: cat?.name ?? seller.category,
      sellerId: seller.id,
      sellerName: seller.name,
      sellerAvatar: seller.avatar,
      rating: seller.rating,
      reviewCount: seller.reviewCount,
      location: seller.location,
      language: 'English & Bengali',
      isVerified: seller.verified,
      isFeatured: seller.rating >= 4.8,
      tags: [seller.category, 'seller', seller.name.toLowerCase(), cat?.name.toLowerCase() ?? ''],
    };
  });

  return [...listings, ...sellers];
}

export const searchCatalog = buildSearchCatalog();
