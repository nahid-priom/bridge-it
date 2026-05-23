'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import type { AuthProfile } from '@/lib/auth/types';
import { refreshProfileAction } from '@/app/actions/profile';
import { useAuthStore, type AuthProfileSnapshot } from '@/store/authStore';
import { useSellerActivationStore } from '@/store/sellerActivationStore';
import { useDashboardModeStore } from '@/store/dashboardModeStore';
import { defaultDashboardModeForRole } from '@/lib/auth/dashboard-routes';

type AuthProfileContextValue = {
  profile: AuthProfile | null;
  refreshProfile: () => Promise<AuthProfile | null>;
  isRefreshing: boolean;
};

const AuthProfileContext = createContext<AuthProfileContextValue | null>(null);

function toSnapshot(profile: AuthProfile): AuthProfileSnapshot {
  return {
    id: profile.id,
    email: profile.email,
    fullName: profile.full_name,
    avatarUrl: profile.avatar_url,
    role: profile.role,
    sellerId: profile.seller_id,
  };
}

export function AuthProfileProvider({
  profile: initialProfile,
  children,
}: {
  profile: AuthProfile | null;
  children: ReactNode;
}) {
  const router = useRouter();
  const [profile, setProfile] = useState<AuthProfile | null>(initialProfile);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const setAuthProfile = useAuthStore((s) => s.setProfile);
  const clearAuthProfile = useAuthStore((s) => s.clear);
  const setDashboardMode = useDashboardModeStore((s) => s.setMode);
  const openActivationModal = useSellerActivationStore((s) => s.openActivationModal);

  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  useEffect(() => {
    if (profile) {
      setAuthProfile(toSnapshot(profile));
      setDashboardMode(defaultDashboardModeForRole(profile.role));
    } else {
      clearAuthProfile();
    }
  }, [profile, setAuthProfile, clearAuthProfile, setDashboardMode]);

  const refreshProfile = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const result = await refreshProfileAction();
      const next = result.profile;
      if (next) {
        const wasSeller = profile?.role === 'seller';
        setProfile(next);
        setAuthProfile(toSnapshot(next));
        if (next.role === 'seller' && !wasSeller) {
          openActivationModal();
        }
        router.refresh();
      }
      return next;
    } finally {
      setIsRefreshing(false);
    }
  }, [profile?.role, setAuthProfile, openActivationModal, router]);

  const value = useMemo(
    () => ({ profile, refreshProfile, isRefreshing }),
    [profile, refreshProfile, isRefreshing]
  );

  return (
    <AuthProfileContext.Provider value={value}>{children}</AuthProfileContext.Provider>
  );
}

export function useAuthProfile() {
  const ctx = useContext(AuthProfileContext);
  return ctx?.profile ?? null;
}

export function useAuthProfileActions() {
  const ctx = useContext(AuthProfileContext);
  if (!ctx) {
    return {
      refreshProfile: async () => null as AuthProfile | null,
      isRefreshing: false,
    };
  }
  return { refreshProfile: ctx.refreshProfile, isRefreshing: ctx.isRefreshing };
}
