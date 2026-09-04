'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ROUTES } from '@/lib/routes';
import { STALE_PUBLIC_LISTING } from '@/lib/query/client';
import { InlineSpinner } from '@/src/components/loading/InlineSpinner';
import {
  parseSoftwareGroupParam,
  parseSoftwareMoreParam,
  primaryFilterToTaxonomySlug,
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
  category: string;
  child: string;
  more: SoftwareMoreFilterId[];
  page: number;
};

function softwareListingQueryKey(filters: CatalogFilters & { pageSize: number }) {
  return [
    SOFTWARE_LISTING_KEY,
    {
      q: filters.q || '',
      category: filters.category || 'all',
      child: filters.child || 'all',
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
  if (params.category && params.category !== 'all') search.set('category', params.category);
  if (params.child && params.child !== 'all') search.set('child', params.child);
  if (params.more.length) search.set('more', params.more.join(','));
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

function resolveCategoryFromUrl(
  searchParams: URLSearchParams,
  initialCategory: string
): string {
  const category = (searchParams.get('category') ?? '').trim();
  if (category && category !== 'all') {
    // New taxonomy param — ignore legacy industry collision when it matches a primary filter id
    const primaryIds = new Set(SOFTWARE_PRIMARY_FILTERS.map((f) => f.id));
    if (primaryIds.has(category as (typeof SOFTWARE_PRIMARY_FILTERS)[number]['id'])) {
      return category;
    }
    // If category looks like taxonomy slug from primary filters
    const byTax = SOFTWARE_PRIMARY_FILTERS.find((f) => f.taxonomySlug === category);
    if (byTax) return byTax.id;
  }
  const group = parseSoftwareGroupParam(searchParams.get('group'), searchParams.get('solutionGroup'));
  if (group !== 'all') return group;
  return initialCategory || 'all';
}

function readCatalogFilters(
  searchParams: URLSearchParams,
  initial: CatalogFilters
): CatalogFilters {
  const category = resolveCategoryFromUrl(searchParams, initial.category);
  const child = (searchParams.get('child') ?? initial.child ?? 'all').trim() || 'all';
  const moreFromUrl = parseSoftwareMoreParam(searchParams.get('more'));
  const more = searchParams.has('more') ? moreFromUrl : initial.more;
  const q = (searchParams.get('q') ?? initial.q).trim();
  const page = Math.max(1, Number(searchParams.get('page') ?? initial.page ?? 1) || 1);
  return { q, category, child, more, page };
}

export function SoftwareCatalog({
  initialFilters,
  initialData,
  childOptions = [],
}: {
  initialFilters: {
    q: string;
    category?: string;
    group?: string;
    solutionGroup?: string;
    child?: string;
    more?: SoftwareMoreFilterId[];
    page: number;
  };
  initialData: SoftwareListResult;
  childOptions?: Array<{ id: string; label: string; slug: string; categorySlug?: string }>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const isExploreSoftware = pathname.includes('/explore');

  const normalizedInitial: CatalogFilters = {
    q: initialFilters.q || '',
    category:
      initialFilters.category ||
      parseSoftwareGroupParam(initialFilters.group, initialFilters.solutionGroup) ||
      'all',
    child: (initialFilters.child ?? 'all').trim() || 'all',
    more: initialFilters.more ?? [],
    page: initialFilters.page || 1,
  };

  const { q, category, child, more, page } = readCatalogFilters(searchParams, normalizedInitial);
  const pageSize = SOFTWARE_GALLERY_PAGE_SIZE;
  const [searchInput, setSearchInput] = useState(q);

  const sanitizeListingParams = (params: URLSearchParams) => {
    params.delete('solutionGroup');
    params.delete('group');
    params.delete('industry');
    if (isExploreSoftware) params.set('type', 'software');
    else params.delete('type');
  };

  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  useEffect(() => {
    if (isExploreSoftware) return;
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

  const writeCategory = (next: string) => {
    writeParams((params) => {
      const slug = primaryFilterToTaxonomySlug(next) ?? (next !== 'all' ? next : undefined);
      if (slug) params.set('category', slug);
      else params.delete('category');
      params.delete('child');
      params.delete('more');
    });
  };

  const writeChild = (next: string) => {
    writeParams((params) => {
      if (next && next !== 'all') params.set('child', next);
      else params.delete('child');
    });
  };

  const writeMore = (next: SoftwareMoreFilterId[]) => {
    writeParams((params) => {
      if (next.length) params.set('more', next.join(','));
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

  const taxonomySlug = primaryFilterToTaxonomySlug(category) ?? (category !== 'all' ? category : undefined);

  const visibleChildren = useMemo(() => {
    if (!taxonomySlug) return childOptions;
    return childOptions.filter((c) => !c.categorySlug || c.categorySlug === taxonomySlug);
  }, [childOptions, taxonomySlug]);

  const queryKey = softwareListingQueryKey({ q, category, child, more, page, pageSize });

  const matchesInitial =
    q === normalizedInitial.q &&
    category === normalizedInitial.category &&
    child === normalizedInitial.child &&
    more.slice().sort().join(',') === normalizedInitial.more.slice().sort().join(',') &&
    page === normalizedInitial.page;

  const { data, isFetching, isError, isPending, refetch, isPlaceholderData, isLoading } = useQuery({
    queryKey,
    queryFn: () => fetchListing({ q, category, child, more, page, pageSize }),
    initialData: matchesInitial ? initialData : undefined,
    placeholderData: keepPreviousData,
    staleTime: STALE_PUBLIC_LISTING,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const hasFilters = Boolean(q || (category && category !== 'all') || (child && child !== 'all') || more.length > 0);
  const showGridSkeleton = isPending || isLoading || (isFetching && isPlaceholderData);
  const showEmpty = !showGridSkeleton && !isError && items.length === 0;
  const showingFrom = items.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const showingTo = items.length === 0 ? 0 : showingFrom + items.length - 1;

  return (
    <>
      {!isExploreSoftware ? (
        <div className="mb-2.5 sm:mb-3">
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
      ) : null}

      <div
        className="flex flex-nowrap items-center gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="group"
        aria-label={isExploreSoftware ? 'More filters' : 'Category filters'}
      >
        {!isExploreSoftware
          ? SOFTWARE_PRIMARY_FILTERS.map((item) => {
              const active = category === item.id || (item.taxonomySlug != null && category === item.taxonomySlug);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => writeCategory(item.id)}
                  className={
                    active
                      ? 'shrink-0 rounded-full bg-[#0f2744] px-2.5 py-1 text-xs font-semibold text-white'
                      : 'shrink-0 rounded-full border border-border-subtle px-2.5 py-1 text-xs font-medium text-text-secondary hover:border-[#2563eb]/40'
                  }
                >
                  {item.label}
                </button>
              );
            })
          : null}
        <SoftwareMoreFiltersSheet applied={more} onApply={writeMore} onClear={clearMore} />
      </div>

      {visibleChildren.length > 0 && category !== 'all' ? (
        <div className="mt-2.5 flex flex-nowrap items-center gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => writeChild('all')}
            className={
              child === 'all'
                ? 'shrink-0 rounded-full bg-emerald-700 px-2.5 py-1 text-xs font-semibold text-white'
                : 'shrink-0 rounded-full border border-border-subtle px-2.5 py-1 text-xs font-medium text-text-secondary'
            }
          >
            All
          </button>
          {visibleChildren.map((item) => {
            const active = child === item.slug;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => writeChild(item.slug)}
                className={
                  active
                    ? 'shrink-0 rounded-full bg-emerald-700 px-2.5 py-1 text-xs font-semibold text-white'
                    : 'shrink-0 rounded-full border border-border-subtle px-2.5 py-1 text-xs font-medium text-text-secondary'
                }
              >
                {item.label}
              </button>
            );
          })}
        </div>
      ) : null}

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
