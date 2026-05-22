import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Grid3X3, List } from 'lucide-react';
import { useStore } from '../store/useStore';
import { searchCatalog } from '../data/searchCatalog';
import { allMarketplaceServices } from '../data/services';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import {
  DEFAULT_SEARCH_FILTERS,
  filterSearchCatalog,
  getRecommendedResults,
  sortSearchResults,
  getActiveFilterCount,
} from '../utils/searchFilter';
import { SearchCatalogItem } from '../types';
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
  const setPage = useStore((s) => s.setPage);
  const setSelectedService = useStore((s) => s.setSelectedService);
  const setSelectedSeller = useStore((s) => s.setSelectedSeller);
  const addToCart = useStore((s) => s.addToCart);

  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const debouncedQuery = useDebouncedValue(localQuery, 300);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setSearchQuery(debouncedQuery);
  }, [debouncedQuery, setSearchQuery]);

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
        setSelectedSeller(item.sellerId);
        setPage('seller-profile');
        return;
      }
      setSelectedService(item.service.id);
      setPage('service-detail');
    },
    [setPage, setSelectedSeller, setSelectedService]
  );

  const handleAddToCart = useCallback(
    (serviceId: string) => {
      const service = allMarketplaceServices.find((s) => s.id === serviceId);
      if (service) addToCart(service);
    },
    [addToCart]
  );

  return (
    <div className="min-h-screen pt-[4.5rem] md:pt-20 pb-16 bg-bridge-dark overflow-x-hidden">
      <div className="absolute top-24 right-0 w-96 h-96 bg-bridge-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-32 left-0 w-72 h-72 bg-bridge-cyan/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SearchHeroBar
          query={localQuery}
          onQueryChange={setLocalQuery}
          onSearch={() => setSearchQuery(localQuery)}
          onGoHome={() => setPage('home')}
        />

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">
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
                <p className="text-sm text-white font-medium">
                  <span className="text-bridge-primary-light">{results.length}</span> results
                  {hasQuery && (
                    <span className="text-bridge-gray">
                      {' '}
                      for &quot;<span className="text-white">{debouncedQuery}</span>&quot;
                    </span>
                  )}
                  {!hasQuery && (
                    <span className="text-bridge-gray"> — featured & recommended</span>
                  )}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <MobileFilterButton
                  onClick={() => setMobileFiltersOpen(true)}
                  activeCount={activeFilterCount}
                />
                <SearchSortDropdown value={sortBy} onChange={setSortBy} />
                <div className="flex items-center gap-1 p-1 glass rounded-xl border border-white/10">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-bridge-primary/40 ${
                      viewMode === 'grid' ? 'bg-bridge-primary text-white' : 'text-bridge-gray hover:text-white'
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-bridge-primary/40 ${
                      viewMode === 'list' ? 'bg-bridge-primary text-white' : 'text-bridge-gray hover:text-white'
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
                onBrowseCategories={() => setPage('categories')}
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
