'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, Sparkles } from 'lucide-react';
import { categories } from '@/data/categories';
import { productsUrl } from '@/lib/routes';
import type { CategoryType } from '@/types';

interface ProductsEmptyStateProps {
  query?: string;
  onClearFilters: () => void;
  suggestedCategories?: CategoryType[];
}

export const ProductsEmptyState: React.FC<ProductsEmptyStateProps> = ({
  query,
  onClearFilters,
  suggestedCategories = ['web-development', 'digital-marketing', 'ui-ux-design'],
}) => {
  const suggested = suggestedCategories
    .map((id) => categories.find((c) => c.id === id))
    .filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-2xl p-12 md:p-16 text-center border border-border-subtle"
    >
      <Package className="w-14 h-14 text-text-muted mx-auto mb-4 opacity-60" />
      <h2 className="text-xl font-bold text-text-primary mb-2">No services found</h2>
      <p className="text-text-muted text-sm max-w-md mx-auto mb-6">
        {query
          ? `We couldn't find matches for "${query}". Try different keywords or adjust your filters.`
          : 'Try adjusting your filters or browse a popular category below.'}
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
        <button
          type="button"
          onClick={onClearFilters}
          className="px-5 py-2.5 glass border border-border-subtle rounded-xl text-sm text-text-primary hover:border-bridge-primary/40 transition-colors cursor-pointer"
        >
          Clear Filters
        </button>
      </div>
      {suggested.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
            Suggested categories
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {suggested.map((cat) => (
              <Link
                key={cat!.id}
                href={productsUrl(cat!.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-bridge-primary/10 border border-bridge-primary/25 text-bridge-primary-light hover:bg-bridge-primary/20 transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                {cat!.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
