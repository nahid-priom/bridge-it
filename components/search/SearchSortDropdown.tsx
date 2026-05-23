'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { SearchSortOption } from '@/lib/searchFilter';
import { cn, focusVisibleInput } from '@/lib/cn';

interface SearchSortDropdownProps {
  value: SearchSortOption;
  onChange: (value: SearchSortOption) => void;
}

const OPTIONS: { value: SearchSortOption; label: string }[] = [
  { value: 'relevance', label: 'Best Match' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
];

export const SearchSortDropdown: React.FC<SearchSortDropdownProps> = ({ value, onChange }) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SearchSortOption)}
        className={cn(
          'appearance-none pl-4 pr-10 py-2.5 bg-surface border border-border-subtle rounded-xl text-sm text-text-primary cursor-pointer',
          focusVisibleInput
        )}
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
    </div>
  );
};
