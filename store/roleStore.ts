'use client';

import { create } from 'zustand';
import type { MarketplaceAccessContext } from '@/lib/auth/resolveMarketplaceAccess';
import { resolveBecomeSellerPath, resolveDashboardRoute } from '@/lib/auth/resolveMarketplaceAccess';

interface RoleState {
  access: MarketplaceAccessContext | null;
  setAccess: (access: MarketplaceAccessContext | null) => void;
  dashboardHref: () => string;
  becomeSellerHref: () => string;
  isSellerActivated: () => boolean;
}

export const useRoleStore = create<RoleState>((set, get) => ({
  access: null,
  setAccess: (access) => set({ access }),
  dashboardHref: () => resolveDashboardRoute(get().access?.profile?.role),
  becomeSellerHref: () => resolveBecomeSellerPath(get().access ?? { profile: null, sellerStatus: null, applicationStatus: null }),
  isSellerActivated: () =>
    get().access?.profile?.role === 'seller' && get().access?.sellerStatus === 'active',
}));
