'use client';

import { ChevronDown, Search, X } from 'lucide-react';
import { MAIN_MARKETPLACE_CATEGORIES } from '@/constants/mainMarketplaceCategories';
import { cn } from '@/lib/cn';

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  ...MAIN_MARKETPLACE_CATEGORIES.map((c) => ({ value: c.slug, label: c.name })),
];

type CompactMarketplaceSearchProps = {
  searchValue: string;
  category: string;
  placeholder?: string;
  onSearchChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  className?: string;
};

export function CompactMarketplaceSearch({
  searchValue,
  category,
  placeholder = 'Search services...',
  onSearchChange,
  onCategoryChange,
  onSubmit,
  onClear,
  className,
}: CompactMarketplaceSearchProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className={cn(
        'flex flex-col sm:flex-row sm:items-stretch w-full max-w-3xl',
        'h-auto sm:h-14 rounded-xl border border-slate-200/90 dark:border-white/12',
        'bg-white dark:bg-slate-900/95 shadow-sm',
        'overflow-hidden',
        className
      )}
      role="search"
      aria-label="Search marketplace services"
    >
      <div className="relative shrink-0 sm:w-[11.5rem] border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-white/10">
        <label htmlFor="search-category-compact" className="sr-only">
          Category
        </label>
        <select
          id="search-category-compact"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full h-11 sm:h-full pl-3 pr-8 bg-slate-50/80 dark:bg-slate-800/50 text-sm font-semibold text-text-primary appearance-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-deshi-green/40"
        >
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none"
          aria-hidden
        />
      </div>

      <div className="relative flex flex-1 items-center min-h-[44px] sm:min-h-0">
        <label className="sr-only" htmlFor="search-input-compact">
          Search
        </label>
        <input
          id="search-input-compact"
          type="search"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-11 sm:h-full px-4 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none min-w-0 pr-10"
          autoComplete="off"
        />
        {searchValue.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-slate-100 dark:hover:bg-white/10"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <button
        type="submit"
        className="hero-search-submit h-11 sm:h-full px-5 sm:px-6 text-white font-bold text-sm inline-flex items-center justify-center gap-2 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/50"
      >
        <Search className="w-4 h-4 sm:w-[18px] sm:h-[18px]" aria-hidden />
        <span>Search</span>
      </button>
    </form>
  );
}
