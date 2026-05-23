'use client';

import type { ProductListingFilters } from '@/types/product';
import { cn, focusVisibleRing } from '@/lib/cn';

interface ProductListingFilterChipsProps {
  q: string;
  filters: ProductListingFilters;
  onRemove: (key: 'price' | 'rating' | 'delivery' | 'seller' | 'featured' | 'promoted' | 'verified' | 'q') => void;
  onClearAll: () => void;
}

export function ProductListingFilterChips({
  q,
  filters,
  onRemove,
  onClearAll,
}: ProductListingFilterChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 min-w-0">
      {q && (
        <button
          type="button"
          onClick={() => onRemove('q')}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-bridge-primary/15 border border-border-subtle text-bridge-primary-light cursor-pointer',
            focusVisibleRing
          )}
        >
          Search: {q} ×
        </button>
      )}
      {(filters.priceMin > 0 || filters.priceMax < 200000) && (
        <button
          type="button"
          onClick={() => onRemove('price')}
          className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-bridge-primary/15 border border-bridge-primary/30 text-bridge-primary-light cursor-pointer"
        >
          Price ×
        </button>
      )}
      {filters.minRating > 0 && (
        <button
          type="button"
          onClick={() => onRemove('rating')}
          className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-bridge-primary/15 border border-bridge-primary/30 text-bridge-primary-light cursor-pointer"
        >
          {filters.minRating}+ stars ×
        </button>
      )}
      {filters.deliveryTime !== 'all' && (
        <button
          type="button"
          onClick={() => onRemove('delivery')}
          className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-bridge-primary/15 border border-bridge-primary/30 text-bridge-primary-light cursor-pointer"
        >
          {filters.deliveryTime} ×
        </button>
      )}
      {filters.sellerLevel !== 'all' && (
        <button
          type="button"
          onClick={() => onRemove('seller')}
          className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-bridge-primary/15 border border-bridge-primary/30 text-bridge-primary-light cursor-pointer"
        >
          {filters.sellerLevel} ×
        </button>
      )}
      {filters.featuredOnly && (
        <button
          type="button"
          onClick={() => onRemove('featured')}
          className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-bridge-primary/15 border border-bridge-primary/30 text-bridge-primary-light cursor-pointer"
        >
          Featured ×
        </button>
      )}
      {filters.promotedOnly && (
        <button
          type="button"
          onClick={() => onRemove('promoted')}
          className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-bridge-primary/15 border border-bridge-primary/30 text-bridge-primary-light cursor-pointer"
        >
          Promoted ×
        </button>
      )}
      {filters.verifiedOnly && (
        <button
          type="button"
          onClick={() => onRemove('verified')}
          className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-bridge-primary/15 border border-bridge-primary/30 text-bridge-primary-light cursor-pointer"
        >
          Verified ×
        </button>
      )}
      <button
        type="button"
        onClick={onClearAll}
        className="text-xs text-text-muted hover:text-bridge-primary cursor-pointer shrink-0 px-1"
      >
        Clear all
      </button>
    </div>
  );
}
