'use client';

import { create } from 'zustand';
import type { MarketplaceAnalyticsSnapshot } from '@/types/marketplace-unified';

interface DashboardState {
  analytics: MarketplaceAnalyticsSnapshot | null;
  lastSyncedAt: string | null;
  isSyncing: boolean;
  setAnalytics: (analytics: MarketplaceAnalyticsSnapshot) => void;
  setSyncing: (syncing: boolean) => void;
}

const defaultAnalytics: MarketplaceAnalyticsSnapshot = {
  gmv: 0,
  orderCount: 0,
  activeSellers: 0,
  activeBuyers: 0,
  revenue: 0,
  topCategories: [],
};

export const useDashboardStore = create<DashboardState>((set) => ({
  analytics: null,
  lastSyncedAt: null,
  isSyncing: false,
  setAnalytics: (analytics) =>
    set({ analytics, lastSyncedAt: new Date().toISOString(), isSyncing: false }),
  setSyncing: (isSyncing) => set({ isSyncing }),
}));

export const useDashboardAnalytics = () =>
  useDashboardStore((s) => s.analytics ?? defaultAnalytics);
