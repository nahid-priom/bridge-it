/**
 * Garments + Feed Mill package tiers live on garments-erp / feed-mill-erp.
 * Legacy ladder product slugs redirect to those flagships with ?package=.
 */

export type LadderStep = {
  slug: string;
  shortLabel: string;
  priceLabel: string;
  /** Package tier query param on the canonical ERP detail page */
  packageTier?: 'starter' | 'standard' | 'professional' | 'enterprise';
};

export type CompareFeatureGroup = {
  group: string;
  features: Array<{
    label: string;
    fromIndex: number;
  }>;
};

/** Canonical product slugs (one card each). */
export const GARMENTS_ERP_SLUG = 'garments-erp';
export const FEED_MILL_ERP_SLUG = 'feed-mill-erp';
export const GARMENTS_ACCESSORIES_SLUG = 'garments-accessories-erp';

/** Soft-deleted ladder product → package redirect targets (for docs / audits). */
export const GARMENTS_LEGACY_LADDER: LadderStep[] = [
  { slug: 'garments-starter-software', shortLabel: 'Starter', priceLabel: '৳60,000', packageTier: 'starter' },
  { slug: 'garments-production-management', shortLabel: 'Standard', priceLabel: '৳90,000', packageTier: 'standard' },
  { slug: 'garments-erp', shortLabel: 'Standard', priceLabel: '৳90,000', packageTier: 'standard' },
  { slug: 'garments-erp-professional', shortLabel: 'Professional', priceLabel: '৳200,000', packageTier: 'professional' },
  { slug: 'garments-enterprise-erp', shortLabel: 'Enterprise', priceLabel: '৳500,000+', packageTier: 'enterprise' },
];

export const FEED_MILL_LEGACY_LADDER: LadderStep[] = [
  { slug: 'feed-mill-mini', shortLabel: 'Starter', priceLabel: '৳45,000', packageTier: 'starter' },
  { slug: 'feed-mill-basic', shortLabel: 'Starter', priceLabel: '৳45,000', packageTier: 'starter' },
  { slug: 'feed-mill-erp', shortLabel: 'Standard', priceLabel: '৳75,000', packageTier: 'standard' },
  { slug: 'feed-mill-erp-professional', shortLabel: 'Professional', priceLabel: '৳100,000', packageTier: 'professional' },
  { slug: 'feed-mill-enterprise-erp', shortLabel: 'Enterprise', priceLabel: '৳250,000+', packageTier: 'enterprise' },
];

/** @deprecated Merged into packages — empty for listing UI */
export const GARMENTS_MATURITY_LADDER: LadderStep[] = [];
/** @deprecated Merged into packages — empty for listing UI */
export const FEED_MILL_MATURITY_LADDER: LadderStep[] = [];

export const GARMENTS_COMPARE_GROUPS: CompareFeatureGroup[] = [];
export const FEED_MILL_COMPARE_GROUPS: CompareFeatureGroup[] = [];

export function maturityLadderForIndustry(industrySlug: string): LadderStep[] | null {
  if (industrySlug === 'garments') return GARMENTS_LEGACY_LADDER;
  if (industrySlug === 'feed-mill') return FEED_MILL_LEGACY_LADDER;
  return null;
}

/** Listing compare UI disabled after package merge. */
export function ladderForIndustry(_industrySlug: string): LadderStep[] | null {
  return null;
}

export function compareGroupsForIndustry(_industrySlug: string): CompareFeatureGroup[] {
  return [];
}

export function upgradeNeighbors(_productSlug: string): {
  previous: LadderStep | null;
  next: LadderStep | null;
  industrySlug: string | null;
} {
  return { previous: null, next: null, industrySlug: null };
}

export function canonicalErpSlugForIndustry(industrySlug: string): string | null {
  if (industrySlug === 'garments') return GARMENTS_ERP_SLUG;
  if (industrySlug === 'feed-mill') return FEED_MILL_ERP_SLUG;
  return null;
}

export function isMergedLadderProductSlug(slug: string): boolean {
  const merged = new Set([
    'garments-starter-software',
    'garments-production-management',
    'garments-erp-professional',
    'garments-enterprise-erp',
    'feed-mill-mini',
    'feed-mill-basic',
    'feed-mill-erp-professional',
    'feed-mill-enterprise-erp',
  ]);
  return merged.has(slug);
}
