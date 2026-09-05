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

/** Mobile: always 2×2. Desktop: up to 4 in a row. */
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

  const tabs = (orderedTabs.length > 0 ? orderedTabs : sorted).slice(0, 4);

  return (
    <div className={cn('w-full', className)}>
      <h2 className="mb-2 font-display text-xl font-black text-text-primary sm:text-2xl">
        Choose the Right Package
      </h2>
      <p className="mb-4 text-sm text-text-secondary">
        Pick a package that matches your business size. You can upgrade later.
      </p>
      <div
        className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4"
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
                'flex min-h-[4.75rem] flex-col items-start justify-center rounded-2xl border px-3 py-3 text-left transition-colors sm:min-h-[5.25rem] sm:px-4',
                active
                  ? 'border-bridge-primary bg-bridge-primary text-white'
                  : 'border-border-subtle bg-surface text-text-secondary hover:border-bridge-primary/40 hover:text-text-primary'
              )}
            >
              <span className="text-sm font-bold sm:text-[0.9375rem]">{packageDisplayName(pkg)}</span>
              <span
                className={cn(
                  'mt-1 text-xs tabular-nums sm:text-sm',
                  active ? 'text-white/85' : 'text-text-muted'
                )}
              >
                {pkg.tier === 'enterprise' && pkg.price >= 250000
                  ? 'Custom'
                  : formatCatalogPrice(pkg.price, { currency: pkg.currency })}
              </span>
              {pkg.is_recommended ? (
                <span
                  className={cn(
                    'mt-1 text-[10px] font-semibold uppercase tracking-wide',
                    active ? 'text-white/90' : 'text-bridge-primary'
                  )}
                >
                  Most Popular
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
