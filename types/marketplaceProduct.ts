export interface MarketplaceProductCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
  isFeatured: boolean;
}

export interface MarketplaceProduct {
  id: string;
  slug: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  name: string;
  shortDescription: string | null;
  fullDescription: string | null;
  thumbnailUrl: string | null;
  coverImagePath?: string | null;
  coverImageAlt?: string | null;
  coverImagePrompt?: string | null;
  coverImageUpdatedAt?: string | null;
  gallery: string[];
  price: number;
  comparePrice: number | null;
  currency: string;
  stock: number;
  brand: string | null;
  sku: string | null;
  tags: string[];
  specifications: Record<string, string>;
  isFeatured: boolean;
  isPopular: boolean;
  rating: number;
  reviewCount: number;
}

export interface MarketplaceProductHomeData {
  categories: MarketplaceProductCategory[];
  products: MarketplaceProduct[];
}
