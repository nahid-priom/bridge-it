'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SellerSetupTaskId } from '@/lib/seller/setup-progress';

interface SellerOnboardingState {
  setupPercent: number;
  completedTaskIds: SellerSetupTaskId[];
  checklistDismissed: boolean;
  setSetupProgress: (percent: number, completedTaskIds: SellerSetupTaskId[]) => void;
  dismissChecklist: () => void;
  resetChecklist: () => void;
}

export const useSellerOnboardingStore = create<SellerOnboardingState>()(
  persist(
    (set) => ({
      setupPercent: 0,
      completedTaskIds: [],
      checklistDismissed: false,
      setSetupProgress: (setupPercent, completedTaskIds) =>
        set({ setupPercent, completedTaskIds }),
      dismissChecklist: () => set({ checklistDismissed: true }),
      resetChecklist: () => set({ checklistDismissed: false }),
    }),
    { name: 'deshi-seller-onboarding' }
  )
);
