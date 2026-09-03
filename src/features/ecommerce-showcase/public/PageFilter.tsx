'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/cn';
import { PAGE_FILTER_CHIPS } from '../config/page-types';
import { showcaseQueryString, type ShowcaseListFilters } from '../utils/filters';
import { parseShowcaseFilters } from '../utils/filters';

function hrefFor(pathname: string, current: ShowcaseListFilters, patch: Partial<ShowcaseListFilters>) {
  const next = { ...current, ...patch };
  if (patch.page === 'all' || patch.page === '') next.page = undefined;
  return `${pathname}${showcaseQueryString(next)}`;
}

export function PageFilter({ className, basePath }: { className?: string; basePath?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = parseShowcaseFilters(searchParams);
  const active = current.page ?? 'all';
  const path = basePath ?? pathname;

  return (
    <div className={cn('flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0', className)} role="tablist" aria-label="Filter by page">
      {PAGE_FILTER_CHIPS.map((chip) => {
        const selected = active === chip.id;
        return (
          <Link
            key={chip.id}
            href={hrefFor(path, current, { page: chip.id === 'all' ? undefined : chip.id })}
            scroll={false}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-sm font-semibold border transition-colors',
              selected
                ? 'bg-[#0f2744] text-white border-[#0f2744]'
                : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-text-secondary hover:border-emerald-400'
            )}
          >
            {chip.label}
          </Link>
        );
      })}
    </div>
  );
}
