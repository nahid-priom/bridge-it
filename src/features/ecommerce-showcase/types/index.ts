import type { PageTypeId } from '../config/page-types';
import type { LeadStatus, WebsiteOrderStatus } from '../config/constants';

export type { PageTypeId, LeadStatus, WebsiteOrderStatus };

export type EcommerceCategory = {
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

export type EcommerceTechnology = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
};

export type EcommerceProject = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  category_id: string | null;
  technology_stack: string[];
  website_type: string | null;
  industry: string | null;
  cover_image_url: string | null;
  cover_image_path: string | null;
  cover_fallback_url: string | null;
  cover_fallback_path: string | null;
  og_image_url: string | null;
  starting_price: number;
  currency: string;
  featured: boolean;
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

export type EcommerceProjectPage = {
  id: string;
  project_id: string;
  page_type: PageTypeId | string;
  page_name: string;
  slug: string;
  image_url: string | null;
  image_path: string | null;
  fallback_url: string | null;
  fallback_path: string | null;
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

export type EcommercePackage = {
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

export type ProjectLead = {
  id: string;
  project_id: string | null;
  package_id: string | null;
  name: string;
  phone: string;
  business_name: string | null;
  website_url: string | null;
  message: string | null;
  preferred_contact: string | null;
  status: LeadStatus;
  source: string;
  created_at: string;
  updated_at: string;
};

export type EcommerceProjectCard = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  category_id: string | null;
  technology_stack: string[];
  website_type: string | null;
  industry: string | null;
  cover_image_url: string | null;
  cover_fallback_url: string | null;
  starting_price: number;
  currency: string;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  category_name: string | null;
  category_slug: string | null;
  page_count: number;
  page_types?: string[];
  deleted_at?: string | null;
};

export type EcommerceProjectDetail = EcommerceProject & {
  category: Pick<EcommerceCategory, 'id' | 'name' | 'slug'> | null;
  pages: EcommerceProjectPage[];
  packages: EcommercePackage[];
};

export type ShowcaseListFilters = {
  q?: string;
  category?: string;
  tech?: string;
  page?: string;
  view?: string;
  industry?: string;
  websiteType?: string;
  price?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  published?: boolean | 'all';
  offset?: number;
  limit?: number;
};

export type ShowcaseListResult = {
  items: EcommerceProjectCard[];
  total: number;
};

export type HomepageSectionKey =
  | 'popular'
  | 'fashion_lifestyle'
  | 'electronics_gadgets';

export type HomepagePlacement = {
  id: string;
  section_key: HomepageSectionKey;
  project_id: string;
  sort_order: number;
  active: boolean;
};

export type HomepageSectionCard = EcommerceProjectCard & {
  section_key: HomepageSectionKey;
  placement_id: string;
};

export type HomepageSectionsResult = Record<HomepageSectionKey, EcommerceProjectCard[]>;

export type HomepageLegacyCategorySection = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  viewAllHref: string;
  viewAllLabel: string;
  projects: EcommerceProjectCard[];
};

export type WebsiteOrder = {
  id: string;
  order_number: string;
  user_id: string;
  project_id: string;
  package_id: string | null;
  project_title: string;
  package_name: string;
  amount: number;
  currency: string;
  customer_name: string;
  phone: string;
  business_name: string | null;
  notes: string | null;
  status: WebsiteOrderStatus;
  created_at: string;
  updated_at: string;
  project_slug?: string | null;
};
