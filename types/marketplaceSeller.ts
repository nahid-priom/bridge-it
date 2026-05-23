import type { MarketplaceService } from '@/types/marketplace';

export interface MarketplaceSeller {
  id: string;
  slug: string;
  fullName: string;
  username: string | null;
  title: string;
  shortBio: string | null;
  about: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  country: string;
  city: string | null;
  languages: string[];
  experienceYears: number;
  responseTime: string;
  responseRate: number;
  deliveryRate: number;
  totalOrders: number;
  happyClients: number;
  queueOrders: number;
  rating: number;
  totalReviews: number;
  startingPrice: number;
  availabilityStatus: string;
  isTopRated: boolean;
  isVerified: boolean;
  isFeatured: boolean;
  memberSince: string;
  sellerLevel: string;
  primaryCategorySlug: string | null;
}

export interface MarketplaceSellerSkill {
  id: string;
  skillName: string;
  skillPercentage: number;
  sortOrder: number;
}

export interface MarketplaceSellerReview {
  id: string;
  clientName: string;
  clientCountry: string;
  clientAvatar: string | null;
  rating: number;
  reviewText: string;
  projectTitle: string | null;
  createdAt: string;
}

export interface MarketplaceSellerPortfolioItem {
  id: string;
  title: string;
  category: string | null;
  imageUrl: string | null;
  technologies: string[];
  projectUrl: string | null;
  sortOrder: number;
}

export interface MarketplaceSellerVerification {
  id: string;
  verificationType: string;
  verified: boolean;
}

export interface MarketplaceSellerClient {
  id: string;
  clientName: string;
  logoUrl: string | null;
  sortOrder: number;
}

export interface MarketplaceSellerProfile {
  seller: MarketplaceSeller;
  skills: MarketplaceSellerSkill[];
  reviews: MarketplaceSellerReview[];
  portfolio: MarketplaceSellerPortfolioItem[];
  verifications: MarketplaceSellerVerification[];
  clients: MarketplaceSellerClient[];
  services: MarketplaceService[];
}

export type MarketplaceSellerSummary = Pick<
  MarketplaceSeller,
  | 'id'
  | 'slug'
  | 'fullName'
  | 'title'
  | 'avatarUrl'
  | 'rating'
  | 'totalReviews'
  | 'startingPrice'
  | 'sellerLevel'
  | 'isTopRated'
  | 'isVerified'
  | 'city'
  | 'availabilityStatus'
>;
