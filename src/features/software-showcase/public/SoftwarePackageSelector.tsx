'use client';

import { useCallback, useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/cn';
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
    <div className={cn('w-full', className)} role="tablist" aria-label="Software packages">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
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
                'inline-flex h-11 shrink-0 items-center justify-center rounded-xl px-4 text-sm font-semibold transition-colors',
                active
                  ? 'bg-[#0f2744] text-white'
                  : 'border border-border-subtle bg-surface text-text-secondary hover:border-[#2563eb]/40 hover:text-text-primary'
              )}
            >
              {packageDisplayName(pkg)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
