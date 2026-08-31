'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, Clock, ArrowRight } from 'lucide-react';
import type { BitpProductDetail, BitpProductPackage } from '@/types/bitp';
import { ROUTES } from '@/lib/routes';
import { formatBdt } from '@/lib/format/currency';
import { cn } from '@/lib/cn';

type PackageComparisonProps = {
  product: BitpProductDetail;
};

export function PackageComparison({ product }: PackageComparisonProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    product.packages.find((p) => p.highlighted)?.id ?? product.packages[0]?.id ?? null
  );

  if (product.packages.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-6 text-center">
        <p className="text-text-secondary mb-4">
          {product.pricing_type === 'custom_quote'
            ? 'This service requires a custom quote based on your requirements.'
            : `Starting from ${formatBdt(Number(product.starting_price))}`}
        </p>
        <Link
          href={
            product.pricing_type === 'custom_quote'
              ? ROUTES.solutionQuote(product.slug)
              : ROUTES.solutionOrder(product.slug)
          }
          className="deshi-btn-primary inline-flex items-center gap-2 px-6 py-3"
        >
          {product.pricing_type === 'custom_quote' ? 'Request a Quote' : 'Order Now'}
          <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {product.packages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            selected={selectedId === pkg.id}
            onSelect={() => setSelectedId(pkg.id)}
            productSlug={product.slug}
          />
        ))}
      </div>
    </div>
  );
}

function PackageCard({
  pkg,
  selected,
  onSelect,
  productSlug,
}: {
  pkg: BitpProductPackage;
  selected: boolean;
  onSelect: () => void;
  productSlug: string;
}) {
  return (
    <div
      className={cn(
        'relative flex flex-col rounded-2xl border p-5 transition-all cursor-pointer',
        selected
          ? 'border-deshi-green shadow-lg shadow-deshi-green/10 bg-emerald-50/30 dark:bg-emerald-500/5'
          : 'border-slate-200 dark:border-white/10 hover:border-deshi-green/30'
      )}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
    >
      {pkg.highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold bg-deshi-green text-white">
          {pkg.badge_text ?? 'Recommended'}
        </span>
      )}
      <h3 className="text-lg font-bold text-text-primary">{pkg.name}</h3>
      {pkg.subtitle && <p className="text-sm text-text-secondary mt-1">{pkg.subtitle}</p>}
      <div className="my-4">
        {pkg.old_price && (
          <span className="text-sm text-text-secondary line-through mr-2">
            {formatBdt(Number(pkg.old_price))}
          </span>
        )}
        <span className="text-2xl font-black text-text-primary">{formatBdt(Number(pkg.price))}</span>
      </div>
      {pkg.delivery_days && (
        <p className="inline-flex items-center gap-1 text-xs text-text-secondary mb-4">
          <Clock className="w-3.5 h-3.5" aria-hidden />
          {pkg.delivery_days} days delivery
        </p>
      )}
      <ul className="space-y-2 flex-1 mb-5">
        {(pkg.features ?? []).map((f) => (
          <li key={f.id} className="flex items-start gap-2 text-sm">
            <Check
              className={cn('w-4 h-4 shrink-0 mt-0.5', f.included ? 'text-deshi-green' : 'text-slate-300')}
              aria-hidden
            />
            <span className={f.included ? 'text-text-primary' : 'text-text-secondary line-through'}>
              {f.feature_text}
            </span>
          </li>
        ))}
      </ul>
      <Link
        href={`${ROUTES.solutionOrder(productSlug)}?package=${pkg.id}`}
        className={cn(
          'w-full text-center py-3 rounded-xl text-sm font-bold transition-colors',
          selected ? 'deshi-btn-primary' : 'border border-slate-200 dark:border-white/10 hover:border-deshi-green/40'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        Order {pkg.name}
      </Link>
    </div>
  );
}
