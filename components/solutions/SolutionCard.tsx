import Link from 'next/link';
import { Clock, ArrowRight, Play } from 'lucide-react';
import type { BitpProduct } from '@/types/bitp';
import { formatProductPrice } from '@/lib/format/currency';
import { getSolutionDetailPath, getSolutionDemoPath, getSolutionOrderPath } from '@/lib/solutions/product-routes';
import { getProductCoverAlt, getProductCoverUrl } from '@/lib/solutions/getProductCoverUrl';
import { SolutionCoverImage } from '@/components/solutions/SolutionCoverImage';
import { cn } from '@/lib/cn';

type SolutionCardProps = {
  product: BitpProduct;
  className?: string;
};

export function SolutionCard({ product, className }: SolutionCardProps) {
  const href = getSolutionDetailPath(product);
  const demoPath = getSolutionDemoPath(product);
  const categoryName = product.category?.name ?? 'Solution';
  const badge = product.featured ? 'Featured' : product.popular ? 'Popular' : null;
  const isQuote = product.pricing_type === 'custom_quote';
  const price = formatProductPrice(Number(product.starting_price), product.pricing_type, {
    promotionalPrice: product.promotional_price,
  });
  const coverUrl = getProductCoverUrl(product);
  const coverAlt = getProductCoverAlt(product);

  return (
    <article
      className={cn(
        'group flex flex-col h-full rounded-2xl border border-slate-200/80 dark:border-white/10',
        'bg-white dark:bg-[#0f1424] shadow-sm',
        'hover:shadow-lg hover:shadow-deshi-green/10 hover:border-deshi-green/35',
        'hover:-translate-y-0.5 transition-all duration-300',
        className
      )}
    >
      <Link
        href={href}
        className="flex flex-col h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/50 rounded-2xl"
      >
        <SolutionCoverImage
          src={coverUrl}
          alt={coverAlt}
          categorySlug={product.category?.slug}
          sizes="(max-width: 640px) 260px, 280px"
          className="group-hover:scale-105 transition-transform duration-500"
          imageClassName="group-hover:scale-105 transition-transform duration-500"
          badge={
            badge ? (
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-deshi-green text-white z-10">
                {badge}
              </span>
            ) : undefined
          }
        />

        <div className="flex flex-col flex-1 p-4 md:p-5 gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-deshi-green">
            {categoryName}
          </span>
          <h3 className="text-base font-bold text-text-primary line-clamp-2 group-hover:text-deshi-green transition-colors">
            {product.name}
          </h3>
          {product.short_description && (
            <p className="text-sm text-text-secondary line-clamp-2 flex-1">
              {product.short_description}
            </p>
          )}
          <div className="flex items-center justify-between pt-2 mt-auto border-t border-slate-100 dark:border-white/5">
            <div>
              <p className="text-xs text-text-secondary">
                {isQuote ? 'Custom Quote' : price.secondary ?? 'Starting from'}
              </p>
              <p className="text-lg font-black text-text-primary">
                {isQuote ? 'Contact Us' : price.primary}
              </p>
              {price.strikethrough && (
                <p className="text-xs text-text-secondary line-through">{price.strikethrough}</p>
              )}
            </div>
            {product.delivery_time && (
              <span className="inline-flex items-center gap-1 text-xs text-text-secondary">
                <Clock className="w-3.5 h-3.5" aria-hidden />
                {product.delivery_time}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4 md:px-5 md:pb-5 flex flex-wrap gap-2">
        <Link
          href={href}
          className="flex-1 min-w-[100px] text-center py-2.5 rounded-xl text-sm font-semibold border border-slate-200 dark:border-white/10 hover:border-deshi-green/40 transition-colors"
        >
          View Details
        </Link>
        {demoPath && (
          <Link
            href={demoPath}
            className="inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl text-sm font-semibold border border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10 transition-colors"
          >
            <Play className="w-3.5 h-3.5" aria-hidden />
            Live Demo
          </Link>
        )}
        {!isQuote && (
          <Link
            href={getSolutionOrderPath(product)}
            className="flex-1 min-w-[100px] inline-flex items-center justify-center gap-1 py-2.5 rounded-xl text-sm font-semibold deshi-btn-primary"
          >
            Order Now
            <ArrowRight className="w-3.5 h-3.5" aria-hidden />
          </Link>
        )}
        {isQuote && (
          <Link
            href={getSolutionOrderPath(product)}
            className="flex-1 min-w-[100px] inline-flex items-center justify-center gap-1 py-2.5 rounded-xl text-sm font-semibold deshi-btn-primary"
          >
            Get Quote
            <ArrowRight className="w-3.5 h-3.5" aria-hidden />
          </Link>
        )}
      </div>
    </article>
  );
}
