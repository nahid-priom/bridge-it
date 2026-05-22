import React from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';

interface SearchEmptyStateProps {
  query: string;
  onBrowseCategories: () => void;
  onClearSearch: () => void;
}

export const SearchEmptyState: React.FC<SearchEmptyStateProps> = ({
  query,
  onBrowseCategories,
  onClearSearch,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-2xl p-12 md:p-16 text-center border border-white/10"
    >
      <Search className="w-14 h-14 text-bridge-gray mx-auto mb-4 opacity-60" />
      <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
      <p className="text-bridge-gray text-sm max-w-md mx-auto mb-6">
        {query
          ? `We couldn't find matches for "${query}". Try different keywords or adjust your filters.`
          : 'Try adjusting your filters to see more results.'}
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onClearSearch}
          className="px-5 py-2.5 glass border border-white/10 rounded-xl text-sm text-white hover:border-bridge-primary/40 transition-colors cursor-pointer"
        >
          Clear search
        </button>
        <button
          onClick={onBrowseCategories}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-bridge-primary to-bridge-primary-light rounded-xl text-sm text-white font-medium cursor-pointer"
        >
          <Sparkles className="w-4 h-4" /> Browse Categories
        </button>
      </div>
    </motion.div>
  );
};
