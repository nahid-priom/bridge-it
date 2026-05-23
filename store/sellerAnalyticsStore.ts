'use client';

import { create } from 'zustand';

export interface SellerAnalyticsSnapshot {
  revenue: number;
  activeOrders: number;
  impressions: number;
  clicks: number;
  conversionRate: number;
  responseRate: number;
  earningsThisMonth: number;
}

interface SellerAnalyticsState {
  snapshot: SellerAnalyticsSnapshot | null;
  period: '7d' | '30d' | '90d';
  setSnapshot: (snapshot: SellerAnalyticsSnapshot) => void;
  setPeriod: (period: '7d' | '30d' | '90d') => void;
}

export const useSellerAnalyticsStore = create<SellerAnalyticsState>((set) => ({
  snapshot: null,
  period: '30d',
  setSnapshot: (snapshot) => set({ snapshot }),
  setPeriod: (period) => set({ period }),
}));
