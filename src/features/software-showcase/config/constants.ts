export const SOFTWARE_BUCKET = 'admin-showcase';
export const SHOWCASE_BUCKET = SOFTWARE_BUCKET;

export const SOFTWARE_CURRENCY = 'BDT';
export const SHOWCASE_CURRENCY = SOFTWARE_CURRENCY;

export const SOFTWARE_GALLERY_PAGE_SIZE = 12;
export const GALLERY_PAGE_SIZE = SOFTWARE_GALLERY_PAGE_SIZE;

export const SOFTWARE_HOMEPAGE_SECTION_MAX = 8;
export const HOMEPAGE_SECTION_MAX = SOFTWARE_HOMEPAGE_SECTION_MAX;

export const SOFTWARE_HOMEPAGE_SECTIONS = [
  {
    key: 'popular',
    title: 'Popular Software Solutions',
    eyebrow: 'Business tools',
    description: 'Premium featured systems for retail, HR, CRM, dealership and more.',
    viewAllHref: '/software',
    viewAllLabel: 'View all software',
  },
  {
    key: 'manufacturing_erp',
    title: 'Industry & Operations Software',
    eyebrow: 'Industry',
    description: 'Premium manufacturing, agro, garments and factory-ready platforms.',
    viewAllHref: '/software?more=manufacturing',
    viewAllLabel: 'View industry software',
  },
] as const;

export type SoftwareHomepageSectionKey = (typeof SOFTWARE_HOMEPAGE_SECTIONS)[number]['key'];

export const HOMEPAGE_SECTIONS = SOFTWARE_HOMEPAGE_SECTIONS;

/** Broad solution groups under Software Solutions (not ERP-only). */
export const SOFTWARE_SOLUTION_GROUPS = [
  { slug: 'erp-business-management', name: 'ERP & Business Management', shortLabel: 'ERP' },
  { slug: 'pos-retail', name: 'POS & Retail', shortLabel: 'POS' },
  { slug: 'crm-sales', name: 'CRM & Sales', shortLabel: 'CRM' },
  { slug: 'hrm-payroll', name: 'HRM & Payroll', shortLabel: 'HRM' },
  { slug: 'manufacturing-production', name: 'Manufacturing & Production', shortLabel: 'Manufacturing' },
  { slug: 'inventory-warehouse', name: 'Inventory & Warehouse', shortLabel: 'Inventory' },
  { slug: 'accounting-finance', name: 'Accounting & Finance', shortLabel: 'Accounting' },
  { slug: 'distribution-dealership', name: 'Distribution & Dealership', shortLabel: 'Distribution' },
  { slug: 'agro-farm-management', name: 'Agro & Farm Management', shortLabel: 'Agro' },
  { slug: 'healthcare-software', name: 'Healthcare Software', shortLabel: 'Healthcare' },
  { slug: 'education-software', name: 'Education Software', shortLabel: 'Education' },
  { slug: 'logistics-courier', name: 'Logistics & Courier', shortLabel: 'Logistics' },
  { slug: 'real-estate-construction', name: 'Real Estate & Construction', shortLabel: 'Real Estate' },
  { slug: 'restaurant-hospitality', name: 'Restaurant & Hospitality', shortLabel: 'Hospitality' },
  { slug: 'saas-platforms', name: 'SaaS Platforms', shortLabel: 'SaaS' },
  { slug: 'mobile-apps', name: 'Mobile Apps', shortLabel: 'Mobile' },
  { slug: 'business-automation', name: 'Business Automation', shortLabel: 'Automation' },
  { slug: 'ai-enabled-systems', name: 'AI-enabled Business Systems', shortLabel: 'AI Systems' },
  { slug: 'custom-business-software', name: 'Custom Business Software', shortLabel: 'Custom' },
  { slug: 'enterprise-solutions', name: 'Enterprise Solutions', shortLabel: 'Enterprise' },
] as const;

