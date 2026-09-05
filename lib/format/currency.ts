import type { PricingType } from '@/types/bitp';

export function formatBdt(amount: number): string {
  return `৳${amount.toLocaleString('en-BD')}`;
}

/** Alias — portfolio / marketplace SSOT. */
export const formatBDTPrice = formatBdt;

export function formatProductPrice(
  amount: number,
  pricingType: PricingType | string = 'fixed',
  options?: { promotionalPrice?: number | null; billingType?: string | null }
): { primary: string; secondary?: string; strikethrough?: string } {
  const billing = options?.billingType?.toLowerCase();
  const suffix = billing === 'monthly' ? '/month' : billing === 'yearly' ? '/year' : '';
  const formatted = `${formatBdt(amount)}${suffix}`;
  const promo = options?.promotionalPrice;

  if (promo != null && promo > 0 && promo < amount) {
    return {
      primary: `${formatBdt(promo)}${suffix}`,
      strikethrough: formatted,
      secondary: pricingType === 'starting_from' ? 'Starting from' : undefined,
    };
  }

  if (pricingType === 'starting_from') {
    return { primary: formatted, secondary: 'Starting from' };
  }

  return { primary: formatted };
}

export function formatPackagePrice(price: number, billingType?: string | null): string {
  const billing = billingType?.toLowerCase();
  if (billing === 'monthly') return `${formatBdt(price)}/month`;
  if (billing === 'yearly') return `${formatBdt(price)}/year`;
  return formatBdt(price);
}
