'use client';

import { useCallback, useMemo, useState, useTransition } from 'react';
import { SectionContainer } from './SectionContainer';
import { PortfolioIntro } from './PortfolioIntro';
import { CategoryFilter } from './CategoryFilter';
import { CategorySection } from './CategorySection';
import { buildPortfolioSections } from './buildPortfolioSections';
import {
  sectionMatchesFilter,
  type PortfolioFilterId,
} from './types';
import type { HomepageLegacyCategorySection, HomepageSectionsResult } from '@/src/features/ecommerce-showcase/types';
import type { SoftwareHomepageSectionsResult } from '@/src/features/software-showcase/types';
import type { CreativeMarketingHomepageSectionsResult } from '@/src/features/creative-marketing-showcase/types';

export function PortfolioExperience({
  sections,
  legacySections,
  softwareSections,
  creativeSections,
}: {
  sections: HomepageSectionsResult;
  legacySections: HomepageLegacyCategorySection[];
  softwareSections?: SoftwareHomepageSectionsResult | null;
  creativeSections?: CreativeMarketingHomepageSectionsResult | null;
}) {
  const allSections = useMemo(
    () =>
      buildPortfolioSections({
        sections,
        legacySections,
        softwareSections,
        creativeSections,
      }),
    [sections, legacySections, softwareSections, creativeSections]
  );

  const [filter, setFilter] = useState<PortfolioFilterId>('all');
  const [, startTransition] = useTransition();

  const visible = useMemo(
    () => allSections.filter((section) => sectionMatchesFilter(section, filter)),
    [allSections, filter]
  );

  const handleFilterChange = useCallback((id: PortfolioFilterId) => {
    startTransition(() => setFilter(id));
  }, []);

  if (allSections.length === 0) {
    return <PortfolioIntro />;
  }

  return (
    <div id="explore-our-work">
      <PortfolioIntro />
      <SectionContainer>
        <CategoryFilter active={filter} onChange={handleFilterChange} />
      </SectionContainer>

      {visible.length === 0 ? (
        <SectionContainer className="py-16 text-center">
          <p className="text-sm text-text-muted">No projects in this category yet.</p>
        </SectionContainer>
      ) : (
        visible.map((section) => <CategorySection key={section.id} section={section} />)
      )}
    </div>
  );
}
