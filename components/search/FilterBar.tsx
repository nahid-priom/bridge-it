'use client';

import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { MAIN_MARKETPLACE_CATEGORIES } from '@/constants/mainMarketplaceCategories';
import type {
  ActiveFilterChip,
  MarketplaceBudgetFilter,
  MarketplaceDeliveryFilter,
  MarketplaceRatingFilter,
  MarketplaceSortOption,
} from '@/lib/search/types';
import { cn } from '@/lib/cn';

const SORT_OPTIONS: { value: MarketplaceSortOption; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'top-rated', label: 'Top Rated' },
  { value: 'price-low', label: 'Price Low to High' },
  { value: 'price-high', label: 'Price High to Low' },
  { value: 'fast-delivery', label: 'Fast Delivery' },
];

type FilterBarProps = {
  sort: MarketplaceSortOption;
  onSortChange: (v: MarketplaceSortOption) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  budget: MarketplaceBudgetFilter;
  onBudgetChange: (v: MarketplaceBudgetFilter) => void;
  delivery: MarketplaceDeliveryFilter;
  onDeliveryChange: (v: MarketplaceDeliveryFilter) => void;
  rating: MarketplaceRatingFilter;
  onRatingChange: (v: MarketplaceRatingFilter) => void;
  chips: ActiveFilterChip[];
  onRemoveChip: (id: string) => void;
  onClearChips: () => void;
  resultCount: number;
  onOpenMobileFilters?: () => void;
  className?: string;
};

function FilterSelect({
  label,
  value,
  onChange,
  children,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('relative shrink-0', className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'appearance-none h-9 pl-3 pr-7 rounded-lg text-xs font-semibold',
          'bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10',
          'text-text-primary cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40'
        )}
        aria-label={label}
      >
        {children}
      </select>
      <ChevronDown
        className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none"
        aria-hidden
      />
    </div>
  );
}

export function FilterBar({
  sort,
  onSortChange,
  category,
  onCategoryChange,
  budget,
  onBudgetChange,
  delivery,
  onDeliveryChange,
  rating,
  onRatingChange,
  chips,
  onRemoveChip,
  onClearChips,
  resultCount,
  onOpenMobileFilters,
  className,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        'sticky top-[calc(var(--header-offset)+0.5rem)] z-30',
        'bg-white/95 dark:bg-[#080b16]/95 backdrop-blur-md',
        className
      )}
    >
      <div className="py-3 space-y-2">
        <div className="scrollbar-none flex flex-nowrap items-center gap-2 overflow-x-auto">
          <p className="shrink-0 text-xs sm:text-sm font-medium text-text-muted whitespace-nowrap pr-1">
            <span className="text-text-primary font-bold">{resultCount.toLocaleString()}</span>{' '}
            {resultCount === 1 ? 'service' : 'services'}
          </p>

          <span className="shrink-0 w-px h-6 bg-slate-200 dark:bg-white/10 hidden sm:block" aria-hidden />

          {onOpenMobileFilters && (
            <button
              type="button"
              onClick={onOpenMobileFilters}
              className="lg:hidden shrink-0 h-9 px-3 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-xs font-bold inline-flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40"
              aria-label="Open filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          )}

          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <FilterSelect label="Category" value={category} onChange={onCategoryChange}>
              <option value="all">All Categories</option>
              {MAIN_MARKETPLACE_CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </FilterSelect>

            <FilterSelect label="Budget" value={budget} onChange={(v) => onBudgetChange(v as MarketplaceBudgetFilter)}>
              <option value="all">Budget</option>
              <option value="under-15k">Under ৳15,000</option>
              <option value="15k-50k">৳15k – ৳50k</option>
              <option value="50k-150k">৳50k – ৳150k</option>
              <option value="150k-plus">৳150,000+</option>
            </FilterSelect>

            <FilterSelect
              label="Delivery time"
              value={delivery}
              onChange={(v) => onDeliveryChange(v as MarketplaceDeliveryFilter)}
            >
              <option value="all">Delivery Time</option>
              <option value="1-7">1–7 days</option>
              <option value="8-21">8–21 days</option>
              <option value="22-plus">22+ days</option>
            </FilterSelect>

            <FilterSelect label="Rating" value={rating} onChange={(v) => onRatingChange(v as MarketplaceRatingFilter)}>
              <option value="all">Rating</option>
              <option value="4.5">4.5+</option>
              <option value="4.7">4.7+</option>
              <option value="4.9">4.9+</option>
            </FilterSelect>
          </div>

          <div className="ml-auto shrink-0 flex items-center gap-2">
            <label htmlFor="sort-select" className="sr-only">
              Sort by
            </label>
            <span className="hidden sm:inline text-xs text-text-muted whitespace-nowrap">
              Sort by:
            </span>
            <div className="relative">
              <select
                id="sort-select"
                value={sort}
                onChange={(e) => onSortChange(e.target.value as MarketplaceSortOption)}
                className="appearance-none h-9 pl-3 pr-7 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-text-primary cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none"
                aria-hidden
              />
            </div>
          </div>
        </div>

        {chips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 min-w-0 pt-1">
            {chips.map((chip) => (
              <span
                key={chip.id}
                className="inline-flex items-center gap-1 pl-3 pr-1.5 py-1 rounded-full text-xs font-semibold bg-deshi-green/10 text-deshi-green-dark dark:text-deshi-green border border-deshi-green/20"
              >
                {chip.label}
                <button
                  type="button"
                  onClick={() => onRemoveChip(chip.id)}
                  className="p-0.5 rounded-full hover:bg-deshi-green/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/50"
                  aria-label={`Remove filter ${chip.label}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={onClearChips}
              className="text-xs font-semibold text-text-muted hover:text-deshi-green transition-colors focus:outline-none focus-visible:underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
