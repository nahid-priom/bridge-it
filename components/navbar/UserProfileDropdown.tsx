'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Sparkles,
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import type { AuthProfile } from '@/lib/auth/types';
import { SellerAvatar } from '@/components/search/SellerAvatar';
import { signOutAction } from '@/app/actions/auth';
import {
  useClickOutside,
  NavDropdownSection,
  NavDropdownItem,
} from '@/components/navbar/navShared';
import { cn } from '@/lib/cn';

type UserProfileDropdownProps = {
  authProfile: AuthProfile | null;
  onNavigate?: () => void;
  className?: string;
  /** Icon-only trigger (mobile) */
  compact?: boolean;
};

export function UserProfileDropdown({
  authProfile,
  onNavigate,
  className,
  compact = false,
}: UserProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isLoggedIn = Boolean(authProfile);

  useClickOutside(ref, () => setOpen(false), open);

  const close = () => {
    setOpen(false);
    onNavigate?.();
  };

  const name = authProfile?.full_name ?? authProfile?.email?.split('@')[0] ?? 'Guest';
  const dashboardHref =
    authProfile?.role === 'admin'
      ? ROUTES.admin
      : ROUTES.dashboard;

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Account menu"
        className={cn(
          'inline-flex items-center gap-2 rounded-full transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40',
          !compact && 'pl-0.5 pr-2 py-0.5 hover:bg-slate-50 dark:hover:bg-white/5',
          open && !compact && 'bg-slate-50 dark:bg-white/5'
        )}
      >
        <SellerAvatar name={name} size={compact ? 'sm' : 'md'} hue={isLoggedIn ? undefined : 200} />
        {!compact && (
          <span className="hidden xl:block text-left min-w-0 max-w-[88px]">
            <span className="block text-sm font-semibold text-text-primary truncate">{name}</span>
            <span className="block text-[10px] text-text-muted">
              {isLoggedIn ? 'Account' : 'Sign in'}
            </span>
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'absolute right-0 top-[calc(100%+8px)] z-50 w-60',
              'rounded-2xl border border-slate-200/90 dark:border-white/10',
              'bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl',
              'shadow-[0_20px_50px_rgba(15,23,42,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)]',
              'p-2 overflow-hidden'
            )}
          >
            {isLoggedIn ? (
              <>
                <div className="px-3 py-2.5 mb-1">
                  <p className="text-sm font-bold text-text-primary truncate">{name}</p>
                  <p className="text-xs text-text-muted truncate">{authProfile?.email}</p>
                </div>
                <NavDropdownSection>
                  <NavDropdownItem
                    href={dashboardHref}
                    onClick={close}
                    icon={<LayoutDashboard className="w-4 h-4 text-deshi-green" />}
                    label="My Dashboard"
                  />
                  <NavDropdownItem
                    href={ROUTES.clientOrders}
                    onClick={close}
                    icon={<Package className="w-4 h-4 text-sky-500" />}
                    label="My Orders"
                  />
                  <NavDropdownItem
                    href={ROUTES.solutions}
                    onClick={close}
                    icon={<Sparkles className="w-4 h-4 text-amber-500" />}
                    label="Browse Solutions"
                  />
                  <NavDropdownItem
                    href={ROUTES.dashboard}
                    onClick={close}
                    icon={<Settings className="w-4 h-4 text-slate-500" />}
                    label="Settings"
                  />
                </NavDropdownSection>

                <div className="h-px bg-slate-100 dark:bg-white/10 mx-2 my-1" />
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" aria-hidden />
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="px-3 py-2 space-y-2">
                  <Link
                    href={ROUTES.login}
                    onClick={close}
                    className="block w-full text-center py-2.5 text-sm font-semibold text-text-primary rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href={ROUTES.signup}
                    onClick={close}
                    className="block w-full text-center py-2.5 text-sm font-bold text-white rounded-xl bg-deshi-green hover:bg-deshi-green-dark shadow-[0_4px_14px_rgba(16,185,129,0.35)] transition-colors"
                  >
                    Join Now
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
