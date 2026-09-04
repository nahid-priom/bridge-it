export const CREATIVE_MARKETING_BUCKET = 'creative-marketing-showcase';
export const CREATIVE_MARKETING_CURRENCY = 'BDT';
export const CREATIVE_MARKETING_GALLERY_PAGE_SIZE = 12;
export const CREATIVE_MARKETING_HOMEPAGE_SECTION_MAX = 8;

/** Native cover-card encode size (1536×1024 → 720×480). */
export const CREATIVE_COVER_CARD = {
  width: 720,
  height: 480,
  aspectClass: 'aspect-[3/2]',
} as const;

export const CREATIVE_MARKETING_HOMEPAGE_SECTIONS = [
  {
    key: 'popular',
    title: 'Featured creative packages',
    eyebrow: 'Popular',
    description: 'Branding, social creatives and campaigns ready to brief.',
    viewAllHref: '/creative-marketing',
    viewAllLabel: 'View all creative services',
  },
] as const;

export type CreativeMarketingHomepageSectionKey =
  (typeof CREATIVE_MARKETING_HOMEPAGE_SECTIONS)[number]['key'];

/** Broad public filters (not 30 pills). */
export const CREATIVE_MARKETING_SERVICE_GROUPS = [
  {
    slug: 'social-media-design',
    name: 'Social Media Design',
    subcategory: 'graphics-design',
  },
  {
    slug: 'branding-identity',
    name: 'Branding & Identity',
    subcategory: 'graphics-design',
  },
  {
    slug: 'advertising-creative',
    name: 'Advertising Creative',
    subcategory: 'graphics-design',
  },
  {
    slug: 'packaging-print',
    name: 'Packaging & Print',
    subcategory: 'graphics-design',
  },
  {
    slug: 'facebook-instagram-ads',
    name: 'Facebook & Instagram Ads',
    subcategory: 'digital-marketing',
  },
  {
    slug: 'ecommerce-marketing',
    name: 'E-commerce Marketing',
    subcategory: 'digital-marketing',
  },
  {
    slug: 'lead-generation',
    name: 'Lead Generation',
    subcategory: 'digital-marketing',
  },
  {
    slug: 'social-media-management',
    name: 'Social Media Management',
    subcategory: 'digital-marketing',
  },
] as const;

export type CreativeMarketingServiceGroupSlug =
  (typeof CREATIVE_MARKETING_SERVICE_GROUPS)[number]['slug'];

/** Primary listing chips. */
export const CREATIVE_PRIMARY_FILTERS = [
  { id: 'all', label: 'All', groups: undefined as CreativeMarketingServiceGroupSlug[] | undefined },
  {
    id: 'design',
    label: 'Design',
    groups: ['social-media-design', 'packaging-print'] as CreativeMarketingServiceGroupSlug[],
  },
  {
    id: 'branding',
    label: 'Branding',
    groups: ['branding-identity'] as CreativeMarketingServiceGroupSlug[],
  },
  {
    id: 'ads',
    label: 'Ads',
    groups: ['advertising-creative', 'facebook-instagram-ads'] as CreativeMarketingServiceGroupSlug[],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    groups: [
      'ecommerce-marketing',
      'lead-generation',
      'social-media-management',
    ] as CreativeMarketingServiceGroupSlug[],
  },
] as const;

/** Secondary filters inside More Filters sheet. */
export const CREATIVE_MORE_FILTERS = [
  {
    id: 'social-media-design',
    label: 'Social Media Design',
    groups: ['social-media-design'] as CreativeMarketingServiceGroupSlug[],
  },
  {
    id: 'packaging-print',
    label: 'Packaging',
    groups: ['packaging-print'] as CreativeMarketingServiceGroupSlug[],
  },
  {
    id: 'facebook-instagram-ads',
    label: 'Facebook Ads',
    groups: ['facebook-instagram-ads'] as CreativeMarketingServiceGroupSlug[],
  },
  {
    id: 'lead-generation',
    label: 'Lead Generation',
    groups: ['lead-generation'] as CreativeMarketingServiceGroupSlug[],
  },
  {
    id: 'ecommerce-marketing',
    label: 'E-commerce Marketing',
    groups: ['ecommerce-marketing'] as CreativeMarketingServiceGroupSlug[],
  },
  {
    id: 'social-media-management',
    label: 'Social Media Management',
    groups: ['social-media-management'] as CreativeMarketingServiceGroupSlug[],
  },
  {
    id: 'advertising-creative',
    label: 'Advertising Creative',
    groups: ['advertising-creative'] as CreativeMarketingServiceGroupSlug[],
  },
  {
    id: 'branding-identity',
    label: 'Branding',
    groups: ['branding-identity'] as CreativeMarketingServiceGroupSlug[],
  },
] as const;

