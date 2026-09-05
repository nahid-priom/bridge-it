'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatCatalogPrice } from '@/src/features/catalog/components/CatalogPrice';
import { PackageBadge } from '@/src/features/catalog/components/PackageBadge';
import type { SoftwarePackage } from '../types';
import { includedFeatureRows, targetAudienceCopy } from './package-features';
import { packageDisplayName, paymentTypeLabel } from './package-utils';

export function SelectedPackageSummary({
  pkg,
  onDemo,
  onOrder,
  className,
}: {
  pkg: SoftwarePackage;
  onDemo: () => void;
  onOrder: () => void;
  className?: string;
}) {
  const name = packageDisplayName(pkg);
  const rows = includedFeatureRows(pkg);
  const highlighted = rows.filter((f) => f.is_highlighted);
  const highlights = (highlighted.length >= 3 ? highlighted : rows).slice(0, 6);

  return (
    <section
      className={cn(
        'rounded-2xl border border-border-subtle bg-surface p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:shadow-black/20 sm:p-6',
        className
      )}
      aria-label={`${name} package summary`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-xl font-black text-[#0f2744] dark:text-white sm:text-2xl">
              {name}
            </h2>
            <PackageBadge badge={pkg.badge} />
            {pkg.is_recommended ? <PackageBadge badge="Recommended" /> : null}
          </div>
          <p className="mt-1.5 max-w-xl text-sm text-text-secondary">{targetAudienceCopy(pkg)}</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-2xl font-black tabular-nums text-text-primary sm:text-3xl">
            {formatCatalogPrice(pkg.price, { currency: pkg.currency })}
          </p>
          <p className="mt-0.5 text-sm text-text-muted">{paymentTypeLabel(pkg.payment_type)}</p>
        </div>
      </div>

      <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {highlights.map((feature) => (
          <li key={feature.id} className="flex items-start gap-2 text-sm text-text-secondary">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
            <span>{feature.label}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onDemo}
          className="inline-flex flex-1 items-center justify-center rounded-xl border border-border-subtle px-4 py-3 text-sm font-semibold text-text-primary hover:border-[#2563eb]/40"
        >
          Free Demo
        </button>
        <button
          type="button"
          onClick={onOrder}
          className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#0f2744] px-4 py-3 text-sm font-semibold text-white hover:bg-[#16375f] dark:bg-white dark:text-[#0f2744]"
        >
          Order {name}
        </button>
      </div>
    </section>
  );
}
