'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { unlockBodyScroll } from '@/hooks/useBodyScrollLock';
import { useStore } from '@/store/useStore';
import { AnimatePresence, motion } from 'framer-motion';
import type { MarketplaceService } from '@/types/marketplace';
import type { MarketplaceSellerSummary } from '@/types/marketplaceSeller';
import {
  filterMarketplaceServices,
  formatQueryLabel,
  paginateServices,
  SEARCH_PAGE_SIZE,
  sortMarketplaceServices,
} from '@/lib/search/searchHelpers';
import { useMarketplaceSearchState } from '@/lib/search/searchState';
import type { ActiveFilterChip, MarketplaceSearchParams } from '@/lib/search/types';
import { MAIN_CATEGORY_BY_SLUG } from '@/constants/mainMarketplaceCategories';
import { SearchCategoryHero } from '@/components/search/SearchCategoryHero';
import { FilterBar } from '@/components/search/FilterBar';
import { MobileFilterSheet } from '@/components/search/MobileFilterSheet';
import { ServiceCard } from '@/components/search/ServiceCard';
import { SidebarWidgets } from '@/components/search/SidebarWidgets';
import { SearchPagination } from '@/components/search/SearchPagination';
import { FreelancerCarousel } from '@/components/search/FreelancerCarousel';
import { WhyChooseSection } from '@/components/search/WhyChooseSection';
import { BRANDING } from '@/lib/config/branding';

type MarketplaceSearchPageProps = {
  services: MarketplaceService[];
  topSellers?: MarketplaceSellerSummary[];
  initialQuery?: string;
};

function buildActiveChips(urlState: MarketplaceSearchParams): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];
  if (urlState.category !== 'all') {
    const cat = MAIN_CATEGORY_BY_SLUG[urlState.category];
    chips.push({ id: 'category', label: cat?.name ?? urlState.category });
  }
  if (urlState.budget !== 'all') {
    const labels: Record<string, string> = {
      'under-15k': 'Under ৳15,000',
      '15k-50k': '৳15k – ৳50k',
      '50k-150k': '৳50k – ৳150k',
      '150k-plus': '৳150,000+',
    };
    chips.push({ id: 'budget', label: labels[urlState.budget] ?? urlState.budget });
  }
  if (urlState.delivery !== 'all') {
    const labels: Record<string, string> = {
      '1-7': '1–7 days delivery',
      '8-21': '8–21 days delivery',
      '22-plus': '22+ days delivery',
    };
    chips.push({ id: 'delivery', label: labels[urlState.delivery] ?? urlState.delivery });
  }
  if (urlState.rating !== 'all') {
    chips.push({ id: 'rating', label: `${urlState.rating}+ rating` });
  }
  return chips;
}

