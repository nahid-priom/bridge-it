import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Grid3X3, List, Home, Package } from 'lucide-react';
import { useStore } from '../store/useStore';
import { allMarketplaceServices } from '../data/services';
import { getProductListings, filterProducts, sortProducts } from '../utils/productFilter';
import { getActiveFilterCount } from '../utils/searchFilter';
import { ProductCategoryFilter, SearchFilters, DEFAULT_SEARCH_FILTERS } from '../types';
import { ProductCard } from './products/ProductCard';
import { ProductFilterSidebar } from './products/ProductFilterSidebar';
import { MobileSearchFilterDrawer, MobileFilterButton } from './search/MobileSearchFilterDrawer';
import { SearchSortDropdown } from './search/SearchSortDropdown';
import { ActiveFilterChips } from './search/ActiveFilterChips';
import { SearchEmptyState } from './search/SearchEmptyState';
import { SearchSkeletonCard } from './search/SearchSkeletonCard';

const PRODUCT_TABS: { id: ProductCategoryFilter; label: string }[] = [
  { id: 'all', label: 'All Products' },
  { id: 'digital-products', label: 'Digital Products' },
  { id: 'courses', label: 'Courses' },
  { id: 'templates', label: 'Templates' },
  { id: 'scripts', label: 'Scripts' },
  { id: 'ui-kits', label: 'UI Kits' },
  { id: 'marketing-assets', label: 'Marketing Assets' },
];

const allProducts = getProductListings(allMarketplaceServices);

export const ProductsPage: React.FC = () => {
  const {
    searchFilters,
    setSearchFilters,
    updateSearchFilter,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    resetFilters,
    setPage,
    setSelectedService,
    addToCart,
  } = useStore();

  const [productCategory, setProductCategory] = useState<ProductCategoryFilter>('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 150);
    return () => window.clearTimeout(t);
  }, [searchFilters, sortBy, productCategory]);

  const results = useMemo(() => {
    const filtered = filterProducts(allProducts, productCategory, searchFilters);
    return sortProducts(filtered, sortBy);
  }, [searchFilters, sortBy, productCategory]);

  const activeFilterCount = getActiveFilterCount(searchFilters);

  const handleClearFilters = useCallback(() => {
    resetFilters();
    setProductCategory('all');
  }, [resetFilters]);

  const handleRemoveFilter = (key: keyof SearchFilters | 'price' | 'clear') => {
    if (key === 'clear') {
      handleClearFilters();
      return;
    }
    if (key === 'price') {
      setSearchFilters({ ...searchFilters, priceMin: 0, priceMax: 200000 });
      return;
    }
    updateSearchFilter(key, DEFAULT_SEARCH_FILTERS[key]);
  };

  const handleViewDetails = useCallback(
    (id: string) => {
      setSelectedService(id);
      setPage('service-detail');
    },
    [setSelectedService, setPage]
  );

  const handleAddToCart = useCallback(
    (product: (typeof allProducts)[0]) => addToCart(product),
    [addToCart]
  );

  return (
    <div className="min-h-screen pt-[4.5rem] md:pt-20 pb-16 bg-bridge-dark overflow-x-hidden">
      <div className="absolute top-20 left-1/4 w-80 h-80 bg-bridge-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <button
          onClick={() => setPage('home')}
          className="flex items-center gap-2 text-bridge-gray hover:text-white transition-colors mb-4 cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-bridge-primary/40 rounded-lg"
        >
          <Home className="w-4 h-4" /> Back to Home
        </button>

        <div className="glass-card rounded-2xl p-5 md:p-6 border border-white/10 mb-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-bridge-primary/20 border border-bridge-primary/30">
              <Package className="w-8 h-8 text-bridge-primary-light" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-display text-white">
                Digital <span className="gradient-text">Products</span>
              </h1>
              <p className="text-sm text-bridge-gray mt-1 max-w-2xl">
                Templates, courses, UI kits, scripts, and downloadable marketing assets — instant delivery on select items.
              </p>
              <p className="text-xs text-bridge-primary-light mt-2">
                {allProducts.length}+ products · Escrow & protected files available
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-5">
            {PRODUCT_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setProductCategory(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-bridge-primary/30 ${
                  productCategory === tab.id
                    ? 'bg-bridge-primary text-white'
                    : 'bg-bridge-dark-2 text-bridge-gray hover:text-white border border-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <ProductFilterSidebar
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

          <main className="flex-1 min-w-0">
            <ActiveFilterChips
              filters={searchFilters}
              onRemove={handleRemoveFilter}
              onClearAll={handleClearFilters}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <p className="text-sm text-white font-medium">
                <span className="text-bridge-primary-light">{results.length}</span> products
              </p>
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
                      viewMode === 'grid' ? 'bg-bridge-primary text-white' : 'text-bridge-gray'
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-bridge-primary/40 ${
                      viewMode === 'list' ? 'bg-bridge-primary text-white' : 'text-bridge-gray'
                    }`}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                    : 'space-y-4'
                }
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <SearchSkeletonCard key={i} />
                ))}
              </div>
            ) : results.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                    : 'flex flex-col gap-4'
                }
              >
                {results.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <SearchEmptyState
                query=""
                onBrowseCategories={() => setPage('categories')}
                onClearSearch={handleClearFilters}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
