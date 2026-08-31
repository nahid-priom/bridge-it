import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight } from 'lucide-react';
import type { BitpProduct } from '@/types/bitp';
import { ROUTES } from '@/lib/routes';
import { formatBdt } from '@/lib/format/currency';
import { cn } from '@/lib/cn';

type SolutionCardProps = {
  product: BitpProduct;
  className?: string;
};

export function SolutionCard({ product, className }: SolutionCardProps) {
  const href = ROUTES.solution(product.slug);
  const categoryName = product.category?.name ?? 'Solution';
  const badge = product.featured ? 'Featured' : product.popular ? 'Popular' : null;

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
        <div className="relative aspect-[16/10] overflow-hidden flex items-center justify-center bg-gradient-to-br from-emerald-600/20 to-teal-700/20 dark:from-emerald-900/30 dark:to-teal-900/30">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt=""
              fill
              sizes="(max-width: 640px) 260px, 280px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <span className="text-4xl select-none" aria-hidden>
              {product.category?.icon ?? '💼'}
            </span>
          )}
          {badge && (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-deshi-green text-white">
              {badge}
            </span>
          )}
        </div>

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
                {product.pricing_type === 'custom_quote' ? 'Custom Quote' : 'Starting from'}
              </p>
              <p className="text-lg font-black text-text-primary">
                {product.pricing_type === 'custom_quote'
                  ? 'Contact Us'
                  : formatBdt(Number(product.starting_price))}
              </p>
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

      <div className="px-4 pb-4 md:px-5 md:pb-5 flex gap-2">
        <Link
          href={href}
          className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold border border-slate-200 dark:border-white/10 hover:border-deshi-green/40 transition-colors"
        >
          View Details
        </Link>
        <Link
          href={
            product.pricing_type === 'custom_quote'
              ? ROUTES.solutionQuote(product.slug)
              : ROUTES.solutionOrder(product.slug)
          }
          className="flex-1 inline-flex items-center justify-center gap-1 py-2.5 rounded-xl text-sm font-semibold deshi-btn-primary"
        >
          {product.pricing_type === 'custom_quote' ? 'Get Quote' : 'Order Now'}
          <ArrowRight className="w-3.5 h-3.5" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