export type SoftwareSolutionGroupSlug = (typeof SOFTWARE_SOLUTION_GROUPS)[number]['slug'];

export const SOFTWARE_PLATFORM_TYPES = ['web', 'mobile', 'web-mobile', 'saas'] as const;
export type SoftwarePlatformType = (typeof SOFTWARE_PLATFORM_TYPES)[number];

/** Primary listing chips — maps to showcase taxonomy_category slug (+ legacy solution_group). */
export const SOFTWARE_PRIMARY_FILTERS = [
  { id: 'all', label: 'All', taxonomySlug: undefined as string | undefined, groups: undefined as SoftwareSolutionGroupSlug[] | undefined },
  { id: 'erp', label: 'ERP', taxonomySlug: 'erp', groups: ['erp-business-management'] as SoftwareSolutionGroupSlug[] },
  { id: 'pos', label: 'POS', taxonomySlug: 'pos', groups: ['pos-retail'] as SoftwareSolutionGroupSlug[] },
  { id: 'crm', label: 'CRM', taxonomySlug: 'crm', groups: ['crm-sales'] as SoftwareSolutionGroupSlug[] },
  { id: 'hrm', label: 'HRM', taxonomySlug: 'hrm', groups: ['hrm-payroll'] as SoftwareSolutionGroupSlug[] },
  {
    id: 'business-automation',
    label: 'Automation',
    taxonomySlug: 'business-automation',
    groups: ['business-automation', 'inventory-warehouse', 'saas-platforms'] as SoftwareSolutionGroupSlug[],
  },
  {
    id: 'ecommerce-admin',
    label: 'E-com Admin',
    taxonomySlug: 'ecommerce-admin',
    groups: undefined as SoftwareSolutionGroupSlug[] | undefined,
  },
] as const;

/** Map legacy group id → taxonomy category slug for URL `category`. */
export function primaryFilterToTaxonomySlug(id: string | null | undefined): string | undefined {
  if (!id || id === 'all') return undefined;
  const found = SOFTWARE_PRIMARY_FILTERS.find((f) => f.id === id);
  return found?.taxonomySlug;
}

/** Secondary filters shown inside More Filters sheet. */
export const SOFTWARE_MORE_FILTERS = [
  {
    id: 'manufacturing',
    label: 'Manufacturing',
    groups: ['manufacturing-production'] as SoftwareSolutionGroupSlug[],
  },
  { id: 'agro', label: 'Agro', groups: ['agro-farm-management'] as SoftwareSolutionGroupSlug[] },
  {
    id: 'healthcare',
    label: 'Healthcare',
    groups: ['healthcare-software'] as SoftwareSolutionGroupSlug[],
  },
  {
    id: 'education',
    label: 'Education',
    groups: ['education-software'] as SoftwareSolutionGroupSlug[],
  },
  {
    id: 'logistics',
    label: 'Logistics',
    groups: ['logistics-courier'] as SoftwareSolutionGroupSlug[],
  },
  {
    id: 'distribution',
    label: 'Distribution',
    groups: ['distribution-dealership'] as SoftwareSolutionGroupSlug[],
  },
  {
    id: 'inventory',
    label: 'Inventory',
    groups: ['inventory-warehouse'] as SoftwareSolutionGroupSlug[],
  },
  {
    id: 'accounting',
    label: 'Accounting',
    groups: ['accounting-finance'] as SoftwareSolutionGroupSlug[],
  },
  { id: 'saas', label: 'SaaS', groups: ['saas-platforms'] as SoftwareSolutionGroupSlug[] },
  {
    id: 'automation',
    label: 'Automation',
    groups: ['business-automation'] as SoftwareSolutionGroupSlug[],
  },
  {
    id: 'enterprise',
    label: 'Enterprise',
    groups: ['enterprise-solutions'] as SoftwareSolutionGroupSlug[],
  },
] as const;

