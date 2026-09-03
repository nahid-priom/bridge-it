'use client';

import { useEffect, useState, useTransition, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/cn';
import { ROUTES } from '@/lib/routes';
import { STALE_PUBLIC_LISTING, showcaseListingQueryKey } from '@/lib/query/client';
import { ProjectCardSkeleton } from '@/src/components/skeletons/ProjectCardSkeleton';
import { ProjectGridError } from '@/src/components/skeletons/section-errors';
import { useDelayedLoading } from '@/src/components/skeletons/useDelayedLoading';
import { InlineSpinner } from '@/src/components/loading/InlineSpinner';
import type { ShowcaseListResult } from '../types';
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
  if (params.category && params.category !== 'all') search.set('category', params.category);
  if (params.view && params.view !== 'all') search.set('view', params.view);
  const res = await fetch(`/api/showcase/projects?${search.toString()}`);
  if (!res.ok) throw new Error('Failed to load website designs');
  return (await res.json()) as ShowcaseListResult;
}

type ListingFilters = { q: string; category: string; view: string };

export function WebsitesCatalog({
  header,
  initialFilters,
  initialData,
}: {
  header: ReactNode;
  initialFilters: ListingFilters;
  initialData: ShowcaseListResult;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const [view, setView] = useState(initialFilters.view);
  const [category, setCategory] = useState(initialFilters.category);
  const [q, setQ] = useState(initialFilters.q);
  const [searchInput, setSearchInput] = useState(initialFilters.q);
  const [extraItems, setExtraItems] = useState<ShowcaseListResult['items']>([]);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setView(initialFilters.view);
    setCategory(initialFilters.category);
    setQ(initialFilters.q);
    setSearchInput(initialFilters.q);
  }, [initialFilters.view, initialFilters.category, initialFilters.q]);

  useEffect(() => {
    setExtraItems([]);
  }, [view, category, q]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const next = searchInput.trim();
      if (next === q) return;
      setQ(next);
    }, 300);
    return () => window.clearTimeout(handle);
  }, [searchInput, q]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (category && category !== 'all') params.set('category', category);
    if (view && view !== 'all') params.set('view', view);
    const qs = params.toString();
    const href = qs ? `${pathname}?${qs}` : pathname;
    const current = `${window.location.pathname}${window.location.search}`;
    if (href === current) return;
    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  }, [q, category, view, pathname, router]);

  const queryKey = showcaseListingQueryKey({
    q,
    category,
    view,
    limit: LISTING_LIMIT,
    offset: 0,
  });

  const matchesInitial =
    q === initialFilters.q &&
    category === initialFilters.category &&
    view === initialFilters.view;

  const { data, isFetching, isError, isPending, refetch, isPlaceholderData } = useQuery({
    queryKey,
    queryFn: () => fetchListing({ q, category, view }),
    initialData: matchesInitial ? initialData : undefined,
    placeholderData: keepPreviousData,
    staleTime: STALE_PUBLIC_LISTING,
  });

  const items = [...(data?.items ?? []), ...extraItems];
  const total = data?.total ?? 0;
  const hasFilters = Boolean(q || (category && category !== 'all') || (view && view !== 'all'));
  const showGridSkeleton = useDelayedLoading(isPending && !data, 150);
  const busy = (isFetching && isPlaceholderData) || loadingMore;
  const remaining = total - items.length;
  const showingFrom = items.length === 0 ? 0 : 1;
  const showingTo = items.length;

  const setViewAndReset = (next: string) => {
    setView(next);
    setExtraItems([]);
  };

  const setCategoryAndReset = (next: string) => {
    setCategory(next);
    setExtraItems([]);
  };

  return (
    <>
      <div className="grid grid-cols-1 items-end gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:gap-8">
        {header}
        <div className="flex min-w-0 w-full flex-col gap-2 lg:items-end">
          <WebsiteSearch id="websites-search" value={searchInput} onChange={setSearchInput} />
          {total > 0 ? (
            <p className="text-sm font-medium text-text-muted lg:text-right">
              {total} Website Design{total === 1 ? '' : 's'}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-5 md:mt-6">
        <WebsiteFilterToolbar
          view={view}
          category={category}
          onViewChange={setViewAndReset}
          onCategoryChange={setCategoryAndReset}
        />
      </div>

      <div className={cn('mt-6 md:mt-8', busy && 'opacity-80 transition-opacity')}>
        {isError && !data ? (
          <ProjectGridError onRetry={() => void refetch()} />
        ) : showGridSkeleton ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <ProjectGrid
            projects={items}
            eagerCount={3}
            priorityFirst
            busy={busy}
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

        {hasFilters && items.length === 0 && data ? (
          <p className="mt-4 text-center text-sm text-text-secondary">
            Need something custom?{' '}
            <Link href={ROUTES.consultation} className="font-semibold text-[#2563eb] hover:underline">
              Book a free consultation
            </Link>
          </p>
        ) : null}

        {remaining > 0 || items.length > 0 ? (
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
                      category,
                      view,
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
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: Math.min(3, remaining) }).map((_, i) => (
              <ProjectCardSkeleton key={`more-${i}`} />
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}
