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
        params.delete('child');
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
              'flex min-h-[32px] w-full min-w-0 items-center justify-center rounded-full px-2 py-1.5 text-center text-[11px] font-semibold leading-tight transition-colors sm:min-h-[34px] sm:px-2.5 sm:text-xs',
              isActive
                ? 'bg-[#2563eb] text-white shadow-[0_0_14px_-2px_rgba(37,99,235,0.4)] dark:bg-[#3b82f6] dark:shadow-[0_0_16px_-1px_rgba(96,165,250,0.45)]'
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
