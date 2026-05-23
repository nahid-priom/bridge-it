'use client';

import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import type { ProductListingFilters } from '@/types/product';
import { ProductFilterPanel } from './ProductFilterPanel';
import { cn, focusVisibleRing } from '@/lib/cn';

interface ProductFilterSidebarProps {
  filters: ProductListingFilters;
  onChange: (filters: ProductListingFilters) => void;
  onClearAll: () => void;
  className?: string;
}

/** Sticky enterprise filter shell — scrollable panel inside. */
export const ProductFilterSidebar: React.FC<ProductFilterSidebarProps> = ({
  filters,
  onChange,
  onClearAll,
  className = '',
}) => {
  return (
    <aside
      aria-label="Product filters"
      className={cn(
        'products-filter-panel flex flex-col overflow-hidden rounded-3xl',
        'bg-surface/90 backdrop-blur-xl border border-border-subtle',
        'shadow-[0_18px_50px_rgba(15,14,23,0.08)] dark:shadow-[0_18px_50px_rgba(0,0,0,0.35)]',
        className
      )}
    >
      <div className="shrink-0 flex items-center justify-between gap-2 px-5 py-4 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-bridge-primary" aria-hidden />
          <h3 className="text-sm font-bold text-text-primary">Filters</h3>
        </div>
        <button
          type="button"
          onClick={onClearAll}
          className={cn(
            'text-xs font-medium text-bridge-primary hover:text-bridge-primary-light transition-colors cursor-pointer rounded-md px-1',
            focusVisibleRing
          )}
        >
          Clear all
        </button>
      </div>

      <ProductFilterPanel
        filters={filters}
        onChange={onChange}
        onClearAll={onClearAll}
        showFooter={false}
        className="flex-1 min-h-0"
      />
    </aside>
  );
};
