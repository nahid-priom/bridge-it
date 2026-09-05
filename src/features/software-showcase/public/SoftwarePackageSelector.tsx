'use client';

import { useCallback, useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/cn';
import { formatCatalogPrice } from '@/src/features/catalog/components/CatalogPrice';
import type { SoftwarePackage } from '../types';
import {
  SOFTWARE_PACKAGE_TIER_ORDER,
  packageDisplayName,
  packageTierKey,
  sortPackagesByTier,
} from './package-utils';

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

function firePackageSelect(pkg: SoftwarePackage, productSlug: string) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'package_select',
    category_root: 'software',
    product: productSlug,
    package: pkg.name,
    package_tier: pkg.tier,
  });
}

export function SoftwarePackageSelector({
  packages,
  productSlug,
  value,
  onChange,
  className,
}: {
  packages: SoftwarePackage[];
  productSlug: string;
  value: SoftwarePackage | null;
  onChange: (pkg: SoftwarePackage) => void;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sorted = sortPackagesByTier(packages);
  const mountedRef = useRef(false);
  const lastFiredId = useRef<string | null>(null);

  const syncUrl = useCallback(
    (pkg: SoftwarePackage) => {
      const params = new URLSearchParams(searchParams.toString());
      const tier = packageTierKey(pkg);
      if (params.get('package') === tier) return;
      params.set('package', tier);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    if (!value) return;
    if (!mountedRef.current) {
      mountedRef.current = true;
      lastFiredId.current = value.id;
      return;
    }
    if (lastFiredId.current === value.id) return;
    lastFiredId.current = value.id;
    firePackageSelect(value, productSlug);
  }, [value, productSlug]);

  if (sorted.length === 0) return null;

  const orderedTabs = SOFTWARE_PACKAGE_TIER_ORDER.map((tier) =>
    sorted.find((pkg) => pkg.tier === tier)
  ).filter(Boolean) as SoftwarePackage[];

  const tabs = orderedTabs.length > 0 ? orderedTabs : sorted;

  return (
    <div className={cn('w-full', className)}>
      <h2 className="mb-3 font-display text-lg font-black text-[#0f2744] dark:text-white sm:text-xl">
        Choose Your Package
      </h2>
      <div
        className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5"
        role="tablist"
        aria-label="Software packages"
      >
        {tabs.map((pkg) => {
          const active = value?.id === pkg.id;
          return (
            <button
              key={pkg.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                onChange(pkg);
                syncUrl(pkg);
              }}
              className={cn(
                'flex min-h-[4.5rem] flex-col items-start justify-center rounded-2xl border px-3 py-3 text-left transition-colors sm:min-h-[5rem] sm:px-4',
                active
                  ? 'border-[#0f2744] bg-[#0f2744] text-white dark:border-white dark:bg-white dark:text-[#0f2744]'
                  : 'border-border-subtle bg-surface text-text-secondary hover:border-[#2563eb]/40 hover:text-text-primary'
              )}
            >
              <span className="text-sm font-bold sm:text-[0.9375rem]">{packageDisplayName(pkg)}</span>
              <span
                className={cn(
                  'mt-1 text-xs tabular-nums sm:text-sm',
                  active ? 'text-white/80 dark:text-[#0f2744]/80' : 'text-text-muted'
                )}
              >
                {formatCatalogPrice(pkg.price, { currency: pkg.currency })}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
