'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Clock, Search, Sparkles, TrendingUp, X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useNavigateToSearch } from '@/hooks/useNavigateToSearch';
import { ROUTES, productsSearchUrl } from '@/lib/routes';
import { SEARCH_POPULAR_CHIPS } from '@/constants/mainMarketplaceCategories';
import { NAV_SERVICE_ITEMS } from '@/components/navbar/constants';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { cn } from '@/lib/cn';

const RECENT_KEY = 'deshi-recent-searches';

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

const overlayEase = [0.22, 1, 0.36, 1] as const;

export function MobileSearchOverlay() {
  const open = useStore((s) => s.isSearchModalOpen);
  const closeSearchModal = useStore((s) => s.closeSearchModal);
  const searchQuery = useStore((s) => s.searchQuery);
  const setSearchQuery = useStore((s) => s.setSearchQuery);
  const { goToSearch } = useNavigateToSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const [recent, setRecent] = useState<string[]>([]);

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    setRecent(readRecent());
    const t = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(t);
  }, [open]);

  const submit = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      if (trimmed) saveRecent(trimmed);
      closeSearchModal();
      goToSearch(trimmed);
    },
    [closeSearchModal, goToSearch]
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[85] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Search marketplace"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-md"
            aria-label="Close search"
            onClick={closeSearchModal}
          />

          <motion.div
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.32, ease: overlayEase }}
            className="relative flex flex-col h-full bg-white/95 dark:bg-deshi-navy/98 backdrop-blur-2xl"
          >
            <div className="sticky top-0 z-10 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 border-b border-slate-100/90 dark:border-white/10 bg-white/90 dark:bg-deshi-navy/90 backdrop-blur-xl">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submit(searchQuery);
                }}
                className="flex items-center gap-2"
              >
                <div className="flex-1 flex items-center gap-2.5 h-11 px-3.5 rounded-2xl bg-slate-100/90 dark:bg-white/[0.08] border border-slate-200/60 dark:border-white/10">
                  <Search className="w-[18px] h-[18px] text-deshi-green shrink-0" aria-hidden />
                  <input
                    ref={inputRef}
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search services..."
                    autoComplete="off"
                    className="flex-1 min-w-0 bg-transparent text-[15px] text-text-primary placeholder:text-text-muted focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={closeSearchModal}
                  aria-label="Close search"
                  className="inline-flex items-center justify-center w-11 h-11 rounded-full text-text-muted hover:bg-slate-100 dark:hover:bg-white/10 shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
              {recent.length > 0 && (
                <section>
                  <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2.5">
                    <Clock className="w-3.5 h-3.5" aria-hidden />
                    Recent
                  </h3>
                  <ul className="space-y-0.5">
                    {recent.map((item) => (
                      <li key={item}>
                        <button
                          type="button"
                          onClick={() => submit(item)}
                          className="flex items-center justify-between w-full py-2.5 text-sm font-medium text-text-primary rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 px-2 -mx-2"
                        >
                          {item}
                          <ArrowRight className="w-4 h-4 text-text-muted opacity-50" aria-hidden />
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section>
                <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2.5">
                  <TrendingUp className="w-3.5 h-3.5" aria-hidden />
                  Trending
                </h3>
                <div className="flex flex-wrap gap-2">
                  {SEARCH_POPULAR_CHIPS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => submit(tag)}
                      className="px-3 py-1.5 text-xs font-medium rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-deshi-green border border-emerald-100/80 dark:border-emerald-500/20"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2.5">
                  <Sparkles className="w-3.5 h-3.5" aria-hidden />
                  Categories
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {NAV_SERVICE_ITEMS.slice(0, 4).map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`${ROUTES.search}?category=${encodeURIComponent(cat.slug)}`}
                      onClick={closeSearchModal}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium bg-slate-50 dark:bg-white/[0.05] border border-slate-100 dark:border-white/10"
                    >
                      <span aria-hidden>{cat.icon}</span>
                      <span className="truncate">{cat.label}</span>
                    </Link>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2.5">
                  Products
                </h3>
                <Link
                  href={productsSearchUrl('')}
                  onClick={closeSearchModal}
                  className="flex items-center justify-between py-3 px-3 rounded-xl bg-violet-50/80 dark:bg-violet-500/10 border border-violet-100/80 dark:border-violet-500/20 text-sm font-semibold text-violet-700 dark:text-violet-300"
                >
                  Browse digital products
                  <ArrowRight className="w-4 h-4" aria-hidden />
                </Link>
              </section>

              <section>
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2.5">
                  Top freelancers
                </h3>
                <Link
                  href={ROUTES.search}
                  onClick={closeSearchModal}
                  className="flex items-center justify-between py-3 px-3 rounded-xl border border-slate-200/80 dark:border-white/10 text-sm font-medium"
                >
                  Explore verified sellers
                  <ArrowRight className="w-4 h-4 text-deshi-green" aria-hidden />
                </Link>
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
