import type { SoftwarePackage, SoftwarePackageFeature } from '../types';

export const SOFTWARE_FEATURE_GROUP_ORDER = [
  'Purchase & Supplier',
  'Production',
  'Inventory',
  'Sales',
  'Accounts',
  'Reports',
  'Administration',
  'Enterprise Automation',
  'Operations',
] as const;

export function groupPackageFeatures(features: SoftwarePackageFeature[]): Array<{
  group: string;
  features: SoftwarePackageFeature[];
}> {
  const byGroup = new Map<string, SoftwarePackageFeature[]>();
  for (const feature of features) {
    const group = feature.feature_group?.trim() || 'Operations';
    const list = byGroup.get(group) ?? [];
    list.push(feature);
    byGroup.set(group, list);
  }

  const ordered: Array<{ group: string; features: SoftwarePackageFeature[] }> = [];
  for (const group of SOFTWARE_FEATURE_GROUP_ORDER) {
    const list = byGroup.get(group);
    if (!list?.length) continue;
    ordered.push({
      group,
      features: list.slice().sort((a, b) => a.display_order - b.display_order),
    });
    byGroup.delete(group);
  }
  for (const [group, list] of byGroup) {
    ordered.push({
      group,
      features: list.slice().sort((a, b) => a.display_order - b.display_order),
    });
  }
  return ordered;
}

export function includedFeatureRows(pkg: SoftwarePackage | null | undefined): SoftwarePackageFeature[] {
  if (!pkg) return [];
  if (pkg.feature_rows?.length) {
    return pkg.feature_rows
      .filter((f) => f.is_included)
      .sort((a, b) => a.display_order - b.display_order);
  }
  return (pkg.features ?? []).map((label, index) => ({
    id: `${pkg.id}-legacy-${index}`,
    package_id: pkg.id,
    feature_key: `legacy-${index}`,
    label,
    feature_group: 'Operations',
    is_included: true,
    is_highlighted: index < 3,
    display_order: index,
  }));
}

export function manageCardsFromPackage(pkg: SoftwarePackage | null | undefined): string[] {
  const rows = includedFeatureRows(pkg);
  const highlighted = rows.filter((r) => r.is_highlighted).map((r) => r.label);
  if (highlighted.length >= 4) return highlighted.slice(0, 8);
  return rows.map((r) => r.label).slice(0, 8);
}

export function targetAudienceCopy(pkg: SoftwarePackage | null | undefined): string {
  if (!pkg) return 'Choose a package that matches your business size.';
  if (pkg.short_description?.trim()) return pkg.short_description.trim();
  const size = (pkg.target_business_size ?? '').toLowerCase();
  if (size === 'small') return 'Best for small teams starting digital operations.';
  if (size === 'growing') return 'Best for growing businesses that need production, stock and accounts.';
  if (size === 'professional') return 'Best for professional teams that need approvals, roles and control.';
  if (size === 'enterprise') return 'Best for factories that need full planning and automation.';
  return `Best for ${pkg.name} buyers who need a clear, practical system.`;
}

export function screensForPackage<T extends { package_id?: string | null }>(
  screens: T[],
  packageId: string | null | undefined
): T[] {
  if (!packageId) return screens;
  const specific = screens.filter((s) => s.package_id === packageId);
  if (specific.length > 0) return specific;
  return screens.filter((s) => !s.package_id);
}
