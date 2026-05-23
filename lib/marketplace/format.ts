/** Format BDT price with ৳ symbol and en-BD grouping. */
export function formatBdtPrice(amount: number): string {
  return `৳${amount.toLocaleString('en-BD')}`;
}

export function formatDeliveryDays(days: number | null): string {
  if (days == null || days <= 0) return 'Flexible delivery';
  if (days === 1) return '1 day delivery';
  return `${days} days delivery`;
}
