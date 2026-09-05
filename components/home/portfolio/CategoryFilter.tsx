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
    <div
      className={cn('mt-3 md:mt-6', className)}
      role="navigation"
      aria-label="Portfolio categories"
    >
      <div
        className={cn(
          'scrollbar-none -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5',
          'snap-x snap-proximity scroll-smooth',
          'md:mx-0 md:flex-wrap md:justify-center md:overflow-visible md:px-0 md:pb-0'
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
                'snap-start shrink-0 rounded-full px-2.5 text-[0.6875rem] font-semibold tracking-[-0.01em]',
                'inline-flex h-8 items-center justify-center sm:px-3 sm:text-xs',
                'border transition-[color,background-color,border-color,box-shadow] duration-200',
                isActive
                  ? 'border-transparent bg-[#0f2744] text-white shadow-sm dark:border-cyan-400/35 dark:bg-cyan-500/15 dark:text-cyan-100 dark:shadow-[0_0_12px_-4px_rgba(34,211,238,0.35)]'
                  : 'border-border-subtle/80 bg-transparent text-text-muted hover:border-border-subtle hover:bg-surface/60 hover:text-text-primary',
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
