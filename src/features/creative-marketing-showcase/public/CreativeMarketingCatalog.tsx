'use client';

import { useEffect, useTransition } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { ROUTES } from '@/lib/routes';
import { STALE_PUBLIC_LISTING } from '@/lib/query/client';
import { InlineSpinner } from '@/src/components/loading/InlineSpinner';
import { useReportCatalogTotal } from '@/src/features/catalog/components/explore/CatalogResultsContext';
import { CATALOG_LISTING_GRID_CLASS } from '@/src/features/catalog/components/explore/types';
import { cn } from '@/lib/cn';
import {
  CREATIVE_MARKETING_GALLERY_PAGE_SIZE,
  parseCreativeGroupParam,
  parseCreativeMoreParam,
  serializeCreativeMoreParam,
  type CreativeMoreFilterId,
} from '../config/constants';
import type { CreativeMarketingListResult } from '../types';
import {
  creativeMarketingListingQueryKey,
  type CreativeMarketingListingQueryFilters,
} from '../utils/query-keys';
import { CreativeMarketingCard, CreativeMarketingCardSkeleton } from './CreativeMarketingCard';

export { creativeMarketingListingQueryKey };

type CatalogFilters = Omit<CreativeMarketingListingQueryFilters, 'pageSize'>;

async function fetchListing(params: CatalogFilters & { pageSize: number }): Promise<CreativeMarketingListResult> {
  const search = new URLSearchParams();
  search.set('page', String(params.page));
  search.set('pageSize', String(params.pageSize));
  if (params.q) search.set('q', params.q);
  if (!params.industrySlug && params.group && params.group !== 'all') search.set('group', params.group);
  const more = serializeCreativeMoreParam(params.more);
  if (!params.industrySlug && more) search.set('more', more);
  if (params.industrySlug) search.set('industrySlug', params.industrySlug);
  const res = await fetch(`/api/creative-marketing/projects?${search.toString()}`);
  if (!res.ok) throw new Error('Failed to load services');
  return (await res.json()) as CreativeMarketingListResult;
}

function readFilters(searchParams: URLSearchParams, initial: CatalogFilters): CatalogFilters {
  const group = parseCreativeGroupParam(
    searchParams.get('group'),
    searchParams.get('serviceGroup'),
    initial.group
  );
  const moreFromUrl = parseCreativeMoreParam(searchParams.get('more'));
  const more = searchParams.has('more') ? moreFromUrl : initial.more;
  const q = (searchParams.get('q') ?? initial.q).trim();
  const page = Math.max(1, Number(searchParams.get('page') ?? initial.page ?? 1) || 1);
  return {
    q,
    group,
    more,
    page,
    industrySlug: initial.industrySlug || '',
  };
}

