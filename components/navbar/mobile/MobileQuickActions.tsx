'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/cn';

type MobileQuickActionsProps = {
  cartCount?: number;
  messageCount?: number;
  onNavigate?: () => void;
  className?: string;
};

function QuickActionCard({
  href,
  label,
  icon,
  badge,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  badge?: number;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        'flex items-center gap-2.5 px-3 py-2.5 rounded-xl',
        'bg-slate-50/90 dark:bg-white/[0.06]',
        'border border-slate-100/80 dark:border-white/[0.08]',
        'text-sm font-medium text-text-primary',
        'active:scale-[0.98] transition-transform'
      )}
    >
      {icon}
      <span className="flex-1 truncate">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="text-[10px] font-bold bg-deshi-green text-white min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  );
}

export function MobileQuickActions({
  cartCount = 0,
  messageCount: _messageCount = 0,
  onNavigate,
  className,
}: MobileQuickActionsProps) {
  void _messageCount;

  return (
    <div className={cn('grid grid-cols-2 gap-2', className)}>
      <QuickActionCard
        href={ROUTES.products}
        label="Wishlist"
        icon={<Heart className="w-4 h-4 text-rose-500 shrink-0" aria-hidden />}
        onNavigate={onNavigate}
      />
      <QuickActionCard
        href={ROUTES.cart}
        label="Cart"
        icon={<ShoppingCart className="w-4 h-4 text-deshi-green shrink-0" aria-hidden />}
        badge={cartCount}
        onNavigate={onNavigate}
      />
    </div>
  );
}
