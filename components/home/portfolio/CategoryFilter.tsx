'use client';

import { cn, focusVisibleRing } from '@/lib/cn';
import { PORTFOLIO_FILTERS, type PortfolioFilterId } from './types';

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
    <div className={cn('mt-8 md:mt-10', className)} role="navigation" aria-label="Portfolio categories">
      <div
        className={cn(
          'scrollbar-none flex gap-2 overflow-x-auto',
          'snap-x snap-mandatory md:flex-wrap md:justify-center md:overflow-visible'
        )}
      >
        {PORTFOLIO_FILTERS.map((filter) => {
          const isActive = active === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => onChange(filter.id)}
              aria-pressed={isActive}
              className={cn(
                'snap-start shrink-0 rounded-full px-4 text-sm font-semibold transition-colors',
                'inline-flex min-h-11 items-center justify-center',
                isActive
                  ? 'bg-[#0f2744] text-white dark:bg-cyan-500/20 dark:text-cyan-100 dark:ring-1 dark:ring-cyan-400/40'
                  : 'border border-border-subtle bg-surface text-text-secondary hover:border-[#2563eb]/35 hover:text-text-primary',
                'active:opacity-80',
                focusVisibleRing
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
