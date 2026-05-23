'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SellerActivationState {
  isModalOpen: boolean;
  dismissedActivationIds: string[];
  pendingCelebration: boolean;
  openActivationModal: () => void;
  closeActivationModal: () => void;
  triggerCelebration: () => void;
  clearCelebration: () => void;
  dismissActivation: (notificationId: string) => void;
  hasDismissedActivation: (notificationId: string) => boolean;
}

export const useSellerActivationStore = create<SellerActivationState>()(
  persist(
    (set, get) => ({
      isModalOpen: false,
      dismissedActivationIds: [],
      pendingCelebration: false,
      openActivationModal: () => set({ isModalOpen: true, pendingCelebration: true }),
      closeActivationModal: () => set({ isModalOpen: false }),
      triggerCelebration: () => set({ pendingCelebration: true }),
      clearCelebration: () => set({ pendingCelebration: false }),
      dismissActivation: (notificationId) =>
        set((state) => ({
          dismissedActivationIds: [...new Set([...state.dismissedActivationIds, notificationId])],
          isModalOpen: false,
        })),
      hasDismissedActivation: (notificationId) =>
        get().dismissedActivationIds.includes(notificationId),
    }),
    { name: 'deshi-seller-activation' }
  )
);
