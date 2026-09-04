'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buildExploreSearchUrl } from '@/lib/search/inferExploreType';
import { useWebsiteSearchPlaceholder } from '@/hooks/useWebsiteSearchPlaceholder';

export function HeroSearch({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const typed = useWebsiteSearchPlaceholder(query.length === 0);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const q = query.trim();
    router.push(buildExploreSearchUrl({ q }));
  };

  return (
    <form onSubmit={onSubmit} role="search" className={cn('w-full', className)}>
      <div className="flex h-11 items-center rounded-xl border border-slate-300 bg-white shadow-sm dark:border-white/40 dark:bg-[#0c1520]">
        <label htmlFor="hero-website-search" className="sr-only">
          Search websites, software, and creative marketing
        </label>
        <input
          id="hero-website-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={typed.onFocus}
          onBlur={typed.onBlur}
          placeholder={typed.placeholder}
          className="h-full min-w-0 flex-1 bg-transparent px-3.5 text-center text-sm leading-none text-text-primary outline-none placeholder:text-center placeholder:text-text-muted sm:text-left sm:placeholder:text-left"
          autoComplete="off"
        />
        <button
          type="submit"
          className={cn(
            'm-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
            'bg-[#2563eb] text-white transition-colors hover:bg-[#1d4ed8]',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60a5fa]'
          )}
          aria-label="Search solutions"
        >
          <Search className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </form>
  );
}
