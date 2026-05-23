'use client';

import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { ProductsPageHeader } from './ProductsPageHeader';
import { useStore } from '@/store/useStore';
import { findCategoryInList } from '@/lib/products/url';
import { productToService } from '@/lib/products/adapter';
import {
  parseProductsSearchParams,
  buildProductsHref,
  searchParamsToRecord,
  DEFAULT_PRODUCTS_PAGE_STATE,
  type ProductsPageState,
} from '@/lib/products/url';
import type { Product, ProductCategory, ProductListingFilters } from '@/types/product';
import { ProductCard } from './ProductCard';
import { ProductFilterSidebar } from './ProductFilterSidebar';
import { CategoryRail } from './CategoryRail';
import { ProductsToolbar } from './ProductsToolbar';
import { ProductListingFilterChips } from './ProductListingFilterChips';
import { MobileProductFilterDrawer } from './MobileProductFilterDrawer';
import { ProductsEmptyState } from './ProductsEmptyState';
import { SearchSkeletonCard } from '../search/SearchSkeletonCard';
function countActiveFilters(filters: ProductListingFilters, q: string): number {
  let n = 0;
  if (filters.priceMin > 0 || filters.priceMax < 200000) n += 1;
  if (filters.minRating > 0) n += 1;
  if (filters.deliveryTime !== 'all') n += 1;
  if (filters.sellerLevel !== 'all') n += 1;
  if (filters.featuredOnly) n += 1;
  if (filters.promotedOnly) n += 1;
  if (filters.verifiedOnly) n += 1;
  if (q) n += 1;
  return n;
}

interface ProductsListingProps {
  initialState?: ProductsPageState;
  products: Product[];
  resultCount: number;
  categories: ProductCategory[];
  categoryCounts: Record<string, number>;
}

export const ProductsListing: React.FC<ProductsListingProps> = ({
  initialState,
  products,
  resultCount,
  categories,
  categoryCounts,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addToCart = useStore((s) => s.addToCart);
  const viewMode = useStore((s) => s.viewMode);
  const setViewMode = useStore((s) => s.setViewMode);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const state = useMemo(() => {
    const record = searchParamsToRecord(searchParams);
    const parsed = parseProductsSearchParams(record);
    if (!searchParams.toString() && initialState) return initialState;
    return parsed;
  }, [searchParams, initialState]);

  const results = products;

  const category = useMemo(
    () => findCategoryInList(categories, state.categoryKey),
    [categories, state.categoryKey]
  );

  const activeFilterCount = useMemo(
    () => countActiveFilters(state.filters, state.q),
    [state.filters, state.q]
  );

  const pushState = useCallback(
    (next: ProductsPageState, replace = true) => {
      const href = buildProductsHref(next);
      if (replace) router.replace(href);
      else router.push(href);
    },
    [router]
  );

  const handleClearFilters = useCallback(() => {
    pushState({
      ...DEFAULT_PRODUCTS_PAGE_STATE,
      categoryKey: state.categoryKey,
    });
  }, [pushState, state.categoryKey]);

  const handleFiltersChange = useCallback(
    (filters: ProductListingFilters) => {
      pushState({ ...state, filters });
    },
    [pushState, state]
  );

  const handleRemoveFilter = useCallback(
    (key: 'price' | 'rating' | 'delivery' | 'seller' | 'featured' | 'promoted' | 'verified' | 'q' | 'clear') => {
      if (key === 'clear') {
        handleClearFilters();
        return;
      }
      if (key === 'q') {
        pushState({ ...state, q: '' });
        return;
      }
      if (key === 'price') {
        pushState({
          ...state,
          filters: { ...state.filters, priceMin: 0, priceMax: 200000 },
        });
        return;
      }
      if (key === 'rating') {
        pushState({ ...state, filters: { ...state.filters, minRating: 0 } });
        return;
      }
      if (key === 'delivery') {
        pushState({ ...state, filters: { ...state.filters, deliveryTime: 'all' } });
        return;
      }
      if (key === 'seller') {
        pushState({ ...state, filters: { ...state.filters, sellerLevel: 'all' } });
        return;
      }
      if (key === 'featured') {
        pushState({ ...state, filters: { ...state.filters, featuredOnly: false } });
        return;
      }
      if (key === 'promoted') {
        pushState({ ...state, filters: { ...state.filters, promotedOnly: false } });
        return;
      }
      if (key === 'verified') {
        pushState({ ...state, filters: { ...state.filters, verifiedOnly: false } });
      }
    },
    [handleClearFilters, pushState, state]
  );

  const handleSortChange = useCallback(
    (sort: ProductsPageState['sort']) => {
      pushState({ ...state, sort });
    },
    [pushState, state]
  );

  useEffect(() => {
    setLoading(true);
    const t = window.setTimeout(() => setLoading(false), 140);
    return () => window.clearTimeout(t);
  }, [searchParams]);

  const handleAddToCart = useCallback(
    (product: (typeof results)[0]) => addToCart(productToService(product)),
    [addToCart]
  );

  const hasFilterChips =
    state.q ||
    state.filters.minRating > 0 ||
    state.filters.priceMin > 0 ||
    state.filters.priceMax < 200000 ||
    state.filters.deliveryTime !== 'all' ||
    state.filters.sellerLevel !== 'all' ||
    state.filters.featuredOnly ||
    state.filters.promotedOnly ||
    state.filters.verifiedOnly;

  const gridClass =
    viewMode === 'grid'
      ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
      : 'flex flex-col gap-4';

  return (
    <div className="min-h-screen pb-16 bg-background">
      <div className="absolute top-8 left-1/4 w-80 h-80 bg-bridge-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container  mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ProductsPageHeader
          categories={categories}
          resultCount={resultCount}
          totalCatalogHint={categoryCounts.all}
        />

        <CategoryRail
          activeCategory={state.categoryKey}
          categories={categories}
          categoryCounts={categoryCounts}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[320px_1fr] gap-6 lg:gap-8 items-start">
          <aside className="hidden lg:block min-w-0">
            <ProductFilterSidebar
              filters={state.filters}
              onChange={handleFiltersChange}
              onClearAll={handleClearFilters}
            />
          </aside>

          <section className="min-w-0 max-w-full overflow-x-clip" aria-label="Products list">
            <MobileProductFilterDrawer
              open={mobileFiltersOpen}
              onClose={() => setMobileFiltersOpen(false)}
              filters={state.filters}
              onChange={handleFiltersChange}
              onClearAll={handleClearFilters}
              activeCount={activeFilterCount}
            />

            <ProductsToolbar
              resultCount={resultCount}
              categoryLabel={category?.label ?? null}
              sort={state.sort}
              onSortChange={handleSortChange}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onOpenFilters={() => setMobileFiltersOpen(true)}
              activeFilterCount={activeFilterCount}
              filterChips={
                hasFilterChips ? (
                  <ProductListingFilterChips
                    q={state.q}
                    filters={state.filters}
                    onRemove={handleRemoveFilter}
                    onClearAll={handleClearFilters}
                  />
                ) : undefined
              }
            />

            {loading ? (
              <div className={gridClass} aria-busy="true" aria-label="Loading products">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SearchSkeletonCard key={i} />
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className={gridClass}>
                {results.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    onAddToCart={handleAddToCart}
                    priorityImage={index < 4}
                  />
                ))}
              </div>
            ) : (
              <ProductsEmptyState
                query={state.q}
                categories={categories}
                onClearFilters={handleClearFilters}
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
