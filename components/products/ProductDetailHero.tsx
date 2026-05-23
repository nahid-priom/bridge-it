'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Star,
  Clock,
  ShoppingCart,
  Heart,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Tag,
} from 'lucide-react';
import type { Product } from '@/types/product';
import { BridgeImage } from '@/components/ui/BridgeImage';
import { useStore } from '@/store/useStore';
import { productToService } from '@/lib/products/adapter';
import { cn, focusVisibleRing } from '@/lib/cn';

interface ProductDetailHeroProps {
  product: Product;
  backHref: string;
}

export function ProductDetailHero({ product, backHref }: ProductDetailHeroProps) {
  const addToCart = useStore((s) => s.addToCart);
  const [saved, setSaved] = useState(false);
  const images = product.gallery?.length ? product.gallery : [product.image];
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const next = useCallback(() => {
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <div className="space-y-3">
        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-border-subtle bg-surface-elevated shadow-[0_18px_50px_rgba(15,14,23,0.08)] dark:shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
          <BridgeImage
            src={images[activeIndex]}
            alt={product.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          {product.badge && (
            <span className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-bridge-gold/20 border border-bridge-gold/30 text-bridge-gold text-xs font-semibold">
              {product.badge}
            </span>
          )}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                className={cn(
                  'absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-surface/90 border border-border-subtle text-text-primary cursor-pointer',
                  focusVisibleRing
                )}
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={next}
                className={cn(
                  'absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-surface/90 border border-border-subtle text-text-primary cursor-pointer',
                  focusVisibleRing
                )}
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={cn(
                  'relative shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 cursor-pointer',
                  focusVisibleRing,
                  i === activeIndex ? 'border-bridge-primary' : 'border-border-subtle'
                )}
                aria-label={`View image ${i + 1}`}
                aria-current={i === activeIndex}
              >
                <BridgeImage src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
        <Link
          href={backHref}
          className="inline-flex lg:hidden items-center gap-2 text-sm text-text-muted hover:text-bridge-primary transition-colors"
        >
          Back to {product.categoryLabel}
        </Link>
      </div>

      <header className="min-w-0">
        <Link
          href={`/products?category=${product.categoryKey}`}
          className="inline-block px-2.5 py-1 rounded-lg text-xs font-medium bg-bridge-primary/10 text-bridge-primary mb-3 hover:bg-bridge-primary/15 transition-colors"
        >
          {product.categoryLabel}
        </Link>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display text-text-primary mb-3">
          {product.title}
        </h1>
        <p className="text-text-secondary text-base leading-relaxed mb-5">{product.shortDescription}</p>

        <div className="flex flex-wrap items-center gap-4 text-sm mb-5">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-bridge-gold fill-bridge-gold" aria-hidden />
            <span className="font-bold text-text-primary">{product.rating}</span>
            <span className="text-text-muted">({product.reviews} reviews)</span>
          </div>
          <div className="flex items-center gap-1.5 text-text-muted">
            <Clock className="w-4 h-4" aria-hidden />
            {product.deliveryTime}
          </div>
        </div>

        <p className="text-sm text-text-muted mb-6">
          Sold by{' '}
          <Link
            href={`/sellers/${product.sellerSlug}`}
            className="text-bridge-primary hover:underline font-medium"
          >
            {product.sellerName}
          </Link>
          {product.sellerLevel ? ` · ${product.sellerLevel}` : null}
        </p>

        <div className="rounded-2xl border border-border-subtle bg-surface/80 p-5 mb-6 shadow-sm">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl md:text-4xl font-bold text-text-primary">${product.price}</span>
            {product.oldPrice != null && (
              <span className="text-lg text-text-muted line-through">${product.oldPrice}</span>
            )}
          </div>
          <p className="text-xs text-text-muted mt-1">Secure checkout on Deshi Fiverr</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => addToCart(productToService(product))}
            className={cn(
              'inline-flex items-center justify-center gap-2 px-6 py-3 bg-bridge-primary hover:bg-bridge-primary-light text-white font-bold rounded-xl transition-colors cursor-pointer',
              focusVisibleRing
            )}
          >
            <ShoppingCart className="w-5 h-5" aria-hidden />
            Continue
          </button>
          <Link
            href="/messages"
            className={cn(
              'inline-flex items-center justify-center gap-2 px-6 py-3 glass border border-border-subtle rounded-xl text-sm font-medium text-text-primary hover:border-bridge-primary/40 transition-colors',
              focusVisibleRing
            )}
          >
            <MessageCircle className="w-4 h-4" aria-hidden />
            Contact Seller
          </Link>
          <button
            type="button"
            onClick={() => setSaved((s) => !s)}
            className={cn(
              'inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium cursor-pointer transition-colors',
              focusVisibleRing,
              saved
                ? 'border-bridge-primary bg-bridge-primary/10 text-bridge-primary'
                : 'border-border-subtle text-text-secondary hover:border-bridge-primary/30'
            )}
            aria-pressed={saved}
            aria-label={saved ? 'Remove from favorites' : 'Save to favorites'}
          >
            <Heart className={cn('w-4 h-4', saved && 'fill-current')} aria-hidden />
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>

        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6 lg:hidden">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-background-soft border border-border-subtle text-text-secondary"
              >
                <Tag className="w-3 h-3" aria-hidden />
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>
    </div>
  );
}