/** @deprecated Prefer CREATIVE_PRIMARY_FILTERS + CREATIVE_MORE_FILTERS */
export const CREATIVE_MARKETING_LISTING_FILTERS = [
  ...CREATIVE_PRIMARY_FILTERS,
  ...CREATIVE_MORE_FILTERS,
] as const;

export type CreativePrimaryFilterId = (typeof CREATIVE_PRIMARY_FILTERS)[number]['id'];
export type CreativeMoreFilterId = (typeof CREATIVE_MORE_FILTERS)[number]['id'];
export type CreativeListingFilterId = (typeof CREATIVE_MARKETING_LISTING_FILTERS)[number]['id'];

const EXPLORE_PILLAR_TYPES = new Set(['software', 'websites', 'marketing', 'creative-marketing']);

export const CREATIVE_MARKETING_PRICING_MODELS = ['one_time', 'monthly', 'package', 'custom'] as const;
export type CreativeMarketingPricingModel = (typeof CREATIVE_MARKETING_PRICING_MODELS)[number];

export function creativeServiceGroupLabel(slug: string | null | undefined): string {
  if (!slug) return 'Creative & Marketing';
  const found = CREATIVE_MARKETING_SERVICE_GROUPS.find((g) => g.slug === slug);
  return found?.name ?? slug;
}

export function isCreativePrimaryFilterId(
  value: string | null | undefined
): value is CreativePrimaryFilterId {
  if (!value) return false;
  return CREATIVE_PRIMARY_FILTERS.some((f) => f.id === value);
}

export function isCreativeMoreFilterId(value: string | null | undefined): value is CreativeMoreFilterId {
  if (!value) return false;
  return CREATIVE_MORE_FILTERS.some((f) => f.id === value);
}

/** Parse primary chip — known chips win over explore pillar names (e.g. group=marketing). */
export function parseCreativeGroupParam(
  ...candidates: Array<string | null | undefined>
): CreativePrimaryFilterId | 'all' {
  for (const raw of candidates) {
    const value = raw?.trim();
    if (!value || value === 'all') continue;
    // Prefer known primary chips even if id overlaps explore type (marketing)
    if (isCreativePrimaryFilterId(value)) return value;
    if (EXPLORE_PILLAR_TYPES.has(value)) continue;
    // Legacy: map raw service_group slug → nearest primary chip
    if (value === 'social-media-design' || value === 'packaging-print') return 'design';
    if (value === 'branding-identity') return 'branding';
    if (value === 'advertising-creative' || value === 'facebook-instagram-ads') return 'ads';
    if (
      value === 'ecommerce-marketing' ||
      value === 'lead-generation' ||
      value === 'social-media-management'
    ) {
      return 'marketing';
    }
  }
  return 'all';
}

export function parseCreativeMoreParam(raw: string | null | undefined): CreativeMoreFilterId[] {
  if (!raw?.trim()) return [];
  const seen = new Set<CreativeMoreFilterId>();
  for (const part of raw.split(',')) {
    const id = part.trim();
    if (isCreativeMoreFilterId(id)) seen.add(id);
  }
  return [...seen];
}

export function serializeCreativeMoreParam(ids: string[]): string | undefined {
  const valid = ids.filter(isCreativeMoreFilterId);
  return valid.length ? valid.join(',') : undefined;
}

export function creativeListingFilterGroups(
  filterId: string | null | undefined
): CreativeMarketingServiceGroupSlug[] | undefined {
  if (!filterId || filterId === 'all') return undefined;
  const found = CREATIVE_MARKETING_LISTING_FILTERS.find((f) => f.id === filterId);
  if (found) return found.groups;
  if (EXPLORE_PILLAR_TYPES.has(filterId)) return undefined;
  return undefined;
}

/** Resolve primary + more filter chips into DB service_group slugs (OR). */
export function resolveCreativeGroupSlugs(options: {
  group?: string | null;
  more?: string[] | null;
  /** @deprecated legacy single serviceGroup param */
  serviceGroup?: string | null;
}): CreativeMarketingServiceGroupSlug[] | undefined {
  const slugs = new Set<CreativeMarketingServiceGroupSlug>();
  const primary = creativeListingFilterGroups(options.group);
  primary?.forEach((slug) => slugs.add(slug));
  for (const id of options.more ?? []) {
    creativeListingFilterGroups(id)?.forEach((slug) => slugs.add(slug));
  }
  if (slugs.size === 0 && options.serviceGroup && options.serviceGroup !== 'all') {
    const legacy = creativeListingFilterGroups(options.serviceGroup);
    if (legacy?.length) legacy.forEach((slug) => slugs.add(slug));
    else if (
      CREATIVE_MARKETING_SERVICE_GROUPS.some((g) => g.slug === options.serviceGroup) &&
      !EXPLORE_PILLAR_TYPES.has(options.serviceGroup)
    ) {
      slugs.add(options.serviceGroup as CreativeMarketingServiceGroupSlug);
    }
  }
  if (slugs.size === 0) return undefined;
  return [...slugs];
}
