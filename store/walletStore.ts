'use client';

import { create } from 'zustand';

interface WalletState {
  balance: number;
  pendingBalance: number;
  currency: string;
  isLoading: boolean;
  setWallet: (balance: number, pending: number, currency?: string) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  balance: 0,
  pendingBalance: 0,
  currency: 'BDT',
  isLoading: false,
  setWallet: (balance, pendingBalance, currency = 'BDT') =>
    set({ balance, pendingBalance, currency, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ balance: 0, pendingBalance: 0, currency: 'BDT', isLoading: false }),
}));
