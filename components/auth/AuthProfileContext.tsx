'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { AuthProfile } from '@/lib/auth/types';

const AuthProfileContext = createContext<AuthProfile | null>(null);

export function AuthProfileProvider({
  profile,
  children,
}: {
  profile: AuthProfile | null;
  children: ReactNode;
}) {
  return (
    <AuthProfileContext.Provider value={profile}>{children}</AuthProfileContext.Provider>
  );
}

export function useAuthProfile() {
  return useContext(AuthProfileContext);
}
