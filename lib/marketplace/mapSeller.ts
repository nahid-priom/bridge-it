import type {
  MarketplaceSeller,
  MarketplaceSellerClient,
  MarketplaceSellerPortfolioItem,
  MarketplaceSellerReview,
  MarketplaceSellerSkill,
  MarketplaceSellerSummary,
  MarketplaceSellerVerification,
} from '@/types/marketplaceSeller';

export type DbMarketplaceSellerRow = {
  id: string;
  slug: string;
  full_name: string;
  username: string | null;
  title: string;
  short_bio: string | null;
  about: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  country: string;
  city: string | null;
  languages: string[] | null;
  experience_years: number;
  response_time: string;
  response_rate: number;
  delivery_rate: number;
  total_orders: number;
  happy_clients: number;
  queue_orders: number;
  rating: number;
  total_reviews: number;
  starting_price: number;
  availability_status: string;
  is_top_rated: boolean;
  is_verified: boolean;
  is_featured: boolean;
  member_since: string;
  seller_level: string;
  primary_category_slug: string | null;
};

export function mapMarketplaceSeller(row: DbMarketplaceSellerRow): MarketplaceSeller {
  return {
    id: row.id,
    slug: row.slug,
    fullName: row.full_name,
    username: row.username,
    title: row.title,
    shortBio: row.short_bio,
    about: row.about,
    avatarUrl: row.avatar_url,
    bannerUrl: row.banner_url,
    country: row.country,
    city: row.city,
    languages: row.languages ?? ['English', 'Bengali'],
    experienceYears: row.experience_years,
    responseTime: row.response_time,
    responseRate: row.response_rate,
    deliveryRate: row.delivery_rate,
    totalOrders: row.total_orders,
    happyClients: row.happy_clients,
    queueOrders: row.queue_orders,
    rating: Number(row.rating),
    totalReviews: row.total_reviews,
    startingPrice: row.starting_price,
    availabilityStatus: row.availability_status,
    isTopRated: row.is_top_rated,
    isVerified: row.is_verified,
    isFeatured: row.is_featured,
    memberSince: row.member_since,
    sellerLevel: row.seller_level,
    primaryCategorySlug: row.primary_category_slug,
  };
}

export function mapSellerSummary(row: DbMarketplaceSellerRow): MarketplaceSellerSummary {
  const s = mapMarketplaceSeller(row);
  return {
    id: s.id,
    slug: s.slug,
    fullName: s.fullName,
    title: s.title,
    avatarUrl: s.avatarUrl,
    rating: s.rating,
    totalReviews: s.totalReviews,
    startingPrice: s.startingPrice,
    sellerLevel: s.sellerLevel,
    isTopRated: s.isTopRated,
    isVerified: s.isVerified,
    city: s.city,
    availabilityStatus: s.availabilityStatus,
  };
}

export function mapSellerSkill(row: {
  id: string;
  skill_name: string;
  skill_percentage: number;
  sort_order: number;
}): MarketplaceSellerSkill {
  return {
    id: row.id,
    skillName: row.skill_name,
    skillPercentage: row.skill_percentage,
    sortOrder: row.sort_order,
  };
}

export function mapSellerReview(row: {
  id: string;
  client_name: string;
  client_country: string;
  client_avatar: string | null;
  rating: number;
  review_text: string;
  project_title: string | null;
  created_at: string;
}): MarketplaceSellerReview {
  return {
    id: row.id,
    clientName: row.client_name,
    clientCountry: row.client_country,
    clientAvatar: row.client_avatar,
    rating: Number(row.rating),
    reviewText: row.review_text,
    projectTitle: row.project_title,
    createdAt: row.created_at,
  };
}

export function mapSellerPortfolio(row: {
  id: string;
  title: string;
  category: string | null;
  image_url: string | null;
  technologies: string[] | null;
  project_url: string | null;
  sort_order: number;
}): MarketplaceSellerPortfolioItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    imageUrl: row.image_url,
    technologies: row.technologies ?? [],
    projectUrl: row.project_url,
    sortOrder: row.sort_order,
  };
}

export function mapSellerVerification(row: {
  id: string;
  verification_type: string;
  verified: boolean;
}): MarketplaceSellerVerification {
  return {
    id: row.id,
    verificationType: row.verification_type,
    verified: row.verified,
  };
}

export function mapSellerClient(row: {
  id: string;
  client_name: string;
  logo_url: string | null;
  sort_order: number;
}): MarketplaceSellerClient {
  return {
    id: row.id,
    clientName: row.client_name,
    logoUrl: row.logo_url,
    sortOrder: row.sort_order,
  };
}
