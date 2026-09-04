'use client';

import { ExploreSearch } from '@/components/explore/ExploreSearch';
import { ExploreSubcategoryRail } from '@/components/explore/ExploreSubcategoryRail';
import { ExploreTypeTabs } from '@/components/explore/ExploreTypeTabs';
import { ExploreWebsitesMoreFilters } from '@/components/explore/ExploreWebsitesMoreFilters';
import { ExploreSoftwareMoreFilters } from '@/components/explore/ExploreSoftwareMoreFilters';
import { ExploreCreativeMoreFilters } from '@/components/explore/ExploreCreativeMoreFilters';
import type { ExploreTypeId } from '@/components/explore/explore-types';
import { cn } from '@/lib/cn';

function MoreForType({ active }: { active: ExploreTypeId }) {
  if (active === 'websites') return <ExploreWebsitesMoreFilters />;
  if (active === 'software') return <ExploreSoftwareMoreFilters />;
  return <ExploreCreativeMoreFilters />;
}

export function ExploreFilterChrome({
  active,
  className,
}: {
  active: ExploreTypeId;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-3 sm:gap-3.5', className)}>
      <ExploreTypeTabs active={active} />
      <div
        className={cn(
          'scrollbar-none flex flex-nowrap items-center gap-2 overflow-x-auto overscroll-x-contain',
          'md:gap-3'
        )}
      >
        <ExploreSearch
          activeType={active}
          className="w-[min(100%,16.5rem)] shrink-0 sm:w-72 md:w-80"
        />
        <ExploreSubcategoryRail activeType={active} className="min-w-0 flex-1" />
        <MoreForType active={active} />
      </div>
    </div>
  );
}
