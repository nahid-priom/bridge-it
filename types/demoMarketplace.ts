export type SellerBadge = 'Top Rated Seller' | 'Level 2 Seller' | 'New Seller';

export type ThumbnailVariant =
  | 'web'
  | 'wordpress'
  | 'ecommerce'
  | 'ai'
  | 'marketing'
  | 'video'
  | 'design'
  | 'seo'
  | 'fullstack'
  | 'landing'
  | 'maintenance'
  | 'mobile'
  | 'dashboard'
  | 'saas'
  | 'booking'
  | 'lms'
  | 'restaurant'
  | 'realestate'
  | 'speed'
  | 'migration'
  | 'payment'
  | 'api'
  | 'crm';

export interface DemoService {
  id: string;
  slug: string;
  title: string;
  sellerName: string;
  sellerLevel: string;
  badge: SellerBadge;
  category: string;
  thumbnailVariant: ThumbnailVariant;
  rating: number;
  reviewCount: number;
  price: number;
  deliveryDays: number;
  location: string;
  tags: string[];
}

export interface DemoFreelancer {
  id: string;
  name: string;
  badge: SellerBadge;
  sellerLevel: string;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  isOnline: boolean;
  avatarHue: number;
}

export type DemoSortOption =
  | 'recommended'
  | 'top-rated'
  | 'price-low'
  | 'price-high'
  | 'fast-delivery';

export type ActiveChip = {
  id: string;
  label: string;
};
