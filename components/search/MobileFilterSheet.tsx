'use client';

import { useEffect } from 'react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MAIN_MARKETPLACE_CATEGORIES } from '@/constants/mainMarketplaceCategories';
import type {
  MarketplaceBudgetFilter,
  MarketplaceDeliveryFilter,
  MarketplaceRatingFilter,
  MarketplaceSortOption,
} from '@/lib/search/types';

type MobileFilterSheetProps = {
  open: boolean;
  onClose: () => void;
  sort: MarketplaceSortOption;
  onSortChange: (v: MarketplaceSortOption) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  budget: MarketplaceBudgetFilter;
  onBudgetChange: (v: MarketplaceBudgetFilter) => void;
  delivery: MarketplaceDeliveryFilter;
  onDeliveryChange: (v: MarketplaceDeliveryFilter) => void;
  rating: MarketplaceRatingFilter;
  onRatingChange: (v: MarketplaceRatingFilter) => void;
};

const SORT_OPTIONS: { value: MarketplaceSortOption; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'top-rated', label: 'Top Rated' },
  { value: 'price-low', label: 'Price Low to High' },
  { value: 'price-high', label: 'Price High to Low' },
  { value: 'fast-delivery', label: 'Fast Delivery' },
];

export function MobileFilterSheet({
  open,
  onClose,
  sort,
  onSortChange,
  category,
  onCategoryChange,
  budget,
  onBudgetChange,
  delivery,
  onDeliveryChange,
  rating,
  onRatingChange,
}: MobileFilterSheetProps) {
  useBodyScrollLock(open);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            className="fixed inset-0 z-50 bg-black/40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-label="Close filters"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-sheet-title"
            className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white dark:bg-slate-900 shadow-2xl lg:hidden flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10">
              <h2 id="filter-sheet-title" className="text-lg font-bold text-text-primary">
                Filters
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div>
                <label htmlFor="mobile-sort" className="block text-xs font-bold text-text-muted uppercase mb-2">
                  Sort by
                </label>
                <select
                  id="mobile-sort"
                  value={sort}
                  onChange={(e) => onSortChange(e.target.value as MarketplaceSortOption)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-sm font-semibold"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="mobile-category" className="block text-xs font-bold text-text-muted uppercase mb-2">
                  Category
                </label>
                <select
                  id="mobile-category"
                  value={category}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-sm font-semibold"
                >
                  <option value="all">All Categories</option>
                  {MAIN_MARKETPLACE_CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="mobile-budget" className="block text-xs font-bold text-text-muted uppercase mb-2">
                  Budget
                </label>
                <select
                  id="mobile-budget"
                  value={budget}
                  onChange={(e) => onBudgetChange(e.target.value as MarketplaceBudgetFilter)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-sm font-semibold"
                >
                  <option value="all">Any budget</option>
                  <option value="under-15k">Under ৳15,000</option>
                  <option value="15k-50k">৳15k – ৳50k</option>
                  <option value="50k-150k">৳50k – ৳150k</option>
                  <option value="150k-plus">৳150,000+</option>
                </select>
              </div>

              <div>
                <label htmlFor="mobile-delivery" className="block text-xs font-bold text-text-muted uppercase mb-2">
                  Delivery time
                </label>
                <select
                  id="mobile-delivery"
                  value={delivery}
                  onChange={(e) => onDeliveryChange(e.target.value as MarketplaceDeliveryFilter)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-sm font-semibold"
                >
                  <option value="all">Any delivery</option>
                  <option value="1-7">1–7 days</option>
                  <option value="8-21">8–21 days</option>
                  <option value="22-plus">22+ days</option>
                </select>
              </div>

              <div>
                <label htmlFor="mobile-rating" className="block text-xs font-bold text-text-muted uppercase mb-2">
                  Rating
                </label>
                <select
                  id="mobile-rating"
                  value={rating}
                  onChange={(e) => onRatingChange(e.target.value as MarketplaceRatingFilter)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-sm font-semibold"
                >
                  <option value="all">Any rating</option>
                  <option value="4.5">4.5+</option>
                  <option value="4.7">4.7+</option>
                  <option value="4.9">4.9+</option>
                </select>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl deshi-btn-primary text-sm font-bold"
              >
                Apply filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
