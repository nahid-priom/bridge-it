'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { cn } from '@/lib/cn';

export function HeroSearch({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const q = query.trim();
    router.push(q ? `/websites?q=${encodeURIComponent(q)}` : '/websites');
  };

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      className={cn('w-full max-w-[540px]', className)}
    >
      <div className="flex h-[52px] items-stretch overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#0c1520]">
        <label htmlFor="hero-website-search" className="sr-only">
          Search Fashion, Electronics, Grocery
        </label>
        <input
          id="hero-website-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search Fashion, Electronics, Grocery..."
          className="min-w-0 flex-1 bg-transparent px-4 text-base text-text-primary outline-none placeholder:text-text-muted"
          autoComplete="off"
        />
        <button
          type="submit"
          className={cn(
            'm-1.5 inline-flex aspect-square h-[calc(100%-0.75rem)] shrink-0 items-center justify-center rounded-xl',
            'bg-[#2563eb] text-white transition-colors hover:bg-[#1d4ed8]',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60a5fa]'
          )}
          aria-label="Search websites"
        >
          <Search className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </form>
  );
}
