import { formatBdt } from '@/lib/format/currency';
import type { PortfolioCardData, PortfolioPricingMode } from './types';

/** SSOT BDT formatter — ৳10,000 / ৳1,20,000 via en-BD grouping. */
export function formatBDTPrice(amount: number): string {
  return formatBdt(amount);
}

/**
 * Compact marketplace price label for portfolio cards.
 * starting_from → ৳45,000+
 * fixed → ৳25,000
 * custom → Custom Package
 * hidden → null
 */
export function formatPortfolioPriceLabel(
  data: Pick<PortfolioCardData, 'pricingMode' | 'price' | 'currency' | 'priceSuffix'>
): string | null {
  const mode: PortfolioPricingMode = data.pricingMode;
  if (mode === 'hidden') return null;
  if (mode === 'custom') return 'Custom Package';

  const amount = Number(data.price ?? 0);
  if (!Number.isFinite(amount) || amount <= 0) {
    return mode === 'starting_from' ? 'Custom Package' : null;
  }

  const currency = data.currency ?? 'BDT';
  const formatted =
    currency === 'BDT' ? formatBDTPrice(amount) : `${currency} ${amount.toLocaleString('en-BD')}`;

  if (mode === 'fixed') return formatted;

  // starting_from — prefer compact ৳45,000+ (don't show "Starting from")
  const suffix = (data.priceSuffix ?? '+').trim() || '+';
  return suffix.startsWith('+') || suffix === '+'
    ? `${formatted}+`
    : `${formatted}${suffix}`;
}

export type PortfolioPriceDisplay = {
  primary: string;
  /** "Starting price" | "Pricing" — muted caption under the primary amount. */
  caption: string;
};

/**
 * Normalized price display for listing cards.
 * Returns null when pricing should be hidden.
 */
export function formatPortfolioPrice(
  data: Pick<PortfolioCardData, 'pricingMode' | 'price' | 'currency' | 'priceSuffix'>
): PortfolioPriceDisplay | null {
  const primary = formatPortfolioPriceLabel(data);
  if (!primary) return null;

  const mode = data.pricingMode;
  if (mode === 'custom' || primary === 'Custom Package') {
    return { primary, caption: 'Pricing' };
  }
  return { primary, caption: 'Starting price' };
}

export function resolvePricingMode(input: {
  contentType: PortfolioCardData['contentType'];
  price?: number | null;
  pricingModel?: string | null;
  priceSuffix?: string | null;
}): PortfolioPricingMode {
  const amount = Number(input.price ?? 0);
  const model = (input.pricingModel ?? '').toLowerCase().trim();

  if (model === 'custom' || model === 'quote' || model === 'contact') {
    return 'custom';
  }
  if (model === 'fixed' && amount > 0) {
    return 'fixed';
  }
  if (input.contentType === 'marketing' && (!Number.isFinite(amount) || amount <= 0)) {
    return 'custom';
  }
  if (Number.isFinite(amount) && amount > 0) {
    return 'starting_from';
  }
  if (input.contentType === 'marketing') return 'custom';
  return 'hidden';
}
