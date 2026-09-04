'use client';

import { useEffect } from 'react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Heart,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Store,
  X,
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { becomeSellerPath } from '@/lib/auth/become-seller';
import type { AuthProfile } from '@/lib/auth/types';
import { useAuthProfile } from '@/components/auth/AuthProfileContext';
import { resolveDashboardHref, dashboardLabelForRole } from '@/lib/auth/dashboard-routes';
import { useDashboardModeStore } from '@/store/dashboardModeStore';
import { SellerAvatar } from '@/components/search/SellerAvatar';
import { signOutAction } from '@/app/actions/auth';
import { cn } from '@/lib/cn';

type MobileProfileSheetProps = {
  open: boolean;
  onClose: () => void;
  authProfile: AuthProfile | null;
  cartCount?: number;
  messageCount?: number;
};

function SheetLink({
  href,
  icon,
  label,
  badge,
  onClose,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  onClose: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="flex items-center gap-3 px-4 py-3.5 text-[15px] font-medium text-text-primary rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 active:bg-slate-100 dark:active:bg-white/8 transition-colors"
    >
      <span className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-white/[0.06] flex items-center justify-center shrink-0">
        {icon}
      </span>
      <span className="flex-1">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="text-[10px] font-bold bg-deshi-green text-white min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  );
}

export function MobileProfileSheet({
  open,
  onClose,
  authProfile,
  cartCount = 0,
  messageCount: _messageCount = 0,
}: MobileProfileSheetProps) {
  void _messageCount;
  const contextProfile = useAuthProfile();
  const profile = contextProfile ?? authProfile;
  const mode = useDashboardModeStore((s) => s.mode);
  const isLoggedIn = Boolean(profile);
  const name = profile?.full_name ?? profile?.email?.split('@')[0] ?? 'Guest';
  const dashboardHref = resolveDashboardHref(profile?.role, mode);
  const dashboardLabel = dashboardLabelForRole(profile?.role);
  const showBecomeSeller = !profile || profile.role === 'buyer';

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[75] lg:hidden" role="dialog" aria-modal="true" aria-label="Account">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/45 backdrop-blur-[3px]"
            aria-label="Close account menu"
            onClick={onClose}
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 380 }}
            className={cn(
              'absolute bottom-0 left-0 right-0 max-h-[min(88vh,640px)]',
              'flex flex-col rounded-t-[1.75rem] overflow-hidden',
              'bg-white/95 dark:bg-deshi-navy/98 backdrop-blur-2xl',
              'border-t border-slate-200/80 dark:border-white/10',
              'shadow-[0_-24px_80px_rgba(15,23,42,0.18)]',
              'pb-[max(1rem,env(safe-area-inset-bottom))]'
            )}
          >
            <div className="flex justify-center pt-2.5 pb-1">
              <span className="w-10 h-1 rounded-full bg-slate-200 dark:bg-white/20" aria-hidden />
            </div>

            <div className="flex items-center justify-between px-5 pb-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="relative shrink-0">
                  <SellerAvatar name={name} size="md" hue={isLoggedIn ? undefined : 200} />
                  {isLoggedIn && (
                    <span
                      className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-deshi-navy"
                      aria-hidden
                    />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-base font-bold text-text-primary truncate">{name}</p>
                  <p className="text-xs text-text-muted truncate">
                    {isLoggedIn ? profile?.email : 'Sign in to your account'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="w-11 h-11 inline-flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 pb-2" aria-label="Account menu">
              {isLoggedIn ? (
                <>
                  <SheetLink
                    href={dashboardHref}
                    icon={<LayoutDashboard className="w-4 h-4 text-deshi-green" />}
                    label={dashboardLabel}
                    onClose={onClose}
                  />
                  {profile?.role === 'seller' && (
                    <>
                      <SheetLink
                        href={ROUTES.sellerDashboardServices}
                        icon={<Store className="w-4 h-4 text-blue-500" />}
                        label="My Services"
                        onClose={onClose}
                      />
                      <SheetLink
                        href={ROUTES.sellerDashboardEarnings}
                        icon={<Package className="w-4 h-4 text-amber-500" />}
                        label="Earnings"
                        onClose={onClose}
                      />
                    </>
                  )}
                  <SheetLink
                    href={ROUTES.clientOrders}
                    icon={<Package className="w-4 h-4 text-sky-500" />}
                    label="Orders"
                    onClose={onClose}
                  />
                  <SheetLink
                    href={ROUTES.products}
                    icon={<Heart className="w-4 h-4 text-rose-500" />}
                    label="Wishlist"
                    onClose={onClose}
                  />
                  <SheetLink
                    href={ROUTES.cart}
                    icon={<ShoppingCart className="w-4 h-4 text-deshi-green" />}
                    label="Cart"
                    badge={cartCount}
                    onClose={onClose}
                  />
                  <SheetLink
                    href={ROUTES.dashboard}
                    icon={<Settings className="w-4 h-4 text-slate-500" />}
                    label="Settings"
                    onClose={onClose}
                  />

                  {showBecomeSeller && (
                    <Link
                      href={becomeSellerPath(profile)}
                      onClick={onClose}
                      className="mx-1 mt-2 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-deshi-green border border-deshi-green/35 bg-emerald-50/80 dark:bg-emerald-500/10"
                    >
                      <Store className="w-4 h-4" aria-hidden />
                      Become a Seller
                    </Link>
                  )}

                  <form action={signOutAction} className="mt-2 px-1">
                    <button
                      type="submit"
                      className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-[15px] font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                    >
                      <span className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
                        <LogOut className="w-4 h-4" aria-hidden />
                      </span>
                      Logout
                    </button>
                  </form>
                </>
              ) : (
                <div className="px-2 space-y-2 pt-1">
                  <Link
                    href={ROUTES.login}
                    onClick={onClose}
                    className="block w-full text-center py-3.5 text-[15px] font-semibold rounded-2xl border border-slate-200 dark:border-white/10"
                  >
                    Login
                  </Link>
                  <Link
                    href={ROUTES.signup}
                    onClick={onClose}
                    className="block w-full text-center py-3.5 text-[15px] font-bold text-white rounded-2xl bg-deshi-green shadow-[0_4px_16px_rgba(16,185,129,0.35)]"
                  >
                    Join Now
                  </Link>
                  {showBecomeSeller && (
                    <Link
                      href={becomeSellerPath(null)}
                      onClick={onClose}
                      className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-text-muted"
                    >
                      <Store className="w-4 h-4" aria-hidden />
                      Become a Seller
                    </Link>
                  )}
                </div>
              )}
            </nav>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
