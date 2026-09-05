import { formatBdt } from '@/lib/format/currency';

/** Format BDT with ৳. Returns null when price is missing or zero (never show ৳0). */
export function formatCatalogPrice(
  amount: number | null | undefined,
  options?: { suffix?: string | null; currency?: string; requestPricingLabel?: string }
): string {
  const requestLabel = options?.requestPricingLabel ?? 'Request Pricing';
  if (amount == null || amount <= 0) return requestLabel;
  const currency = options?.currency ?? 'BDT';
  const formatted =
    currency === 'BDT' ? formatBdt(amount) : `${currency} ${amount.toLocaleString('en-BD')}`;
  const suffix = options?.suffix?.trim() ?? '';
  return suffix ? `${formatted}${suffix}` : formatted;
}

export function CatalogPrice({
  amount,
  suffix,
  currency = 'BDT',
  className,
  requestPricingLabel = 'Request Pricing',
}: {
  amount: number | null | undefined;
  suffix?: string | null;
  currency?: string;
  className?: string;
  requestPricingLabel?: string;
}) {
  return (
    <span className={className}>
      {formatCatalogPrice(amount, { suffix, currency, requestPricingLabel })}
    </span>
  );
}
