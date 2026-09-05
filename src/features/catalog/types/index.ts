export type CatalogCategoryRoot = 'software' | 'websites' | 'marketing';

export type CatalogProductKind = CatalogCategoryRoot;

export type CatalogIndustryTaxonomyType = 'industry' | 'business_function' | 'service_vertical';

export interface CatalogIndustry {
  id: string;
  category_root: CatalogCategoryRoot;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_h1: string | null;
  seo_intro: string | null;
  /** industry | business_function | service_vertical */
  taxonomy_type?: CatalogIndustryTaxonomyType | string | null;
  is_featured?: boolean;
  primary_keyword?: string | null;
  secondary_keywords?: string[];
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CatalogProductRef {
  kind: CatalogProductKind;
  id: string;
  slug: string;
  title: string;
  industry_id: string | null;
  industry_slug: string | null;
  industry_name: string | null;
  canonical_path: string | null;
  short_description: string | null;
  cover_url: string | null;
  starting_price: number;
  price_suffix: string;
  currency: string;
  badge: string | null;
  business_size: string | null;
  package_tier: string | null;
  payment_type: string | null;
  featured: boolean;
  popular: boolean;
  published: boolean;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
  primary_keyword: string | null;
  secondary_keywords: string[];
  rating_avg?: number | null;
  review_count?: number | null;
}

export interface CatalogUrlRedirect {
  id: string;
  from_path: string;
  to_path: string;
  permanent: boolean;
  active: boolean;
}

export interface CatalogFaq {
  id: string;
  category_root: CatalogCategoryRoot | null;
  industry_id: string | null;
  product_kind: CatalogProductKind | null;
  product_id: string | null;
  question: string;
  answer: string;
  sort_order: number;
  active: boolean;
}

export interface CatalogRelatedProduct {
  id: string;
  source_kind: CatalogProductKind;
  source_id: string;
  related_kind: CatalogProductKind;
  related_id: string;
  sort_order: number;
  product: CatalogProductRef | null;
}

export interface CatalogProductListFilters {
  root: CatalogCategoryRoot;
  industryId?: string | null;
  industrySlug?: string | null;
  q?: string | null;
  featured?: boolean;
  popular?: boolean;
  businessSize?: string | null;
  packageTier?: string | null;
  page?: number;
  pageSize?: number;
}

export interface CatalogProductListResult {
  items: CatalogProductRef[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CatalogBreadcrumbItem {
  name: string;
  path: string;
}

export interface CatalogPageMetadata {
  title: string;
  description: string;
  canonicalPath: string;
  h1?: string;
}

export interface CatalogFaqScope {
  categoryRoot?: CatalogCategoryRoot | null;
  industryId?: string | null;
  productKind?: CatalogProductKind | null;
  productId?: string | null;
}
