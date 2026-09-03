'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ROUTES } from '@/lib/routes';
import { STALE_PUBLIC_LISTING, showcaseListingQueryKey } from '@/lib/query/client';
import { ProjectGridSkeleton } from '@/src/components/skeletons/ProjectGridSkeleton';
import { ProjectGridError } from '@/src/components/skeletons/section-errors';
import { InlineSpinner } from '@/src/components/loading/InlineSpinner';
import type { ShowcaseListResult } from '../types';
import { parseFilterList, serializeFilterList } from '../utils/filters';
import { ProjectGrid } from './ProjectGrid';
import { WebsiteFilterToolbar } from './WebsiteFilterToolbar';
import { WebsiteSearch } from './WebsiteSearch';
import { LISTING_LIMIT } from './websites-listing';

async function fetchListing(params: {
  q: string;
  category: string;
  view: string;
  offset?: number;
}): Promise<ShowcaseListResult> {
  const search = new URLSearchParams();
  search.set('limit', String(LISTING_LIMIT));
  if (params.offset) search.set('offset', String(params.offset));
  if (params.q) search.set('q', params.q);
  if (params.category) search.set('category', params.category);
  if (params.view) search.set('view', params.view);
  const res = await fetch(`/api/showcase/projects?${search.toString()}`);
  if (!res.ok) throw new Error('Failed to load website designs');
  return (await res.json()) as ShowcaseListResult;
}

type ListingFilters = { q: string; category: string; view: string };

export function WebsitesCatalog({
  initialFilters,
  initialData,
}: {
  initialFilters: ListingFilters;
  initialData: ShowcaseListResult;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const views = parseFilterList(searchParams.get('view') || searchParams.get('page') || initialFilters.view);
  const categories = parseFilterList(searchParams.get('category') || initialFilters.category);
  const q = (searchParams.get('q') ?? initialFilters.q).trim();
  const viewKey = serializeFilterList(views) ?? 'all';
  const categoryKey = serializeFilterList(categories) ?? 'all';

  const [extraItems, setExtraItems] = useState<ShowcaseListResult['items']>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchInput, setSearchInput] = useState(q);

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
      const qs = params.toString();
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    }, 320);
    return () => window.clearTimeout(handle);
  }, [searchInput, q, pathname, router, searchParams]);

  useEffect(() => {
    setExtraItems([]);
  }, [viewKey, categoryKey, q]);

  const writeFilters = (nextViews: string[], nextCategories: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    const view = serializeFilterList(nextViews);
    const category = serializeFilterList(nextCategories);
    if (view) params.set('view', view);
    else params.delete('view');
    params.delete('page');
    if (category) params.set('category', category);
    else params.delete('category');
    const qs = params.toString();
    const href = qs ? `${pathname}?${qs}` : pathname;
    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  };

  const queryKey = showcaseListingQueryKey({
    q,
    category: categoryKey,
    view: viewKey,
    limit: LISTING_LIMIT,
    offset: 0,
  });

  const matchesInitial =
    q === initialFilters.q &&
    categoryKey === (initialFilters.category || 'all') &&
    viewKey === (initialFilters.view || 'all');

  const { data, isFetching, isError, isPending, refetch, isPlaceholderData } = useQuery({
    queryKey,
    queryFn: () =>
      fetchListing({
        q,
        category: serializeFilterList(categories) ?? '',
        view: serializeFilterList(views) ?? '',
      }),
    initialData: matchesInitial ? initialData : undefined,
    placeholderData: keepPreviousData,
    staleTime: STALE_PUBLIC_LISTING,
  });

  const items = [...(data?.items ?? []), ...extraItems];
  const total = data?.total ?? 0;
  const hasFilters = Boolean(q || views.length || categories.length);
  const showGridSkeleton = isPending || (isFetching && isPlaceholderData);
  const remaining = total - items.length;
  const showingFrom = items.length === 0 ? 0 : 1;
  const showingTo = items.length;

  return (
    <>
      <WebsiteSearch
        id="websites-catalog-search"
        value={searchInput}
        onChange={setSearchInput}
        className="mb-5 max-w-xl"
      />
      <WebsiteFilterToolbar
        views={views}
        categories={categories}
        onViewsChange={(next) => writeFilters(next, categories)}
        onCategoriesChange={(next) => writeFilters(views, next)}
      />

      <div className="mt-6 md:mt-8">
        {isError && !data ? (
          <ProjectGridError onRetry={() => void refetch()} />
        ) : showGridSkeleton ? (
          <ProjectGridSkeleton count={6} />
        ) : (
          <ProjectGrid
            projects={items}
            eagerCount={3}
            priorityFirst
            busy={loadingMore}
            emptyTitle={hasFilters ? 'No designs match your filters' : 'No website designs yet'}
            emptyDescription={
              hasFilters
                ? 'Clear filters or talk to us about a custom storefront for your brand.'
                : 'Premium e-commerce designs will appear here soon.'
            }
            emptyActionHref={hasFilters ? '/websites' : ROUTES.consultation}
            emptyActionLabel={hasFilters ? 'Clear filters' : 'Book a consultation'}
          />
        )}

        {hasFilters && items.length === 0 && data && !showGridSkeleton ? (
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
                ? 'Showing 0 designs'
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
                      category: serializeFilterList(categories) ?? '',
                      view: serializeFilterList(views) ?? '',
                      offset: items.length,
                    });
                    setExtraItems((current) => [...current, ...next.items]);
                  } finally {
                    setLoadingMore(false);
                  }
                }}
              >
                {loadingMore ? (
                  <InlineSpinner size={18} label="Loading more projects" />
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
    </>
  );
}
