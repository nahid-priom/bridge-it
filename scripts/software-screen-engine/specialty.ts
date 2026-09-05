/**
 * Specialty layout profiles — drive genuinely different dashboard/table compositions
 * (not just color swaps) for specialized Garments + Feed Mill catalogs.
 */
import type { SeedSoftwareProduct } from '../../src/features/software-showcase/types';

export type SpecialtyLayout =
  | 'merchandising'
  | 'production-floor'
  | 'inventory'
  | 'hr-payroll'
  | 'commercial'
  | 'feed-production'
  | 'formula-costing'
  | 'dealer-sales'
  | 'finance'
  | null;

export function specialtyLayout(product: SeedSoftwareProduct): SpecialtyLayout {
  const s = product.slug;
  if (s.includes('merchandising')) return 'merchandising';
  if (s.includes('cutting-sewing')) return 'production-floor';
  if (s.includes('inventory-warehouse') || s.includes('garments-inventory')) return 'inventory';
  if (s.includes('hr-payroll')) return 'hr-payroll';
  if (s.includes('commercial-export')) return 'commercial';
  if (s === 'feed-production-management') return 'feed-production';
  if (s.includes('formula-costing')) return 'formula-costing';
  if (s.includes('dealer-distribution')) return 'dealer-sales';
  if (s.includes('accounts-finance')) return 'finance';
  if (s.includes('feed-mill-inventory')) return 'inventory';
  return null;
}
