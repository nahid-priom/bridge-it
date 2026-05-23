import { ROUTES } from '@/lib/routes';

export type SellerSetupTaskId =
  | 'profile'
  | 'avatar'
  | 'payout'
  | 'service'
  | 'product'
  | 'identity'
  | 'publish'
  | 'portfolio'
  | 'skills';

export interface SellerSetupTask {
  id: SellerSetupTaskId;
  label: string;
  href: string;
  weight: number;
}

export const SELLER_SETUP_TASKS: SellerSetupTask[] = [
  { id: 'profile', label: 'Complete profile', href: ROUTES.sellerDashboardProfile, weight: 12 },
  { id: 'avatar', label: 'Upload avatar & banner', href: ROUTES.sellerDashboardProfile, weight: 10 },
  { id: 'payout', label: 'Add payout method', href: ROUTES.sellerDashboardPayouts, weight: 12 },
  { id: 'identity', label: 'Verify identity', href: ROUTES.sellerDashboardSettingsVerification, weight: 10 },
  { id: 'service', label: 'Create first service', href: ROUTES.sellerDashboardServicesNew, weight: 14 },
  { id: 'product', label: 'Create first product', href: ROUTES.sellerDashboardProductsNew, weight: 12 },
  { id: 'publish', label: 'Publish listing', href: ROUTES.sellerDashboardServices, weight: 10 },
  { id: 'portfolio', label: 'Add portfolio', href: ROUTES.sellerDashboardProfile, weight: 10 },
  { id: 'skills', label: 'Add skills', href: ROUTES.sellerDashboardProfile, weight: 10 },
];

export interface SellerSetupInput {
  hasBio: boolean;
  hasAvatar: boolean;
  hasBanner: boolean;
  hasPayoutMethod: boolean;
  isVerified: boolean;
  serviceCount: number;
  productCount: number;
  publishedListingCount: number;
  portfolioCount: number;
  skillsCount: number;
}

export function computeSellerSetupProgress(input: SellerSetupInput): {
  percent: number;
  completedIds: SellerSetupTaskId[];
} {
  const checks: Record<SellerSetupTaskId, boolean> = {
    profile: input.hasBio,
    avatar: input.hasAvatar && input.hasBanner,
    payout: input.hasPayoutMethod,
    identity: input.isVerified,
    service: input.serviceCount > 0,
    product: input.productCount > 0,
    publish: input.publishedListingCount > 0,
    portfolio: input.portfolioCount > 0,
    skills: input.skillsCount > 0,
  };

  const completedIds = SELLER_SETUP_TASKS.filter((t) => checks[t.id]).map((t) => t.id);
  const earned = SELLER_SETUP_TASKS.filter((t) => checks[t.id]).reduce((s, t) => s + t.weight, 0);
  const total = SELLER_SETUP_TASKS.reduce((s, t) => s + t.weight, 0);

  return {
    percent: Math.min(100, Math.round((earned / total) * 100)),
    completedIds,
  };
}
