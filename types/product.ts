import type { SearchSortOption } from '@/lib/searchFilter';

/** Product marketplace category slugs (physical/digital goods) */
export type ProductCategoryKey =
  | 'electronics'
  | 'gadgets'
  | 'office-solutions'
  | 'smart-devices'
  | 'digital-products';

export interface ProductCategory {
  label: string;
  key: ProductCategoryKey | 'all';
  href: string;
  icon: string;
}

export interface ProductFaq {
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  overview?: string;
  categoryKey: ProductCategoryKey;
  categoryLabel: string;
  sellerName: string;
  sellerSlug: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  deliveryTime: string;
  image: string;
  gallery?: string[];
  badge?: string;
  tags: string[];
  sellerLevel: string;
  isFeatured?: boolean;
  isPromoted?: boolean;
  included?: string[];
  process?: string[];
  faqs?: ProductFaq[];
  createdAt?: string;
}

export interface ProductReview {
  id: string;
  productSlug: string;
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  helpfulCount?: number;
  verified?: boolean;
}

export type ProductSellerLevelFilter = 'all' | 'Top Rated' | 'Level 2' | 'Rising Talent';

export interface ProductListingFilters {
  priceMin: number;
  priceMax: number;
  minRating: number;
  deliveryTime: 'all' | 'instant' | '1-3' | '4-7' | '8-14' | '15+';
  sellerLevel: ProductSellerLevelFilter;
  verifiedOnly: boolean;
  featuredOnly: boolean;
  promotedOnly: boolean;
}

export const DEFAULT_PRODUCT_LISTING_FILTERS: ProductListingFilters = {
  priceMin: 0,
  priceMax: 200000,
  minRating: 0,
  deliveryTime: 'all',
  sellerLevel: 'all',
  verifiedOnly: false,
  featuredOnly: false,
  promotedOnly: false,
};

export interface ProductFilterState {
  categoryKey: ProductCategoryKey | null;
  q: string;
  sort: SearchSortOption;
  filters: ProductListingFilters;
}

export type ProductFilter = ProductFilterState;
