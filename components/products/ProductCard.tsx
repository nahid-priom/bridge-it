'use client';

import React, { memo, useCallback } from 'react';
import Link from 'next/link';
import { Star, Clock, ShoppingCart, Sparkles } from 'lucide-react';
import type { Product } from '@/types/product';
import { SafeImage } from '../search/SafeImage';
import { cn, focusVisibleRing } from '@/lib/cn';

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  onAddToCart: (product: Product) => void;
  priorityImage?: boolean;
}

export const ProductCard = memo(function ProductCard({
  product,
  viewMode,
  onAddToCart,
  priorityImage = false,
}: ProductCardProps) {
  const href = `/products/${product.slug}`;
  const instant = product.deliveryTime.toLowerCase().includes('instant');

  const handleCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onAddToCart(product);
    },
    [onAddToCart, product]
  );

  return (
    <article
      className={cn(
        'group glass-card rounded-2xl overflow-hidden border border-border-subtle hover:border-bridge-primary/30 card-hover flex flex-col h-full',
        viewMode === 'list' && 'sm:flex-row sm:h-auto'
      )}
    >
      <Link
        href={href}
        className={cn(
          'relative overflow-hidden bg-surface-elevated flex-shrink-0 block',
          viewMode === 'list'
            ? 'w-full sm:w-52 aspect-[4/3] sm:aspect-auto sm:min-h-[180px]'
            : 'relative aspect-[4/3] w-full'
        )}
      >
        <SafeImage
          src={product.image}
          alt={`${product.title} — ${product.categoryLabel}`}
          fill={viewMode === 'grid'}
          sizes={
            viewMode === 'grid'
              ? '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
              : '208px'
          }
          priority={priorityImage}
          className={
            viewMode === 'grid'
              ? 'object-cover group-hover:scale-105 transition-transform duration-500'
              : 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
          }
          fallbackClassName="w-full h-full min-h-[160px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2 py-1 glass-strong text-text-primary text-[10px] font-medium rounded-lg">
            {product.categoryLabel}
          </span>
          {product.badge && (
            <span className="inline-flex items-center gap-0.5 px-2 py-1 bg-bridge-gold/20 border border-bridge-gold/30 text-bridge-gold text-[10px] font-semibold rounded-lg">
              <Sparkles className="w-3 h-3" aria-hidden />
              {product.badge}
            </span>
          )}
        </div>
        {instant && (
          <span className="absolute top-3 right-3 px-2 py-1 bg-bridge-cyan/20 text-bridge-cyan text-[10px] font-bold rounded-lg border border-bridge-cyan/30">
            Instant
          </span>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1 min-w-0">
        <p className="text-xs text-text-muted truncate mb-1">
          {product.sellerName}
          {product.sellerLevel ? (
            <span className="text-text-muted/70"> · {product.sellerLevel}</span>
          ) : null}
        </p>
        <Link href={href} className="block min-w-0 flex-1">
          <h3 className="text-sm font-bold text-text-primary mb-1 line-clamp-2 group-hover:text-bridge-primary-light transition-colors">
            {product.title}
          </h3>
          <p className="text-xs text-text-muted line-clamp-2 mb-3">{product.shortDescription}</p>
        </Link>
        <div className="flex items-center gap-3 mb-3 text-xs">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-bridge-gold fill-bridge-gold" aria-hidden />
            <span className="font-bold text-text-primary">{product.rating}</span>
            <span className="text-text-muted">({product.reviews})</span>
          </div>
          <div className="flex items-center gap-1 text-text-muted">
            <Clock className="w-3 h-3" aria-hidden />
            {product.deliveryTime}
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-border-subtle mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-text-primary">${product.price}</span>
            {product.oldPrice != null && (
              <span className="text-xs text-text-muted line-through">${product.oldPrice}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={href}
              className={cn(
                'px-3 py-2 text-xs font-medium glass border border-border-subtle rounded-xl text-text-primary hover:border-bridge-primary/40 transition-colors',
                focusVisibleRing
              )}
            >
              View Details
            </Link>
            <button
              type="button"
              onClick={handleCart}
              className={cn(
                'p-2 bg-bridge-primary hover:bg-bridge-primary-light rounded-xl text-white transition-colors cursor-pointer',
                focusVisibleRing
              )}
              aria-label={`Add ${product.title} to cart`}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
});
