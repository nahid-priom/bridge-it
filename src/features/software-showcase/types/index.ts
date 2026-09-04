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

export type SoftwareProject = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  category_id: string | null;
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
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type SoftwareProjectScreen = {
  id: string;
  project_id: string;
  screen_key: string;
  screen_name: string;
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

export type SoftwarePackage = {
  id: string;
  project_id: string;
  name: string;
  price: number;
  currency: string;
  short_description: string | null;
  features: string[];
  is_popular: boolean;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type SoftwareProjectCard = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  category_id: string | null;
  industry: string | null;
  business_type: string | null;
  solution_group: string | null;
  software_type: string | null;
  platform_type: string | null;
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
  category_name: string | null;
  category_slug: string | null;
  screen_count: number;
  deleted_at?: string | null;
};

export type SoftwareProjectDetail = SoftwareProject & {
  category: Pick<SoftwareCategory, 'id' | 'name' | 'slug'> | null;
  screens: SoftwareProjectScreen[];
  packages: SoftwarePackage[];
};

export type SoftwareListFilters = {
  q?: string;
  /** Industry category slug */
  category?: string;
  /** @deprecated Prefer `group` — primary chip id (erp, pos, …) */
  solutionGroup?: string;
  /** Primary chip id: all | erp | pos | crm | hrm */
  group?: string;
  /** Secondary More Filters chip ids */
  more?: string[];
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
