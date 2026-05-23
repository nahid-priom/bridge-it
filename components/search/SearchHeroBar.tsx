'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface SearchHeroBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
}

export const SearchHeroBar: React.FC<SearchHeroBarProps> = ({
  query,
  onQueryChange,
  onSearch,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-6"
    >
      <div className="glass-card rounded-2xl p-5 md:p-6 border border-border-subtle relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-bridge-primary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-bridge-cyan/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <h1 className="text-2xl md:text-3xl font-bold font-display text-text-primary mb-1">
            Search <span className="gradient-text">Deshi Fiverr</span>
          </h1>
          <p className="text-sm text-text-muted mb-5 max-w-2xl">
            Find verified services, digital products, sellers, and virtual offices.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSearch();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Search services, products, sellers, categories..."
                className="w-full pl-12 pr-4 py-3.5 bg-surface border border-border-subtle rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-bridge-primary focus:ring-2 focus:ring-bridge-primary/20"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 bg-gradient-to-r from-bridge-primary to-bridge-primary-light hover:shadow-lg hover:shadow-bridge-primary/25 rounded-xl text-white font-semibold text-sm transition-all cursor-pointer whitespace-nowrap"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};
