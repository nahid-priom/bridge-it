'use client';

import React, { useEffect, useRef } from 'react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { Search, X, Command, TrendingUp } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useNavigateToSearch } from '@/hooks/useNavigateToSearch';
import { SEARCH_POPULAR_CHIPS } from '@/constants/mainMarketplaceCategories';
import { cn } from '@/lib/cn';
import { BRANDING } from '@/lib/config/branding';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchModalOpen, closeSearchModal, searchQuery, setSearchQuery } = useStore();
  const { goToSearch } = useNavigateToSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  useBodyScrollLock(isSearchModalOpen);

  useEffect(() => {
    if (!isSearchModalOpen) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [isSearchModalOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        useStore.getState().openSearchModal();
      }
      if (e.key === 'Escape') closeSearchModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeSearchModal]);

  if (!isSearchModalOpen) return null;

  return (
    <div
      className="hidden md:flex fixed inset-0 z-[80] items-start justify-center pt-[10vh] px-4 sm:px-6"
      role="dialog"
      aria-modal="true"
      aria-label="Global search"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/55 dark:bg-black/70 backdrop-blur-md cursor-default"
        onClick={closeSearchModal}
        aria-label="Close search"
      />

      <div
        className={cn(
          'relative w-full max-w-2xl rounded-2xl overflow-hidden animate-scale-in',
          'bg-white dark:bg-[#0f1419]',
          'border border-slate-200/90 dark:border-white/12',
          'shadow-2xl shadow-slate-900/15 dark:shadow-black/50',
          'ring-1 ring-slate-900/5 dark:ring-white/5'
        )}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            goToSearch(searchQuery);
          }}
          className="flex items-center gap-3 px-4 sm:px-5 py-4 border-b border-slate-200/80 dark:border-white/10"
        >
          <Search
            className="w-5 h-5 text-deshi-green shrink-0"
            strokeWidth={2.25}
            aria-hidden
          />
          <input
            ref={inputRef}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services, products, sellers..."
            className={cn(
              'flex-1 min-w-0 bg-transparent text-base sm:text-lg font-medium',
              'text-slate-900 dark:text-white',
              'placeholder:text-slate-500 dark:placeholder:text-slate-400',
              'focus:outline-none focus:ring-0'
            )}
            autoComplete="off"
            aria-label="Search query"
          />
          <kbd
            className={cn(
              'hidden sm:inline-flex items-center gap-0.5 px-2 py-1 rounded-lg text-[11px] font-semibold shrink-0',
              'text-slate-600 dark:text-slate-300',
              'bg-slate-100 dark:bg-white/10',
              'border border-slate-200/90 dark:border-white/15'
            )}
          >
            <Command className="w-3 h-3" aria-hidden />
            <span>K</span>
          </kbd>
          <button
            type="button"
            onClick={closeSearchModal}
            className={cn(
              'p-2 rounded-xl shrink-0 transition-colors',
              'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
              'hover:bg-slate-100 dark:hover:bg-white/10',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/50'
            )}
            aria-label="Close search"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </form>

        <div className="px-4 sm:px-5 py-4 bg-slate-50/80 dark:bg-white/[0.03]">
          <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            <TrendingUp className="w-3.5 h-3.5 text-deshi-green" aria-hidden />
            Popular searches
          </h3>
          <div className="flex flex-wrap gap-2">
            {SEARCH_POPULAR_CHIPS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => goToSearch(tag)}
                className={cn(
                  'px-3.5 py-2 text-sm font-semibold rounded-full transition-colors cursor-pointer',
                  'bg-white dark:bg-white/[0.08]',
                  'text-slate-800 dark:text-slate-100',
                  'border border-slate-200/90 dark:border-white/12',
                  'hover:border-deshi-green/50 hover:text-deshi-green dark:hover:text-emerald-400',
                  'hover:bg-emerald-50/80 dark:hover:bg-emerald-500/10',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40'
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <p className="px-4 sm:px-5 py-3.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300 border-t border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0f1419]">
          Press{' '}
          <kbd className="px-1.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-white/12">
            Enter
          </kbd>{' '}
          to search {BRANDING.appName}. An empty search shows featured marketplace results.
        </p>
      </div>
    </div>
  );
};
