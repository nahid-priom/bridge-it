'use client';

import { useEffect } from 'react';
import { useSellerActivationStore } from '@/store/sellerActivationStore';

/** Opens celebration modal when seller has a pending approval notification. */
export function SellerDashboardActivation({
  showCelebration = false,
}: {
  showCelebration?: boolean;
}) {
  const openActivationModal = useSellerActivationStore((s) => s.openActivationModal);

  useEffect(() => {
    if (showCelebration) {
      openActivationModal();
    }
  }, [showCelebration, openActivationModal]);

  return null;
}
