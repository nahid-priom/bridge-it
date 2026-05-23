'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { productsSearchUrl } from '@/lib/routes';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/cn';

type NavbarSearchProps = {
  className?: string;
  autoFocus?: boolean;
  onSubmitted?: () => void;
  /** Drawer uses full width; desktop uses fixed widths via className */
  variant?: 'bar' | 'drawer';
};

function NavbarSearchForm({
  className,
  autoFocus,
  onSubmitted,
  variant = 'bar',
}: NavbarSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [q, setQ] = useState('');

  useEffect(() => {
    if (pathname === '/products') {
      setQ(searchParams.get('q') ?? '');
    }
  }, [pathname, searchParams]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = q.trim();
    useStore.setState({ isMenuOpen: false, searchQuery: trimmed });
    onSubmitted?.();
    router.push(productsSearchUrl(trimmed));
  };

  return (
    <form onSubmit={submit} role="search" className={cn('w-full', className)}>
      <div className="relative w-full">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400 dark:text-white/40 pointer-events-none"
          aria-hidden
        />
        <input
          type="search"
          name="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search services, sellers, products..."
          aria-label="Search marketplace"
          autoFocus={autoFocus}
          className={cn(
            'w-full h-12 rounded-full text-sm text-text-primary placeholder:text-slate-400',
            'bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10',
            'pl-11 pr-14',
            'focus:outline-none focus:border-bridge-primary focus-visible:ring-2 focus-visible:ring-bridge-primary/40',
            'dark:text-white dark:placeholder:text-white/40',
            variant === 'drawer' && 'shadow-sm'
          )}
        />
        <button
          type="submit"
          className={cn(
            'absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9',
            'flex items-center justify-center rounded-full cursor-pointer',
            'bg-gradient-to-br from-bridge-primary to-bridge-primary-light text-white',
            'shadow-[0_4px_14px_rgba(108,60,225,0.45)] hover:shadow-[0_6px_18px_rgba(108,60,225,0.55)]',
            'transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-bridge-primary/40'
          )}
          aria-label="Submit search"
        >
          <Search className="w-4 h-4" aria-hidden />
        </button>
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
            'h-12 w-full rounded-full bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10',
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
