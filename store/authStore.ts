'use client';

import { create } from 'zustand';
import type { UserRole } from '@/types/database.types';

export interface AuthProfileSnapshot {
  id: string;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  role: UserRole;
  sellerId: string | null;
}

interface AuthState {
  profile: AuthProfileSnapshot | null;
  isLoading: boolean;
  setProfile: (profile: AuthProfileSnapshot | null) => void;
  setLoading: (loading: boolean) => void;
  clear: () => void;
  isBuyer: () => boolean;
  isSeller: () => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  profile: null,
  isLoading: true,
  setProfile: (profile) => set({ profile, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  clear: () => set({ profile: null, isLoading: false }),
  isBuyer: () => get().profile?.role === 'buyer',
  isSeller: () => get().profile?.role === 'seller',
  isAdmin: () => get().profile?.role === 'admin',
}));
