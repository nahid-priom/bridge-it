export interface Seller {
  id: string;
  name: string;
  slug: string;
  avatar: string;
  coverImage: string;
  category: CategoryType;
  rating: number;
  reviewCount: number;
  verified: boolean;
  description: string;
  tagline: string;
  location: string;
  joinedDate: string;
  completedProjects: number;
  responseTime: string;
  services: Service[];
  gallery: GalleryItem[];
  customUrl: string;
}

export type SearchResultType = 'service' | 'digital-product' | 'seller' | 'course';

export interface Service {
  id: string;
  title: string;
  titleBn?: string;
  description: string;
  price: number;
  currency: string;
  deliveryTime: string;
  thumbnail: string;
  category: CategoryType;
  subcategory: string;
  rating: number;
  reviewCount: number;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  features: string[];
  demoItems: GalleryItem[];
  tags: string[];
  popular: boolean;
  isVerified?: boolean;
  isFeatured?: boolean;
  hasProtectedDemo?: boolean;
  location?: string;
  language?: string;
  escrowAvailable?: boolean;
  instantDelivery?: boolean;
  resultType?: SearchResultType;
}

export type SearchFilterResultType = 'all' | SearchResultType;

export interface SearchFilters {
  resultType: SearchFilterResultType;
  category: CategoryType | 'all';
  priceMin: number;
  priceMax: number;
  deliveryTime: 'all' | 'instant' | '1-3' | '4-7' | '8-14' | '15+';
  minRating: number;
  verifiedOnly: boolean;
  featuredOnly: boolean;
  protectedDemoOnly: boolean;
  location: string;
  language: string;
  escrowOnly: boolean;
  instantOnly: boolean;
}

export interface SearchListingItem {
  kind: 'listing';
  service: Service;
}

export interface SearchSellerItem {
  kind: 'seller';
  id: string;
  title: string;
  titleBn?: string;
  description: string;
  thumbnail: string;
  category: CategoryType;
  categoryName: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  rating: number;
  reviewCount: number;
  location: string;
  language: string;
  isVerified: boolean;
  isFeatured: boolean;
  tags: string[];
}

export type SearchCatalogItem = SearchListingItem | SearchSellerItem;

export const DEFAULT_SEARCH_FILTERS: SearchFilters = {
  resultType: 'all',
  category: 'all',
  priceMin: 0,
  priceMax: 200000,
  deliveryTime: 'all',
  minRating: 0,
  verifiedOnly: false,
  featuredOnly: false,
  protectedDemoOnly: false,
  location: 'all',
  language: 'all',
  escrowOnly: false,
  instantOnly: false,
};

export interface GalleryItem {
  id: string;
  type: 'image' | 'video' | 'demo';
  url: string;
  thumbnail: string;
  title: string;
  protected: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'file' | 'image';
}

export interface Order {
  id: string;
  serviceId: string;
  buyerId: string;
  sellerId: string;
  status: 'pending' | 'in-progress' | 'review' | 'completed' | 'cancelled';
  totalAmount: number;
  currency: string;
  createdAt: string;
  deliveryDate: string;
  service: Service;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  serviceId: string;
}

export type CategoryType = 
  | '2d-animation'
  | '3d-animation'
  | 'video-ads'
  | 'software'
  | 'digital-products'
  | 'courses'
  | 'boosting-agency'
  | 'editing'
  | 'web-development'
  | 'mobile-apps'
  | 'ui-ux-design'
  | 'digital-marketing';

export interface Category {
  id: CategoryType;
  name: string;
  nameBn: string;
  icon: string;
  description: string;
  color: string;
  gradient: string;
  count: number;
}

export type PageType = 
  | 'home'
  | 'categories'
  | 'category-detail'
  | 'service-detail'
  | 'seller-profile'
  | 'messages'
  | 'cart'
  | 'dashboard'
  | 'admin-dashboard'
  | 'search'
  | 'products'
  | 'about';

export type ProductCategoryFilter =
  | 'all'
  | 'digital-products'
  | 'courses'
  | 'templates'
  | 'scripts'
  | 'ui-kits'
  | 'marketing-assets';
