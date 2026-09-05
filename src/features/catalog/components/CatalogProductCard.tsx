import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { CatalogProductRef } from '../types';
import { productPath } from '../utils/paths';
import { CatalogPrice } from './CatalogPrice';
import { PackageBadge } from './PackageBadge';

export type CatalogProductFeature = {
  id?: string;
  title: string;
};

export function CatalogProductCard({
  product,
  features,
  className,
}: {
  product: CatalogProductRef;
  features?: CatalogProductFeature[];
  className?: string;
}) {
  const industrySlug = product.industry_slug;
  const href =
    product.canonical_path?.trim() ||
    (industrySlug ? productPath(product.kind, industrySlug, product.slug) : `/${product.kind}/${product.slug}`);

  const shownFeatures = (features ?? []).slice(0, 6);

  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface',
        className
      )}
    >
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {product.industry_name ? (
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                {product.industry_name}
              </p>
            ) : null}
            <h3 className="mt-1 font-display text-lg font-bold leading-snug text-text-primary">
              <Link href={href} className="hover:text-[#2563eb]">
                {product.title}
              </Link>
            </h3>
          </div>
          <PackageBadge badge={product.badge} />
        </div>

        {product.short_description ? (
          <p className="line-clamp-2 text-sm text-text-secondary">{product.short_description}</p>
        ) : null}

        {shownFeatures.length > 0 ? (
          <ul className="mt-1 space-y-1.5">
            {shownFeatures.map((feature, index) => (
              <li
                key={feature.id ?? `${feature.title}-${index}`}
                className="flex items-start gap-2 text-sm text-text-secondary"
              >
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden />
                <span className="line-clamp-1">{feature.title}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <p className="mt-auto pt-2 text-sm font-semibold text-text-primary">
          <CatalogPrice
            amount={product.starting_price}
            suffix={product.price_suffix}
            currency={product.currency}
          />
        </p>

        <Link
          href={href}
          className={cn(
            'inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold',
            'bg-[#0f2744] text-white transition-colors hover:bg-[#16375f]'
          )}
        >
          View Details
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
