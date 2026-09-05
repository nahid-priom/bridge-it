import Link from 'next/link';
import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatCatalogPrice } from '@/src/features/catalog/components/CatalogPrice';
import { PackageBadge } from '@/src/features/catalog/components/PackageBadge';
import { consultationDeepLink } from '@/src/features/catalog/components/CatalogCTA';
import { productPath } from '@/src/features/catalog/utils/paths';
import type { SoftwarePackage } from '../types';
import {
  SOFTWARE_BUSINESS_SIZE_LABELS,
  packageDisplayName,
  packageTierKey,
  paymentTypeLabel,
  sortPackagesByTier,
} from './package-utils';

export function SoftwarePackageCards({
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
  const sorted = sortPackagesByTier(packages);
  if (sorted.length === 0) return null;

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5',
        className
      )}
    >
      {sorted.map((pkg) => {
        const tier = packageTierKey(pkg);
        const detailsHref = `${productPath('software', industrySlug, productSlug)}?package=${encodeURIComponent(tier)}`;
        const demoHref = consultationDeepLink({
          intent: 'demo',
          product: productSlug,
          industry: industrySlug,
          kind: 'software',
          package: pkg.name,
        });
        const features = pkg.features.slice(0, 6);
        const sizeLabel = pkg.target_business_size
          ? SOFTWARE_BUSINESS_SIZE_LABELS[pkg.target_business_size] || pkg.target_business_size
          : null;

        return (
          <article
            key={pkg.id}
            className={cn(
              'flex h-full flex-col rounded-2xl border border-border-subtle bg-surface p-4 sm:p-5',
              pkg.is_recommended && 'border-[#2563eb]/50 ring-1 ring-[#2563eb]/20'
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-display text-lg font-bold text-[#0f2744] dark:text-white">
                  {packageDisplayName(pkg)}
                </h3>
                {sizeLabel ? (
                  <p className="mt-0.5 text-xs text-text-muted">{sizeLabel}</p>
                ) : null}
              </div>
              <PackageBadge badge={pkg.badge} />
            </div>

            <p className="mt-3 text-xl font-black tabular-nums text-text-primary">
              {formatCatalogPrice(pkg.price, { currency: pkg.currency })}
            </p>
            <p className="mt-0.5 text-xs font-medium text-text-secondary">
              {paymentTypeLabel(pkg.payment_type)}
            </p>

            {pkg.short_description ? (
              <p className="mt-2 line-clamp-2 text-sm text-text-secondary">{pkg.short_description}</p>
            ) : null}

            {features.length > 0 ? (
              <ul className="mt-3 flex-1 space-y-1.5">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-text-secondary">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden />
                    <span className="line-clamp-2">{feature}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex-1" />
            )}

            <div className="mt-4 flex flex-col gap-2">
              <Link
                href={detailsHref}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#0f2744] px-4 text-sm font-semibold text-white hover:bg-[#16375f]"
              >
                View Details
              </Link>
              <Link
                href={demoHref}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border-subtle px-4 text-sm font-semibold text-text-primary hover:border-[#2563eb]/40"
              >
                Free Demo
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
