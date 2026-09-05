'use client';

import { useEffect, useTransition } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { ROUTES } from '@/lib/routes';
import { STALE_PUBLIC_LISTING } from '@/lib/query/client';
import { InlineSpinner } from '@/src/components/loading/InlineSpinner';
import { useReportCatalogTotal } from '@/src/features/catalog/components/explore/CatalogResultsContext';
import { cn } from '@/lib/cn';
import {
  CATALOG_LISTING_GRID_CLASS,
  parseSoftwareBusinessSizeParam,
  parseSoftwarePriceParam,
  parseSoftwareSortParam,
  serializeSoftwareBusinessSizes,
  softwarePriceBounds,
  type SoftwareSortId,
} from '@/src/features/catalog/components/explore/types';
import {
  parseSoftwareGroupParam,
  parseSoftwareMoreParam,
  primaryFilterToTaxonomySlug,
  SOFTWARE_GALLERY_PAGE_SIZE,
  SOFTWARE_PRIMARY_FILTERS,
  type SoftwareMoreFilterId,
} from '../config/constants';
import type { SoftwareListResult } from '../types';
import {
  softwareListingQueryKey,
  type SoftwareListingQueryFilters,
} from '../utils/query-keys';
import { SoftwareCard, SoftwareCardSkeleton } from './SoftwareCard';

export { softwareListingQueryKey };

type CatalogFilters = Omit<SoftwareListingQueryFilters, 'pageSize'>;

async function fetchListing(
  params: CatalogFilters & { pageSize: number; minPrice?: number; maxPrice?: number }
): Promise<SoftwareListResult> {
  const search = new URLSearchParams();
  search.set('page', String(params.page));
  search.set('pageSize', String(params.pageSize));
  if (params.q) search.set('q', params.q);
  if (params.category && params.category !== 'all') search.set('category', params.category);
  if (params.child && params.child !== 'all') search.set('child', params.child);
  if (params.more.length) search.set('more', params.more.join(','));
  if (params.industrySlug) search.set('industrySlug', params.industrySlug);
  if (params.minPrice != null) search.set('minPrice', String(params.minPrice));
  if (params.maxPrice != null) search.set('maxPrice', String(params.maxPrice));
  if (params.size) search.set('size', params.size);
  if (params.sort && params.sort !== 'popular') search.set('sort', params.sort);
  const res = await fetch(`/api/software/projects?${search.toString()}`);
  if (!res.ok) throw new Error('Failed to load software');
  return (await res.json()) as SoftwareListResult;
}

function SoftwareGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className={CATALOG_LISTING_GRID_CLASS}
      aria-busy="true"
      aria-label="Loading software"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={index >= 4 ? 'max-md:hidden' : undefined}>
          <SoftwareCardSkeleton />
        </div>
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
    const primaryIds = new Set(SOFTWARE_PRIMARY_FILTERS.map((f) => f.id));
    if (primaryIds.has(category as (typeof SOFTWARE_PRIMARY_FILTERS)[number]['id'])) {
      return category;
    }
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
  const industrySlug = initial.industrySlug || '';
  const price =
    parseSoftwarePriceParam(searchParams.get('price')) ??
    parseSoftwarePriceParam(initial.price) ??
    '';
  const sizeFromUrl = parseSoftwareBusinessSizeParam(searchParams.get('size'));
  const size = searchParams.has('size')
    ? serializeSoftwareBusinessSizes(sizeFromUrl)
    : initial.size || '';
  const sort = searchParams.has('sort')
    ? parseSoftwareSortParam(searchParams.get('sort'))
    : initial.sort || 'popular';
  return { q, category, child, more, page, industrySlug, price, size, sort };
}

