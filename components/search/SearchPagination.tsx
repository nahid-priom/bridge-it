'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { buildPaginationItems } from '@/lib/search/searchHelpers';
import { cn } from '@/lib/cn';

type SearchPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function SearchPagination({ page, totalPages, onPageChange }: SearchPaginationProps) {
  const items = buildPaginationItems(page, totalPages);

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-1.5 py-8"
      aria-label="Search results pagination"
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className={cn(
          'inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold border transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40',
          page <= 1
            ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-white/10'
            : 'border-slate-200 dark:border-white/10 hover:border-deshi-green/40 hover:text-deshi-green'
        )}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      {items.map((item, i) =>
        item === 'ellipsis' ? (
          <span key={`e-${i}`} className="px-2 text-text-muted" aria-hidden>
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            className={cn(
              'min-w-[2.25rem] h-9 px-2 rounded-lg text-sm font-bold border transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40',
              item === page
                ? 'bg-deshi-green text-white border-deshi-green shadow-md'
                : 'border-slate-200 dark:border-white/10 hover:border-deshi-green/40 hover:text-deshi-green'
            )}
            aria-label={`Page ${item}`}
            aria-current={item === page ? 'page' : undefined}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className={cn(
          'inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold border transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40',
          page >= totalPages
            ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-white/10'
            : 'border-slate-200 dark:border-white/10 hover:border-deshi-green/40 hover:text-deshi-green'
        )}
        aria-label="Next page"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
