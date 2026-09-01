'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Play, ArrowRight, Check, ShoppingCart, Clock, Sparkles } from 'lucide-react';
import type { BitpProduct } from '@/types/bitp';
import { ROUTES } from '@/lib/routes';
import { formatProductPrice } from '@/lib/format/currency';
import { cn } from '@/lib/cn';

type FlagshipShowroomCardProps = {
  product: BitpProduct;
  topFeatures?: string[];
  className?: string;
};

export function FlagshipShowroomCard({ product, topFeatures = [], className }: FlagshipShowroomCardProps) {
  const cover = product.cover_image ?? product.thumbnail ?? `/showroom/covers/${product.slug}.svg`;
  const demoSlug = product.internal_demo_slug;
  const price = formatProductPrice(Number(product.starting_price), product.pricing_type ?? 'fixed', {
    promotionalPrice: product.promotional_price,
  });
  const bestFor = product.target_customer ?? 'Small businesses and online sellers';

  return (
    <article
      className={cn(
        'group flex flex-col rounded-2xl border border-slate-200/80 dark:border-white/10',
        'bg-white dark:bg-[#0f1424] overflow-hidden',
        'hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300',
        className
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#0f2744] to-[#132f52]">
        <Image
          src={cover}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, 400px"
        />
        {product.showroom_featured && (
          <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-white text-xs font-black">
            <Sparkles className="w-3 h-3" aria-hidden />
            Featured
          </div>
        )}
        {product.delivery_time && (
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 text-white text-xs font-semibold backdrop-blur-sm">
            <Clock className="w-3 h-3" aria-hidden />
            {product.delivery_time}
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="mb-3">
          {price.secondary && (
            <p className="text-xs text-text-secondary mb-0.5">{price.secondary}</p>
          )}
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black text-emerald-600">{price.primary}</p>
            {price.strikethrough && (
              <p className="text-sm text-text-secondary line-through">{price.strikethrough}</p>
            )}
          </div>
        </div>

        <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Best for</p>
        <p className="text-xs text-text-secondary line-clamp-2 mb-2">{bestFor}</p>
        <h3 className="text-lg font-black text-text-primary mb-3">{product.name}</h3>

        {topFeatures.length > 0 && (
          <ul className="space-y-1.5 mb-4 flex-1">
            {topFeatures.slice(0, 5).map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-text-secondary">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" aria-hidden />
                {f}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col gap-2 mt-auto">
          {demoSlug && (
            <Link
              href={ROUTES.ecommerceDemo(demoSlug)}
              className="deshi-btn-primary w-full inline-flex items-center justify-center gap-2 py-2.5 text-sm font-bold"
            >
              <Play className="w-4 h-4" aria-hidden />
              Live Demo
            </Link>
          )}
          <div className="flex flex-col sm:flex-row gap-2">
            <Link
              href={ROUTES.ecommerceSolution(product.slug)}
              className="deshi-btn-outline flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-sm font-semibold"
            >
              View Details
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href={ROUTES.ecommerceSolutionOrder(product.slug)}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 dark:border-white/10 hover:border-emerald-500/40 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" aria-hidden />
              Order Now
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