export function MarketplaceSearchPage({
  services,
  topSellers = [],
  initialQuery = '',
}: MarketplaceSearchPageProps) {
  const {
    urlState,
    inputValue,
    setInputValue,
    pushState,
    submitSearch,
    resetSearch,
    clearQuery,
  } = useMarketplaceSearchState();

  const queryLabel = useMemo(
    () => formatQueryLabel(urlState.q || initialQuery),
    [urlState.q, initialQuery]
  );

  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    useStore.getState().closeSearchModal();
    unlockBodyScroll();
    setMobileFiltersOpen(false);
  }, [searchParams]);

  useEffect(() => {
    document.title = urlState.q
      ? `Results for "${queryLabel}" | ${BRANDING.appName}`
      : `Search Solutions | ${BRANDING.appName}`;
  }, [queryLabel, urlState.q]);

  const filtered = useMemo(() => {
    const list = filterMarketplaceServices(services, urlState);
    if (urlState.q.trim()) return list;
    return sortMarketplaceServices(list, urlState.sort);
  }, [services, urlState]);

  const { items: pageItems, totalPages, page: safePage, total } = useMemo(
    () => paginateServices(filtered, urlState.page, SEARCH_PAGE_SIZE),
    [filtered, urlState.page]
  );

  const chips = useMemo(() => buildActiveChips(urlState), [urlState]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const removeChip = useCallback(
    (id: string) => {
      if (id === 'category') pushState({ category: 'all' });
      if (id === 'budget') pushState({ budget: 'all' });
      if (id === 'delivery') pushState({ delivery: 'all' });
      if (id === 'rating') pushState({ rating: 'all' });
    },
    [pushState]
  );

  const clearChips = useCallback(() => {
    pushState({ category: 'all', budget: 'all', delivery: 'all', rating: 'all' });
  }, [pushState]);

  const featuredWhenEmpty = useMemo(
    () => sortMarketplaceServices(services, 'recommended').slice(0, SEARCH_PAGE_SIZE),
    [services]
  );

  const hasActiveFilters =
    Boolean(urlState.q.trim()) ||
    urlState.category !== 'all' ||
    urlState.budget !== 'all' ||
    urlState.delivery !== 'all' ||
    urlState.rating !== 'all';

  const displayItems = hasActiveFilters ? pageItems : featuredWhenEmpty;

  return (
    <div className="min-h-screen bg-background">
      <SearchCategoryHero
        queryLabel={queryLabel}
        searchValue={inputValue}
        category={urlState.category}
        onSearchChange={setInputValue}
        onCategoryChange={(category) => pushState({ category })}
        onSubmit={submitSearch}
        onClear={clearQuery}
        onChipSelect={(chipQuery) => {
          setInputValue(chipQuery);
          pushState({ q: chipQuery, page: 1 });
        }}
        highlightQuery={urlState.q}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FilterBar
          sort={urlState.sort}
          onSortChange={(sort) => pushState({ sort })}
          category={urlState.category}
          onCategoryChange={(category) => pushState({ category })}
          budget={urlState.budget}
          onBudgetChange={(budget) => pushState({ budget })}
          delivery={urlState.delivery}
          onDeliveryChange={(delivery) => pushState({ delivery })}
          rating={urlState.rating}
          onRatingChange={(rating) => pushState({ rating })}
          chips={chips}
          onRemoveChip={removeChip}
          onClearChips={clearChips}
          resultCount={total}
          onOpenMobileFilters={() => setMobileFiltersOpen(true)}
        />

        <div className="flex flex-col xl:flex-row gap-8 py-3">
          <div className="flex-1 min-w-0">
            {displayItems.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-5">
                  <AnimatePresence mode="popLayout">
                    {displayItems.map((service) => (
                      <motion.div
                        key={service.id}
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ServiceCard
                          service={service}
                          isFavorite={favorites.has(service.id)}
                          onToggleFavorite={toggleFavorite}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                {hasActiveFilters && totalPages > 1 && (
                  <SearchPagination
                    page={safePage}
                    totalPages={totalPages}
                    onPageChange={(p) => {
                      pushState({ page: p });
                    }}
                  />
                )}
              </>
            ) : (
              <div className="py-16 text-center">
                <p className="text-lg font-bold text-text-primary mb-2">No services found</p>
                <p className="text-sm text-text-muted mb-4">
                  Try a different keyword or clear your filters.
                </p>
                <button
                  type="button"
                  onClick={resetSearch}
                  className="px-5 py-2.5 rounded-xl deshi-btn-primary text-sm font-bold"
                >
                  Reset search
                </button>
              </div>
            )}
          </div>

          <div className="xl:w-[300px] 2xl:w-[320px] shrink-0">
            <div className="xl:sticky xl:top-[calc(var(--header-offset)+5rem)]">
              <SidebarWidgets services={services} topSellers={topSellers} />
            </div>
          </div>
        </div>
      </div>

      <FreelancerCarousel sellers={topSellers} />
      <WhyChooseSection />

      <MobileFilterSheet
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        sort={urlState.sort}
        onSortChange={(sort) => pushState({ sort })}
        category={urlState.category}
        onCategoryChange={(category) => pushState({ category })}
        budget={urlState.budget}
        onBudgetChange={(budget) => pushState({ budget })}
        delivery={urlState.delivery}
        onDeliveryChange={(delivery) => pushState({ delivery })}
        rating={urlState.rating}
        onRatingChange={(rating) => pushState({ rating })}
      />
    </div>
  );
}
