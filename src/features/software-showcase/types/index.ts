import type {
  SoftwareHomepageSectionKey,
  SoftwarePlatformType,
  SoftwareSolutionGroupSlug,
} from '../config/constants';

export type { SoftwareHomepageSectionKey, SoftwarePlatformType, SoftwareSolutionGroupSlug };

export type SoftwareCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type ShowcaseMainCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  cover_url: string | null;
  cover_path: string | null;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type ShowcaseCategory = {
  id: string;
  main_category_id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  cover_url: string | null;
  cover_path: string | null;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type ShowcaseChildCategory = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type SoftwareProductFeature = {
  id: string;
  project_id: string;
  title: string;
  short_description: string | null;
  icon_key: string | null;
  sort_order: number;
  is_primary: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type SoftwareProject = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  feature_summary: string | null;
  category_id: string | null;
  main_category_id: string | null;
  taxonomy_category_id: string | null;
  child_category_id: string | null;
  industry: string | null;
  business_type: string | null;
  primary_user: string | null;
  solution_group: string | null;
  software_type: string | null;
  platform_type: string | null;
  modules: string[];
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
  asset_version: number;
  rating_avg?: number;
  review_count?: number;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type SoftwareProjectScreen = {
  id: string;
  project_id: string;
  /** When set, screen is package-specific; null = shared across packages. */
  package_id: string | null;
  screen_key: string;
  screen_name: string;
  module_name: string | null;
  short_caption: string | null;
  image_url: string | null;
  image_path: string | null;
  thumbnail_url: string | null;
  thumbnail_path: string | null;
  mobile_image_url: string | null;
  mobile_image_path: string | null;
  image_width: number | null;
  image_height: number | null;
  sort_order: number;
  is_featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type SoftwarePackageTier =
  | 'starter'
  | 'basic'
  | 'standard'
  | 'professional'
  | 'enterprise'
  | 'advanced';

export type SoftwarePackageFeature = {
  id: string;
  package_id: string;
  feature_key: string;
  label: string;
  feature_group: string;
  is_included: boolean;
  is_highlighted: boolean;
  display_order: number;
};

export type SoftwarePackage = {
  id: string;
  project_id: string;
  name: string;
  price: number;
  currency: string;
  short_description: string | null;
  /** Included feature labels (derived from feature_rows when present). */
  features: string[];
  /** Normalized feature rows with groups. */
  feature_rows: SoftwarePackageFeature[];
  is_popular: boolean;
  sort_order: number;
  active: boolean;
  /** Package tier slug (starter → enterprise). */
  tier: SoftwarePackageTier | string | null;
  /** Payment model — typically one_time. */
  payment_type: string | null;
  /** Target segment: small | growing | professional | enterprise. */
  target_business_size: string | null;
  badge: string | null;
  is_recommended: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type SoftwareProjectCard = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  feature_summary: string | null;
  category_id: string | null;
  industry: string | null;
  business_type: string | null;
  solution_group: string | null;
  software_type: string | null;
  platform_type: string | null;
  main_category_id: string | null;
  taxonomy_category_id: string | null;
  child_category_id: string | null;
  industry_id?: string | null;
  industry_slug?: string | null;
  industry_name?: string | null;
  canonical_path?: string | null;
  badge?: string | null;
  cover_card_url: string | null;
  cover_detail_url: string | null;
  /** Canonical resolved cover for listing cards (legacy-rejected + cache-busted). */
  coverImageUrl: string | null;
  starting_price: number;
  price_suffix: string;
  currency: string;
  featured: boolean;
  popular: boolean;
  published: boolean;
  sort_order: number;
  asset_version?: number;
  rating_avg?: number;
  review_count?: number;
  created_at: string;
  updated_at: string;
  category_name: string | null;
  category_slug: string | null;
  taxonomy_category_name: string | null;
  taxonomy_category_slug: string | null;
  child_category_name: string | null;
  child_category_slug: string | null;
  screen_count: number;
  primary_features: Array<Pick<SoftwareProductFeature, 'id' | 'title' | 'short_description'>>;
  deleted_at?: string | null;
};

export type SoftwareProjectDetail = SoftwareProject & {
  category: Pick<SoftwareCategory, 'id' | 'name' | 'slug'> | null;
  taxonomy_category: Pick<ShowcaseCategory, 'id' | 'name' | 'slug'> | null;
  child_category: Pick<ShowcaseChildCategory, 'id' | 'name' | 'slug'> | null;
  features: SoftwareProductFeature[];
  screens: SoftwareProjectScreen[];
  packages: SoftwarePackage[];
  related_websites_cta?: boolean;
};

export type SoftwareListFilters = {
  q?: string;
  /** @deprecated Industry category slug — prefer taxonomyCategory */
  industry?: string;
  /** Catalog industry path slug (`/software/{slug}`) → industry_slug column */
  industrySlug?: string;
  /** Showcase L2 taxonomy category slug (erp, pos, …) */
  taxonomyCategory?: string;
  /** Showcase L3 child category slug */
  child?: string;
  /** @deprecated Prefer `group` — primary chip id (erp, pos, …) */
  solutionGroup?: string;
  /** Primary chip id: all | erp | pos | crm | hrm — maps to taxonomyCategory */
  group?: string;
  /** Secondary More Filters chip ids / child slugs */
  more?: string[];
  minPrice?: number;
  maxPrice?: number;
  /** Project-level business_size values (small | growing | professional | enterprise) */
  businessSizes?: string[];
  /** Listing sort — default popular (featured → sort_order → created_at) */
  sort?: 'popular' | 'newest' | 'price-asc' | 'relevance';
  featured?: boolean;
  popular?: boolean;
  published?: boolean | 'all';
  page?: number;
  pageSize?: number;
};

export type SoftwareListResult = {
  items: SoftwareProjectCard[];
  total: number;
  page: number;
  pageSize: number;
};

export type SoftwareHomepageSectionsResult = Record<SoftwareHomepageSectionKey, SoftwareProjectCard[]>;

export type SoftwareScreenCategory =
  | 'dashboard'
  | 'list'
  | 'form'
  | 'detail'
  | 'transaction'
  | 'stock'
  | 'accounts'
  | 'reports'
  | 'users'
  | 'settings'
  | 'other';

export type SoftwareScreenSeed = {
  key: string;
  name: string;
  category: SoftwareScreenCategory;
};

export type SoftwareCategorySlug =
  | 'manufacturing'
  | 'trading-distribution'
  | 'retail-pos'
  | 'agro-farming'
  | 'garments-textile'
  | 'healthcare'
  | 'education'
  | 'logistics'
  | 'real-estate-construction'
  | 'service-business'
  | 'enterprise';

export type SoftwareThemeSidebar = 'dark' | 'light' | 'brand';
export type SoftwareThemeDensity = 'comfortable' | 'compact';

export type SeedSoftwareTheme = {
  primary: string;
  accent: string;
  sidebar: SoftwareThemeSidebar;
  density: SoftwareThemeDensity;
};

export type SeedSoftwareProduct = {
  slug: string;
  title: string;
  /** Cover/chrome brand label (e.g. RetailPro). Falls back to title in generators. */
  brandName: string;
  /** Short mark for avatar/logo; defaults to first word of brandName. */
  logoText?: string;
  categorySlug: SoftwareCategorySlug;
  solutionGroup: SoftwareSolutionGroupSlug;
  softwareType: string;
  platformType: SoftwarePlatformType;
  industry: string;
  businessType: string;
  primaryUser: string;
  shortDescription: string;
  fullDescription: string;
  startingPrice: number;
  priceSuffix: '' | '+';
  featured: boolean;
  popular: boolean;
  sortOrder: number;
  modules: string[];
  dashboardKPIs: string[];
  terminology: string[];
  screens: SoftwareScreenSeed[];
  theme: SeedSoftwareTheme;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
};

export type SoftwareCategorySeed = {
  name: string;
  slug: SoftwareCategorySlug;
  description: string;
  icon: string;
  sortOrder: number;
};
