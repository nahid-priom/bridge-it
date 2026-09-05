'use client';

import { useEffect, useState, useTransition } from 'react';
import { Filter } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn, focusVisibleInput, focusVisibleRing } from '@/lib/cn';
import type { CatalogCategoryRoot } from '../../types';
import { MobileFilterDrawer } from './MobileFilterDrawer';
import {
  catalogSearchPlaceholder,
  parseSoftwareSortParam,
  SOFTWARE_SORT_OPTIONS,
  type CatalogSidebarIndustry,
} from './types';
import { useCatalogResults } from './CatalogResultsContext';

export function CatalogToolbar({
  activeRoot,
  activeIndustrySlug,
  industries,
  resultCount,
}: {
  activeRoot: CatalogCategoryRoot;
  activeIndustrySlug?: string | null;
  industries: CatalogSidebarIndustry[];
  resultCount?: number | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const resultsCtx = useCatalogResults();
  const q = (searchParams.get('q') ?? '').trim();
  const sort = parseSoftwareSortParam(searchParams.get('sort'));
  const [searchInput, setSearchInput] = useState(q);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const displayCount =
    typeof resultsCtx?.liveTotal === 'number'
      ? resultsCtx.liveTotal
      : typeof resultCount === 'number'
        ? resultCount
        : null;

  const industryName = activeIndustrySlug
    ? industries.find((i) => i.slug === activeIndustrySlug)?.name
    : null;

  useEffect(() => {
    setSearchInput(q);
  }, [q, pathname]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const next = searchInput.trim();
      if (next === q) return;
      const params = new URLSearchParams(searchParams.toString());
      if (next) params.set('q', next);
      else params.delete('q');
      params.delete('page');
      const qs = params.toString();
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    }, 320);
    return () => window.clearTimeout(handle);
  }, [searchInput, q, pathname, router, searchParams]);

  const setSort = (next: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!next || next === 'popular') params.delete('sort');
    else params.set('sort', next);
    params.delete('page');
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  };

  const placeholder = catalogSearchPlaceholder(activeRoot, industryName);
  const searchId = `catalog-search-${activeRoot}`;
  const resultNoun =
    activeRoot === 'software'
      ? 'Software Solution'
      : activeRoot === 'websites'
        ? 'template'
        : 'service';

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2 md:mb-5 md:gap-3">
        <div className="min-w-0 flex-1 sm:max-w-lg">
          <label htmlFor={searchId} className="sr-only">
            {placeholder}
          </label>
          <input
            id={searchId}
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={placeholder}
            className={cn(
              focusVisibleInput,
              'h-10 w-full rounded-xl border border-border-subtle bg-surface px-3 text-sm text-text-primary sm:px-4'
            )}
          />
        </div>

        {activeRoot === 'software' ? (
          <div className="shrink-0">
            <label htmlFor="software-sort" className="sr-only">
              Sort
            </label>
            <select
              id="software-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className={cn(
                focusVisibleInput,
                'h-10 rounded-xl border border-border-subtle bg-surface px-3 text-sm font-medium text-text-primary'
              )}
            >
              {SOFTWARE_SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className={cn(
            focusVisibleRing,
            'inline-flex h-10 items-center gap-2 rounded-xl border border-border-subtle px-3 text-sm font-semibold text-text-secondary lg:hidden'
          )}
        >
          <Filter className="h-4 w-4" aria-hidden />
          Filters
        </button>

        {typeof displayCount === 'number' ? (
          <p className="ml-auto hidden text-sm text-text-muted sm:block">
            {displayCount} {resultNoun}
            {displayCount === 1 ? '' : 's'}
          </p>
        ) : null}
      </div>

      <MobileFilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeRoot={activeRoot}
        activeIndustrySlug={activeIndustrySlug}
        industries={industries}
      />
    </>
  );
}
