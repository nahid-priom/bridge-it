'use client';

import { useEffect } from 'react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutDashboard, X } from 'lucide-react';
import { ROUTES, isNavActive } from '@/lib/routes';
import { BridgeLogo } from '@/components/brand/BridgeLogo';
import { MAIN_NAV_LINKS } from '@/components/navbar/constants';
import { MobileQuickActions } from '@/components/navbar/mobile/MobileQuickActions';
import type { AuthProfile } from '@/lib/auth/types';
import { useAuthProfile } from '@/components/auth/AuthProfileContext';
import { resolveDashboardHref } from '@/lib/auth/dashboard-routes';
import { useDashboardModeStore } from '@/store/dashboardModeStore';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { cn } from '@/lib/cn';

type MobileDrawerMenuProps = {
  open: boolean;
  onClose: () => void;
  authProfile: AuthProfile | null;
  cartCount?: number;
  notificationCount?: number;
  messageCount?: number;
};

export function MobileDrawerMenu({
  open,
  onClose,
  authProfile,
  cartCount = 0,
  notificationCount = 3,
  messageCount = 0,
}: MobileDrawerMenuProps) {
  const pathname = usePathname();
  const isActive = (href: string) => isNavActive(pathname, href);

  const contextProfile = useAuthProfile();
  const profile = contextProfile ?? authProfile;
  const mode = useDashboardModeStore((s) => s.mode);
  const isLoggedIn = Boolean(profile);
  const dashboardHref = resolveDashboardHref(profile?.role, mode);

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  const closeAndNavigate = () => onClose();

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 340 }}
            className={cn(
              'absolute top-0 left-0 bottom-0 w-[min(100vw-2.5rem,340px)]',
              'flex flex-col overflow-hidden',
              'rounded-r-[1.75rem]',
              'bg-white/92 dark:bg-deshi-navy/94 backdrop-blur-2xl',
              'border-r border-slate-200/70 dark:border-white/10',
              'shadow-[8px_0_48px_rgba(15,23,42,0.16)]'
            )}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100/90 dark:border-white/10">
              <Link href={ROUTES.home} onClick={closeAndNavigate}>
                <BridgeLogo variant="navSm" href={false} />
              </Link>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="w-11 h-11 inline-flex items-center justify-center rounded-full hover:bg-slate-100/90 dark:hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3">
              <nav aria-label="Main navigation">
                {MAIN_NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeAndNavigate}
                    className={cn(
                      'block py-3 text-[15px] font-semibold border-b border-slate-100/90 dark:border-white/[0.08]',
                      isActive(link.href) ? 'text-deshi-green' : 'text-text-primary'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mt-5 mb-2">
                Quick actions
              </p>
              <MobileQuickActions
                cartCount={cartCount}
                notificationCount={notificationCount}
                messageCount={messageCount}
                onNavigate={closeAndNavigate}
              />

              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mt-5 mb-2">
                Account
              </p>
              {isLoggedIn ? (
                <Link
                  href={dashboardHref}
                  onClick={closeAndNavigate}
                  className="flex items-center gap-2.5 px-3 py-3 rounded-xl border border-slate-200/80 dark:border-white/10 text-sm font-semibold"
                >
                  <LayoutDashboard className="w-4 h-4 text-deshi-green" aria-hidden />
                  {authProfile?.role === 'seller' ? 'Seller dashboard' : 'My dashboard'}
                </Link>
              ) : (
                <Link
                  href={ROUTES.login}
                  onClick={closeAndNavigate}
                  className="flex items-center justify-center py-3 rounded-xl text-sm font-semibold border border-slate-200 dark:border-white/10"
                >
                  Sign in
                </Link>
              )}

              <div className="mt-6 pb-4">
                <ThemeSwitcher variant="mobile" />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
