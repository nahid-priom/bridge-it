/**
 * Garments + Feed Mill maturity ladders for listing compare + detail upgrade paths.
 * Standards keep existing slugs; Accessories is specialized (not on the ladder).
 */

export type LadderStep = {
  slug: string;
  shortLabel: string;
  priceLabel: string;
};

export const GARMENTS_MATURITY_LADDER: LadderStep[] = [
  { slug: 'garments-starter-software', shortLabel: 'Starter', priceLabel: '৳25,000' },
  { slug: 'garments-production-management', shortLabel: 'Production', priceLabel: '৳50,000' },
  { slug: 'garments-erp', shortLabel: 'Standard', priceLabel: '৳100,000' },
  { slug: 'garments-erp-professional', shortLabel: 'Professional', priceLabel: '৳200,000' },
  { slug: 'garments-enterprise-erp', shortLabel: 'Enterprise', priceLabel: '৳500,000+' },
];

export const FEED_MILL_MATURITY_LADDER: LadderStep[] = [
  { slug: 'feed-mill-mini', shortLabel: 'Mini', priceLabel: '৳10,000' },
  { slug: 'feed-mill-basic', shortLabel: 'Basic', priceLabel: '৳25,000' },
  { slug: 'feed-mill-erp', shortLabel: 'Standard', priceLabel: '৳50,000' },
  { slug: 'feed-mill-erp-professional', shortLabel: 'Professional', priceLabel: '৳100,000' },
  { slug: 'feed-mill-enterprise-erp', shortLabel: 'Enterprise', priceLabel: '৳250,000+' },
];

export const GARMENTS_ACCESSORIES_SLUG = 'garments-accessories-erp';

/** Compact compare feature groups (not a 100-row matrix). */
export type CompareFeatureGroup = {
  group: string;
  features: Array<{
    label: string;
    /** Ladder indices (0=Starter/Mini … 4=Enterprise) that include this feature */
    fromIndex: number;
  }>;
};

export const GARMENTS_COMPARE_GROUPS: CompareFeatureGroup[] = [
  {
    group: 'Orders & Styles',
    features: [
      { label: 'Buyer & style booking', fromIndex: 0 },
      { label: 'Size/color matrix', fromIndex: 0 },
      { label: 'Merchandising & BOM', fromIndex: 2 },
    ],
  },
  {
    group: 'Production',
    features: [
      { label: 'Production entry', fromIndex: 0 },
      { label: 'Cutting / sewing / finishing', fromIndex: 1 },
      { label: 'Line efficiency & QC', fromIndex: 3 },
      { label: 'Multi-factory planning', fromIndex: 4 },
    ],
  },
  {
    group: 'Stock & Delivery',
    features: [
      { label: 'Stock & delivery', fromIndex: 0 },
      { label: 'Fabric / ready stock', fromIndex: 2 },
      { label: 'Shipment & packing', fromIndex: 2 },
    ],
  },
  {
    group: 'Commercial',
    features: [
      { label: 'Basic reports', fromIndex: 0 },
      { label: 'Costing & accounts', fromIndex: 2 },
      { label: 'Approvals & roles', fromIndex: 3 },
      { label: 'HR, analytics & automation', fromIndex: 4 },
    ],
  },
];

export const FEED_MILL_COMPARE_GROUPS: CompareFeatureGroup[] = [
  {
    group: 'Purchase & Stock',
    features: [
      { label: 'Purchase & raw stock', fromIndex: 0 },
      { label: 'Finished goods', fromIndex: 2 },
      { label: 'Multi-warehouse', fromIndex: 4 },
    ],
  },
  {
    group: 'Production',
    features: [
      { label: 'Basic production', fromIndex: 0 },
      { label: 'Formula & batch costing', fromIndex: 2 },
      { label: 'BOM, planning & QC', fromIndex: 4 },
    ],
  },
  {
    group: 'Sales & Dealers',
    features: [
      { label: 'Sales & customers', fromIndex: 0 },
      { label: 'Dispatch & collection', fromIndex: 2 },
      { label: 'Dealer network & territories', fromIndex: 3 },
    ],
  },
  {
    group: 'Accounts & Admin',
    features: [
      { label: 'Due & expenses', fromIndex: 1 },
      { label: 'Cash / bank / ledgers', fromIndex: 2 },
      { label: 'Approvals & audit', fromIndex: 3 },
      { label: 'HR, payroll & analytics', fromIndex: 4 },
    ],
  },
];

export function ladderForIndustry(industrySlug: string): LadderStep[] | null {
  if (industrySlug === 'garments') return GARMENTS_MATURITY_LADDER;
  if (industrySlug === 'feed-mill') return FEED_MILL_MATURITY_LADDER;
  return null;
}

export function compareGroupsForIndustry(industrySlug: string): CompareFeatureGroup[] | null {
  if (industrySlug === 'garments') return GARMENTS_COMPARE_GROUPS;
  if (industrySlug === 'feed-mill') return FEED_MILL_COMPARE_GROUPS;
  return null;
}

export function upgradeNeighbors(productSlug: string): {
  previous: LadderStep | null;
  next: LadderStep | null;
  industrySlug: 'garments' | 'feed-mill' | null;
} {
  for (const [industrySlug, ladder] of [
    ['garments', GARMENTS_MATURITY_LADDER] as const,
    ['feed-mill', FEED_MILL_MATURITY_LADDER] as const,
  ]) {
    const idx = ladder.findIndex((s) => s.slug === productSlug);
    if (idx < 0) continue;
    return {
      previous: idx > 0 ? ladder[idx - 1] : null,
      next: idx < ladder.length - 1 ? ladder[idx + 1] : null,
      industrySlug,
    };
  }
  return { previous: null, next: null, industrySlug: null };
}
