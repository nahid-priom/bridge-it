'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useStore } from '@/store/useStore';
import {
  buildSearchUrl,
  DEFAULT_SEARCH_PARAMS,
  parseSearchParams,
} from '@/lib/search/searchHelpers';
import type { MarketplaceSearchParams } from '@/lib/search/types';

/**
 * Unified marketplace search state — URL is source of truth, Zustand mirrors `q` for hero/modal.
 */
export function useMarketplaceSearchState() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSearchQuery = useStore((s) => s.setSearchQuery);

  const urlState = useMemo(
    () => parseSearchParams(searchParams),
    [searchParams]
  );

  const [inputValue, setInputValue] = useState(urlState.q);
  const debouncedInput = useDebouncedValue(inputValue, 300);

  useEffect(() => {
    setInputValue(urlState.q);
    setSearchQuery(urlState.q);
  }, [urlState.q, setSearchQuery]);

  const pushState = useCallback(
    (patch: Partial<MarketplaceSearchParams>, options?: { replace?: boolean }) => {
      const next: MarketplaceSearchParams = {
        ...urlState,
        ...patch,
        page: patch.page ?? (patch.q !== undefined || patch.category !== undefined ? 1 : urlState.page),
      };
      const href = buildSearchUrl(next);
      if (options?.replace) router.replace(href);
      else router.push(href);
    },
    [router, urlState]
  );

  const submitSearch = useCallback(() => {
    const q = inputValue.trim();
    setSearchQuery(q);
    pushState({ q, page: 1 });
  }, [inputValue, pushState, setSearchQuery]);

  const resetSearch = useCallback(() => {
    setInputValue('');
    setSearchQuery('');
    router.push(buildSearchUrl(DEFAULT_SEARCH_PARAMS));
  }, [router, setSearchQuery]);

  const clearQuery = useCallback(() => {
    setInputValue('');
    setSearchQuery('');
    pushState({ q: '', page: 1 });
  }, [pushState, setSearchQuery]);

  return {
    urlState,
    inputValue,
    setInputValue,
    debouncedInput,
    pushState,
    submitSearch,
    resetSearch,
    clearQuery,
  };
}
