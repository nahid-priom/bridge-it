'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { SearchSubcategoryChip } from '@/lib/search/searchCategoryContent';
import { cn } from '@/lib/cn';

type SearchCategoryChipsProps = {
  chips: SearchSubcategoryChip[];
  activeId: string | null;
  onSelect: (chip: SearchSubcategoryChip) => void;
  className?: string;
};

export function SearchCategoryChips({
  chips,
  activeId,
  onSelect,
  className,
}: SearchCategoryChipsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState, chips]);

  const scrollBy = (dir: -1 | 1) => {
    scrollRef.current?.scrollBy({ left: dir * 220, behavior: 'smooth' });
  };

  return (
    <div className={cn('relative group/chips', className)}>
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-white/10 shadow-md text-text-muted hover:text-text-primary"
          aria-label="Scroll categories left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scrollBy(1)}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-white/10 shadow-md text-text-muted hover:text-text-primary"
          aria-label="Scroll categories right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-none scroll-smooth py-0.5 md:px-1"
        role="list"
        aria-label="Subcategories"
      >
        {chips.map((chip) => {
          const selected = activeId === chip.id;
          return (
            <motion.button
              key={chip.id}
              type="button"
              role="listitem"
              onClick={() => onSelect(chip)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'shrink-0 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap',
                'border transition-colors duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/50',
                selected
                  ? 'bg-deshi-green text-white border-deshi-green shadow-sm shadow-emerald-500/20'
                  : 'bg-white dark:bg-slate-900/80 text-text-secondary border-slate-200/90 dark:border-white/12 hover:border-deshi-green/40 hover:text-deshi-green dark:hover:text-emerald-400'
              )}
              aria-pressed={selected}
            >
              {chip.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
