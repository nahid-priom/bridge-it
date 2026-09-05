'use client';

import { Fragment, useMemo, useState } from 'react';
import { Check, ChevronDown, Minus } from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatCatalogPrice } from '@/src/features/catalog/components/CatalogPrice';
import type { SoftwarePackage } from '../types';
import { groupPackageFeatures, includedFeatureRows } from './package-features';
import {
  packageDisplayName,
  paymentTypeLabel,
  sortPackagesByTier,
} from './package-utils';

type ComparisonRow = {
  key: string;
  label: string;
  group: string;
};

function packageIncludesKey(pkg: SoftwarePackage, key: string, label: string): boolean {
  const rows = includedFeatureRows(pkg);
  if (rows.length) {
    return rows.some(
      (r) =>
        r.feature_key === key ||
        r.label.trim().toLowerCase() === label.trim().toLowerCase()
    );
  }
  return (pkg.features ?? []).some((f) => f.trim().toLowerCase() === label.trim().toLowerCase());
}

export function SoftwarePackageComparison({
  packages,
  selectedPackageId,
  className,
}: {
  packages: SoftwarePackage[];
  selectedPackageId?: string | null;
  className?: string;
}) {
  const sorted = sortPackagesByTier(packages);
  const [expanded, setExpanded] = useState(false);

  const comparisonRows = useMemo(() => {
    const seen = new Set<string>();
    const rows: ComparisonRow[] = [];
    for (const pkg of sorted) {
      const included = includedFeatureRows(pkg);
      if (included.length) {
        for (const feature of included) {
          const dedupe = feature.feature_key || feature.label.trim().toLowerCase();
          if (!dedupe || seen.has(dedupe)) continue;
          seen.add(dedupe);
          rows.push({
            key: feature.feature_key || dedupe,
            label: feature.label,
            group: feature.feature_group || 'Operations',
          });
        }
        continue;
      }
      for (const feature of pkg.features ?? []) {
        const key = feature.trim().toLowerCase();
        if (!key || seen.has(key)) continue;
        seen.add(key);
        rows.push({ key, label: feature.trim(), group: 'Operations' });
      }
    }
    return rows;
  }, [sorted]);

  const groupedRows = useMemo(() => groupPackageFeatures(
    comparisonRows.map((row, index) => ({
      id: row.key,
      package_id: '',
      feature_key: row.key,
      label: row.label,
      feature_group: row.group,
      is_included: true,
      is_highlighted: false,
      display_order: index,
    }))
  ), [comparisonRows]);

  const selected =
    sorted.find((p) => p.id === selectedPackageId) ?? sorted[0] ?? null;
  const selectedIndex = selected ? sorted.findIndex((p) => p.id === selected.id) : 0;
  const nextTier = selectedIndex >= 0 ? sorted[selectedIndex + 1] ?? null : null;

  const upgradeDiff = useMemo(() => {
    if (!selected || !nextTier) return [];
    const selectedKeys = new Set(
      includedFeatureRows(selected).map((f) => f.feature_key || f.label.toLowerCase())
    );
    return includedFeatureRows(nextTier).filter((f) => {
      const key = f.feature_key || f.label.toLowerCase();
      return !selectedKeys.has(key);
    });
  }, [nextTier, selected]);

  if (sorted.length < 2) return null;

  const visibleGroups = expanded ? groupedRows : groupedRows.slice(0, 2);
  const visibleRowCount = visibleGroups.reduce((n, g) => n + g.features.length, 0);
  const hasMore = comparisonRows.length > visibleRowCount || (!expanded && groupedRows.length > 2);

  return (
    <div className={cn('w-full', className)}>
      <h2 className="mb-3 font-display text-xl font-black text-[#0f2744] dark:text-white md:text-2xl">
        Compare Packages
      </h2>

      {/* Desktop matrix by groups */}
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
            {visibleGroups.map(({ group, features }) => (
              <Fragment key={group}>
                <tr className="bg-background-soft/60">
                  <td
                    colSpan={sorted.length + 1}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wide text-text-muted"
                  >
                    {group}
                  </td>
                </tr>
                {features.map((feature) => (
                  <tr key={feature.feature_key} className="border-b border-border-subtle last:border-0">
                    <td className="sticky left-0 z-10 bg-surface px-4 py-2.5 text-text-secondary">
                      {feature.label}
                    </td>
                    {sorted.map((pkg) => {
                      const included = packageIncludesKey(pkg, feature.feature_key, feature.label);
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
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: selected vs next-tier upgrade difference */}
      <div className="md:hidden">
        {selected && nextTier ? (
          <article className="rounded-2xl border border-border-subtle bg-surface p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              Upgrade difference
            </p>
            <h3 className="mt-1 font-display text-base font-bold text-text-primary">
              {packageDisplayName(selected)} → {packageDisplayName(nextTier)}
            </h3>
            <p className="mt-1 text-sm text-text-secondary">
              {formatCatalogPrice(selected.price, { currency: selected.currency })} →{' '}
              {formatCatalogPrice(nextTier.price, { currency: nextTier.currency })}
            </p>
            {upgradeDiff.length > 0 ? (
              <ul className="mt-3 space-y-1.5">
                {upgradeDiff.slice(0, expanded ? undefined : 8).map((feature) => (
                  <li key={feature.id} className="flex items-start gap-2 text-sm text-text-secondary">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden />
                    <span>{feature.label}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-text-muted">Next tier mainly expands capacity and control.</p>
            )}
          </article>
        ) : (
          <div className="space-y-3">
            {sorted.map((pkg) => (
              <article key={pkg.id} className="rounded-2xl border border-border-subtle bg-surface p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-display text-base font-bold text-text-primary">
                    {packageDisplayName(pkg)}
                  </h3>
                  <p className="text-sm font-semibold tabular-nums">
                    {formatCatalogPrice(pkg.price, { currency: pkg.currency })}
                  </p>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {includedFeatureRows(pkg)
                    .slice(0, 6)
                    .map((feature) => (
                      <li key={feature.id} className="flex items-start gap-2 text-sm text-text-secondary">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden />
                        <span className="line-clamp-2">{feature.label}</span>
                      </li>
                    ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </div>

      {hasMore ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 inline-flex h-10 items-center gap-1.5 text-sm font-semibold text-[#2563eb] hover:underline"
        >
          {expanded ? 'Show fewer features' : `Show all ${comparisonRows.length} features`}
          <ChevronDown
            className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')}
            aria-hidden
          />
        </button>
      ) : null}
    </div>
  );
}
