'use client';

import { useId, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatCatalogPrice } from '@/src/features/catalog/components/CatalogPrice';
import { PackageBadge } from '@/src/features/catalog/components/PackageBadge';
import type { SoftwarePackage } from '../types';
import { includedFeatureRows, targetAudienceCopy } from './package-features';
import { packageDisplayName, paymentTypeLabel } from './package-utils';

const PREVIEW_COUNT = 5;

export function PackageFeatureAccordion({
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
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();
  const name = packageDisplayName(pkg);
  const rows = includedFeatureRows(pkg);
  const visible = expanded ? rows : rows.slice(0, PREVIEW_COUNT);
  const hasMore = rows.length > PREVIEW_COUNT;

  return (
    <section
      className={cn(
        'rounded-2xl border border-border-subtle bg-surface p-4 sm:p-6',
        pkg.is_recommended && 'border-bridge-primary/50 ring-1 ring-bridge-primary/20',
        className
      )}
      aria-label={`${name} package details`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-lg font-black text-text-primary sm:text-xl">{name}</h3>
            <PackageBadge badge={pkg.badge} />
            {pkg.is_recommended ? <PackageBadge badge="Most Popular" /> : null}
          </div>
          <p className="mt-1 text-sm text-text-secondary">{targetAudienceCopy(pkg)}</p>
        </div>
        <div className="text-left sm:text-right">
          {pkg.tier === 'enterprise' && pkg.price >= 250000 ? (
            <>
              <p className="text-xl font-black text-text-primary sm:text-2xl">Custom Pricing</p>
              <p className="text-sm text-text-muted">
                From {formatCatalogPrice(pkg.price, { currency: pkg.currency })}
              </p>
            </>
          ) : (
            <>
              <p className="text-2xl font-black tabular-nums text-text-primary">
                {formatCatalogPrice(pkg.price, { currency: pkg.currency })}
              </p>
              <p className="text-sm text-text-muted">{paymentTypeLabel(pkg.payment_type)}</p>
            </>
          )}
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {visible.map((feature) => (
          <li key={feature.id} className="flex items-start gap-2 text-sm text-text-secondary">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
            <span>{feature.label}</span>
          </li>
        ))}
      </ul>

      {hasMore ? (
        <button
          type="button"
          className="mt-3 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-bridge-primary"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? 'Show fewer features' : 'View all features'}
          <ChevronDown
            className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')}
            aria-hidden
          />
        </button>
      ) : null}

      <div id={panelId} className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onDemo}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-border-subtle px-4 py-3 text-sm font-semibold text-text-primary hover:border-bridge-primary/40"
        >
          Request Free Demo
        </button>
        <button
          type="button"
          onClick={onOrder}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-bridge-primary px-4 py-3 text-sm font-semibold text-white hover:bg-bridge-primary-dark"
        >
          Choose {name}
        </button>
      </div>
    </section>
  );
}
