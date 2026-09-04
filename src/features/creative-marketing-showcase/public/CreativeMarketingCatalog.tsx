'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ROUTES } from '@/lib/routes';
import { STALE_PUBLIC_LISTING } from '@/lib/query/client';
import { InlineSpinner } from '@/src/components/loading/InlineSpinner';
import {
  CREATIVE_MARKETING_GALLERY_PAGE_SIZE,
  CREATIVE_MORE_FILTERS,
  CREATIVE_PRIMARY_FILTERS,
  parseCreativeGroupParam,
  parseCreativeMoreParam,
  serializeCreativeMoreParam,
  type CreativeMoreFilterId,
} from '../config/constants';
import type { CreativeMarketingListResult } from '../types';
import { CreativeMarketingCard, CreativeMarketingCardSkeleton } from './CreativeMarketingCard';
import { CreativeMoreFiltersSheet } from './CreativeMoreFiltersSheet';

const LISTING_KEY = 'creative-marketing-listing' as const;

type CatalogFilters = {
  q: string;
  group: string;
  more: CreativeMoreFilterId[];
  page: number;
};

function listingQueryKey(filters: CatalogFilters & { pageSize: number }) {
  return [
    LISTING_KEY,
    {
      q: filters.q || '',
      group: filters.group || 'all',
      more: filters.more.slice().sort().join(','),
      page: filters.page,
      pageSize: filters.pageSize,
    },
  ] as const;
}

async function fetchListing(params: CatalogFilters & { pageSize: number }): Promise<CreativeMarketingListResult> {
  const search = new URLSearchParams();
  search.set('page', String(params.page));
  search.set('pageSize', String(params.pageSize));
  if (params.q) search.set('q', params.q);
  if (params.group && params.group !== 'all') search.set('group', params.group);
  const more = serializeCreativeMoreParam(params.more);
  if (more) search.set('more', more);
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
  return { q, group, more, page };
}

export function CreativeMarketingCatalog({
  initialFilters,
  initialData,
}: {
  initialFilters: {
    q: string;
    group?: string;
    serviceGroup?: string;
    more?: CreativeMoreFilterId[];
    page: number;
  };
  initialData: CreativeMarketingListResult;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const isExplore = pathname.includes('/explore');

  const normalizedInitial: CatalogFilters = {
    q: initialFilters.q || '',
    group: parseCreativeGroupParam(initialFilters.group, initialFilters.serviceGroup),
    more: initialFilters.more ?? [],
    page: initialFilters.page || 1,
  };

  const { q, group, more, page } = readFilters(searchParams, normalizedInitial);
  const pageSize = CREATIVE_MARKETING_GALLERY_PAGE_SIZE;
  const [searchInput, setSearchInput] = useState(q);

  const sanitizeParams = (params: URLSearchParams) => {
    params.delete('serviceGroup');
    if (isExplore) params.set('type', 'marketing');
    else params.delete('type');
  };

  useEffect(() => setSearchInput(q), [q]);

  useEffect(() => {
    if (isExplore) return;
    const handle = window.setTimeout(() => {
      const next = searchInput.trim();
      if (next === q) return;
      const params = new URLSearchParams(searchParams.toString());
      if (next) params.set('q', next);
      else params.delete('q');
      params.delete('page');
      sanitizeParams(params);
      const qs = params.toString();
      startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
    }, 300);
    return () => window.clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput, q, pathname, router, searchParams, isExplore]);

  const writeParams = (mutate: (params: URLSearchParams) => void, scroll = false) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    params.delete('page');
    sanitizeParams(params);
    const qs = params.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll }));
  };

  const writeGroup = (next: string) => {
    writeParams((params) => {
      if (next && next !== 'all') params.set('group', next);
      else params.delete('group');
    });
  };

  const writeMore = (next: CreativeMoreFilterId[]) => {
    writeParams((params) => {
      const serialized = serializeCreativeMoreParam(next);
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
      router.replace(
        isExplore ? `${pathname}?type=marketing` : ROUTES.creativeMarketingShowroom,
        { scroll: false }
      );
    });
  };

  const writePage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage > 1) params.set('page', String(nextPage));
    else params.delete('page');
    sanitizeParams(params);
    const qs = params.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: true }));
  };

  const queryKey = listingQueryKey({ q, group, more, page, pageSize });
  const matchesInitial =
    q === normalizedInitial.q &&
    group === normalizedInitial.group &&
    more.slice().sort().join(',') === normalizedInitial.more.slice().sort().join(',') &&
    page === normalizedInitial.page;

  const { data, isFetching, isError, isPending, refetch, isPlaceholderData, isLoading } = useQuery({
    queryKey,
    queryFn: () => fetchListing({ q, group, more, page, pageSize }),
    initialData: matchesInitial ? initialData : undefined,
    placeholderData: keepPreviousData,
    staleTime: STALE_PUBLIC_LISTING,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const hasFilters = Boolean(q || (group && group !== 'all') || more.length > 0);
  const showGridSkeleton = isPending || isLoading || (isFetching && isPlaceholderData);
  const showEmpty = !showGridSkeleton && !isError && items.length === 0;
  const showingFrom = items.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const showingTo = items.length === 0 ? 0 : showingFrom + items.length - 1;

  return (
    <>
      {!isExplore ? (
        <div className="mb-3 max-w-xl sm:mb-4">
          <label htmlFor="cm-catalog-search" className="sr-only">
            Search services
          </label>
          <input
            id="cm-catalog-search"
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search creative & marketing…"
            className="w-full rounded-xl border border-border-subtle bg-surface px-4 py-2.5 text-sm outline-none focus:border-[#2563eb]"
          />
        </div>
      ) : null}

      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-label={isExplore ? 'More filters' : 'Service type filters'}
      >
        {!isExplore
          ? CREATIVE_PRIMARY_FILTERS.map((item) => {
              const active = group === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => writeGroup(item.id)}
                  className={
                    active
                      ? 'rounded-full bg-[#0f2744] px-3.5 py-1.5 text-sm font-semibold text-white'
                      : 'rounded-full border border-border-subtle px-3.5 py-1.5 text-sm font-medium text-text-secondary hover:border-[#2563eb]/40'
                  }
                >
                  {item.label}
                </button>
              );
            })
          : null}
        <CreativeMoreFiltersSheet applied={more} onApply={writeMore} onClear={clearMore} />
      </div>

      {more.length > 0 ? (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {more.map((id) => {
            const label = CREATIVE_MORE_FILTERS.find((f) => f.id === id)?.label ?? id;
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
            {total} Service{total === 1 ? '' : 's'}
          </p>
        ) : null}

        {isError && !data ? (
          <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-16 text-center dark:border-white/15">
            <h3 className="font-display text-xl font-bold">Could not load services</h3>
            <button type="button" onClick={() => void refetch()} className="mt-4 text-sm font-semibold">
              Try again
            </button>
          </div>
        ) : showGridSkeleton ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3" aria-busy="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <CreativeMarketingCardSkeleton key={i} />
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
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.map((project, index) => (
              <CreativeMarketingCard
                key={project.id}
                project={project}
                eager={index < 3}
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
    </>
  );
}
