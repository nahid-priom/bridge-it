'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type CatalogResultsContextValue = {
  liveTotal: number | null;
  setLiveTotal: (total: number | null) => void;
};

const CatalogResultsContext = createContext<CatalogResultsContextValue | null>(null);

export function CatalogResultsProvider({
  children,
  initialTotal = null,
}: {
  children: ReactNode;
  initialTotal?: number | null;
}) {
  const [liveTotal, setLiveTotalState] = useState<number | null>(initialTotal);
  const setLiveTotal = useCallback((total: number | null) => {
    setLiveTotalState(total);
  }, []);

  useEffect(() => {
    setLiveTotalState(initialTotal);
  }, [initialTotal]);

  const value = useMemo(
    () => ({ liveTotal, setLiveTotal }),
    [liveTotal, setLiveTotal]
  );

  return (
    <CatalogResultsContext.Provider value={value}>{children}</CatalogResultsContext.Provider>
  );
}

export function useCatalogResults() {
  return useContext(CatalogResultsContext);
}

/** Catalogs report live totals so the toolbar count stays accurate after filters. */
export function useReportCatalogTotal(total: number | undefined, ready: boolean) {
  const ctx = useCatalogResults();
  const setLiveTotal = ctx?.setLiveTotal;

  useEffect(() => {
    if (!setLiveTotal) return;
    if (ready && typeof total === 'number') setLiveTotal(total);
  }, [ready, total, setLiveTotal]);
}
