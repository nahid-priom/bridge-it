'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import type { AuthProfile } from '@/lib/auth/types';
import { SellerAvatar } from '@/components/search/SellerAvatar';
import { cn } from '@/lib/cn';

type NavUserProfileProps = {
  authProfile: AuthProfile | null;
  className?: string;
};

export function NavUserProfile({ authProfile, className }: NavUserProfileProps) {
  if (authProfile) {
    const name = authProfile.full_name ?? authProfile.email?.split('@')[0] ?? 'Account';
    const roleLabel =
      authProfile.role === 'seller'
        ? 'Seller'
        : authProfile.role === 'admin'
          ? 'Admin'
          : 'Buyer';

    return (
      <Link
        href={ROUTES.dashboard}
        className={cn(
          'hidden lg:flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40',
          className
        )}
      >
        <SellerAvatar name={name} size="md" />
        <span className="text-left min-w-0">
          <span className="block text-sm font-bold text-text-primary truncate max-w-[100px]">{name}</span>
          <span className="block text-[10px] font-medium text-text-muted">{roleLabel}</span>
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={ROUTES.login}
      className={cn(
        'hidden lg:flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40',
        className
      )}
    >
      <SellerAvatar name="Mahfuzur" size="md" hue={200} />
      <span className="text-left">
        <span className="block text-sm font-bold text-text-primary">Mahfuzur</span>
        <span className="block text-[10px] font-medium text-text-muted">Buyer</span>
      </span>
    </Link>
  );
}