/** @deprecated Prefer SOFTWARE_PRIMARY_FILTERS + SOFTWARE_MORE_FILTERS */
export const SOFTWARE_LISTING_FILTERS = [
  ...SOFTWARE_PRIMARY_FILTERS,
  ...SOFTWARE_MORE_FILTERS,
] as const;

export type SoftwareListingFilterId = (typeof SOFTWARE_LISTING_FILTERS)[number]['id'];
export type SoftwarePrimaryFilterId = (typeof SOFTWARE_PRIMARY_FILTERS)[number]['id'];
export type SoftwareMoreFilterId = (typeof SOFTWARE_MORE_FILTERS)[number]['id'];

const EXPLORE_PILLAR_TYPES = new Set(['software', 'websites', 'marketing', 'creative-marketing']);

export function isSoftwareFilterId(value: string | null | undefined): value is SoftwareListingFilterId {
  if (!value || value === 'all') return false;
  if (EXPLORE_PILLAR_TYPES.has(value)) return false;
  return SOFTWARE_LISTING_FILTERS.some((f) => f.id === value);
}

export function isSoftwarePrimaryFilterId(
  value: string | null | undefined
): value is SoftwarePrimaryFilterId {
  if (!value) return false;
  return SOFTWARE_PRIMARY_FILTERS.some((f) => f.id === value);
}

export function isSoftwareMoreFilterId(value: string | null | undefined): value is SoftwareMoreFilterId {
  if (!value) return false;
  return SOFTWARE_MORE_FILTERS.some((f) => f.id === value);
}

/** Parse primary chip id from URL — never treat explore `type=software` as a group. */
export function parseSoftwareGroupParam(
  ...candidates: Array<string | null | undefined>
): SoftwarePrimaryFilterId | 'all' {
  for (const raw of candidates) {
    const value = raw?.trim();
    if (!value || value === 'all') continue;
    if (EXPLORE_PILLAR_TYPES.has(value)) continue;
    if (isSoftwarePrimaryFilterId(value)) return value;
  }
  return 'all';
}

/** Parse comma-separated more-filter ids from URL. */
export function parseSoftwareMoreParam(raw: string | null | undefined): SoftwareMoreFilterId[] {
  if (!raw?.trim()) return [];
  const seen = new Set<SoftwareMoreFilterId>();
  for (const part of raw.split(',')) {
    const id = part.trim();
    if (isSoftwareMoreFilterId(id)) seen.add(id);
  }
  return [...seen];
}

export function serializeSoftwareMoreParam(ids: string[]): string | undefined {
  const valid = ids.filter(isSoftwareMoreFilterId);
  return valid.length ? valid.join(',') : undefined;
}

export function solutionGroupLabel(slug: string | null | undefined): string {
  if (!slug) return 'Software Solution';
  const found = SOFTWARE_SOLUTION_GROUPS.find((g) => g.slug === slug);
  return found?.name ?? slug;
}

export function listingFilterGroups(
  filterId: string | null | undefined
): SoftwareSolutionGroupSlug[] | undefined {
  if (!filterId || filterId === 'all') return undefined;
  if (EXPLORE_PILLAR_TYPES.has(filterId)) return undefined;
  const found = SOFTWARE_LISTING_FILTERS.find((f) => f.id === filterId);
  return found?.groups;
}

/** Resolve primary + more filter chips into DB solution_group slugs (OR). */
export function resolveSoftwareGroupSlugs(options: {
  group?: string | null;
  more?: string[] | null;
}): SoftwareSolutionGroupSlug[] | undefined {
  const slugs = new Set<SoftwareSolutionGroupSlug>();
  const primary = listingFilterGroups(options.group);
  primary?.forEach((slug) => slugs.add(slug));
  for (const id of options.more ?? []) {
    listingFilterGroups(id)?.forEach((slug) => slugs.add(slug));
  }
  if (slugs.size === 0) return undefined;
  return [...slugs];
}


