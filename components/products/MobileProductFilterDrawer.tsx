'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal } from 'lucide-react';
import type { ProductListingFilters } from '@/types/product';
import { ProductFilterPanel } from './ProductFilterPanel';
import { cn, focusVisibleRing } from '@/lib/cn';

interface MobileProductFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: ProductListingFilters;
  onChange: (filters: ProductListingFilters) => void;
  onClearAll: () => void;
  activeCount: number;
}

export function MobileProductFilterDrawer({
  open,
  onClose,
  filters,
  onChange,
  onClearAll,
  activeCount,
}: MobileProductFilterDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed top-0 left-0 bottom-0 z-[70] w-[min(100%,340px)] flex flex-col bg-surface border-r border-border-subtle lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Product filters"
          >
            <div className="shrink-0 flex items-center justify-between gap-2 px-5 py-4 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-bridge-primary" aria-hidden />
                <span className="font-semibold text-text-primary">Filters</span>
                {activeCount > 0 && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-bridge-primary text-white">
                    {activeCount}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  'p-2 text-text-muted hover:text-text-primary rounded-lg cursor-pointer',
                  focusVisibleRing
                )}
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <ProductFilterPanel
              filters={filters}
              onChange={onChange}
              onClearAll={() => {
                onClearAll();
                onClose();
              }}
              className="flex-1 min-h-0"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
