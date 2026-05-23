'use client';

import { useCallback } from 'react';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { useStore } from '@/store/useStore';

/** Single entry point for navbar, hero, modal, and quick tags */
export function useNavigateToSearch() {
  const { goToSearch } = useAppNavigation();
  const setSearchQuery = useStore((s) => s.setSearchQuery);

  const navigateToSearch = useCallback(
    (query?: string) => {
      if (query !== undefined) setSearchQuery(query);
      goToSearch(query);
    },
    [goToSearch, setSearchQuery]
  );

  return { goToSearch: navigateToSearch };
}
