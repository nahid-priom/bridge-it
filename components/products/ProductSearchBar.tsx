'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import {
  buildProductsHref,
  parseProductsSearchParams,
  searchParamsToRecord,
} from '@/lib/products/url';
import { cn, focusVisibleRing } from '@/lib/cn';

interface ProductSearchBarProps {
  categoryLabel?: string | null;
  className?: string;
}

export function ProductSearchBar({ categoryLabel, className = '' }: ProductSearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const state = useMemo(
    () => parseProductsSearchParams(searchParamsToRecord(searchParams)),
    [searchParams]
  );

  const [value, setValue] = useState(state.q);

  useEffect(() => {
    setValue(state.q);
  }, [state.q]);

  const applyQuery = useCallback(
    (raw: string) => {
      const current = parseProductsSearchParams(searchParamsToRecord(searchParams));
      const q = raw.trim();
      router.replace(buildProductsHref({ ...current, q }));
    },
    [router, searchParams]
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    applyQuery(value);
  };

  const handleClear = () => {
    setValue('');
    applyQuery('');
  };

  const showClear = value.length > 0 || state.q.length > 0;

  const placeholder = categoryLabel
    ? `Search in ${categoryLabel}...`
    : 'Search products and services...';

  return (
    <form
      role="search"
      aria-label="Search products and services"
      onSubmit={handleSubmit}
      className={cn('relative w-full group', className)}
    >
      <div
        className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-r from-bridge-primary/20 via-bridge-secondary/15 to-bridge-cyan/20 opacity-0 blur-xl transition-opacity duration-300 group-focus-within:opacity-100"
        aria-hidden
      />
      <div
        className={cn(
          'relative flex h-14 sm:h-16 items-center gap-1 rounded-2xl border border-border-subtle',
          'bg-white/90 dark:bg-bridge-dark-2/90 backdrop-blur-sm',
          'transition-[box-shadow,border-color] duration-200',
          'focus-within:border-bridge-primary/50 focus-within:ring-2 focus-within:ring-bridge-primary/30'
        )}
      >
        <Search className="ml-4 h-5 w-5 shrink-0 text-text-muted" aria-hidden />
        <input
          name="q"
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent px-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none sm:px-3 sm:text-base"
          aria-label={placeholder}
        />
        {showClear && (
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              'mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-text-muted',
              'hover:bg-background-soft hover:text-text-primary transition-colors cursor-pointer',
              focusVisibleRing
            )}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          type="submit"
          className={cn(
            'mr-1.5 sm:mr-2 shrink-0 rounded-xl px-3 py-2.5 text-sm font-semibold text-white',
            'bg-gradient-to-r from-bridge-primary to-bridge-primary-light',
            'hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer',
            'sm:px-5',
            focusVisibleRing
          )}
        >
          <span className="sr-only sm:not-sr-only">Search</span>
          <Search className="h-4 w-4 sm:hidden" aria-hidden />
        </button>
      </div>
    </form>
  );
}
