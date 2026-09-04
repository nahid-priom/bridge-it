import { formatBdt } from '@/lib/format/currency';
import { SOFTWARE_CURRENCY } from '../config/constants';

/** Bangladesh-style starting price, e.g. `Starting ৳50,000/mo`. */
export function formatStartingPrice(price: number, suffix = '', currency = SOFTWARE_CURRENCY): string {
  const amount = currency === 'BDT' ? formatBdt(price) : `${currency} ${price.toLocaleString('en-BD')}`;
  const trimmed = suffix.trim();
  return `Starting ${amount}${trimmed ? trimmed : ''}`;
}

export function formatSoftwarePackagePrice(price: number, currency = SOFTWARE_CURRENCY): string {
  if (currency === 'BDT') return formatBdt(price);
  return `${currency} ${price.toLocaleString('en-BD')}`;
}
