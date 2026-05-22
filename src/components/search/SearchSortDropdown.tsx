import React from 'react';
import { ChevronDown } from 'lucide-react';
import { SearchSortOption } from '../../utils/searchFilter';

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
        className="appearance-none pl-4 pr-10 py-2.5 bg-bridge-dark-2 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-bridge-primary cursor-pointer"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bridge-gray pointer-events-none" />
    </div>
  );
};
