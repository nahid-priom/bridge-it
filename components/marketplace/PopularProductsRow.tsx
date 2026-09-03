'use client';

import { useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import type { MarketplaceProduct } from '@/types/marketplaceProduct';
import { MarketplaceProductCard } from '@/components/marketplace/MarketplaceProductCard';
import { ROUTES } from '@/lib/routes';

type PopularProductsRowProps = {
  products: MarketplaceProduct[];
};

export function PopularProductsRow({ products }: PopularProductsRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector('[data-product-card]') as HTMLElement | null;
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 260) + 16), behavior: 'smooth' });
  }, []);

  if (products.length === 0) return null;

  return (
    <section
      className="py-6 md:py-12 bg-slate-50/80 dark:bg-deshi-navy/15"
      aria-labelledby="popular-products-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 md:mb-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wide mb-1">
              Product Marketplace
            </p>
            <h2
              id="popular-products-heading"
              className="text-xl md:text-2xl font-black font-display text-text-primary"
            >
              Popular Products
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Top gadgets, software & business solutions for modern companies
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scroll(-1)}
              className="hidden md:flex w-9 h-9 rounded-full border border-slate-200 dark:border-white/10 bg-surface items-center justify-center hover:border-deshi-green/40 transition-colors"
              aria-label="Previous products"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              className="hidden md:flex w-9 h-9 rounded-full border border-slate-200 dark:border-white/10 bg-surface items-center justify-center hover:border-deshi-green/40 transition-colors"
              aria-label="Next products"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <Link
              href={ROUTES.products}
              className="inline-flex items-center gap-1 text-sm font-semibold text-deshi-green hover:underline"
            >
              View all products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 scrollbar-none -mx-1 px-1"
          role="list"
        >
          {products.map((product) => (
            <div
              key={product.id}
              data-product-card
              role="listitem"
              className="snap-start shrink-0 w-[min(100%,240px)] sm:w-[260px]"
            >
              <MarketplaceProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
