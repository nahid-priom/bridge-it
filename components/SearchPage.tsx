'use client';

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Grid3X3, List } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { searchUrl } from '@/lib/routes';
import { getSellerSlugById } from '@/lib/sellers';
import { searchCatalog } from '@/data/searchCatalog';
import { allMarketplaceServices } from '@/data/services';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import {
  DEFAULT_SEARCH_FILTERS,
  filterSearchCatalog,
  getRecommendedResults,
  sortSearchResults,
  getActiveFilterCount,
} from '@/lib/searchFilter';
import { SearchCatalogItem } from '@/types';
import { SearchHeroBar } from './search/SearchHeroBar';
import { SearchFilterSidebar } from './search/SearchFilterSidebar';
import { MobileSearchFilterDrawer, MobileFilterButton } from './search/MobileSearchFilterDrawer';
import { SearchResultGrid } from './search/SearchResultGrid';
import { SearchSortDropdown } from './search/SearchSortDropdown';
import { SearchEmptyState } from './search/SearchEmptyState';
import { ActiveFilterChips } from './search/ActiveFilterChips';

export const SearchPage: React.FC = () => {
  const searchQuery = useStore((s) => s.searchQuery);
  const searchFilters = useStore((s) => s.searchFilters);
  const sortBy = useStore((s) => s.sortBy);
  const viewMode = useStore((s) => s.viewMode);
  const setSearchQuery = useStore((s) => s.setSearchQuery);
  const setSearchFilters = useStore((s) => s.setSearchFilters);
  const updateSearchFilter = useStore((s) => s.updateSearchFilter);
  const setSortBy = useStore((s) => s.setSortBy);
  const setViewMode = useStore((s) => s.setViewMode);
  const resetFilters = useStore((s) => s.resetFilters);
  const addToCart = useStore((s) => s.addToCart);
  const { goToCategories, goToService, goToSeller } = useAppNavigation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlQuery = searchParams.get('q') ?? '';

  const [localQuery, setLocalQuery] = useState(urlQuery || searchQuery);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const debouncedQuery = useDebouncedValue(localQuery, 300);

  useEffect(() => {
    const q = urlQuery || searchQuery;
    setLocalQuery(q);
    if (urlQuery && urlQuery !== searchQuery) {
      setSearchQuery(urlQuery);
    }
  }, [urlQuery, searchQuery, setSearchQuery]);

  useEffect(() => {
    setSearchQuery(debouncedQuery);
    if (debouncedQuery.trim() === urlQuery.trim()) return;
    router.replace(searchUrl(debouncedQuery), { scroll: false });
  }, [debouncedQuery, setSearchQuery, router, urlQuery]);

  useEffect(() => {
    setIsFiltering(true);
    const t = window.setTimeout(() => setIsFiltering(false), 200);
    return () => window.clearTimeout(t);
  }, [debouncedQuery, searchFilters, sortBy]);

  const hasQuery = debouncedQuery.trim().length > 0;

  const results = useMemo(() => {
    const filtered = hasQuery
      ? filterSearchCatalog(searchCatalog, debouncedQuery, searchFilters)
      : filterSearchCatalog(getRecommendedResults(searchCatalog), '', searchFilters);
    return sortSearchResults(filtered, sortBy);
  }, [debouncedQuery, searchFilters, sortBy, hasQuery]);

  const activeFilterCount = getActiveFilterCount(searchFilters);

  const handleClearFilters = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  const handleRemoveFilter = useCallback(
    (key: keyof typeof searchFilters | 'price' | 'clear') => {
      if (key === 'clear') {
        handleClearFilters();
        return;
      }
      if (key === 'price') {
        setSearchFilters({ ...searchFilters, priceMin: 0, priceMax: 200000 });
        return;
      }
      updateSearchFilter(key, DEFAULT_SEARCH_FILTERS[key]);
    },
    [handleClearFilters, searchFilters, setSearchFilters, updateSearchFilter]
  );

  const handleViewDetails = useCallback(
    (item: SearchCatalogItem) => {
      if (item.kind === 'seller') {
        const sellerSlug = getSellerSlugById(item.sellerId);
        if (sellerSlug) goToSeller(sellerSlug);
        return;
      }
      goToService(item.service);
    },
    [goToSeller, goToService]
  );

  const handleAddToCart = useCallback(
    (serviceId: string) => {
      const service = allMarketplaceServices.find((s) => s.id === serviceId);
      if (service) addToCart(service);
    },
    [addToCart]
  );

  return (
    <div className="min-h-screen pb-16 bg-background overflow-x-hidden">
      <div className="absolute top-8 right-0 w-96 h-96 bg-bridge-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-32 left-0 w-72 h-72 bg-bridge-cyan/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container  mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SearchHeroBar
          query={localQuery}
          onQueryChange={setLocalQuery}
          onSearch={() => router.push(searchUrl(localQuery))}
        />

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-[calc(var(--below-header)+4.5rem)] max-h-[calc(100vh-var(--below-header)-5rem)] overflow-y-auto pr-1">
              <SearchFilterSidebar
                filters={searchFilters}
                onChange={setSearchFilters}
                onClearAll={handleClearFilters}
              />
            </div>
          </div>

          <MobileSearchFilterDrawer
            open={mobileFiltersOpen}
            onClose={() => setMobileFiltersOpen(false)}
            filters={searchFilters}
            onChange={setSearchFilters}
            onClearAll={handleClearFilters}
            activeCount={activeFilterCount}
          />

          <main className="flex-1 min-w-0 animate-slide-up">
            <ActiveFilterChips
              filters={searchFilters}
              onRemove={handleRemoveFilter}
              onClearAll={handleClearFilters}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div className="min-w-0">
                <p className="text-sm text-text-primary font-medium">
                  <span className="text-bridge-primary-light">{results.length}</span> results
                  {hasQuery && (
                    <span className="text-text-muted">
                      {' '}
                      for &quot;<span className="text-text-primary">{debouncedQuery}</span>&quot;
                    </span>
                  )}
                  {!hasQuery && (
                    <span className="text-text-muted"> — featured & recommended</span>
                  )}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <MobileFilterButton
                  onClick={() => setMobileFiltersOpen(true)}
                  activeCount={activeFilterCount}
                />
                <SearchSortDropdown value={sortBy} onChange={setSortBy} />
                <div className="flex items-center gap-1 p-1 glass rounded-xl border border-border-subtle">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-bridge-primary/40 ${
                      viewMode === 'grid' ? 'bg-bridge-primary text-white' : 'text-text-muted hover:text-text-primary'
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-bridge-primary/40 ${
                      viewMode === 'list' ? 'bg-bridge-primary text-white' : 'text-text-muted hover:text-text-primary'
                    }`}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {results.length > 0 ? (
              <SearchResultGrid
                items={results}
                viewMode={viewMode}
                loading={isFiltering}
                onViewDetails={handleViewDetails}
                onAddToCart={handleAddToCart}
              />
            ) : (
              <SearchEmptyState
                query={debouncedQuery}
                onBrowseCategories={goToCategories}
                onClearSearch={() => {
                  setLocalQuery('');
                  setSearchQuery('');
                  handleClearFilters();
                }}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
