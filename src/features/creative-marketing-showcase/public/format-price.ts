export function formatCreativeStartingPrice(
  amount: number,
  suffix = '',
  currency = 'BDT'
): string {
  const formatted = new Intl.NumberFormat('en-BD').format(amount);
  const symbol = currency === 'BDT' ? '৳' : `${currency} `;
  return `Starting ${symbol}${formatted}${suffix}`;
}

export function formatCreativePackagePrice(amount: number, currency = 'BDT', model = 'one_time'): string {
  const formatted = new Intl.NumberFormat('en-BD').format(amount);
  const symbol = currency === 'BDT' ? '৳' : `${currency} `;
  if (model === 'monthly') return `${symbol}${formatted}/mo`;
  if (model === 'custom') return `From ${symbol}${formatted}`;
  return `${symbol}${formatted}`;
}
