'use client';

import Link from 'next/link';
import { cn } from '@/lib/cn';
import { ROUTES } from '@/lib/routes';
import { becomeSellerPath } from '@/lib/auth/become-seller';
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
    return null;
  }

  const showBecomeSeller =
    !authProfile || authProfile.role === 'buyer';

  return (
    <div className={cn('hidden lg:flex items-center gap-2 shrink-0', className)}>
      <Link
        href={ROUTES.login}
        onClick={onNavigate}
        className="px-3 py-2 text-sm font-semibold text-slate-600 hover:text-text-primary dark:text-white/85 dark:hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40 rounded-lg"
      >
        Login
      </Link>
      <Link
        href={ROUTES.signup}
        onClick={onNavigate}
        className={cn(
          'px-5 py-2.5 text-sm font-bold rounded-lg text-white whitespace-nowrap',
          'bg-deshi-green hover:bg-deshi-green-dark',
          'shadow-[0_6px_20px_rgba(16,185,129,0.35)]',
          'transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40'
        )}
      >
        Join
      </Link>
      {showBecomeSeller && (
        <Link
          href={becomeSellerPath(authProfile)}
          onClick={onNavigate}
          className="px-4 py-2 text-sm font-bold rounded-lg border-2 border-deshi-green text-deshi-green-dark dark:text-deshi-green hover:bg-deshi-green/10 transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40"
        >
          Become a Seller
        </Link>
      )}
    </div>
  );
}
