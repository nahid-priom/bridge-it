import type {
  CreativeMarketingHomepageSectionKey,
  CreativeMarketingPricingModel,
  CreativeMarketingServiceGroupSlug,
} from '../config/constants';

export type {
  CreativeMarketingHomepageSectionKey,
  CreativeMarketingPricingModel,
  CreativeMarketingServiceGroupSlug,
};

export type CreativeMarketingProject = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  outcome_line: string | null;
  service_group: string;
  service_type: string | null;
  service_subcategory: string | null;
  target_business: string | null;
  pricing_model: string;
  deliverables: string[];
  related_slugs: string[];
  cover_card_url: string | null;
  cover_card_path: string | null;
  cover_detail_url: string | null;
  cover_detail_path: string | null;
  og_image_url: string | null;
  starting_price: number;
  price_suffix: string;
  currency: string;
  featured: boolean;
  popular: boolean;
  published: boolean;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type CreativeMarketingAsset = {
  id: string;
  project_id: string;
  asset_key: string;
  asset_name: string;
  asset_kind: string;
  image_url: string | null;
  image_path: string | null;
  thumbnail_url: string | null;
  thumbnail_path: string | null;
  image_width: number | null;
  image_height: number | null;
  sort_order: number;
  is_featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type CreativeMarketingPackage = {
  id: string;
  project_id: string;
  name: string;
  price: number;
  currency: string;
  pricing_model: string;
  short_description: string | null;
  features: string[];
  is_popular: boolean;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type CreativeMarketingProjectCard = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  outcome_line: string | null;
  service_group: string;
  service_type: string | null;
  service_subcategory: string | null;
  target_business: string | null;
  pricing_model: string;
  cover_card_url: string | null;
  cover_detail_url: string | null;
  starting_price: number;
  price_suffix: string;
  currency: string;
  featured: boolean;
  popular: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  asset_count: number;
  deleted_at?: string | null;
};

export type CreativeMarketingProjectDetail = CreativeMarketingProject & {
  assets: CreativeMarketingAsset[];
  packages: CreativeMarketingPackage[];
  related: CreativeMarketingProjectCard[];
};

export type CreativeMarketingListFilters = {
  q?: string;
  /** Primary chip: all | design | branding | ads | marketing */
  group?: string;
  /** Secondary more-filter ids */
  more?: string[];
  /** @deprecated Prefer group + more */
  serviceGroup?: string;
  featured?: boolean;
  popular?: boolean;
  published?: boolean | 'all';
  page?: number;
  pageSize?: number;
};

export type CreativeMarketingListResult = {
  items: CreativeMarketingProjectCard[];
  total: number;
  page: number;
  pageSize: number;
};

export type CreativeMarketingHomepageSectionsResult = Record<
  CreativeMarketingHomepageSectionKey,
  CreativeMarketingProjectCard[]
>;

export type SeedCreativeAsset = {
  key: string;
  name: string;
  kind: 'portfolio' | 'dashboard' | 'mockup' | 'other';
};

export type SeedCreativeMarketingProduct = {
  slug: string;
  title: string;
  serviceGroup: CreativeMarketingServiceGroupSlug;
  serviceType: string;
  serviceSubcategory: 'graphics-design' | 'digital-marketing';
  targetBusiness: string;
  pricingModel: CreativeMarketingPricingModel;
  shortDescription: string;
  outcomeLine: string;
  fullDescription: string;
  startingPrice: number;
  priceSuffix: '' | '+';
  featured: boolean;
  popular: boolean;
  sortOrder: number;
  deliverables: string[];
  relatedSlugs: string[];
  assets: SeedCreativeAsset[];
  theme: { primary: string; accent: string };
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
};
