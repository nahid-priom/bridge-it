import { CATALOG_PACKAGE_TIERS } from '../config/constants';
import { formatCatalogTierPrice } from '../utils/filters';

export function CatalogPriceTiers({
  compact = false,
  stacked = false,
}: {
  compact?: boolean;
  stacked?: boolean;
}) {
  if (stacked) {
    return (
      <ul className="space-y-2">
        {CATALOG_PACKAGE_TIERS.map((tier) => (
          <li
            key={tier.key}
            title={tier.features.join(', ')}
            className="flex items-start justify-between gap-3 rounded-xl border border-border-subtle bg-background-soft px-3 py-2.5"
          >
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">{tier.shortLabel}</p>
              <p className="mt-0.5 text-sm font-medium text-text-secondary">{tier.name}</p>
            </div>
            <p className="shrink-0 text-sm font-bold text-text-primary">{formatCatalogTierPrice(tier)}</p>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {CATALOG_PACKAGE_TIERS.map((tier) => (
        <span
          key={tier.key}
          title={`${tier.name}: ${tier.features.join(', ')}`}
          className={
            compact
              ? 'inline-flex flex-col rounded-md border border-border-subtle bg-background-soft px-1.5 py-1 leading-tight'
              : 'inline-flex min-w-[5.5rem] flex-col rounded-lg border border-border-subtle bg-background-soft px-2 py-1.5'
          }
        >
          <span className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">{tier.shortLabel}</span>
          <span className="text-xs font-bold text-text-primary sm:text-sm">{formatCatalogTierPrice(tier)}</span>
        </span>
      ))}
    </div>
  );
}
