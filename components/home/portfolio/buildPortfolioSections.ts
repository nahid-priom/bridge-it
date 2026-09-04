import { HOMEPAGE_SECTIONS } from '@/src/features/ecommerce-showcase/config/constants';
import type {
  HomepageLegacyCategorySection,
  HomepageSectionsResult,
} from '@/src/features/ecommerce-showcase/types';
import { SOFTWARE_HOMEPAGE_SECTIONS } from '@/src/features/software-showcase/config/constants';
import type { SoftwareHomepageSectionsResult } from '@/src/features/software-showcase/types';
import { CREATIVE_MARKETING_HOMEPAGE_SECTIONS } from '@/src/features/creative-marketing-showcase/config/constants';
import type { CreativeMarketingHomepageSectionsResult } from '@/src/features/creative-marketing-showcase/types';
import type { PortfolioSection } from './types';

const WEBSITE_EYEBROWS: Record<string, string> = {
  fashion_lifestyle: 'Websites',
  electronics_gadgets: 'E-commerce',
  popular: 'Websites',
};

export function buildPortfolioSections({
  sections,
  legacySections,
  softwareSections,
  creativeSections,
}: {
  sections: HomepageSectionsResult;
  legacySections: HomepageLegacyCategorySection[];
  softwareSections?: SoftwareHomepageSectionsResult | null;
  creativeSections?: CreativeMarketingHomepageSectionsResult | null;
}): PortfolioSection[] {
  const result: PortfolioSection[] = [];

  HOMEPAGE_SECTIONS.forEach((section, index) => {
    const projects = sections[section.key] ?? [];
    if (projects.length === 0) return;
    result.push({
      kind: 'website',
      id: `portfolio-${section.key}`,
      headingId: `website-section-${section.key}`,
      eyebrow: WEBSITE_EYEBROWS[section.key] ?? section.eyebrow,
      title: section.title,
      description: section.description,
      viewAllHref: section.viewAllHref,
      viewAllLabel: section.viewAllLabel,
      group: 'websites',
      projects,
      eagerCount: index === 0 ? 4 : 0,
    });
  });

  for (const section of legacySections) {
    if (section.projects.length === 0) continue;
    result.push({
      kind: 'website',
      id: `portfolio-legacy-${section.slug}`,
      headingId: `website-section-${section.slug}`,
      eyebrow: 'Websites',
      title: section.title,
      description: '',
      viewAllHref: section.viewAllHref,
      viewAllLabel: section.viewAllLabel,
      group: 'websites',
      projects: section.projects,
      eagerCount: 0,
    });
  }

  if (softwareSections) {
    SOFTWARE_HOMEPAGE_SECTIONS.forEach((section, index) => {
      const projects = softwareSections[section.key] ?? [];
      if (projects.length === 0) return;
      const isErp = section.key === 'manufacturing_erp';
      result.push({
        kind: 'software',
        id: `portfolio-software-${section.key}`,
        headingId: `software-section-${section.key}`,
        eyebrow: isErp ? 'ERP' : 'Software',
        title: section.title,
        description: section.description,
        viewAllHref: section.viewAllHref,
        viewAllLabel: section.viewAllLabel,
        group: isErp ? 'erp' : 'software',
        projects,
        eagerCount: index === 0 && result.every((s) => s.kind !== 'website') ? 4 : 0,
      });
    });
  }

  if (creativeSections) {
    for (const section of CREATIVE_MARKETING_HOMEPAGE_SECTIONS) {
      const projects = creativeSections[section.key] ?? [];
      if (projects.length === 0) continue;
      result.push({
        kind: 'creative',
        id: `portfolio-creative-${section.key}`,
        headingId: `creative-section-${section.key}`,
        eyebrow: 'Marketing',
        title: section.title,
        description: section.description,
        viewAllHref: section.viewAllHref,
        viewAllLabel: section.viewAllLabel,
        group: 'marketing',
        projects,
        eagerCount: 0,
      });
    }
  }

  return result;
}
