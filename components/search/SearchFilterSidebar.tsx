'use client';

import React from 'react';
import { SearchFilters, SearchFilterResultType } from '@/types';
import { categories } from '@/data/categories';

interface SearchFilterSidebarProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  onClearAll: () => void;
  className?: string;
}

const RESULT_TYPES: { value: SearchFilterResultType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'service', label: 'Services' },
  { value: 'digital-product', label: 'Digital Products' },
  { value: 'seller', label: 'Sellers' },
  { value: 'course', label: 'Courses' },
];

const DELIVERY_OPTIONS = [
  { value: 'all', label: 'Any delivery' },
  { value: 'instant', label: 'Instant' },
  { value: '1-3', label: '1–3 days' },
  { value: '4-7', label: '4–7 days' },
  { value: '8-14', label: '8–14 days' },
  { value: '15+', label: '15+ days' },
] as const;

const LOCATIONS = ['all', 'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Remote'];
const LANGUAGES = ['all', 'English', 'Bengali', 'English & Bengali'];

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">{title}</h4>
      {children}
    </div>
  );
}

export const SearchFilterSidebar: React.FC<SearchFilterSidebarProps> = ({
  filters,
  onChange,
  onClearAll,
  className = '',
}) => {
  const update = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <aside
      className={`glass-card rounded-2xl p-5 border border-border-subtle ${className}`}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-bold text-text-primary">Filters</h3>
        <button
          onClick={onClearAll}
          className="text-xs text-bridge-primary-light hover:text-text-primary transition-colors cursor-pointer"
        >
          Clear all
        </button>
      </div>

      <FilterSection title="Result type">
        <div className="flex flex-wrap gap-2">
          {RESULT_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => update('resultType', type.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                filters.resultType === type.value
                  ? 'bg-bridge-primary text-white'
                  : 'bg-surface text-text-muted hover:text-text-primary border border-border-subtle'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Category">
        <select
          value={filters.category}
          onChange={(e) => update('category', e.target.value as SearchFilters['category'])}
          className="w-full px-3 py-2.5 bg-surface border border-border-subtle rounded-xl text-sm text-text-primary focus:outline-none focus:border-bridge-primary cursor-pointer"
        >
          <option value="all">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>
      </FilterSection>

      <FilterSection title="Price range (৳)">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={filters.priceMin}
            onChange={(e) => update('priceMin', Number(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-lg text-sm text-text-primary focus:outline-none"
            placeholder="Min"
          />
          <span className="text-text-muted text-sm">–</span>
          <input
            type="number"
            min={0}
            value={filters.priceMax}
            onChange={(e) => update('priceMax', Number(e.target.value) || 200000)}
            className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-lg text-sm text-text-primary focus:outline-none"
            placeholder="Max"
          />
        </div>
      </FilterSection>

      <FilterSection title="Delivery time">
        <select
          value={filters.deliveryTime}
          onChange={(e) => update('deliveryTime', e.target.value as SearchFilters['deliveryTime'])}
          className="w-full px-3 py-2.5 bg-surface border border-border-subtle rounded-xl text-sm text-text-primary focus:outline-none cursor-pointer"
        >
          {DELIVERY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </FilterSection>

      <FilterSection title="Minimum rating">
        <select
          value={filters.minRating}
          onChange={(e) => update('minRating', Number(e.target.value))}
          className="w-full px-3 py-2.5 bg-surface border border-border-subtle rounded-xl text-sm text-text-primary focus:outline-none cursor-pointer"
        >
          <option value={0}>Any rating</option>
          <option value={4}>4+ stars</option>
          <option value={4.5}>4.5+ stars</option>
          <option value={4.8}>4.8+ stars</option>
        </select>
      </FilterSection>

      <FilterSection title="Seller location">
        <select
          value={filters.location}
          onChange={(e) => update('location', e.target.value)}
          className="w-full px-3 py-2.5 bg-surface border border-border-subtle rounded-xl text-sm text-text-primary focus:outline-none cursor-pointer"
        >
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc === 'all' ? 'All locations' : loc}
            </option>
          ))}
        </select>
      </FilterSection>

      <FilterSection title="Language">
        <select
          value={filters.language}
          onChange={(e) => update('language', e.target.value)}
          className="w-full px-3 py-2.5 bg-surface border border-border-subtle rounded-xl text-sm text-text-primary focus:outline-none cursor-pointer"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang === 'all' ? 'All languages' : lang}
            </option>
          ))}
        </select>
      </FilterSection>

      <FilterSection title="Options">
        <div className="space-y-2.5">
          {(
            [
              ['verifiedOnly', 'Verified only'],
              ['featuredOnly', 'Featured only'],
              ['protectedDemoOnly', 'Protected demo'],
              ['escrowOnly', 'Escrow available'],
              ['instantOnly', 'Instant delivery'],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters[key]}
                onChange={(e) => update(key, e.target.checked)}
                className="w-4 h-4 rounded border-border-subtle bg-surface text-bridge-primary focus:ring-bridge-primary/30"
              />
              <span className="text-sm text-text-muted group-hover:text-text-primary transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>
    </aside>
  );
};
