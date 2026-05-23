'use client';

import { memo, type ReactNode } from 'react';
import { Grid3X3, List } from 'lucide-react';
import type { SearchSortOption } from '@/lib/searchFilter';
import { SearchSortDropdown } from '../search/SearchSortDropdown';
import { MobileFilterButton } from '../search/MobileSearchFilterDrawer';
import { cn, focusVisibleRing } from '@/lib/cn';

interface ProductsToolbarProps {
  resultCount: number;
  categoryLabel?: string | null;
  sort: SearchSortOption;
  onSortChange: (sort: SearchSortOption) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onOpenFilters?: () => void;
  activeFilterCount?: number;
  filterChips?: ReactNode;
  className?: string;
}

export const ProductsToolbar = memo(function ProductsToolbar({
  resultCount,
  categoryLabel = null,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  onOpenFilters,
  activeFilterCount = 0,
  filterChips,
  className = '',
}: ProductsToolbarProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4 mb-5 md:mb-6',
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 min-w-0 flex-1">
        <p
          className="text-sm text-text-secondary leading-snug shrink-0"
          aria-live="polite"
          aria-atomic="true"
        >
          Showing{' '}
          <span className="font-semibold text-text-primary tabular-nums">{resultCount}</span>
          {categoryLabel
            ? ` ${categoryLabel} service${resultCount === 1 ? '' : 's'}`
            : ` result${resultCount === 1 ? '' : 's'}`}
        </p>
        {filterChips}
      </div>
      <div className="flex flex-wrap items-center gap-3 shrink-0 lg:ml-4">
        {onOpenFilters && (
          <div className="lg:hidden">
            <MobileFilterButton onClick={onOpenFilters} activeCount={activeFilterCount} />
          </div>
        )}
        <SearchSortDropdown value={sort} onChange={onSortChange} />
        <div
          className="flex items-center gap-1 p-1 rounded-xl border border-border-subtle bg-surface/80"
          role="group"
          aria-label="View mode"
        >
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            className={cn(
              'p-2 rounded-lg cursor-pointer',
              focusVisibleRing,
              viewMode === 'grid' ? 'bg-bridge-primary text-white' : 'text-text-muted hover:text-text-primary bg-transparent'
            )}
            aria-label="Grid view"
            aria-pressed={viewMode === 'grid'}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('list')}
            className={cn(
              'p-2 rounded-lg cursor-pointer',
              focusVisibleRing,
              viewMode === 'list' ? 'bg-bridge-primary text-white' : 'text-text-muted hover:text-text-primary bg-transparent'
            )}
            aria-label="List view"
            aria-pressed={viewMode === 'list'}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
});
