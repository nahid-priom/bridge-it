import {
  GARMENTS_MATURITY_LADDER,
  FEED_MILL_MATURITY_LADDER,
  GARMENTS_ACCESSORIES_SLUG,
} from './maturity-ladder';

export {
  GARMENTS_MATURITY_LADDER,
  FEED_MILL_MATURITY_LADDER,
  GARMENTS_ACCESSORIES_SLUG,
  ladderForIndustry,
  compareGroupsForIndustry,
  upgradeNeighbors,
} from './maturity-ladder';

export const GARMENTS_SPECIALIZED_SLUGS = [
  GARMENTS_ACCESSORIES_SLUG,
  'garments-merchandising-management',
  'garments-cutting-sewing-management',
  'garments-inventory-warehouse',
  'garments-hr-payroll',
  'garments-commercial-export-management',
] as const;

export const FEED_MILL_SPECIALIZED_SLUGS = [
  'feed-production-management',
  'feed-formula-costing-software',
  'feed-dealer-distribution-management',
  'feed-mill-inventory-warehouse',
  'feed-mill-accounts-finance',
] as const;

export function isMaturitySlug(slug: string, industry: 'garments' | 'feed-mill'): boolean {
  const ladder = industry === 'garments' ? GARMENTS_MATURITY_LADDER : FEED_MILL_MATURITY_LADDER;
  return ladder.some((s) => s.slug === slug);
}

export function isSpecializedSlug(slug: string, industry: 'garments' | 'feed-mill'): boolean {
  const list = industry === 'garments' ? GARMENTS_SPECIALIZED_SLUGS : FEED_MILL_SPECIALIZED_SLUGS;
  return (list as readonly string[]).includes(slug);
}

export function specializedSlugsForIndustry(industry: string): readonly string[] {
  if (industry === 'garments') return GARMENTS_SPECIALIZED_SLUGS;
  if (industry === 'feed-mill') return FEED_MILL_SPECIALIZED_SLUGS;
  return [];
}
