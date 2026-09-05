export type PortfolioContentType = 'website' | 'software' | 'marketing';

export type PortfolioPricingMode = 'starting_from' | 'fixed' | 'custom' | 'hidden';

export type PortfolioCardData = {
  id: string;
  slug: string;
  contentType: PortfolioContentType;
  title: string;
  categoryLabel?: string;
  categorySlug?: string;
  coverImageUrl: string | null;
  coverImageFallbackUrl?: string | null;
  coverImageAlt?: string;
  rating?: number | null;
  reviewCount?: number | null;
  pricingMode: PortfolioPricingMode;
  price?: number | null;
  currency?: 'BDT' | string;
  /** Extra suffix from DB (e.g. "+"); starting_from always shows + when absent. */
  priceSuffix?: string | null;
  href: string;
  featured?: boolean;
};
