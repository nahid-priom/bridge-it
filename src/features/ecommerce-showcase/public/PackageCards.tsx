'use client';

import { useState } from 'react';
import { formatBdt } from '@/lib/format/currency';
import { cn } from '@/lib/cn';
import type { EcommercePackage } from '../types';

export function formatShowcasePackagePrice(pkg: Pick<EcommercePackage, 'name' | 'price'>): string {
  const base = formatBdt(pkg.price);
  if (pkg.name === 'Premium Custom') return `${base}+`;
  return base;
}

export function PackageCards({
  packages,
  selectedId,
  onSelect,
}: {
  packages: EcommercePackage[];
  selectedId?: string;
  onSelect?: (id: string) => void;
}) {
  const [internal, setInternal] = useState(packages.find((item) => item.is_popular)?.id ?? packages[0]?.id);
  const active = selectedId ?? internal;

  if (packages.length === 0) return null;

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {packages.map((pkg) => {
        const selected = pkg.id === active;
        return (
          <button
            key={pkg.id}
            type="button"
            onClick={() => {
              setInternal(pkg.id);
              onSelect?.(pkg.id);
            }}
            className={cn(
              'text-left rounded-2xl border p-4 transition-colors',
              selected
                ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-500/10'
                : 'border-slate-200 dark:border-white/10 hover:border-emerald-400'
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-display font-bold">{pkg.name}</p>
              {pkg.is_popular ? (
                <span className="text-[10px] uppercase tracking-wide font-bold text-emerald-700">Popular</span>
              ) : null}
            </div>
            <p className="mt-2 text-xl font-black text-[#0f2744] dark:text-white">
              {formatShowcasePackagePrice(pkg)}
            </p>
            {pkg.short_description ? (
              <p className="mt-1 text-sm text-text-secondary">{pkg.short_description}</p>
            ) : null}
            <ul className="mt-3 space-y-1.5 text-sm text-text-secondary">
              {pkg.features.slice(0, 5).map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
          </button>
        );
      })}
    </div>
  );
}
