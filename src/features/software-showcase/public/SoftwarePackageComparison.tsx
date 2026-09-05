'use client';

import { useMemo, useState } from 'react';
import { Check, ChevronDown, Minus } from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatCatalogPrice } from '@/src/features/catalog/components/CatalogPrice';
import type { SoftwarePackage } from '../types';
import {
  packageDisplayName,
  paymentTypeLabel,
  sortPackagesByTier,
} from './package-utils';

const FEATURE_GROUP_SIZE = 8;

export function SoftwarePackageComparison({
  packages,
  className,
}: {
  packages: SoftwarePackage[];
  className?: string;
}) {
  const sorted = sortPackagesByTier(packages);
  const [expanded, setExpanded] = useState(false);

  const featureRows = useMemo(() => {
    const seen = new Set<string>();
    const rows: string[] = [];
    for (const pkg of sorted) {
      for (const feature of pkg.features) {
        const key = feature.trim();
        if (!key || seen.has(key.toLowerCase())) continue;
        seen.add(key.toLowerCase());
        rows.push(key);
      }
    }
    return rows;
  }, [sorted]);

  if (sorted.length < 2) return null;

  const visibleRows = expanded ? featureRows : featureRows.slice(0, FEATURE_GROUP_SIZE);
  const hasMore = featureRows.length > FEATURE_GROUP_SIZE;

  return (
    <div className={cn('w-full', className)}>
      <h2 className="mb-3 font-display text-xl font-black text-[#0f2744] dark:text-white md:text-2xl">
        Compare Packages
      </h2>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-2xl border border-border-subtle md:block">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border-subtle bg-background-soft">
              <th className="sticky left-0 z-10 bg-background-soft px-4 py-3 font-semibold text-text-primary">
                Feature
              </th>
              {sorted.map((pkg) => (
                <th key={pkg.id} className="min-w-[120px] px-3 py-3 font-semibold text-text-primary">
                  <span className="block">{packageDisplayName(pkg)}</span>
                  <span className="mt-1 block text-xs font-normal text-text-muted">
                    {formatCatalogPrice(pkg.price, { currency: pkg.currency })}
                  </span>
                  <span className="mt-0.5 block text-[11px] font-normal text-text-muted">
                    {paymentTypeLabel(pkg.payment_type)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((feature) => (
              <tr key={feature} className="border-b border-border-subtle last:border-0">
                <td className="sticky left-0 z-10 bg-surface px-4 py-2.5 text-text-secondary">
                  {feature}
                </td>
                {sorted.map((pkg) => {
                  const included = pkg.features.some(
                    (f) => f.trim().toLowerCase() === feature.toLowerCase()
                  );
                  return (
                    <td key={pkg.id} className="px-3 py-2.5 text-center">
                      {included ? (
                        <Check className="mx-auto h-4 w-4 text-emerald-600" aria-label="Included" />
                      ) : (
                        <Minus className="mx-auto h-4 w-4 text-text-muted/40" aria-label="Not included" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="space-y-3 md:hidden">
        {sorted.map((pkg) => (
          <article
            key={pkg.id}
            className="rounded-2xl border border-border-subtle bg-surface p-4"
          >
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-display text-base font-bold text-text-primary">
                {packageDisplayName(pkg)}
              </h3>
              <p className="text-sm font-semibold tabular-nums">
                {formatCatalogPrice(pkg.price, { currency: pkg.currency })}
              </p>
            </div>
            <p className="mt-0.5 text-xs text-text-muted">{paymentTypeLabel(pkg.payment_type)}</p>
            <ul className="mt-3 space-y-1.5">
              {visibleRows.map((feature) => {
                const included = pkg.features.some(
                  (f) => f.trim().toLowerCase() === feature.toLowerCase()
                );
                return (
                  <li
                    key={feature}
                    className={cn(
                      'flex items-start gap-2 text-sm',
                      included ? 'text-text-secondary' : 'text-text-muted/50'
                    )}
                  >
                    {included ? (
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden />
                    ) : (
                      <Minus className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                    )}
                    <span className="line-clamp-2">{feature}</span>
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>

      {hasMore ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 inline-flex h-10 items-center gap-1.5 text-sm font-semibold text-[#2563eb] hover:underline"
        >
          {expanded ? 'Show fewer features' : `Show all ${featureRows.length} features`}
          <ChevronDown
            className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')}
            aria-hidden
          />
        </button>
      ) : null}
    </div>
  );
}
