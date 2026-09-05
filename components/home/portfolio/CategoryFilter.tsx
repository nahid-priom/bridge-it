'use client';

import { cn, focusVisibleRing } from '@/lib/cn';
import { PORTFOLIO_FILTERS, type PortfolioFilterId } from './types';

/** Filter chips styled to match /explore portfolio tabs. */
export function CategoryFilter({
  active,
  onChange,
  className,
}: {
  active: PortfolioFilterId;
  onChange: (id: PortfolioFilterId) => void;
  className?: string;
}) {
  return (
    <div
      className={cn('mt-6 flex flex-wrap items-center justify-center gap-2 md:mt-8', className)}
      role="tablist"
      aria-label="Portfolio categories"
    >
      {PORTFOLIO_FILTERS.map((filter) => {
        const isActive = active === filter.id;
        return (
          <button
            key={filter.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(filter.id)}
            className={cn(
              focusVisibleRing,
              'rounded-full border px-4 py-2 text-sm font-semibold tracking-wide transition-colors',
              isActive
                ? 'border-[#0f2744]/90 bg-[#0f2744] text-white dark:border-white dark:bg-white dark:text-[#0f2744]'
                : 'border-border-subtle bg-surface/80 text-text-secondary hover:border-[#2563eb]/35 hover:text-text-primary'
            )}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
