'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ROUTES } from '@/lib/routes';
import { STALE_PUBLIC_LISTING } from '@/lib/query/client';
import { InlineSpinner } from '@/src/components/loading/InlineSpinner';
import {
  parseSoftwareGroupParam,
  parseSoftwareMoreParam,
  serializeSoftwareMoreParam,
  SOFTWARE_GALLERY_PAGE_SIZE,
  SOFTWARE_MORE_FILTERS,
  SOFTWARE_PRIMARY_FILTERS,
  type SoftwareMoreFilterId,
} from '../config/constants';
import type { SoftwareListResult } from '../types';
import { SoftwareCard, SoftwareCardSkeleton } from './SoftwareCard';
import { SoftwareMoreFiltersSheet } from './SoftwareMoreFiltersSheet';

const SOFTWARE_LISTING_KEY = 'software-listing' as const;

type CatalogFilters = {
  q: string;
  group: string;
  industry: string;
  more: SoftwareMoreFilterId[];
  page: number;
};

function softwareListingQueryKey(filters: CatalogFilters & { pageSize: number }) {
  return [
    SOFTWARE_LISTING_KEY,
    {
      q: filters.q || '',
      group: filters.group || 'all',
      industry: filters.industry || 'all',
      more: filters.more.slice().sort().join(','),
      page: filters.page,
      pageSize: filters.pageSize,
    },
  ] as const;
}

async function fetchListing(params: CatalogFilters & { pageSize: number }): Promise<SoftwareListResult> {
  const search = new URLSearchParams();
  search.set('page', String(params.page));
  search.set('pageSize', String(params.pageSize));
  if (params.q) search.set('q', params.q);
  if (params.group && params.group !== 'all') search.set('group', params.group);
  if (params.industry && params.industry !== 'all') search.set('industry', params.industry);
  const more = serializeSoftwareMoreParam(params.more);
  if (more) search.set('more', more);
  const res = await fetch(`/api/software/projects?${search.toString()}`);
  if (!res.ok) throw new Error('Failed to load software');
  return (await res.json()) as SoftwareListResult;
}

function SoftwareGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3"
      aria-busy="true"
      aria-label="Loading software"
    >
      {Array.from({ length: count }).map((_, index) => (
        <SoftwareCardSkeleton key={index} />
      ))}
    </div>
  );
}

function readCatalogFilters(
  searchParams: URLSearchParams,
  initial: CatalogFilters
): CatalogFilters {
  const group = parseSoftwareGroupParam(
    searchParams.get('group'),
    searchParams.get('solutionGroup'),
    initial.group
  );
  const industry =
    (searchParams.get('industry') ?? searchParams.get('category') ?? initial.industry ?? 'all').trim() ||
    'all';
  const moreFromUrl = parseSoftwareMoreParam(searchParams.get('more'));
  const more = searchParams.has('more') ? moreFromUrl : initial.more;
  const q = (searchParams.get('q') ?? initial.q).trim();
  const page = Math.max(1, Number(searchParams.get('page') ?? initial.page ?? 1) || 1);
  return { q, group, industry, more, page };
}

