import React from 'react';
import { X } from 'lucide-react';
import { SearchFilters } from '../../types';
import { categories } from '../../data/categories';

interface ActiveFilterChipsProps {
  filters: SearchFilters;
  onRemove: (key: keyof SearchFilters | 'price' | 'clear') => void;
  onClearAll: () => void;
}

const RESULT_LABELS: Record<string, string> = {
  all: 'All',
  service: 'Services',
  'digital-product': 'Digital Products',
  seller: 'Sellers',
  course: 'Courses',
};

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  filters,
  onRemove,
  onClearAll,
}) => {
  const chips: { key: keyof SearchFilters | 'price'; label: string }[] = [];

  if (filters.resultType !== 'all') {
    chips.push({ key: 'resultType', label: RESULT_LABELS[filters.resultType] ?? filters.resultType });
  }
  if (filters.category !== 'all') {
    const cat = categories.find((c) => c.id === filters.category);
    chips.push({ key: 'category', label: cat?.name ?? filters.category });
  }
  if (filters.priceMin > 0 || filters.priceMax < 200000) {
    chips.push({
      key: 'price',
      label: `৳${filters.priceMin.toLocaleString()} – ৳${filters.priceMax.toLocaleString()}`,
    });
  }
  if (filters.deliveryTime !== 'all') {
    chips.push({ key: 'deliveryTime', label: `Delivery: ${filters.deliveryTime}` });
  }
  if (filters.minRating > 0) {
    chips.push({ key: 'minRating', label: `${filters.minRating}+ stars` });
  }
  if (filters.verifiedOnly) chips.push({ key: 'verifiedOnly', label: 'Verified' });
  if (filters.featuredOnly) chips.push({ key: 'featuredOnly', label: 'Featured' });
  if (filters.protectedDemoOnly) chips.push({ key: 'protectedDemoOnly', label: 'Protected demo' });
  if (filters.location !== 'all') chips.push({ key: 'location', label: filters.location });
  if (filters.language !== 'all') chips.push({ key: 'language', label: filters.language });
  if (filters.escrowOnly) chips.push({ key: 'escrowOnly', label: 'Escrow' });
  if (filters.instantOnly) chips.push({ key: 'instantOnly', label: 'Instant delivery' });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {chips.map((chip) => (
        <button
          key={`${chip.key}-${chip.label}`}
          onClick={() => onRemove(chip.key)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-bridge-primary/15 border border-bridge-primary/30 text-bridge-primary-light hover:bg-bridge-primary/25 transition-colors cursor-pointer"
        >
          {chip.label}
          <X className="w-3 h-3" />
        </button>
      ))}
      <button
        onClick={onClearAll}
        className="text-xs text-bridge-gray hover:text-white transition-colors cursor-pointer px-2"
      >
        Clear all
      </button>
    </div>
  );
};
