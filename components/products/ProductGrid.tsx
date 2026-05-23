'use client';

import { memo } from 'react';
import type { Product } from '@/types/product';
import { ProductCard } from '@/components/products/ProductCard';
import { SearchSkeletonCard } from '@/components/search/SearchSkeletonCard';

type ProductGridProps = {
  products: Product[];
  viewMode: 'grid' | 'list';
  loading?: boolean;
  onAddToCart: (product: Product) => void;
};

export const ProductGrid = memo(function ProductGrid({
  products,
  viewMode,
  loading = false,
  onAddToCart,
}: ProductGridProps) {
  if (loading) {
    return (
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5'
            : 'flex flex-col gap-4'
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
          ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5'
          : 'flex flex-col gap-4'
      }
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          viewMode={viewMode}
          onAddToCart={onAddToCart}
          priorityImage={index < 3}
        />
      ))}
    </div>
  );
});
