'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { cn } from '@/lib/cn';
import { FieldSelect } from '@/components/ui/FieldSelect';
import { ROUTES } from '@/lib/routes';
import { STALE_PUBLIC_LISTING, showcaseListingQueryKey } from '@/lib/query/client';
import { ProjectCardSkeleton } from '@/src/components/skeletons/ProjectCardSkeleton';
import { ProjectGridError } from '@/src/components/skeletons/section-errors';
import { useDelayedLoading } from '@/src/components/skeletons/useDelayedLoading';
import { InlineSpinner } from '@/src/components/loading/InlineSpinner';
import { LISTING_CATEGORIES, LISTING_VIEW_TABS } from '../config/constants';
import type { ShowcaseListResult } from '../types';
import { ProjectGrid } from './ProjectGrid';
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
  initialFilters,
  initialData,
}: {
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

  // Sync when RSC re-renders with new searchParams (soft nav / shared URL)
  useEffect(() => {
    setView(initialFilters.view);
    setCategory(initialFilters.category);
    setQ(initialFilters.q);
    setSearchInput(initialFilters.q);
    setExtraItems([]);
  }, [initialFilters.view, initialFilters.category, initialFilters.q]);

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

  return (
    <>
      <div className="mt-6 md:hidden">
        <label className="sr-only" htmlFor="websites-search-mobile">
          Search website designs
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            id="websites-search-mobile"
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search website designs..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-text-primary outline-none ring-emerald-600/30 placeholder:text-text-muted focus:ring-2 dark:border-white/10 dark:bg-white/5"
          />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="-mx-4 overflow-x-auto px-4 scrollbar-none">
          <div className="flex w-max gap-2">
            {LISTING_VIEW_TABS.map((tab) => {
              const active = view === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setView(tab.id)}
                  className={cn(
                    'shrink-0 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors',
                    active
                      ? 'bg-[#0f2744] text-white dark:bg-emerald-600'
                      : 'bg-slate-100 text-text-secondary hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10'
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="md:hidden">
            <label className="sr-only" htmlFor="websites-category">
              Category
            </label>
            <FieldSelect
              id="websites-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="py-2.5 font-medium"
            >
              {LISTING_CATEGORIES.map((item) => (
                <option key={item.id} value={item.slug ?? 'all'}>
                  {item.label}
                </option>
              ))}
            </FieldSelect>
          </div>

          <div className="hidden md:flex md:flex-wrap md:gap-1.5">
            {LISTING_CATEGORIES.map((item) => {
              const value = item.slug ?? 'all';
              const active = category === value;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCategory(value)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors',
                    active
                      ? 'bg-emerald-700 text-white'
                      : 'text-text-secondary hover:bg-slate-100 dark:hover:bg-white/5'
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="hidden md:block md:w-72 lg:w-80">
            <label className="sr-only" htmlFor="websites-search">
              Search website designs
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                id="websites-search"
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search website designs..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-text-primary outline-none ring-emerald-600/30 placeholder:text-text-muted focus:ring-2 dark:border-white/10 dark:bg-white/5"
              />
            </div>
          </div>
        </div>
      </div>

      <div className={cn('mt-8', busy && 'opacity-80 transition-opacity')}>
        {isError && !data ? (
          <ProjectGridError onRetry={() => void refetch()} />
        ) : showGridSkeleton ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
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
            <Link href={ROUTES.consultation} className="font-semibold text-emerald-700 hover:underline">
              Book a free consultation
            </Link>
          </p>
        ) : null}

        {remaining > 0 ? (
          <div className="mt-8 space-y-6">
            {loadingMore ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
                {Array.from({ length: Math.min(3, remaining) }).map((_, i) => (
                  <ProjectCardSkeleton key={`more-${i}`} />
                ))}
              </div>
            ) : null}
            <div className="text-center">
              <button
                type="button"
                disabled={loadingMore}
                aria-busy={loadingMore || undefined}
                className="inline-flex min-w-[10.5rem] items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold disabled:opacity-60 dark:border-white/15"
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
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
