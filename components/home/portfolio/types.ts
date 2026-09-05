import type { EcommerceProjectCard } from '@/src/features/ecommerce-showcase/types';
import type { SoftwareProjectCard } from '@/src/features/software-showcase/types';
import type { CreativeMarketingProjectCard } from '@/src/features/creative-marketing-showcase/types';

export type PortfolioFilterId =
  | 'all'
  | 'websites'
  | 'ecommerce'
  | 'software'
  | 'erp'
  | 'marketing';

/** Section group used for filter matching. */
export type PortfolioGroup = 'websites' | 'software' | 'erp' | 'marketing';

export type PortfolioSectionBase = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  viewAllHref: string;
  viewAllLabel: string;
  group: PortfolioGroup;
  headingId: string;
  eagerCount: number;
};

export type WebsitePortfolioSection = PortfolioSectionBase & {
  kind: 'website';
  projects: EcommerceProjectCard[];
};

export type SoftwarePortfolioSection = PortfolioSectionBase & {
  kind: 'software';
  projects: SoftwareProjectCard[];
};

export type CreativePortfolioSection = PortfolioSectionBase & {
  kind: 'creative';
  projects: CreativeMarketingProjectCard[];
};

export type PortfolioSection =
  | WebsitePortfolioSection
  | SoftwarePortfolioSection
  | CreativePortfolioSection;

export const PORTFOLIO_FILTERS: { id: PortfolioFilterId; label: string }[] = [
  { id: 'all', label: 'All work' },
  { id: 'websites', label: 'Websites' },
  { id: 'ecommerce', label: 'E-commerce' },
  { id: 'software', label: 'Software' },
  { id: 'erp', label: 'ERP' },
  { id: 'marketing', label: 'Marketing' },
];

/** Which section groups a filter pill reveals. */
export function groupsForFilter(filter: PortfolioFilterId): PortfolioGroup[] | 'all' {
  switch (filter) {
    case 'all':
      return 'all';
    case 'websites':
    case 'ecommerce':
      return ['websites'];
    case 'software':
      return ['software', 'erp'];
    case 'erp':
      return ['erp'];
    case 'marketing':
      return ['marketing'];
  }
}

export function sectionMatchesFilter(
  section: PortfolioSection,
  filter: PortfolioFilterId
): boolean {
  const groups = groupsForFilter(filter);
  if (groups === 'all') return true;
  return groups.includes(section.group);
}
