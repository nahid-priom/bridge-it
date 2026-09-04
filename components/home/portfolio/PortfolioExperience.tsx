'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
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
  const pendingScrollFilter = useRef<PortfolioFilterId | null>(null);

  const visible = useMemo(
    () => allSections.filter((section) => sectionMatchesFilter(section, filter)),
    [allSections, filter]
  );

  useEffect(() => {
    const targetFilter = pendingScrollFilter.current;
    if (!targetFilter) return;
    pendingScrollFilter.current = null;

    const preferReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el =
      targetFilter === 'all'
        ? document.getElementById('explore-our-work-heading')
        : document.getElementById(visible[0]?.id ?? '');

    el?.scrollIntoView({
      behavior: preferReduced ? 'auto' : 'smooth',
      block: 'start',
    });
  }, [filter, visible]);

  const handleFilterChange = useCallback((id: PortfolioFilterId) => {
    pendingScrollFilter.current = id;
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
