'use client';

import { create } from 'zustand';
import type { MarketplaceOrderStatus } from '@/types/marketplace-unified';

export interface OrderSnapshot {
  id: string;
  orderNumber: string;
  title: string;
  status: MarketplaceOrderStatus;
  amount: number;
  currency: string;
  sellerName?: string;
}

interface OrderState {
  orders: OrderSnapshot[];
  activeOrderId: string | null;
  isLoading: boolean;
  setOrders: (orders: OrderSnapshot[]) => void;
  setActiveOrder: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  upsertOrder: (order: OrderSnapshot) => void;
  updateOrderStatus: (id: string, status: MarketplaceOrderStatus) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  activeOrderId: null,
  isLoading: false,
  setOrders: (orders) => set({ orders, isLoading: false }),
  setActiveOrder: (activeOrderId) => set({ activeOrderId }),
  setLoading: (isLoading) => set({ isLoading }),
  upsertOrder: (order) =>
    set((state) => {
      const idx = state.orders.findIndex((o) => o.id === order.id);
      if (idx >= 0) {
        const next = [...state.orders];
        next[idx] = order;
        return { orders: next };
      }
      return { orders: [order, ...state.orders] };
    }),
  updateOrderStatus: (id, status) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
    })),
}));
