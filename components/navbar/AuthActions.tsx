'use client';

import Link from 'next/link';
import { cn } from '@/lib/cn';
import { ROUTES } from '@/lib/routes';
import type { AuthProfile } from '@/lib/auth/types';

type AuthActionsProps = {
  authProfile: AuthProfile | null;
  className?: string;
  onNavigate?: () => void;
  /** Compact text links for desktop bar */
  variant?: 'desktop' | 'drawer';
};

export function AuthActions({
  authProfile,
  className,
  onNavigate,
  variant = 'desktop',
}: AuthActionsProps) {
  const isLoggedIn = Boolean(authProfile);
  const isAdmin = authProfile?.role === 'admin';
  const isSeller = authProfile?.role === 'seller';

  if (variant === 'drawer') {
    return null;
  }

  if (isLoggedIn && authProfile) {
    const dashboardHref = isAdmin
      ? ROUTES.admin
      : isSeller
        ? ROUTES.sellerDashboard
        : ROUTES.dashboard;
    const dashboardLabel = isAdmin
      ? 'Admin'
      : isSeller
        ? 'Seller Dashboard'
        : 'Dashboard';

    return (
      <div className={cn('hidden lg:flex items-center gap-2 shrink-0', className)}>
        <Link
          href={dashboardHref}
          onClick={onNavigate}
          className="px-3 py-2 text-sm font-semibold text-slate-600 hover:text-bridge-primary dark:text-white/85 dark:hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bridge-primary/40 rounded-lg"
        >
          {dashboardLabel}
        </Link>
      </div>
    );
  }

  return (
    <div className={cn('hidden lg:flex items-center gap-2 shrink-0', className)}>
      <Link
        href={ROUTES.login}
        onClick={onNavigate}
        className="px-3 py-2 text-sm font-semibold text-slate-600 hover:text-text-primary dark:text-white/85 dark:hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bridge-primary/40 rounded-lg"
      >
        Login
      </Link>
      <Link
        href={ROUTES.signup}
        onClick={onNavigate}
        className={cn(
          'px-5 py-2.5 text-sm font-bold rounded-full text-white whitespace-nowrap',
          'bg-gradient-to-r from-bridge-primary to-bridge-primary-light',
          'shadow-[0_8px_24px_rgba(108,60,225,0.35)] hover:shadow-[0_10px_28px_rgba(108,60,225,0.45)]',
          'transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-bridge-primary/40'
        )}
      >
        Join
      </Link>
    </div>
  );
}
