'use client';

import { memo } from 'react';
import { SearchCatalogItem, Category } from '@/types';
import { SearchResultCard } from './SearchResultCard';
import { SearchSkeletonCard } from './SearchSkeletonCard';

interface SearchResultGridProps {
  items: SearchCatalogItem[];
  categories: Category[];
  viewMode: 'grid' | 'list';
  loading?: boolean;
  onViewDetails: (item: SearchCatalogItem) => void;
  onAddToCart?: (serviceId: string) => void;
}

export const SearchResultGrid = memo(function SearchResultGrid({
  items,
  categories,
  viewMode,
  loading,
  onViewDetails,
  onAddToCart,
}: SearchResultGridProps) {
  if (loading) {
    return (
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
            : 'space-y-4'
        }
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <SearchSkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
          : 'flex flex-col gap-4'
      }
    >
      {items.map((item) => (
        <SearchResultCard
          key={item.kind === 'seller' ? item.id : item.service.id}
          item={item}
          categories={categories}
          viewMode={viewMode}
          onViewDetails={onViewDetails}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
});