export function SoftwareCatalog({
  initialFilters,
  initialData,
  hideChrome = true,
  lockedIndustrySlug,
  excludeSlugs,
}: {
  initialFilters: {
    q: string;
    category?: string;
    group?: string;
    solutionGroup?: string;
    child?: string;
    more?: SoftwareMoreFilterId[];
    page: number;
    price?: string;
    size?: string;
    sort?: SoftwareSortId;
    industrySlug?: string;
  };
  initialData: SoftwareListResult;
  /** @deprecated Chrome removed — layout owns search/filters */
  hideChrome?: boolean;
  lockedIndustrySlug?: string;
  excludeSlugs?: string[];
}) {
  void hideChrome;
  const exclude = new Set(excludeSlugs ?? []);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const normalizedInitial: CatalogFilters = {
    q: initialFilters.q || '',
    category:
      initialFilters.category ||
      parseSoftwareGroupParam(initialFilters.group, initialFilters.solutionGroup) ||
      'all',
    child: (initialFilters.child ?? 'all').trim() || 'all',
    more: initialFilters.more ?? [],
    page: initialFilters.page || 1,
    industrySlug: lockedIndustrySlug || initialFilters.industrySlug || '',
    price: initialFilters.price || '',
    size: initialFilters.size || '',
    sort: initialFilters.sort || 'popular',
  };

  const { q, category, child, more, page, industrySlug, price, size, sort } = readCatalogFilters(
    searchParams,
    normalizedInitial
  );
  const pageSize = SOFTWARE_GALLERY_PAGE_SIZE;
  const priceBounds = softwarePriceBounds(parseSoftwarePriceParam(price));
  const businessSizes = parseSoftwareBusinessSizeParam(size);

  const writePage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage > 1) params.set('page', String(nextPage));
    else params.delete('page');
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: true });
    });
  };

  const clearAllFilters = () => {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  };

  const queryKey = softwareListingQueryKey({
    q,
    category: industrySlug ? 'all' : category,
    child: industrySlug ? 'all' : child,
    more: industrySlug ? [] : more,
    page,
    pageSize,
    industrySlug,
    price,
    size,
    sort,
  });

  const matchesInitial =
    q === normalizedInitial.q &&
    (industrySlug || category) === (normalizedInitial.industrySlug || normalizedInitial.category) &&
    child === normalizedInitial.child &&
    more.slice().sort().join(',') === normalizedInitial.more.slice().sort().join(',') &&
    page === normalizedInitial.page &&
    price === (normalizedInitial.price || '') &&
    size === (normalizedInitial.size || '') &&
    sort === (normalizedInitial.sort || 'popular') &&
    industrySlug === normalizedInitial.industrySlug;

  const { data, isFetching, isError, isPending, refetch, isPlaceholderData } = useQuery({
    queryKey,
    queryFn: () =>
      fetchListing({
        q,
        category: industrySlug ? 'all' : category,
        child: industrySlug ? 'all' : child,
        more: industrySlug ? [] : more,
        page,
        pageSize,
        industrySlug,
        price,
        size,
        sort,
        minPrice: priceBounds.minPrice,
        maxPrice: priceBounds.maxPrice,
      }),
    initialData: matchesInitial ? initialData : undefined,
    placeholderData: keepPreviousData,
    staleTime: STALE_PUBLIC_LISTING,
    refetchOnMount: false,
  });

  const queryClient = useQueryClient();
  const items = (data?.items ?? []).filter((p) => !exclude.has(p.slug));
  const total = Math.max(0, (data?.total ?? 0) - (exclude.size ? exclude.size : 0));
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (!data || page >= totalPages) return;
    const nextFilters = {
      q,
      category: industrySlug ? 'all' : category,
      child: industrySlug ? 'all' : child,
      more: industrySlug ? [] : more,
      page: page + 1,
      pageSize,
      industrySlug,
      price,
      size,
      sort,
    };
    void queryClient.prefetchQuery({
      queryKey: softwareListingQueryKey(nextFilters),
      queryFn: () =>
        fetchListing({
          ...nextFilters,
          minPrice: priceBounds.minPrice,
          maxPrice: priceBounds.maxPrice,
        }),
      staleTime: STALE_PUBLIC_LISTING,
    });
  }, [
    data,
    page,
    totalPages,
    q,
    category,
    child,
    more,
    pageSize,
    industrySlug,
    price,
    size,
    sort,
    priceBounds.minPrice,
    priceBounds.maxPrice,
    queryClient,
  ]);

  const hasFilters = Boolean(
    q ||
      (!industrySlug && category && category !== 'all') ||
      (!industrySlug && child && child !== 'all') ||
      (!industrySlug && more.length > 0) ||
      price ||
      businessSizes.length > 0 ||
      (sort && sort !== 'popular')
  );
  // Never skeleton on isFetching — keep previous cards (placeholderData) + opacity.
  const showGridSkeleton = Boolean(isPending && !data);
  const isFilterRefreshing = Boolean(isFetching && isPlaceholderData && data);
  const showEmpty =
    !showGridSkeleton && !isFetching && !isError && items.length === 0 && Boolean(data);
  const showingFrom = items.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const showingTo = items.length === 0 ? 0 : showingFrom + items.length - 1;

  useReportCatalogTotal(data?.total, Boolean(data) && !showGridSkeleton);

  return (
    <div>
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
        <div
          className={cn(
            CATALOG_LISTING_GRID_CLASS,
            'transition-opacity duration-200 motion-reduce:transition-none',
            isFilterRefreshing && 'opacity-60'
          )}
          aria-busy={isFilterRefreshing || undefined}
        >
          {items.map((project, index) => (
            <SoftwareCard
              key={project.id}
              project={project}
              eager={index < 3}
              priority={index === 0}
              variant="home"
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
  );
}
