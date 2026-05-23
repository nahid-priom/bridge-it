'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { becomeSellerPath } from '@/lib/auth/become-seller';
import type { AuthProfile } from '@/lib/auth/types';

export function useBecomeSeller(profile: AuthProfile | null) {
  const router = useRouter();
  return useCallback(() => {
    router.push(becomeSellerPath(profile));
  }, [router, profile]);
}
