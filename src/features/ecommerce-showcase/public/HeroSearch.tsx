'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buildExploreSearchUrl } from '@/lib/search/inferExploreType';
import {
  WEBSITE_SEARCH_FALLBACK,
  useWebsiteSearchPlaceholder,
} from '@/hooks/useWebsiteSearchPlaceholder';

export function HeroSearch({
  className,
  variant = 'default',
  staticPlaceholder,
}: {
  className?: string;
  /** Premium search chrome for the homepage hero (light in light mode, dark in dark mode). */
  variant?: 'default' | 'premium';
  /** When set, skips the typewriter placeholder animation. */
  staticPlaceholder?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const useTyped = !staticPlaceholder;
  const typed = useWebsiteSearchPlaceholder(useTyped && query.length === 0);
  const isPremium = variant === 'premium';
  const showAnimatedHint = isPremium && useTyped && query.length === 0 && !typed.focused;
  const hintText = typed.keyword
    ? `Search ${typed.keyword}`
    : staticPlaceholder ?? typed.placeholder ?? WEBSITE_SEARCH_FALLBACK;

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const q = query.trim();
    router.push(buildExploreSearchUrl({ q }));
  };

  return (
    <form onSubmit={onSubmit} role="search" className={cn('w-full', className)}>
      <div
        className={cn(
          'flex items-center',
          isPremium
            ? cn(
                'hero-search-field h-14 rounded-[1.25rem] sm:h-[3.75rem]',
                'border border-slate-200/90 bg-white dark:border-border-subtle dark:bg-[#071226]',
                'shadow-[0_10px_40px_rgba(8,11,22,0.06)] dark:shadow-[0_0_0_1px_rgba(37,99,235,0.06)]',
                'transition-[box-shadow,border-color] duration-300 ease-out',
                'focus-within:border-bridge-primary/50',
                'focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.18)]'
              )
            : 'h-11 rounded-xl border border-slate-300 bg-white shadow-sm dark:border-white/40 dark:bg-[#0c1520]'
        )}
      >
        {/* Optical balance for centered text (mirrors submit button width). */}
        {isPremium ? (
          <span
            className="pointer-events-none m-1.5 h-11 w-11 shrink-0 opacity-0 sm:h-12 sm:w-12"
            aria-hidden
          />
        ) : null}

        <label htmlFor="hero-website-search" className="sr-only">
          Search websites, software, and creative marketing
        </label>

        <div className="relative h-full min-w-0 flex-1">
          {showAnimatedHint ? (
            <span
              aria-hidden
              className={cn(
                'pointer-events-none absolute inset-0 z-[1] flex items-center justify-center px-2',
                'text-[0.8125rem] text-slate-600 transition-opacity duration-500 ease-out sm:text-[0.9375rem]',
                'dark:text-text-muted'
              )}
            >
              <span className="inline-flex max-w-full items-center justify-center truncate">
                <span className="transition-opacity duration-300 ease-out">{hintText}</span>
                {typed.animating ? (
                  <span
                    className="ml-0.5 inline-block h-[0.95em] w-px translate-y-px bg-current motion-safe:[animation:hero-cursor_1.1s_ease-in-out_infinite]"
                    aria-hidden
                  />
                ) : null}
              </span>
            </span>
          ) : null}

          <input
            id="hero-website-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={useTyped ? typed.onFocus : undefined}
            onBlur={useTyped ? typed.onBlur : undefined}
            placeholder={
              showAnimatedHint
                ? ''
                : staticPlaceholder ?? typed.placeholder ?? WEBSITE_SEARCH_FALLBACK
            }
            className={cn(
              'h-full w-full min-w-0 bg-transparent leading-none outline-none transition-colors duration-300',
              isPremium
                ? cn(
                    'px-2 text-center text-[0.8125rem] text-text-primary sm:text-[0.9375rem]',
                    'placeholder:text-center placeholder:text-slate-600 dark:placeholder:text-text-muted'
                  )
                : cn(
                    'px-3.5 text-center text-sm text-text-primary',
                    'placeholder:text-center placeholder:text-text-muted'
                  )
            )}
            autoComplete="off"
          />
        </div>

        <button
          type="submit"
          className={cn(
            'inline-flex shrink-0 items-center justify-center font-semibold text-white transition-[background-color,transform] duration-200 ease-out',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]',
            isPremium
              ? cn(
                  'm-1.5 h-11 w-11 rounded-[0.875rem] bg-bridge-primary p-0 text-sm sm:h-12 sm:w-12',
                  'hover:bg-bridge-primary-dark active:scale-[0.97]',
                  'motion-reduce:active:scale-100'
                )
              : cn(
                  'm-1 h-8 w-8 rounded-lg bg-[#2563eb] p-0 text-xs',
                  'hover:bg-[#1d4ed8]'
                )
          )}
          aria-label="Search solutions"
        >
          <Search className={isPremium ? 'h-[1.125rem] w-[1.125rem]' : 'h-4 w-4'} aria-hidden />
        </button>
      </div>
    </form>
  );
}
