import type { SoftwarePackage, SoftwarePackageTier } from '../types';

export const SOFTWARE_PACKAGE_TIER_ORDER: SoftwarePackageTier[] = [
  'starter',
  'basic',
  'standard',
  'professional',
  'enterprise',
];

export const SOFTWARE_PACKAGE_TIER_LABELS: Record<string, string> = {
  starter: 'Starter',
  basic: 'Basic',
  standard: 'Standard',
  professional: 'Professional',
  enterprise: 'Enterprise',
  advanced: 'Advanced',
};

export const SOFTWARE_BUSINESS_SIZE_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'small', label: 'Small' },
  { id: 'growing', label: 'Growing' },
  { id: 'professional', label: 'Professional' },
  { id: 'enterprise', label: 'Enterprise' },
] as const;

export type SoftwareBusinessSizeFilterId =
  (typeof SOFTWARE_BUSINESS_SIZE_FILTERS)[number]['id'];

export const SOFTWARE_BUSINESS_SIZE_LABELS: Record<string, string> = {
  small: 'Small business',
  growing: 'Growing business',
  professional: 'Professional operations',
  enterprise: 'Enterprise',
};

export function packageTierKey(pkg: SoftwarePackage): string {
  return (pkg.tier || pkg.name || pkg.id).toLowerCase().replace(/\s+/g, '-');
}

export function packageDisplayName(pkg: SoftwarePackage): string {
  if (pkg.tier && SOFTWARE_PACKAGE_TIER_LABELS[pkg.tier]) {
    return SOFTWARE_PACKAGE_TIER_LABELS[pkg.tier];
  }
  return pkg.name;
}

export function sortPackagesByTier(packages: SoftwarePackage[]): SoftwarePackage[] {
  return [...packages].sort((a, b) => {
    const ai = SOFTWARE_PACKAGE_TIER_ORDER.indexOf(
      (a.tier as SoftwarePackageTier) ?? ('starter' as SoftwarePackageTier)
    );
    const bi = SOFTWARE_PACKAGE_TIER_ORDER.indexOf(
      (b.tier as SoftwarePackageTier) ?? ('starter' as SoftwarePackageTier)
    );
    const aOrder = ai === -1 ? a.sort_order : ai;
    const bOrder = bi === -1 ? b.sort_order : bi;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.sort_order - b.sort_order;
  });
}

export function filterPackagesByBusinessSize(
  packages: SoftwarePackage[],
  size: SoftwareBusinessSizeFilterId
): SoftwarePackage[] {
  if (size === 'all') return packages;
  return packages.filter((pkg) => pkg.target_business_size === size);
}

export function pickDefaultPackage(
  packages: SoftwarePackage[],
  preferredTier?: string | null
): SoftwarePackage | null {
  if (packages.length === 0) return null;
  const sorted = sortPackagesByTier(packages);
  if (preferredTier) {
    const match = sorted.find(
      (pkg) =>
        pkg.tier === preferredTier ||
        packageTierKey(pkg) === preferredTier.toLowerCase() ||
        pkg.name.toLowerCase() === preferredTier.toLowerCase()
    );
    if (match) return match;
  }
  return (
    sorted.find((pkg) => pkg.is_recommended) ||
    sorted.find((pkg) => pkg.is_popular) ||
    sorted.find((pkg) => pkg.tier === 'standard') ||
    sorted[0] ||
    null
  );
}

export function paymentTypeLabel(paymentType: string | null | undefined): string {
  if (!paymentType || paymentType === 'one_time') return 'One Time Payment';
  if (paymentType === 'subscription') return 'Subscription';
  return paymentType.replace(/_/g, ' ');
}

/** Format BDT package price. Never returns ৳0 — use Request Pricing for missing/zero. */
export function formatPackagePrice(
  price: number | null | undefined,
  currency = 'BDT'
): string {
  if (price == null || price <= 0) return 'Request Pricing';
  const formatted = Math.round(price).toLocaleString('en-BD');
  if (currency === 'BDT' || currency === '৳') return `৳${formatted}`;
  return `${currency} ${formatted}`;
}
