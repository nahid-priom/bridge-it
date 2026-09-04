'use client';

import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import type { MarketplaceProduct } from '@/types/marketplaceProduct';
import { ROUTES } from '@/lib/routes';
import { formatBdtPrice } from '@/lib/marketplace/format';
import { hasValidSolutionCover } from '@/lib/solutions/isLegacyCover';
import { SolutionCoverImage } from '@/components/solutions/SolutionCoverImage';
import { cn } from '@/lib/cn';

type MarketplaceProductCardProps = {
  product: MarketplaceProduct;
  onAddToCart?: (product: MarketplaceProduct) => void;
  className?: string;
};

export function MarketplaceProductCard({
  product,
  onAddToCart,
  className,
}: MarketplaceProductCardProps) {
  const href = ROUTES.product(product.slug);
  const inStock = product.stock > 0;
  const discount =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round((1 - product.price / product.comparePrice) * 100)
      : null;
  const hasCover = hasValidSolutionCover(product.thumbnailUrl, product.coverImagePath);
  const coverAlt =
    product.coverImageAlt ??
    `3D illustration of ${product.name} for ${product.categoryName}`;

  return (
    <article
      className={cn(
        'group flex flex-col h-full rounded-2xl border border-slate-200/90 dark:border-white/10',
        'bg-white dark:bg-[#0f1424] overflow-hidden shadow-sm',
        'hover:shadow-lg hover:shadow-deshi-green/10 hover:border-deshi-green/35',
        'hover:-translate-y-0.5 transition-all duration-300',
        className
      )}
    >
      <Link href={href} className="flex flex-col h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/50 rounded-2xl">
        <SolutionCoverImage
          src={hasCover ? product.thumbnailUrl : null}
          alt={coverAlt}
          categorySlug={product.categorySlug}
          aspectClassName="aspect-[4/3]"
          sizes="(max-width: 640px) 260px, 280px"
          imageClassName="group-hover:scale-105 transition-transform duration-500"
          badge={
            <>
              <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-white/95 dark:bg-slate-900/95 text-[10px] font-bold text-deshi-green">
                {product.categoryName}
              </span>
              {product.isFeatured && (
                <span className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold">
                  Featured
                </span>
              )}
              {discount != null && discount > 0 && (
                <span className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded-md bg-rose-500 text-white text-[10px] font-bold">
                  -{discount}%
                </span>
              )}
            </>
          }
        />

        <div className="flex flex-col flex-1 p-3.5">
          <div className="flex items-center gap-1 text-xs mb-1.5">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" aria-hidden />
            <span className="font-bold text-text-primary">{product.rating.toFixed(1)}</span>
            <span className="text-text-muted">({product.reviewCount})</span>
          </div>

          <h3 className="text-sm font-bold text-text-primary line-clamp-2 leading-snug mb-1 group-hover:text-deshi-green transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>

          {product.brand && (
            <p className="text-[11px] text-text-muted mb-2">{product.brand}</p>
          )}

          <div className="mt-auto flex items-end justify-between gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
            <div>
              <p className="text-base font-black text-text-primary leading-none">
                {formatBdtPrice(product.price)}
              </p>
              {product.comparePrice && product.comparePrice > product.price && (
                <p className="text-[11px] text-text-muted line-through mt-0.5">
                  {formatBdtPrice(product.comparePrice)}
                </p>
              )}
            </div>
            <span
              className={cn(
                'text-[10px] font-bold px-2 py-0.5 rounded-full',
                inStock
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
              )}
            >
              {inStock ? (product.stock > 50 ? 'In stock' : `${product.stock} left`) : 'Out of stock'}
            </span>
          </div>
        </div>
      </Link>

      {onAddToCart && inStock && (
        <div className="px-3.5 pb-3.5 pt-0">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onAddToCart(product);
            }}
            className="w-full h-9 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 bg-deshi-green/10 text-deshi-green border border-deshi-green/25 hover:bg-deshi-green hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/50"
          >
            <ShoppingCart className="w-3.5 h-3.5" aria-hidden />
            Add to cart
          </button>
        </div>
      )}
    </article>
  );
}