export function CreativeMarketingCatalog({
  initialFilters,
  initialData,
  hideChrome = true,
  lockedIndustrySlug,
}: {
  initialFilters: {
    q: string;
    group?: string;
    serviceGroup?: string;
    more?: CreativeMoreFilterId[];
    page: number;
    industrySlug?: string;
  };
  initialData: CreativeMarketingListResult;
  hideChrome?: boolean;
  lockedIndustrySlug?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const normalizedInitial: CatalogFilters = {
    q: initialFilters.q || '',
    group: parseCreativeGroupParam(initialFilters.group, initialFilters.serviceGroup),
    more: initialFilters.more ?? [],
    page: initialFilters.page || 1,
    industrySlug: lockedIndustrySlug || initialFilters.industrySlug || '',
  };

  const { q, group, more, page, industrySlug } = readFilters(searchParams, normalizedInitial);
  const pageSize = CREATIVE_MARKETING_GALLERY_PAGE_SIZE;

  const clearAllFilters = () => {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  };

  const writePage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage > 1) params.set('page', String(nextPage));
    else params.delete('page');
    const qs = params.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: true }));
  };

  const queryKey = creativeMarketingListingQueryKey({
    q,
    group: industrySlug ? 'all' : group,
    more: industrySlug ? [] : more,
    page,
    pageSize,
    industrySlug,
  });
  const matchesInitial =
    q === normalizedInitial.q &&
    (industrySlug || group) === (normalizedInitial.industrySlug || normalizedInitial.group) &&
    more.slice().sort().join(',') === normalizedInitial.more.slice().sort().join(',') &&
    page === normalizedInitial.page &&
    industrySlug === normalizedInitial.industrySlug;

  const { data, isFetching, isError, isPending, refetch, isPlaceholderData } = useQuery({
    queryKey,
    queryFn: () =>
      fetchListing({
        q,
        group: industrySlug ? 'all' : group,
        more: industrySlug ? [] : more,
        page,
        pageSize,
        industrySlug,
      }),
    initialData: matchesInitial ? initialData : undefined,
    placeholderData: keepPreviousData,
    staleTime: STALE_PUBLIC_LISTING,
    refetchOnMount: false,
  });

  const queryClient = useQueryClient();
  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (!data || page >= totalPages) return;
    const nextFilters = {
      q,
      group: industrySlug ? 'all' : group,
      more: industrySlug ? [] : more,
      page: page + 1,
      pageSize,
      industrySlug,
    };
    void queryClient.prefetchQuery({
      queryKey: creativeMarketingListingQueryKey(nextFilters),
      queryFn: () => fetchListing(nextFilters),
      staleTime: STALE_PUBLIC_LISTING,
    });
  }, [data, page, totalPages, q, group, more, pageSize, industrySlug, queryClient]);

  const hasFilters = Boolean(
    q || (!industrySlug && group && group !== 'all') || (!industrySlug && more.length > 0) || industrySlug
  );
  // Never skeleton on isFetching — keep previous cards (placeholderData) + opacity.
  const showGridSkeleton = Boolean(isPending && !data);
  const isFilterRefreshing = Boolean(isFetching && isPlaceholderData && data);
  const showEmpty =
    !showGridSkeleton && !isFetching && !isError && items.length === 0 && Boolean(data);
  const showingFrom = items.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const showingTo = items.length === 0 ? 0 : showingFrom + items.length - 1;

  void hideChrome;
  useReportCatalogTotal(data?.total, Boolean(data) && !showGridSkeleton);

  return (
    <div>
      {isError && !data ? (
        <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-16 text-center dark:border-white/15">
          <h3 className="font-display text-xl font-bold">Could not load services</h3>
          <button type="button" onClick={() => void refetch()} className="mt-4 text-sm font-semibold">
            Try again
          </button>
        </div>
      ) : showGridSkeleton ? (
        <div className={CATALOG_LISTING_GRID_CLASS} aria-busy="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={i >= 4 ? 'max-md:hidden' : undefined}>
              <CreativeMarketingCardSkeleton />
            </div>
          ))}
        </div>
      ) : showEmpty ? (
        <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-16 text-center dark:border-white/15">
          <h3 className="font-display text-xl font-bold">
            {hasFilters ? 'No services match your filters' : 'No services yet'}
          </h3>
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
            <CreativeMarketingCard
              key={project.id}
              project={project}
              eager={index < 3}
              variant="home"
              priority={index === 0}
            />
          ))}
        </div>
      )}

      {!showGridSkeleton && total > 0 ? (
        <nav className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row" aria-label="Pagination">
          <p className="text-sm text-text-muted">
            Showing {showingFrom}–{showingTo} of {total}
          </p>
          {totalPages > 1 ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || isFetching}
                className="rounded-xl border border-border-subtle px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
                onClick={() => writePage(page - 1)}
              >
                Previous
              </button>
              <span className="px-2 text-sm">
                {isFetching ? <InlineSpinner size={16} label="Loading" /> : `${page} / ${totalPages}`}
              </span>
              <button
                type="button"
                disabled={page >= totalPages || isFetching}
                className="rounded-xl border border-border-subtle px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
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
