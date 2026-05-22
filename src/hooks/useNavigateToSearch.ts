import { useCallback } from 'react';
import { useStore } from '../store/useStore';

/** Single entry point for navbar, hero, modal, and quick tags */
export function useNavigateToSearch() {
  const navigateToSearch = useStore((s) => s.navigateToSearch);
  const setSearchQuery = useStore((s) => s.setSearchQuery);

  const goToSearch = useCallback(
    (query?: string) => {
      if (query !== undefined) setSearchQuery(query);
      navigateToSearch(query);
    },
    [navigateToSearch, setSearchQuery]
  );

  return { goToSearch };
}
