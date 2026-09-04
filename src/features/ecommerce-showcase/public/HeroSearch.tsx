'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buildExploreSearchUrl } from '@/lib/search/inferExploreType';
import { useWebsiteSearchPlaceholder } from '@/hooks/useWebsiteSearchPlaceholder';

export function HeroSearch({
  className,
  variant = 'default',
  staticPlaceholder,
}: {
  className?: string;
  /** Premium dark search chrome for the homepage hero. */
  variant?: 'default' | 'premium';
  /** When set, skips the typewriter placeholder animation. */
  staticPlaceholder?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const useTyped = !staticPlaceholder;
  const typed = useWebsiteSearchPlaceholder(useTyped && query.length === 0);
  const placeholder = staticPlaceholder ?? typed.placeholder;

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const q = query.trim();
    router.push(buildExploreSearchUrl({ q }));
  };

  const isPremium = variant === 'premium';

  return (
    <form onSubmit={onSubmit} role="search" className={cn('w-full', className)}>
      <div
        className={cn(
          'flex items-center',
          isPremium
            ? cn(
                'hero-search-field h-14 rounded-[1.25rem] sm:h-[3.75rem]',
                'border border-border-subtle bg-deshi-navy-light/90 dark:bg-[#071226]',
                'shadow-[0_0_0_1px_rgba(37,99,235,0.06)]',
                'transition-[box-shadow,border-color] duration-200',
                'focus-within:border-bridge-primary/50',
                'focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.18)]'
              )
            : 'h-11 rounded-xl border border-slate-300 bg-white shadow-sm dark:border-white/40 dark:bg-[#0c1520]'
        )}
      >
        {isPremium ? (
          <span className="pointer-events-none pl-4 text-text-muted" aria-hidden>
            <Search className="h-[1.125rem] w-[1.125rem]" strokeWidth={2} />
          </span>
        ) : null}

        <label htmlFor="hero-website-search" className="sr-only">
          Search websites, software, and creative marketing
        </label>
        <input
          id="hero-website-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={useTyped ? typed.onFocus : undefined}
          onBlur={useTyped ? typed.onBlur : undefined}
          placeholder={placeholder}
          className={cn(
            'h-full min-w-0 flex-1 bg-transparent text-sm leading-none text-text-primary outline-none',
            'placeholder:text-text-muted',
            isPremium
              ? 'px-3 text-left sm:text-[0.9375rem]'
              : 'px-3.5 text-center placeholder:text-center sm:text-left sm:placeholder:text-left'
          )}
          autoComplete="off"
        />
        <button
          type="submit"
          className={cn(
            'shrink-0 items-center justify-center text-white transition-[background-color,transform] duration-150',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]',
            isPremium
              ? cn(
                  'm-1.5 inline-flex h-11 w-11 rounded-[0.875rem] bg-bridge-primary sm:h-12 sm:w-12',
                  'hover:bg-bridge-primary-dark active:scale-[0.97]',
                  'motion-reduce:active:scale-100'
                )
              : cn(
                  'm-1 inline-flex h-8 w-8 rounded-lg bg-[#2563eb]',
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
