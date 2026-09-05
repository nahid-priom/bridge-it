'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/lib/cn';
import type { SoftwarePackage } from '../types';
import { SoftwarePackageCards } from './SoftwarePackageCards';
import { SoftwarePackageComparison } from './SoftwarePackageComparison';
import {
  SOFTWARE_BUSINESS_SIZE_FILTERS,
  type SoftwareBusinessSizeFilterId,
  filterPackagesByBusinessSize,
} from './package-utils';

/** Industry-page package section: size filter + cards + comparison. */
export function SoftwareIndustryPackages({
  packages,
  productSlug,
  industrySlug,
  className,
}: {
  packages: SoftwarePackage[];
  productSlug: string;
  industrySlug: string;
  className?: string;
}) {
  const [size, setSize] = useState<SoftwareBusinessSizeFilterId>('all');

  const filtered = useMemo(
    () => filterPackagesByBusinessSize(packages, size),
    [packages, size]
  );

  if (packages.length === 0) return null;

  return (
    <section className={cn('space-y-5', className)} aria-labelledby="software-packages-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="software-packages-heading"
            className="font-display text-xl font-black text-[#0f2744] dark:text-white md:text-2xl"
          >
            Choose Your Package
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            One-time pricing. Pick the fit for your business size.
          </p>
        </div>
        <div
          className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none"
          role="group"
          aria-label="Filter by business size"
        >
          {SOFTWARE_BUSINESS_SIZE_FILTERS.map((chip) => {
            const active = size === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setSize(chip.id)}
                className={cn(
                  'inline-flex h-10 shrink-0 items-center justify-center rounded-xl px-3.5 text-sm font-semibold transition-colors',
                  active
                    ? 'bg-[#0f2744] text-white'
                    : 'border border-border-subtle bg-surface text-text-secondary hover:border-[#2563eb]/40'
                )}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-border-subtle bg-background-soft px-4 py-6 text-center text-sm text-text-secondary">
          No packages match this business size. Try another filter.
        </p>
      ) : (
        <SoftwarePackageCards
          packages={filtered}
          productSlug={productSlug}
          industrySlug={industrySlug}
        />
      )}

      <SoftwarePackageComparison packages={packages} className="pt-4" />
    </section>
  );
}
