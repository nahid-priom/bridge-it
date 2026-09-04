export const EXPLORE_TYPES = [
  { id: 'websites', label: 'Custom Websites', shortLabel: 'Websites' },
  { id: 'software', label: 'Software Solutions', shortLabel: 'Software' },
  { id: 'marketing', label: 'Creative & Digital Marketing', shortLabel: 'Creative & Marketing' },
] as const;

export type ExploreTypeId = (typeof EXPLORE_TYPES)[number]['id'];

export function parseExploreType(value: string | null | undefined): ExploreTypeId {
  if (value === 'software' || value === 'marketing') return value;
  return 'websites';
}
