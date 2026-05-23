'use client';

import type { Category } from '@/types';
import type { AuthProfile } from '@/lib/auth/types';
import { FloatingNavbar } from '@/components/navbar/FloatingNavbar';

/** Premium floating navbar with hero-aware search reveal. */
export function PremiumMarketplaceNavbar({
  categories,
  authProfile = null,
}: {
  categories: Category[];
  authProfile?: AuthProfile | null;
}) {
  return <FloatingNavbar categories={categories} authProfile={authProfile} />;
}