export function SoftwareCatalog({
  initialFilters,
  initialData,
  industries = [],
}: {
  initialFilters: {
    q: string;
    group?: string;
    solutionGroup?: string;
    industry?: string;
    category?: string;
    more?: SoftwareMoreFilterId[];
    page: number;
  };
  initialData: SoftwareListResult;
  industries?: Array<{ id: string; label: string; slug?: string }>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const isExploreSoftware = pathname.includes('/explore');

  const normalizedInitial: CatalogFilters = {
    q: initialFilters.q || '',
    group: parseSoftwareGroupParam(initialFilters.group, initialFilters.solutionGroup),
    industry: (initialFilters.industry ?? initialFilters.category ?? 'all').trim() || 'all',
    more: initialFilters.more ?? [],
    page: initialFilters.page || 1,
  };

  const { q, group, industry, more, page } = readCatalogFilters(searchParams, normalizedInitial);
  const pageSize = SOFTWARE_GALLERY_PAGE_SIZE;
  const [searchInput, setSearchInput] = useState(q);

  /** Drop legacy aliases; keep explore pillar `type=software` when on /explore. */
  const sanitizeListingParams = (params: URLSearchParams) => {
    params.delete('solutionGroup');
    params.delete('category');
    if (isExploreSoftware) params.set('type', 'software');
    else params.delete('type');
  };

  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const next = searchInput.trim();
      if (next === q) return;
      const params = new URLSearchParams(searchParams.toString());
      if (next) params.set('q', next);
      else params.delete('q');
      params.delete('page');
      sanitizeListingParams(params);
      const qs = params.toString();
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    }, 300);
    return () => window.clearTimeout(handle);
    // sanitizeListingParams is stable for the pathname lifetime
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput, q, pathname, router, searchParams, isExploreSoftware]);

  const writeParams = (mutate: (params: URLSearchParams) => void, scroll = false) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    params.delete('page');
    sanitizeListingParams(params);
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll });
    });
  };

  const writeGroup = (next: string) => {
    writeParams((params) => {
      if (next && next !== 'all') params.set('group', next);
      else params.delete('group');
    });
  };

  const writeIndustry = (next: string) => {
    writeParams((params) => {
      if (next && next !== 'all') params.set('industry', next);
      else params.delete('industry');
    });
  };

  const writeMore = (next: SoftwareMoreFilterId[]) => {
    writeParams((params) => {
      const serialized = serializeSoftwareMoreParam(next);
      if (serialized) params.set('more', serialized);
      else params.delete('more');
    });
  };

  const clearMore = () => {
    writeParams((params) => {
      params.delete('more');
    });
  };

  const clearAllFilters = () => {
    startTransition(() => {
      router.replace(pathname.includes('/explore') ? `${pathname}?type=software` : ROUTES.softwareShowroom, {
        scroll: false,
      });
    });
  };

  const writePage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage > 1) params.set('page', String(nextPage));
    else params.delete('page');
    sanitizeListingParams(params);
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: true });
    });
  };

  const queryKey = softwareListingQueryKey({ q, group, industry, more, page, pageSize });

  const matchesInitial =
    q === normalizedInitial.q &&
    group === normalizedInitial.group &&
    industry === normalizedInitial.industry &&
    more.slice().sort().join(',') === normalizedInitial.more.slice().sort().join(',') &&
    page === normalizedInitial.page;

  const { data, isFetching, isError, isPending, refetch, isPlaceholderData, isLoading } = useQuery({
    queryKey,
    queryFn: () => fetchListing({ q, group, industry, more, page, pageSize }),
    initialData: matchesInitial ? initialData : undefined,
    placeholderData: keepPreviousData,
    staleTime: STALE_PUBLIC_LISTING,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const hasFilters = Boolean(
    q || (group && group !== 'all') || (industry && industry !== 'all') || more.length > 0
  );
  const showGridSkeleton = isPending || isLoading || (isFetching && isPlaceholderData);
  const showEmpty = !showGridSkeleton && !isError && items.length === 0;
  const showingFrom = items.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const showingTo = items.length === 0 ? 0 : showingFrom + items.length - 1;

  return (
    <>
      <div
        className={
          industries.length > 0
            ? 'mb-2.5 grid grid-cols-[minmax(0,7fr)_minmax(0,3fr)] gap-2 sm:mb-3'
            : 'mb-2.5 sm:mb-3'
        }
      >
        <div className="min-w-0">
          <label htmlFor="software-catalog-search" className="sr-only">
            Search software solutions
          </label>
          <input
            id="software-catalog-search"
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search software solutions..."
            className="h-10 w-full rounded-xl border border-border-subtle bg-surface px-3 text-sm text-text-primary outline-none focus:border-[#2563eb] sm:px-4"
          />
        </div>
        {industries.length > 0 ? (
          <div className="min-w-0">
            <label htmlFor="software-industry-filter" className="sr-only">
              Industry
            </label>
            <select
              id="software-industry-filter"
              value={industry}
              onChange={(event) => writeIndustry(event.target.value)}
              className="h-10 w-full rounded-xl border border-border-subtle bg-surface px-2.5 text-xs text-text-primary outline-none focus:border-[#2563eb] sm:px-3 sm:text-sm"
            >
              <option value="all">All industries</option>
              {industries.map((item) => (
                <option key={item.id} value={item.slug ?? item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      <div
        className="flex flex-nowrap items-center gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="group"
        aria-label="Solution type filters"
      >
        {SOFTWARE_PRIMARY_FILTERS.map((item) => {
          const active = group === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => writeGroup(item.id)}
              className={
                active
                  ? 'shrink-0 rounded-full bg-[#0f2744] px-2.5 py-1 text-xs font-semibold text-white'
                  : 'shrink-0 rounded-full border border-border-subtle px-2.5 py-1 text-xs font-medium text-text-secondary hover:border-[#2563eb]/40'
              }
            >
              {item.label}
            </button>
          );
        })}
        <SoftwareMoreFiltersSheet applied={more} onApply={writeMore} onClear={clearMore} />
      </div>

      {more.length > 0 ? (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {more.map((id) => {
            const label = SOFTWARE_MORE_FILTERS.find((f) => f.id === id)?.label ?? id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => writeMore(more.filter((item) => item !== id))}
                className="inline-flex items-center gap-1 rounded-full border border-[#2563eb]/30 bg-[#2563eb]/08 px-2.5 py-1 text-xs font-semibold text-[#1d4ed8] dark:text-[#60a5fa]"
              >
                {label}
                <span aria-hidden>×</span>
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="mt-4 md:mt-6">
        {!showGridSkeleton && total > 0 ? (
          <p className="mb-3 text-sm text-text-muted">
            {total} Software Solution{total === 1 ? '' : 's'}
          </p>
        ) : null}

        {isError && !data ? (
          <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-16 text-center dark:border-white/15">
            <h3 className="font-display text-xl font-bold">Unable to load software solutions.</h3>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border-subtle px-4 py-2 text-sm font-semibold"
            >
              Retry
            </button>
          </div>
        ) : showGridSkeleton ? (
          <SoftwareGridSkeleton count={6} />
        ) : showEmpty ? (
          <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-16 text-center dark:border-white/15">
            <h3 className="font-display text-xl font-bold text-[#0f2744] dark:text-white">
              {hasFilters ? 'No software matches your filters' : 'No software found'}
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              {hasFilters
                ? 'Try clearing filters or request a custom solution.'
                : 'Request a custom solution for your business.'}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              {hasFilters ? (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="inline-flex rounded-xl border border-border-subtle px-4 py-2 text-sm font-semibold"
                >
                  Clear Filters
                </button>
              ) : null}
              <Link
                href={ROUTES.consultation}
                className="inline-flex rounded-xl bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1d4ed8]"
              >
                Free Consultation
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.map((project, index) => (
              <SoftwareCard
                key={project.id}
                project={project}
                eager={index < 3}
                priority={index === 0}
              />
            ))}
          </div>
        )}

        {!showGridSkeleton && (total > 0 || items.length > 0) ? (
          <nav
            className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row"
            aria-label="Catalog pagination"
          >
            <p className="text-sm text-text-muted">
              {items.length === 0
                ? 'Showing 0 software'
                : `Showing ${showingFrom}–${showingTo} of ${total}`}
            </p>
            {totalPages > 1 ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1 || isFetching}
                  className="inline-flex min-w-[6.5rem] items-center justify-center rounded-xl border border-border-subtle px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
                  onClick={() => writePage(page - 1)}
                >
                  Previous
                </button>
                <span className="px-2 text-sm text-text-secondary">
                  {isFetching ? <InlineSpinner size={16} label="Loading page" /> : `${page} / ${totalPages}`}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages || isFetching}
                  className="inline-flex min-w-[6.5rem] items-center justify-center rounded-xl border border-border-subtle px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
                  onClick={() => writePage(page + 1)}
                >
                  Next
                </button>
              </div>
            ) : null}
          </nav>
        ) : null}
      </div>
    </>
  );
}
