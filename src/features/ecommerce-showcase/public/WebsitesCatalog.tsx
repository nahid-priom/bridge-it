'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ROUTES } from '@/lib/routes';
import { STALE_PUBLIC_LISTING, showcaseListingQueryKey } from '@/lib/query/client';
import { ProjectGridSkeleton } from '@/src/components/skeletons/ProjectGridSkeleton';
import { ProjectGridError } from '@/src/components/skeletons/section-errors';
import { InlineSpinner } from '@/src/components/loading/InlineSpinner';
import { useReportCatalogTotal } from '@/src/features/catalog/components/explore/CatalogResultsContext';
import { cn } from '@/lib/cn';
import type { ShowcaseListResult } from '../types';
import { parseFilterList, serializeFilterList } from '../utils/filters';
import { ProjectGrid } from './ProjectGrid';
import { LISTING_LIMIT } from './websites-listing';

async function fetchListing(params: {
  q: string;
  category: string;
  view: string;
  industrySlug?: string;
  offset?: number;
}): Promise<ShowcaseListResult> {
  const search = new URLSearchParams();
  search.set('limit', String(LISTING_LIMIT));
  if (params.offset) search.set('offset', String(params.offset));
  if (params.q) search.set('q', params.q);
  if (params.category) search.set('category', params.category);
  if (params.view) search.set('view', params.view);
  if (params.industrySlug) search.set('industrySlug', params.industrySlug);
  const res = await fetch(`/api/showcase/projects?${search.toString()}`);
  if (!res.ok) throw new Error('Failed to load website templates');
  return (await res.json()) as ShowcaseListResult;
}

type ListingFilters = {
  q: string;
  category: string;
  view: string;
  industrySlug?: string;
};

export function WebsitesCatalog({
  initialFilters,
  initialData,
  hideChrome = true,
  lockedIndustrySlug,
}: {
  initialFilters: ListingFilters;
  initialData: ShowcaseListResult;
  /** When true, search/filters live in CatalogToolbar / sidebar. */
  hideChrome?: boolean;
  /** Path-locked industry (`/websites/{slug}`). */
  lockedIndustrySlug?: string;
}) {
  const searchParams = useSearchParams();

  const views = parseFilterList(searchParams.get('view') || searchParams.get('page') || initialFilters.view);
  const categories = lockedIndustrySlug
    ? []
    : parseFilterList(searchParams.get('category') || initialFilters.category);
  const industrySlug = lockedIndustrySlug || initialFilters.industrySlug || '';
  const q = (searchParams.get('q') ?? initialFilters.q).trim();
  const viewKey = serializeFilterList(views) ?? 'all';
  const categoryKey = industrySlug || serializeFilterList(categories) || 'all';

  const [extraItems, setExtraItems] = useState<ShowcaseListResult['items']>([]);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setExtraItems([]);
  }, [viewKey, categoryKey, q, industrySlug]);

  const queryKey = showcaseListingQueryKey({
    q,
    category: categoryKey,
    view: viewKey,
    limit: LISTING_LIMIT,
    offset: 0,
  });

  const matchesInitial =
    q === initialFilters.q &&
    categoryKey === (initialFilters.industrySlug || initialFilters.category || 'all') &&
    viewKey === (initialFilters.view || 'all');

  const { data, isFetching, isError, isPending, refetch, isPlaceholderData } = useQuery({
    queryKey,
    queryFn: () =>
      fetchListing({
        q,
        category: industrySlug ? '' : serializeFilterList(categories) ?? '',
        view: serializeFilterList(views) ?? '',
        industrySlug: industrySlug || undefined,
      }),
    initialData: matchesInitial ? initialData : undefined,
    placeholderData: keepPreviousData,
    staleTime: STALE_PUBLIC_LISTING,
  });

  const items = [...(data?.items ?? []), ...extraItems];
  const total = data?.total ?? 0;
  const hasFilters = Boolean(q || views.length || categories.length || industrySlug);
  const showGridSkeleton = isPending && !data;
  const isFilterRefreshing = Boolean(isFetching && isPlaceholderData && data);
  const showEmpty = !showGridSkeleton && !isFetching && !isError && items.length === 0 && Boolean(data);
  const remaining = total - items.length;
  const showingFrom = items.length === 0 ? 0 : 1;
  const showingTo = items.length;

  useReportCatalogTotal(data?.total, Boolean(data) && !showGridSkeleton);

  return (
    <div className={hideChrome ? undefined : 'mt-2 md:mt-3'}>
      {isError && !data ? (
        <ProjectGridError onRetry={() => void refetch()} />
      ) : showGridSkeleton ? (
        <ProjectGridSkeleton count={6} />
      ) : (
        <div
          className={cn(
            'transition-opacity duration-200 motion-reduce:transition-none',
            isFilterRefreshing && 'opacity-60'
          )}
          aria-busy={isFilterRefreshing || loadingMore || undefined}
        >
          <ProjectGrid
            projects={items}
            eagerCount={3}
            priorityFirst
            busy={loadingMore || isFilterRefreshing}
            emptyTitle={hasFilters ? 'No templates match your filters' : 'No website templates yet'}
            emptyDescription={
              hasFilters
                ? 'Clear filters or talk to us about a custom storefront for your brand.'
                : 'Premium e-commerce templates will appear here soon.'
            }
            emptyActionHref={hasFilters ? '/websites' : ROUTES.consultation}
            emptyActionLabel={hasFilters ? 'Clear filters' : 'Book a consultation'}
          />
        </div>
      )}

      {showEmpty && hasFilters ? (
        <p className="mt-4 text-center text-sm text-text-secondary">
          Need something custom?{' '}
          <Link href={ROUTES.consultation} className="font-semibold text-[#2563eb] hover:underline">
            Book a free consultation
          </Link>
        </p>
      ) : null}

      {!showGridSkeleton && (remaining > 0 || items.length > 0) ? (
        <nav
          className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row"
          aria-label="Catalog pagination"
        >
          <p className="text-sm text-text-muted">
            {items.length === 0
              ? 'Showing 0 templates'
              : `Showing ${showingFrom}–${showingTo} of ${total}`}
          </p>
          {remaining > 0 ? (
            <button
              type="button"
              disabled={loadingMore}
              aria-busy={loadingMore || undefined}
              className="inline-flex min-w-[10.5rem] items-center justify-center gap-2 rounded-xl border border-border-subtle px-6 py-3 text-sm font-semibold disabled:opacity-60"
              onClick={async () => {
                setLoadingMore(true);
                try {
                  const next = await fetchListing({
                    q,
                    category: industrySlug ? '' : serializeFilterList(categories) ?? '',
                    view: serializeFilterList(views) ?? '',
                    industrySlug: industrySlug || undefined,
                    offset: items.length,
                  });
                  setExtraItems((current) => [...current, ...next.items]);
                } finally {
                  setLoadingMore(false);
                }
              }}
            >
              {loadingMore ? (
                <InlineSpinner size={18} label="Loading more templates" />
              ) : (
                `Load more (${remaining})`
              )}
            </button>
          ) : null}
        </nav>
      ) : null}

      {loadingMore ? (
        <div className="mt-6">
          <ProjectGridSkeleton count={Math.min(3, remaining)} />
        </div>
      ) : null}
    </div>
  );
}
