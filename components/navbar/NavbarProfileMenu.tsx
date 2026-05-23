'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, LogOut, Store, ArrowLeftRight } from 'lucide-react';
import { becomeSellerPath } from '@/lib/auth/become-seller';
import type { AuthProfile } from '@/lib/auth/types';
import { useAuthProfile } from '@/components/auth/AuthProfileContext';
import { useDashboardModeStore } from '@/store/dashboardModeStore';
import { SellerAvatar } from '@/components/search/SellerAvatar';
import { signOutAction } from '@/app/actions/auth';
import { useClickOutside, NavDropdownSection, NavDropdownItem } from '@/components/navbar/navShared';
import { buildProfileMenuItems } from '@/components/navbar/profileMenuItems';
import { cn } from '@/lib/cn';

type NavbarProfileMenuProps = {
  authProfile: AuthProfile | null;
  onNavigate?: () => void;
  className?: string;
  compact?: boolean;
};

function roleLabel(role: AuthProfile['role'] | null | undefined): string {
  if (role === 'admin') return 'Admin';
  if (role === 'seller') return 'Seller';
  return 'Buyer';
}

export function NavbarProfileMenu({
  authProfile: authProfileProp,
  onNavigate,
  className,
  compact = false,
}: NavbarProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const contextProfile = useAuthProfile();
  const authProfile = contextProfile ?? authProfileProp;
  const mode = useDashboardModeStore((s) => s.mode);
  const setMode = useDashboardModeStore((s) => s.setMode);
  const isLoggedIn = Boolean(authProfile);

  useClickOutside(ref, () => setOpen(false), open);

  const close = () => {
    setOpen(false);
    onNavigate?.();
  };

  const name = authProfile?.full_name ?? authProfile?.email?.split('@')[0] ?? 'Guest';
  const role = roleLabel(authProfile?.role);
  const menu = buildProfileMenuItems(authProfile, mode, close);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Account menu"
        className={cn(
          'flex items-center gap-2 rounded-full transition-all duration-200',
          'hover:bg-slate-100/80 dark:hover:bg-white/10',
          compact ? 'p-1' : 'pl-1 pr-2 py-1',
          open && 'bg-slate-100/80 dark:bg-white/10'
        )}
      >
        <SellerAvatar name={name} size={compact ? 'sm' : 'md'} />
        {!compact && (
          <>
            <span className="hidden sm:block text-sm font-semibold text-text-primary max-w-[100px] truncate">
              {name}
            </span>
            <ChevronDown
              className={cn(
                'hidden sm:block w-4 h-4 text-text-muted transition-transform',
                open && 'rotate-180'
              )}
            />
          </>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'absolute right-0 top-[calc(100%+10px)] z-50 w-64',
              'rounded-2xl border border-slate-200/90 dark:border-white/10',
              'bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl',
              'shadow-[0_24px_60px_rgba(15,23,42,0.14)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.5)]',
              'p-2 overflow-hidden'
            )}
          >
            {isLoggedIn ? (
              <>
                <div className="px-3 py-3 mb-1 rounded-xl bg-slate-50/80 dark:bg-white/5">
                  <p className="text-sm font-bold text-text-primary truncate">{name}</p>
                  <p className="text-xs text-text-muted truncate">{authProfile?.email}</p>
                  <span
                    className={cn(
                      'inline-flex mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide',
                      authProfile?.role === 'seller'
                        ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                        : authProfile?.role === 'admin'
                          ? 'bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-400'
                          : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'
                    )}
                  >
                    {role}
                  </span>
                </div>

                {menu.showModeSwitcher && (
                  <div className="mx-2 mb-2 p-1 rounded-xl bg-slate-100/80 dark:bg-white/5 grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('buyer');
                        close();
                      }}
                      className={cn(
                        'flex items-center justify-center gap-1 py-2 rounded-lg text-[11px] font-bold transition-colors',
                        mode === 'buyer'
                          ? 'bg-white dark:bg-slate-800 text-deshi-green shadow-sm'
                          : 'text-text-muted hover:text-text-primary'
                      )}
                    >
                      <ArrowLeftRight className="w-3 h-3" />
                      Buyer
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('seller');
                        close();
                      }}
                      className={cn(
                        'flex items-center justify-center gap-1 py-2 rounded-lg text-[11px] font-bold transition-colors',
                        mode === 'seller'
                          ? 'bg-white dark:bg-slate-800 text-deshi-green shadow-sm'
                          : 'text-text-muted hover:text-text-primary'
                      )}
                    >
                      <Store className="w-3 h-3" />
                      Seller
                    </button>
                  </div>
                )}

                <NavDropdownSection>
                  {(authProfile?.role === 'seller' ? menu.sellerItems : menu.primaryItems).map(
                    (item) => (
                      <NavDropdownItem
                        key={item.href + item.label}
                        href={item.href}
                        onClick={item.onClick}
                        icon={item.icon}
                        label={item.label}
                      />
                    )
                  )}
                </NavDropdownSection>

                {authProfile?.role === 'seller' && (
                  <NavDropdownSection>
                    <NavDropdownItem
                      href={menu.buyerModeHref}
                      onClick={close}
                      icon={<ArrowLeftRight className="w-4 h-4 text-slate-500" />}
                      label="Buyer Dashboard"
                    />
                  </NavDropdownSection>
                )}

                {menu.showBecomeSeller && (
                  <>
                    <div className="h-px bg-slate-100 dark:bg-white/10 mx-2 my-1" />
                    <Link
                      href={becomeSellerPath(authProfile)}
                      onClick={close}
                      className="flex items-center gap-2 mx-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-deshi-green hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors"
                    >
                      <Store className="w-3.5 h-3.5" aria-hidden />
                      Become a Seller
                    </Link>
                  </>
                )}

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
                    href="/login"
                    onClick={close}
                    className="block w-full text-center py-2.5 text-sm font-semibold text-text-primary rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={close}
                    className="block w-full text-center py-2.5 text-sm font-bold text-white rounded-xl bg-deshi-green hover:bg-deshi-green-dark shadow-[0_4px_14px_rgba(16,185,129,0.35)] transition-colors"
                  >
                    Join Now
                  </Link>
                </div>
                <Link
                  href={becomeSellerPath(null)}
                  onClick={close}
                  className="flex items-center justify-center gap-1.5 mx-2 mb-2 px-3 py-2 text-xs font-medium text-text-muted hover:text-deshi-green transition-colors"
                >
                  <Store className="w-3.5 h-3.5" aria-hidden />
                  Become a Seller
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
