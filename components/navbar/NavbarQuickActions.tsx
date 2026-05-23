'use client';

import Link from 'next/link';
import { Bell, Heart, MessageCircle, Search, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/cn';

type NavbarQuickActionsProps = {
  cartCount: number;
  notificationCount?: number;
  messageCount?: number;
  onCartClick: () => void;
  onSearchClick?: () => void;
  className?: string;
};

function ActionButton({
  label,
  onClick,
  href,
  badge,
  children,
}: {
  label: string;
  badge?: number;
  children: React.ReactNode;
} & ({ href: string; onClick?: never } | { href?: never; onClick: () => void })) {
  const classes = cn(
    'relative inline-flex items-center justify-center w-10 h-10 rounded-xl',
    'text-slate-500 dark:text-slate-400',
    'hover:text-text-primary hover:bg-slate-100/90 dark:hover:bg-white/8',
    'transition-colors duration-200',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40'
  );

  const badgeEl =
    badge !== undefined && badge > 0 ? (
      <motion.span
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 text-[9px] font-bold text-white rounded-full flex items-center justify-center bg-gradient-to-br from-deshi-green to-emerald-600 ring-2 ring-white dark:ring-slate-900"
      >
        {badge > 99 ? '99+' : badge}
      </motion.span>
    ) : null;

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={label}>
        {children}
        {badgeEl}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes} aria-label={label}>
      {children}
      {badgeEl}
    </button>
  );
}

export function NavbarQuickActions({
  cartCount,
  notificationCount = 3,
  messageCount = 0,
  onCartClick,
  onSearchClick,
  className,
}: NavbarQuickActionsProps) {
  return (
    <div
      className={cn(
        'hidden md:flex items-center gap-0.5 px-1 py-0.5 rounded-2xl',
        'border border-slate-200/60 dark:border-white/8',
        'bg-slate-50/50 dark:bg-white/[0.03]',
        className
      )}
      aria-label="Quick actions"
    >
      {onSearchClick ? (
        <ActionButton label="Search (⌘K)" onClick={onSearchClick}>
          <Search className="w-[18px] h-[18px]" aria-hidden />
        </ActionButton>
      ) : null}
      <ActionButton label="Wishlist" href={ROUTES.products}>
        <Heart className="w-[18px] h-[18px]" aria-hidden />
      </ActionButton>
      <ActionButton label="Messages" href={ROUTES.messages} badge={messageCount}>
        <MessageCircle className="w-[18px] h-[18px]" aria-hidden />
      </ActionButton>
      <ActionButton label="Notifications" onClick={() => {}} badge={notificationCount}>
        <Bell className="w-[18px] h-[18px]" aria-hidden />
      </ActionButton>
      <ActionButton
        label={cartCount ? `Cart, ${cartCount} items` : 'Cart'}
        onClick={onCartClick}
        badge={cartCount}
      >
        <ShoppingCart className="w-[18px] h-[18px]" aria-hidden />
      </ActionButton>
    </div>
  );
}
