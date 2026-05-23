'use client';

import { Menu } from 'lucide-react';
import { NavbarProfileMenu } from '@/components/navbar/NavbarProfileMenu';
import type { AuthProfile } from '@/lib/auth/types';
import { cn } from '@/lib/cn';

export function SellerTopbar({
  title,
  subtitle,
  authProfile,
  onMenuClick,
}: {
  title: string;
  subtitle?: string;
  authProfile: AuthProfile | null;
  onMenuClick: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 px-3 sm:px-4 lg:px-6 pt-3 pb-2">
      <div
        className={cn(
          'flex items-center gap-3 sm:gap-4 rounded-2xl px-3 sm:px-5 py-2.5 sm:py-3',
          'bg-white/90 dark:bg-slate-900/70 backdrop-blur-xl',
          'border border-slate-200/80 dark:border-white/10',
          'shadow-[0_4px_24px_rgba(15,23,42,0.04)]'
        )}
      >
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="text-base sm:text-lg font-bold text-text-primary truncate">{title}</h1>
          {subtitle && <p className="text-xs text-text-muted truncate">{subtitle}</p>}
        </div>

        <NavbarProfileMenu authProfile={authProfile} />
      </div>
    </header>
  );
}
