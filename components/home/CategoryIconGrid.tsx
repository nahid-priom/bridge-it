'use client';

import { useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Bot,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Globe,
  LayoutGrid,
  Megaphone,
  Smartphone,
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { HOME_CATEGORY_GRID, HOME_SECTION_IDS } from '@/data/homeContent';
import type { HomeCategoryItem } from '@/data/homeContent';
import type { Category } from '@/types';
import { cn } from '@/lib/cn';

const ICON_MAP = {
  web: Globe,
  app: Smartphone,
  software: Cpu,
  marketing: Megaphone,
  ai: Bot,
  more: LayoutGrid,
} as const;

type CategoryIconGridProps = {
  categories?: Category[];
};

function CategoryCard({
  cat,
  count,
  className,
}: {
  cat: HomeCategoryItem;
  count?: number;
  className?: string;
}) {
  const isMore = cat.id === 'more';
  const Icon = ICON_MAP[cat.id as keyof typeof ICON_MAP] ?? LayoutGrid;

  return (
    <Link
      href={cat.href}
      className={cn(
        'group relative flex flex-col items-center text-center h-full',
        'p-4 sm:p-5 rounded-2xl border transition-all duration-300',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        isMore
          ? 'border-dashed border-slate-200/90 dark:border-white/15 bg-gradient-to-br from-slate-50 to-white dark:from-white/5 dark:to-transparent hover:border-deshi-green/50'
          : [
              'border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900/60',
              'shadow-[0_2px_12px_rgba(15,23,42,0.04)] dark:shadow-none',
              'hover:border-deshi-green/35 hover:shadow-[0_12px_32px_rgba(16,185,129,0.12)] hover:-translate-y-0.5',
            ],
        className
      )}
    >
      <div
        className={cn(
          'relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-3',
          'transition-transform duration-300 group-hover:scale-110 group-hover:rotate-1',
          'ring-1 ring-inset ring-white/20'
        )}
        style={{
          background: `linear-gradient(145deg, ${cat.color}28 0%, ${cat.color}10 55%, transparent 100%)`,
          boxShadow: `0 8px 24px ${cat.color}22`,
        }}
      >
        <Icon
          className="w-7 h-7 sm:w-8 sm:h-8 transition-colors"
          style={{ color: cat.color }}
          strokeWidth={1.75}
          aria-hidden
        />
      </div>

      <h3 className="text-xs sm:text-sm font-bold text-text-primary leading-snug px-0.5">
        {cat.name}
      </h3>

      {cat.subtitle && (
        <p className="mt-1 text-[10px] sm:text-[11px] text-text-muted leading-snug line-clamp-2 px-1">
          {cat.subtitle}
        </p>
      )}

      {count !== undefined && count > 0 && !isMore && (
        <p className="mt-2 text-[10px] font-semibold text-deshi-green">{count}+ services</p>
      )}

      {!isMore && (
        <span
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          aria-hidden
        >
          <ArrowRight className="w-3 h-3 text-deshi-green" />
        </span>
      )}
    </Link>
  );
}

export function CategoryIconGrid({ categories }: CategoryIconGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const countById = new Map(categories?.map((c) => [c.id, c.count]) ?? []);

  const scroll = useCallback((dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const step = el.clientWidth * 0.85;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  }, []);

  return (
    <section
      id={HOME_SECTION_IDS.categories}
      className="py-12 md:py-16 bg-background overflow-hidden"
      aria-labelledby="category-grid-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8 md:mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-deshi-green mb-2">
              Explore the marketplace
            </p>
            <h2
              id="category-grid-heading"
              className="text-2xl md:text-3xl font-black font-display text-text-primary"
            >
              Browse Popular <span className="text-deshi-green">Categories</span>
            </h2>
          </div>
          <Link
            href={ROUTES.categories}
            className="inline-flex items-center gap-1 text-sm font-semibold text-deshi-green hover:text-deshi-green-dark shrink-0"
          >
            View all categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile & tablet: 3×2 grid (two rows) */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 lg:hidden">
          {HOME_CATEGORY_GRID.map((cat, i) => {
            const count = cat.categoryId ? countById.get(cat.categoryId) : undefined;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
                className="min-h-[148px] sm:min-h-[160px]"
              >
                <CategoryCard cat={cat} count={count} className="h-full" />
              </motion.div>
            );
          })}
        </div>

        {/* Desktop: single-row carousel (all 6 visible on 2xl) */}
        <div className="hidden lg:block relative">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-12 z-10 bg-gradient-to-r from-background to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-12 z-10 bg-gradient-to-l from-background to-transparent 2xl:hidden"
            aria-hidden
          />

          <button
            type="button"
            onClick={() => scroll(-1)}
            className={cn(
              'absolute left-0 top-1/2 -translate-y-1/2 z-20 -ml-2',
              'w-10 h-10 rounded-full border border-slate-200 dark:border-white/10',
              'bg-white dark:bg-slate-900 shadow-lg flex items-center justify-center',
              'text-text-primary hover:border-deshi-green/40 hover:text-deshi-green transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40',
              '2xl:hidden'
            )}
            aria-label="Scroll categories left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => scroll(1)}
            className={cn(
              'absolute right-0 top-1/2 -translate-y-1/2 z-20 -mr-2',
              'w-10 h-10 rounded-full border border-slate-200 dark:border-white/10',
              'bg-white dark:bg-slate-900 shadow-lg flex items-center justify-center',
              'text-text-primary hover:border-deshi-green/40 hover:text-deshi-green transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40',
              '2xl:hidden'
            )}
            aria-label="Scroll categories right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div
            ref={scrollRef}
            className={cn(
              'flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-1 -mx-1 px-1',
              '2xl:overflow-visible 2xl:snap-none 2xl:grid 2xl:grid-cols-6 2xl:gap-4'
            )}
          >
            {HOME_CATEGORY_GRID.map((cat, i) => {
              const count = cat.categoryId ? countById.get(cat.categoryId) : undefined;
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className={cn(
                    'snap-start shrink-0',
                    'w-[calc((100%-3rem)/4)] min-w-[168px]',
                    'xl:w-[calc((100%-4rem)/5)] xl:min-w-[172px]',
                    '2xl:w-auto 2xl:min-w-0'
                  )}
                >
                  <CategoryCard cat={cat} count={count} className="h-full min-h-[172px]" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
