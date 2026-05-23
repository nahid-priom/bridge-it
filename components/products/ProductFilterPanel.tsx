'use client';

import React from 'react';
import type { ProductListingFilters, ProductSellerLevelFilter } from '@/types/product';
import { cn, focusVisibleInput, focusVisibleRing } from '@/lib/cn';

const DELIVERY_OPTIONS = [
  { value: 'all', label: 'Any delivery' },
  { value: 'instant', label: 'Instant' },
  { value: '1-3', label: '1–3 days' },
  { value: '4-7', label: '4–7 days' },
  { value: '8-14', label: '8–14 days' },
] as const;

const SELLER_LEVELS: { value: ProductSellerLevelFilter; label: string }[] = [
  { value: 'all', label: 'Any level' },
  { value: 'Top Rated', label: 'Top Rated' },
  { value: 'Level 2', label: 'Level 2' },
  { value: 'Rising Talent', label: 'Rising Talent' },
];

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5 last:mb-0">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2.5">
        {title}
      </h4>
      {children}
    </div>
  );
}

export interface ProductFilterPanelProps {
  filters: ProductListingFilters;
  onChange: (filters: ProductListingFilters) => void;
  onClearAll: () => void;
  showFooter?: boolean;
  className?: string;
}

export function ProductFilterPanel({
  filters,
  onChange,
  onClearAll,
  showFooter = true,
  className = '',
}: ProductFilterPanelProps) {
  const update = <K extends keyof ProductListingFilters>(
    key: K,
    value: ProductListingFilters[K]
  ) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className={cn('flex flex-col min-h-0', className)}>
      <div className="filter-scrollbar flex-1 overflow-y-auto px-5 py-4 min-h-0">
        <FilterSection title="Price range ($)">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              value={filters.priceMin}
              onChange={(e) => update('priceMin', Number(e.target.value) || 0)}
              className={cn(
                'w-full px-3 py-2 bg-background-soft border border-border-subtle rounded-lg text-sm text-text-primary',
                focusVisibleInput
              )}
              placeholder="Min"
              aria-label="Minimum price"
            />
            <span className="text-text-muted text-sm shrink-0">–</span>
            <input
              type="number"
              min={0}
              value={filters.priceMax}
              onChange={(e) => update('priceMax', Number(e.target.value) || 200000)}
              className={cn(
                'w-full px-3 py-2 bg-background-soft border border-border-subtle rounded-lg text-sm text-text-primary',
                focusVisibleInput
              )}
              placeholder="Max"
              aria-label="Maximum price"
            />
          </div>
        </FilterSection>

        <FilterSection title="Minimum rating">
          <div className="flex flex-wrap gap-2">
            {[0, 3, 4, 4.5, 5].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => update('minRating', r)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer',
                  focusVisibleRing,
                  filters.minRating === r
                    ? 'bg-bridge-primary text-white'
                    : 'bg-background-soft text-text-muted hover:text-text-primary border border-border-subtle'
                )}
              >
                {r === 0 ? 'Any' : `${r}+`}
              </button>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Delivery time">
          <select
            value={filters.deliveryTime}
            onChange={(e) =>
              update('deliveryTime', e.target.value as ProductListingFilters['deliveryTime'])
            }
            className={cn(
              'w-full px-3 py-2.5 bg-background-soft border border-border-subtle rounded-xl text-sm text-text-primary cursor-pointer',
              focusVisibleInput
            )}
            aria-label="Delivery time"
          >
            {DELIVERY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </FilterSection>

        <FilterSection title="Seller level">
          <div className="flex flex-wrap gap-2">
            {SELLER_LEVELS.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => update('sellerLevel', level.value)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer',
                  focusVisibleRing,
                  filters.sellerLevel === level.value
                    ? 'bg-bridge-primary text-white'
                    : 'bg-background-soft text-text-muted hover:text-text-primary border border-border-subtle'
                )}
              >
                {level.label}
              </button>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Badges & status">
          <div className="space-y-2.5">
            <label className="flex items-center gap-2.5 text-sm text-text-secondary cursor-pointer">
              <input
                type="checkbox"
                checked={filters.featuredOnly}
                onChange={(e) => update('featuredOnly', e.target.checked)}
                className="rounded border-border-subtle text-bridge-primary focus:ring-0 focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              />
              Featured only
            </label>
            <label className="flex items-center gap-2.5 text-sm text-text-secondary cursor-pointer">
              <input
                type="checkbox"
                checked={filters.promotedOnly}
                onChange={(e) => update('promotedOnly', e.target.checked)}
                className="rounded border-border-subtle text-bridge-primary focus:ring-0 focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              />
              Promoted only
            </label>
            <label className="flex items-center gap-2.5 text-sm text-text-secondary cursor-pointer">
              <input
                type="checkbox"
                checked={filters.verifiedOnly}
                onChange={(e) => update('verifiedOnly', e.target.checked)}
                className="rounded border-border-subtle text-bridge-primary focus:ring-0 focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              />
              Top rated sellers only
            </label>
          </div>
        </FilterSection>
      </div>

      {showFooter && (
        <div className="shrink-0 flex gap-2 px-5 py-4 border-t border-border-subtle bg-surface/95">
          <button
            type="button"
            onClick={onClearAll}
            className={cn(
              'flex-1 px-4 py-2.5 text-sm font-medium rounded-xl border border-border-subtle text-text-secondary hover:text-text-primary hover:border-bridge-primary/30 transition-colors cursor-pointer',
              focusVisibleRing
            )}
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
