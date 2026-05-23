'use client';

import { Bell, Heart, MessageCircle, ShoppingCart } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { NavIconButton } from '@/components/navbar/NavIconButton';
import type { AuthProfile } from '@/lib/auth/types';
import { cn } from '@/lib/cn';

type NavActionButtonsProps = {
  cartCount: number;
  onCartClick: () => void;
  authProfile: AuthProfile | null;
  notificationCount?: number;
  iconSize?: 'md' | 'lg';
  /** Show only cart (mobile header) */
  cartOnly?: boolean;
  className?: string;
};

export function NavActionButtons({
  cartCount,
  onCartClick,
  authProfile,
  notificationCount = 0,
  iconSize = 'md',
  cartOnly = false,
  className,
}: NavActionButtonsProps) {
  void authProfile;

  return (
    <div className={cn('flex items-center gap-0.5 shrink-0', className)}>
      {!cartOnly && (
        <>
          <NavIconButton
            href={ROUTES.products}
            label="Wishlist"
            size={iconSize}
          >
            <Heart className="w-5 h-5" aria-hidden />
          </NavIconButton>
          <NavIconButton
            href={ROUTES.messages}
            label="Messages"
            size={iconSize}
          >
            <MessageCircle className="w-5 h-5" aria-hidden />
          </NavIconButton>
          <NavIconButton
            label={
              notificationCount > 0
                ? `Notifications, ${notificationCount} unread`
                : 'Notifications'
            }
            onClick={() => {}}
            badge={notificationCount}
            size={iconSize}
          >
            <Bell className="w-5 h-5" aria-hidden />
          </NavIconButton>
        </>
      )}
      <NavIconButton
        label={cartCount ? `Cart, ${cartCount} items` : 'Cart'}
        onClick={onCartClick}
        badge={cartCount}
        size={iconSize}
      >
        <ShoppingCart className="w-5 h-5" aria-hidden />
      </NavIconButton>
    </div>
  );
}
