import type { SoftwareFeatureFlags } from '@/types/bitp';

export function hasSoftwareFeature(flags: SoftwareFeatureFlags, key: keyof SoftwareFeatureFlags): boolean {
  return Boolean(flags[key]);
}
