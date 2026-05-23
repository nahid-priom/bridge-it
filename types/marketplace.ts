export type MarketplaceRowGroup =
  | 'software_development'
  | 'web_development'
  | 'app_development'
  | 'popular';

export type MarketplaceThumbnailType = 'gradient' | 'image';

export interface MarketplaceCategory {
  id: string;
  slug: string;
  name: string;
  subtitle: string | null;
  description: string | null;
  icon: string | null;
  serviceCount: number;
  sortOrder: number;
  isFeatured: boolean;
}

export interface MarketplaceService {
  id: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  slug: string;
  title: string;
  shortDescription: string | null;
  sellerId: string | null;
  sellerSlug: string | null;
  sellerName: string;
  sellerLevel: string | null;
  sellerAvatarUrl: string | null;
  sellerRating: number | null;
  sellerCity: string | null;
  thumbnailType: MarketplaceThumbnailType;
  thumbnailUrl: string | null;
  priceFrom: number;
  currency: string;
  deliveryDays: number | null;
  rating: number;
  reviewCount: number;
  tags: string[];
  rowGroup: MarketplaceRowGroup;
  isPopular: boolean;
  isFeatured: boolean;
  sortOrder: number;
}

export interface MarketplaceHomeData {
  categories: MarketplaceCategory[];
  services: MarketplaceService[];
}

export interface MarketplaceHomeRowConfig {
  rowGroup: MarketplaceRowGroup;
  title: string;
  subtitle: string;
  viewAllHref: string;
  highlight?: boolean;
  sectionBadge?: string;
  containerBadge?: string;
}
