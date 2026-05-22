import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { cn } from '../../utils/cn';

interface AdminFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  sortValue?: string;
  onSortChange?: (value: string) => void;
  sortOptions?: { value: string; label: string }[];
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterOptions?: { value: string; label: string }[];
  children?: React.ReactNode;
}

export const AdminFilterBar: React.FC<AdminFilterBarProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  sortValue,
  onSortChange,
  sortOptions,
  filterValue,
  onFilterChange,
  filterOptions,
  children,
}) => (
  <div className="flex flex-col sm:flex-row gap-3 mb-6">
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bridge-gray" />
      <input
        type="text"
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={searchPlaceholder}
        className="w-full pl-10 pr-4 py-2.5 bg-bridge-dark-2 border border-white/10 rounded-xl text-sm text-white placeholder-bridge-gray focus:outline-none focus:border-bridge-primary focus:ring-2 focus:ring-bridge-primary/20"
      />
    </div>
    <div className="flex flex-wrap gap-2">
      {filterOptions && onFilterChange && (
        <div className="relative">
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bridge-gray pointer-events-none" />
          <select
            value={filterValue}
            onChange={(e) => onFilterChange(e.target.value)}
            className={cn(
              'pl-10 pr-8 py-2.5 bg-bridge-dark-2 border border-white/10 rounded-xl text-sm text-white',
              'focus:outline-none focus:border-bridge-primary appearance-none cursor-pointer min-w-[140px]'
            )}
          >
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-bridge-dark-2">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}
      {sortOptions && onSortChange && (
        <select
          value={sortValue}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-4 py-2.5 bg-bridge-dark-2 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-bridge-primary cursor-pointer min-w-[140px]"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-bridge-dark-2">
              {opt.label}
            </option>
          ))}
        </select>
      )}
      {children}
    </div>
  </div>
);