/** Seed / migration category list — industry verticals (secondary filter). */
export const SOFTWARE_CATEGORIES = [
  {
    name: 'Manufacturing',
    slug: 'manufacturing',
    description: 'Factory, production and plant management software.',
    icon: 'factory',
    sortOrder: 10,
  },
  {
    name: 'Trading & Distribution',
    slug: 'trading-distribution',
    description: 'Wholesale, dealership and distribution software.',
    icon: 'truck',
    sortOrder: 20,
  },
  {
    name: 'Retail & POS',
    slug: 'retail-pos',
    description: 'Retail stores, POS and shop management.',
    icon: 'store',
    sortOrder: 30,
  },
  {
    name: 'Agro & Farming',
    slug: 'agro-farming',
    description: 'Feed, poultry, fish, cattle and farm systems.',
    icon: 'sprout',
    sortOrder: 40,
  },
  {
    name: 'Garments & Textile',
    slug: 'garments-textile',
    description: 'Apparel, dyeing and textile business software.',
    icon: 'shirt',
    sortOrder: 50,
  },
  {
    name: 'Healthcare',
    slug: 'healthcare',
    description: 'Hospital, clinic, diagnostic and pharmacy systems.',
    icon: 'heart-pulse',
    sortOrder: 60,
  },
  {
    name: 'Education',
    slug: 'education',
    description: 'School, college and coaching management.',
    icon: 'graduation-cap',
    sortOrder: 70,
  },
  {
    name: 'Logistics',
    slug: 'logistics',
    description: 'Courier, transport and logistics software.',
    icon: 'package',
    sortOrder: 80,
  },
  {
    name: 'Real Estate & Construction',
    slug: 'real-estate-construction',
    description: 'Property, construction and project software.',
    icon: 'building',
    sortOrder: 90,
  },
  {
    name: 'Service Business',
    slug: 'service-business',
    description: 'Salon, workshop, ISP and service ops.',
    icon: 'wrench',
    sortOrder: 100,
  },
  {
    name: 'Enterprise',
    slug: 'enterprise',
    description: 'Multi-branch, CRM, HR and SaaS platforms.',
    icon: 'building-2',
    sortOrder: 110,
  },
] as const;

/** @deprecated Prefer SOFTWARE_LISTING_FILTERS for primary chips */
export const SOFTWARE_LISTING_CATEGORIES = [
  { id: 'all', label: 'All', slug: undefined },
  { id: 'manufacturing', label: 'Manufacturing', slug: 'manufacturing' },
  { id: 'trading-distribution', label: 'Trading', slug: 'trading-distribution' },
  { id: 'retail-pos', label: 'Retail & POS', slug: 'retail-pos' },
  { id: 'agro-farming', label: 'Agro', slug: 'agro-farming' },
  { id: 'garments-textile', label: 'Garments', slug: 'garments-textile' },
  { id: 'healthcare', label: 'Healthcare', slug: 'healthcare' },
  { id: 'education', label: 'Education', slug: 'education' },
  { id: 'logistics', label: 'Logistics', slug: 'logistics' },
  { id: 'real-estate-construction', label: 'Real Estate', slug: 'real-estate-construction' },
  { id: 'service-business', label: 'Services', slug: 'service-business' },
  { id: 'enterprise', label: 'Enterprise', slug: 'enterprise' },
] as const;

export const SOFTWARE_IMAGE_ACCEPT =
  'image/png,image/jpeg,image/webp,image/avif,.png,.jpg,.jpeg,.webp,.avif';

/** AVIF encode targets — widths and starting quality for size budgets. */
export const SOFTWARE_IMAGE_TARGETS = {
  coverCard: { width: 720, quality: 55, maxBytes: 50 * 1024 },
  coverDetail: { width: 1200, quality: 62 },
  screenPreview: { width: 960, quality: 58 },
  screenThumb: { width: 480, quality: 48, maxBytes: 35 * 1024 },
} as const;
