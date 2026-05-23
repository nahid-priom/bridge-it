'use client';

import { create } from 'zustand';

interface OnboardingState {
  step: number;
  setStep: (step: number) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  step: 0,
  setStep: (step) => set({ step }),
  reset: () => set({ step: 0 }),
}));
