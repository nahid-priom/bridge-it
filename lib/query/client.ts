import { QueryClient, defaultShouldDehydrateQuery, isServer } from '@tanstack/react-query';

/** Long-lived reference data (categories, page types, industries). */
export const STALE_REFERENCE = 30 * 60_000;
/** Public project listings and cards. */
export const STALE_PUBLIC_LISTING = 60_000;
/** Admin live tables / KPIs. */
export const STALE_ADMIN_LIVE = 15_000;

export const SHOWCASE_LISTING_KEY = 'showcase-listing' as const;

export function showcaseListingQueryKey(filters: {
  q?: string;
  category?: string;
  view?: string;
  limit?: number;
  offset?: number;
}) {
  return [
    SHOWCASE_LISTING_KEY,
    {
      q: filters.q || '',
      category: filters.category || 'all',
      view: filters.view || 'all',
      limit: filters.limit ?? 24,
      offset: filters.offset ?? 0,
    },
  ] as const;
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_PUBLIC_LISTING,
        gcTime: 5 * 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
        // Avoid immediate refetch after SSR hydration when data is still fresh
        refetchOnMount: false,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

export function createQueryClient() {
  return makeQueryClient();
}
