'use client';

import React, { useEffect, useMemo, useState, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { buildExploreSearchUrl } from '@/lib/search/inferExploreType';
import { parseSearchParams } from '@/lib/search/searchHelpers';
import { cn } from '@/lib/cn';

type NavbarSearchProps = {
  className?: string;
  autoFocus?: boolean;
  onSubmitted?: () => void;
  variant?: 'compact' | 'drawer' | 'bar';
  compact?: boolean;
  onOpenCommandPalette?: () => void;
};

function NavbarSearchForm({
  className,
  autoFocus,
  onSubmitted,
  variant = 'compact',
  compact = false,
  onOpenCommandPalette,
}: NavbarSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setSearchQuery = useStore((s) => s.setSearchQuery);
  const openSearchModal = useStore((s) => s.openSearchModal);

  const urlState = useMemo(() => parseSearchParams(searchParams), [searchParams]);
  const [q, setQ] = useState(urlState.q);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (
      pathname === '/search' ||
      pathname.startsWith('/search?') ||
      pathname === '/explore' ||
      pathname.startsWith('/explore')
    ) {
      setQ(urlState.q);
    }
  }, [pathname, urlState.q]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = q.trim();
    setSearchQuery(trimmed);
    useStore.setState({ isMenuOpen: false });
    onSubmitted?.();
    router.push(buildExploreSearchUrl({ q: trimmed }));
  };

  const clear = () => {
    setQ('');
    setSearchQuery('');
    if (pathname.startsWith('/search') || pathname.startsWith('/explore')) {
      router.push(buildExploreSearchUrl({ q: '' }));
    }
  };

  const isCompact = variant === 'compact' || compact;
  const openPalette = onOpenCommandPalette ?? openSearchModal;

  return (
    <form onSubmit={submit} role="search" className={cn('w-full', className)}>
      <div
        className={cn(
          'relative w-full transition-all duration-300',
          isCompact && 'group/search',
          focused &&
            isCompact &&
            'shadow-[0_0_0_3px_rgba(16,185,129,0.15),0_8px_24px_rgba(37,99,235,0.12)] rounded-full'
        )}
      >
        <Search
          className={cn(
            'absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40 pointer-events-none transition-colors',
            focused && isCompact && 'text-deshi-green',
            isCompact ? 'w-4 h-4' : 'w-[18px] h-[18px] left-4'
          )}
          aria-hidden
        />
        <input
          type="search"
          name="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={
            isCompact
              ? 'Search services, products, sellers...'
              : 'Search software, web, apps, marketing, AI…'
          }
          aria-label="Search marketplace"
          autoFocus={autoFocus}
          className={cn(
            'w-full rounded-full text-sm text-text-primary placeholder:text-slate-400 dark:placeholder:text-white/35',
            'bg-white/90 dark:bg-white/[0.06] border border-slate-200/90 dark:border-white/10',
            'focus:outline-none focus:border-deshi-green/50 dark:focus:border-emerald-500/40',
            'focus-visible:ring-2 focus-visible:ring-deshi-green/25 focus-visible:ring-offset-0',
            'dark:text-white transition-[height,box-shadow,border-color] duration-300',
            isCompact
              ? cn(
                  'h-10 pl-10 pr-[4.5rem]',
                  compact ? 'h-9 text-[13px]' : 'shadow-[0_2px_12px_rgba(15,23,42,0.06)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.25)]'
                )
              : 'h-12 pl-11 pr-14'
          )}
        />
        {q.length > 0 && (
          <button
            type="button"
            onClick={clear}
            className={cn(
              'absolute top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full',
              'text-slate-400 hover:text-text-primary hover:bg-slate-200/60 dark:hover:bg-white/10',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40',
              isCompact ? 'right-[3.25rem] w-7 h-7' : 'right-12 w-8 h-8'
            )}
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        {isCompact ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              openPalette();
            }}
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2 hidden sm:inline-flex',
              'items-center gap-0.5 px-1.5 py-0.5 rounded-md',
              'text-[10px] font-semibold text-slate-400 dark:text-white/40',
              'border border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-white/5',
              'hover:text-text-primary hover:border-slate-300 transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40'
            )}
            aria-label="Open command search (⌘K)"
          >
            <span className="font-mono">⌘</span>K
          </button>
        ) : (
          <button
            type="submit"
            className={cn(
              'absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9',
              'flex items-center justify-center rounded-full cursor-pointer',
              'bg-gradient-to-br from-bridge-primary to-bridge-primary-light text-white',
              'shadow-[0_4px_14px_rgba(37,99,235,0.45)]',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-bridge-primary/40'
            )}
            aria-label="Submit search"
          >
            <Search className="w-4 h-4" aria-hidden />
          </button>
        )}
      </div>
    </form>
  );
}

export function NavbarSearch(props: NavbarSearchProps) {
  return (
    <Suspense
      fallback={
        <div
          className={cn(
            'h-10 w-full rounded-full bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10',
            props.className
          )}
          aria-hidden
        />
      }
    >
      <NavbarSearchForm {...props} />
    </Suspense>
  );
}
