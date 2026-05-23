'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Search as SearchIcon, Sparkles, Store, Package, Briefcase, X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { buildSearchUrl, parseSearchParams } from '@/lib/search/searchHelpers';
import { ROUTES, productsSearchUrl } from '@/lib/routes';
import { SEARCH_POPULAR_CHIPS } from '@/constants/mainMarketplaceCategories';
import { cn } from '@/lib/cn';

const RECENT_KEY = 'deshi-recent-searches';
const PLACEHOLDERS = [
  'Search websites...',
  'Search products...',
  'Search freelancers...',
  'Search software...',
] as const;

export type SmartSearchBarProps = {
  className?: string;
  compact?: boolean;
  scrolled?: boolean;
  onOpenCommandPalette?: () => void;
  onSubmitted?: () => void;
};

function readRecent(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(parsed) ? parsed.slice(0, 5) : [];
  } catch {
    return [];
  }
}

function saveRecent(query: string) {
  if (!query.trim() || typeof window === 'undefined') return;
  const prev = readRecent().filter((q) => q !== query);
  localStorage.setItem(RECENT_KEY, JSON.stringify([query, ...prev].slice(0, 5)));
}

function SmartSearchBarInner({
  className,
  compact = false,
  scrolled = false,
  onOpenCommandPalette,
  onSubmitted,
}: SmartSearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setSearchQuery = useStore((s) => s.setSearchQuery);
  const openSearchModal = useStore((s) => s.openSearchModal);

  const urlState = useMemo(() => parseSearchParams(searchParams), [searchParams]);
  const [mounted, setMounted] = useState(false);
  const [q, setQ] = useState('');
  const [focused, setFocused] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (pathname === '/search' || pathname.startsWith('/search?')) {
      setQ(urlState.q);
    }
  }, [pathname, urlState.q]);

  useEffect(() => {
    if (!mounted) return;
    setRecent(readRecent());
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const id = window.setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, [mounted]);

  const placeholder = mounted ? PLACEHOLDERS[placeholderIdx] : PLACEHOLDERS[0];

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const submit = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) return;
      setSearchQuery(trimmed);
      saveRecent(trimmed);
      setRecent(readRecent());
      useStore.setState({ isMenuOpen: false });
      onSubmitted?.();
      router.push(
        buildSearchUrl({
          q: trimmed,
          category: pathname.startsWith('/search') ? urlState.category : 'all',
          page: 1,
        })
      );
      setFocused(false);
    },
    [onSubmitted, pathname, router, setSearchQuery, urlState.category]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit(q);
  };

  const clear = () => {
    setQ('');
    setSearchQuery('');
    if (pathname.startsWith('/search')) {
      router.push(buildSearchUrl({ q: '', category: 'all', page: 1 }));
    }
  };

  const openPalette = onOpenCommandPalette ?? openSearchModal;
  const showPanel = focused;

  const quickFilters = [
    { label: 'Services', href: ROUTES.search, icon: Briefcase },
    { label: 'Products', href: ROUTES.products, icon: Package },
    { label: 'Sellers', href: `${ROUTES.search}?q=freelancer`, icon: Store },
  ] as const;

  return (
    <div ref={wrapRef} className={cn('relative w-full', className)}>
      <form onSubmit={handleSubmit} role="search">
        <motion.div
          transition={{ duration: 0.25 }}
          className={cn(
            'relative rounded-full transition-all duration-300',
            'bg-white/95 dark:bg-white/[0.07]',
            'border border-slate-200/90 dark:border-white/12',
            focused
              ? 'border-deshi-green/50 dark:border-emerald-500/40 shadow-[0_0_0_3px_rgba(16,185,129,0.12)]'
              : 'shadow-none',
            compact || scrolled ? 'h-11' : 'h-12'
          )}
        >
          <SearchIcon
            className={cn(
              'absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] pointer-events-none transition-colors',
              focused ? 'text-deshi-green' : 'text-slate-400 dark:text-white/40'
            )}
            aria-hidden
          />
          <input
            type="search"
            name="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder={placeholder}
            suppressHydrationWarning
            aria-label="Search marketplace"
            aria-expanded={showPanel}
            aria-controls="smart-search-panel"
            className={cn(
              'w-full h-full rounded-full bg-transparent text-sm text-text-primary',
              'pl-11 pr-[5.25rem] sm:pr-[6.5rem] focus:outline-none',
              'placeholder:text-slate-400 dark:placeholder:text-white/35 dark:text-white'
            )}
          />
          {q.length > 0 && (
            <button
              type="button"
              onClick={clear}
              className="absolute right-[3.25rem] sm:right-[4.5rem] top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              openPalette();
            }}
            className={cn(
              'absolute right-14 top-1/2 -translate-y-1/2 hidden sm:inline-flex',
              'items-center gap-0.5 px-2 py-1 rounded-md text-[10px] font-semibold',
              'text-slate-500 dark:text-white/45 border border-slate-200/80 dark:border-white/10',
              'bg-slate-50/90 dark:bg-white/5 hover:text-text-primary transition-colors'
            )}
            aria-label="Open command search"
          >
            <span className="font-mono">⌘</span>K
          </button>
          <button
            type="submit"
            aria-label="Search"
            className={cn(
              'absolute right-1.5 top-1/2 -translate-y-1/2',
              'h-9 w-9 flex items-center justify-center rounded-full text-white',
              'bg-gradient-to-r from-deshi-green to-emerald-500',
              'shadow-[0_4px_14px_rgba(16,185,129,0.4)] hover:brightness-105 transition-all',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/50'
            )}
          >
            <SearchIcon className="w-4 h-4" aria-hidden />
          </button>
        </motion.div>
      </form>

      <AnimatePresence>
        {showPanel && (
          <motion.div
            id="smart-search-panel"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18 }}
            className={cn(
              'absolute top-[calc(100%+8px)] left-0 right-0 z-50',
              'rounded-2xl border border-slate-200/90 dark:border-white/10',
              'bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl',
              'shadow-[0_24px_60px_rgba(15,23,42,0.14)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.5)]',
              'p-3 overflow-hidden'
            )}
          >
            <div className="flex gap-1.5 mb-3">
              {quickFilters.map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setFocused(false)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-white/5 text-text-secondary hover:bg-deshi-green/10 hover:text-deshi-green transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden />
                  {label}
                </Link>
              ))}
            </div>

            {recent.length > 0 && (
              <div className="mb-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted px-1 mb-1.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" aria-hidden />
                  Recent
                </p>
                <ul className="space-y-0.5">
                  {recent.map((term) => (
                    <li key={term}>
                      <button
                        type="button"
                        onClick={() => submit(term)}
                        className="w-full text-left px-2 py-1.5 rounded-lg text-sm text-text-secondary hover:bg-slate-50 dark:hover:bg-white/5 hover:text-deshi-green"
                      >
                        {term}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted px-1 mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-violet-500" aria-hidden />
                Trending
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SEARCH_POPULAR_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => submit(chip)}
                    className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-white/10 flex gap-2">
              <Link
                href={productsSearchUrl(q)}
                onClick={() => setFocused(false)}
                className="text-[11px] font-medium text-sky-600 dark:text-sky-400 hover:underline"
              >
                Search products →
              </Link>
              <Link
                href={ROUTES.search}
                onClick={() => setFocused(false)}
                className="text-[11px] font-medium text-deshi-green hover:underline"
              >
                Browse services →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SmartSearchBar(props: SmartSearchBarProps) {
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
      <SmartSearchBarInner {...props} />
    </Suspense>
  );
}
