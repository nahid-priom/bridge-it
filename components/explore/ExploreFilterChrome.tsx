'use client';

import { ExploreSearch } from '@/components/explore/ExploreSearch';
import { ExploreSubcategoryRail } from '@/components/explore/ExploreSubcategoryRail';
import { ExploreTypeTabs } from '@/components/explore/ExploreTypeTabs';
import type { ExploreTypeId } from '@/components/explore/explore-types';
import { cn } from '@/lib/cn';

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
      <ExploreSubcategoryRail activeType={active} />
      <ExploreSearch activeType={active} />
    </div>
  );
}
