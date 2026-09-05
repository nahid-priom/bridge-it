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
  const isSoftware = activeRoot === 'software';
  const resultNoun =
    activeRoot === 'software'
      ? 'Software Solution'
      : activeRoot === 'websites'
        ? 'template'
        : 'service';

  const resultsLabel =
    typeof displayCount === 'number'
      ? `${displayCount} ${resultNoun}${displayCount === 1 ? '' : 's'}`
      : null;

  return (
    <>
      <div className="mb-4 space-y-2 md:mb-5">
        {/*
          Mobile: search 60% / filter 20% / popular 20% (software).
          Non-software: search 80% / filter 20%.
          Desktop: flex row — search + popular + results count.
        */}
        <div
          className={cn(
            'grid w-full items-center gap-2',
            isSoftware
              ? 'grid-cols-[minmax(0,3fr)_minmax(0,1fr)_minmax(0,1fr)]'
              : 'grid-cols-[minmax(0,4fr)_minmax(0,1fr)]',
            'lg:flex lg:flex-wrap lg:gap-3'
          )}
        >
          <div className="min-w-0 lg:max-w-xl lg:flex-1">
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
                'h-10 w-full min-w-0 rounded-xl border border-border-subtle bg-surface px-3 text-sm text-text-primary'
              )}
            />
          </div>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open filters"
            className={cn(
              focusVisibleRing,
              'inline-flex h-10 min-w-0 w-full items-center justify-center gap-1.5 rounded-xl border border-border-subtle px-2 text-xs font-semibold text-text-secondary sm:text-sm lg:hidden'
            )}
          >
            <Filter className="h-4 w-4 shrink-0" aria-hidden />
            <span className="truncate">Filter</span>
          </button>

          {isSoftware ? (
            <div className="min-w-0 lg:shrink-0">
              <label htmlFor="software-sort" className="sr-only">
                Sort
              </label>
              <select
                id="software-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className={cn(
                  focusVisibleInput,
                  'h-10 w-full min-w-0 rounded-xl border border-border-subtle bg-surface px-2 text-xs font-medium text-text-primary sm:px-3 sm:text-sm lg:w-auto'
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

          {resultsLabel ? (
            <p className="ml-auto hidden shrink-0 text-sm tabular-nums text-text-muted lg:block">
              {resultsLabel}
            </p>
          ) : null}
        </div>

        {resultsLabel ? (
          <p className="text-sm tabular-nums text-text-muted lg:hidden" aria-live="polite">
            {resultsLabel}
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
