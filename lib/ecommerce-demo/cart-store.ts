'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DemoStoreProduct } from '@/types/bitp';

export type CartItem = {
  product: DemoStoreProduct;
  quantity: number;
  variantLabel?: string;
};

type CartState = {
  demoSlug: string | null;
  items: CartItem[];
  couponCode: string | null;
  couponDiscount: number;
  setDemoSlug: (slug: string) => void;
  addItem: (product: DemoStoreProduct, qty?: number, variantLabel?: string) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  subtotal: () => number;
  total: () => number;
  itemCount: () => number;
};

const DEMO_COUPONS: Record<string, number> = { DEMO10: 0.1, SAVE500: 500 };

export const useDemoCart = create<CartState>()(
  persist(
    (set, get) => ({
      demoSlug: null,
      items: [],
      couponCode: null,
      couponDiscount: 0,
      setDemoSlug: (slug) => set({ demoSlug: slug }),
      addItem: (product, qty = 1, variantLabel) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.product.id === product.id && i.variantLabel === variantLabel
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id && i.variantLabel === variantLabel
                  ? { ...i, quantity: i.quantity + qty }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity: qty, variantLabel }] };
        });
      },
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.product.id !== productId) })),
      updateQty: (productId, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.product.id !== productId)
              : state.items.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i)),
        })),
      clearCart: () => set({ items: [], couponCode: null, couponDiscount: 0 }),
      applyCoupon: (code) => {
        const upper = code.toUpperCase();
        if (DEMO_COUPONS[upper] !== undefined) {
          const discount = DEMO_COUPONS[upper];
          set({
            couponCode: upper,
            couponDiscount: discount <= 1 ? get().subtotal() * discount : discount,
          });
          return true;
        }
        return false;
      },
      subtotal: () =>
        get().items.reduce((s, i) => s + Number(i.product.price) * i.quantity, 0),
      total: () => Math.max(0, get().subtotal() - get().couponDiscount),
      itemCount: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    { name: 'bitp-demo-cart' }
  )
);
