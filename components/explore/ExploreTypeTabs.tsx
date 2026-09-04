'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/cn';
import { EXPLORE_TYPES, type ExploreTypeId } from '@/components/explore/explore-types';

export type { ExploreTypeId } from '@/components/explore/explore-types';
export { EXPLORE_TYPES, parseExploreType } from '@/components/explore/explore-types';

export function ExploreTypeTabs({ active }: { active: ExploreTypeId }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div
      className="grid w-full grid-cols-3 gap-1.5 sm:gap-2"
      role="tablist"
      aria-label="Explore categories"
    >
      {EXPLORE_TYPES.map((tab) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('type', tab.id);
        params.delete('view');
        params.delete('category');
        params.delete('industry');
        params.delete('group');
        params.delete('more');
        params.delete('solutionGroup');
        params.delete('serviceGroup');
        params.delete('page');
        const href = `${pathname}?${params.toString()}`;
        const isActive = active === tab.id;
        return (
          <Link
            key={tab.id}
            href={href}
            role="tab"
            aria-selected={isActive}
            aria-label={tab.label}
            title={tab.label}
            scroll={false}
            className={cn(
              'flex min-h-[40px] w-full min-w-0 items-center justify-center rounded-full px-2.5 py-2 text-center text-[12px] font-semibold leading-tight transition-colors sm:min-h-[42px] sm:px-3 sm:text-sm',
              isActive
                ? 'bg-[#2563eb] text-white'
                : 'border border-border-subtle bg-surface text-text-secondary hover:border-[#2563eb]/40 hover:text-text-primary'
            )}
          >
            <span className="sm:hidden">{tab.shortLabel}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
