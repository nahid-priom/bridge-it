'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DashboardMode } from '@/lib/auth/dashboard-routes';

interface DashboardModeState {
  mode: DashboardMode;
  setMode: (mode: DashboardMode) => void;
  toggleMode: () => void;
}

export const useDashboardModeStore = create<DashboardModeState>()(
  persist(
    (set, get) => ({
      mode: 'seller',
      setMode: (mode) => set({ mode }),
      toggleMode: () =>
        set({ mode: get().mode === 'seller' ? 'buyer' : 'seller' }),
    }),
    { name: 'deshi-dashboard-mode' }
  )
);
