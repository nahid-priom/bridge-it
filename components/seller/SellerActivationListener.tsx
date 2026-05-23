'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { useAuthProfile, useAuthProfileActions } from '@/components/auth/AuthProfileContext';
import { useSellerActivationStore } from '@/store/sellerActivationStore';
import { SellerActivationModal } from '@/components/seller/SellerActivationModal';

const POLL_MS = 12_000;

/**
 * Keeps navbar/profile in sync when admin approves a seller application.
 * Listens for marketplace_notifications inserts and polls on onboarding while pending.
 */
export function SellerActivationListener() {
  const profile = useAuthProfile();
  const { refreshProfile } = useAuthProfileActions();
  const pathname = usePathname();
  const openActivationModal = useSellerActivationStore((s) => s.openActivationModal);
  const hasDismissedActivation = useSellerActivationStore((s) => s.hasDismissedActivation);
  const previousRole = useRef(profile?.role);

  useEffect(() => {
    if (!profile?.id || profile.role === 'seller' || profile.role === 'admin') return;

    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;

    const channel = supabase
      .channel(`seller-activation:${profile.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'marketplace_notifications',
          filter: `user_id=eq.${profile.id}`,
        },
        (payload) => {
          const row = payload.new as {
            id?: string;
            notification_type?: string;
          };
          if (row.notification_type !== 'seller_approved') return;
          if (row.id && hasDismissedActivation(row.id)) return;
          void refreshProfile().then((next) => {
            if (next?.role === 'seller') openActivationModal();
          });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [profile?.id, profile?.role, refreshProfile, openActivationModal, hasDismissedActivation]);

  useEffect(() => {
    const prev = previousRole.current;
    if (prev !== 'seller' && profile?.role === 'seller') {
      openActivationModal();
    }
    previousRole.current = profile?.role;
  }, [profile?.role, openActivationModal]);

  useEffect(() => {
    if (!profile?.id || profile.role !== 'buyer') return;
    const onOnboarding = pathname.startsWith('/seller/onboarding');
    if (!onOnboarding) return;

    const id = window.setInterval(() => {
      void refreshProfile();
    }, POLL_MS);

    return () => window.clearInterval(id);
  }, [profile?.id, profile?.role, pathname, refreshProfile]);

  return <SellerActivationModal />;
}
