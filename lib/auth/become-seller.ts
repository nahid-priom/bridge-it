import type { AuthProfile } from '@/lib/auth/types';

export function becomeSellerPath(profile: AuthProfile | null): string {
  if (!profile) return '/login?next=%2Fseller%2Fonboarding';
  if (profile.role === 'admin') return '/admin';
  if (profile.role === 'seller') return '/dashboard/seller';
  return '/seller/onboarding';
}
