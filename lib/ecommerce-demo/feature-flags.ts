import type { DemoFeatureFlags } from '@/types/bitp';

export function hasFeature(flags: DemoFeatureFlags, key: keyof DemoFeatureFlags): boolean {
  return Boolean(flags[key]);
}

export const DEFAULT_FLAGS: DemoFeatureFlags = {
  landingOnly: false,
  catalog: true,
  cart: true,
  checkout: true,
  customerAccount: false,
  wishlist: false,
  coupon: false,
  variants: false,
  stock: false,
  courierFlow: false,
  paymentGatewayUi: false,
  fraudCheckerUi: false,
  analytics: false,
  adminPreview: false,
  search: true,
};
