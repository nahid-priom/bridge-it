'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  X,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Store,
} from 'lucide-react';
import { ROUTES, isNavActive } from '@/lib/routes';
import { BridgeLogo } from '@/components/brand/BridgeLogo';
import { NavbarSearch } from '@/components/navbar/NavbarSearch';
import {
  MAIN_NAV_LINKS,
  NAV_CATEGORY_ITEMS,
  categoryProductsHref,
} from '@/components/navbar/constants';
import type { AuthProfile } from '@/lib/auth/types';
import { becomeSellerPath } from '@/lib/auth/become-seller';
import { cn } from '@/lib/cn';

type MobileDrawerProps = {
  open: boolean;
  onClose: () => void;
  authProfile: AuthProfile | null;
  cartCount?: number;
  messageBadge?: number;
};

function DrawerNavLink({
  href,
  label,
  active,
  onNavigate,
  badge,
}: {
  href: string;
  label: string;
  active: boolean;
  onNavigate: () => void;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center justify-between px-4 py-3 rounded-xl text-[15px] font-medium transition-colors',
        active
          ? 'bg-bridge-primary/10 text-bridge-primary font-semibold'
          : 'text-slate-600 hover:bg-slate-50 dark:text-white/85 dark:hover:bg-white/5'
      )}
    >
      <span>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="min-w-[20px] h-5 px-1.5 bg-bridge-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  );
}

export function MobileDrawer({
  open,
  onClose,
  authProfile,
  cartCount = 0,
  messageBadge = 0,
}: MobileDrawerProps) {
  const pathname = usePathname();
  const isActive = (href: string) => isNavActive(pathname, href);
  const isLoggedIn = Boolean(authProfile);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const becomeSellerHref = becomeSellerPath(authProfile);
  const showBecomeSellerCard =
    !authProfile || authProfile.role === 'buyer';

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

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
    setCategoriesOpen(false);
  }, [pathname, onClose]);

  useEffect(() => {
    if (!open) setCategoriesOpen(false);
  }, [open]);

  if (!open) return null;

  const closeAndNavigate = () => onClose();

  type AccountLink = {
    label: string;
    href: string;
    badge?: number;
    highlight?: boolean;
  };

  const accountLinks: AccountLink[] = isLoggedIn
    ? [
        {
          label: 'Dashboard',
          href:
            authProfile?.role === 'admin'
              ? ROUTES.admin
              : authProfile?.role === 'seller'
                ? ROUTES.sellerDashboard
                : ROUTES.dashboard,
        },
        { label: 'Messages', href: ROUTES.messages, badge: messageBadge },
        { label: 'Orders', href: ROUTES.dashboard },
        { label: 'Wishlist', href: ROUTES.products },
      ]
    : [
        { label: 'Log in', href: ROUTES.login },
        { label: 'Join Now', href: ROUTES.signup, highlight: true },
      ];

  return (
    <div className="fixed inset-0 z-[70] xl:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]"
        aria-label="Close menu"
        onClick={onClose}
      />

      <div
        className={cn(
          'absolute top-4 right-4 left-4 sm:left-auto',
          'w-[calc(100vw-32px)] sm:w-full max-w-[520px]',
          'max-h-[calc(100vh-32px)] overflow-y-auto',
          'rounded-[28px] p-5',
          'bg-white dark:bg-bridge-dark-2',
          'border border-slate-200 dark:border-white/10',
          'shadow-[0_30px_90px_rgba(15,14,23,0.18)]'
        )}
      >
        <div className="flex items-center justify-between mb-5">
          <Link href={ROUTES.home} onClick={closeAndNavigate} className="shrink-0">
            <BridgeLogo textVisibility="always" iconSize="nav" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="h-12 w-12 inline-flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-bridge-primary/40"
          >
            <X className="w-5 h-5" aria-hidden />
          </button>
        </div>

        <NavbarSearch variant="drawer" onSubmitted={closeAndNavigate} className="mb-6" />

        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-6 min-[420px]:gap-8">
          <nav aria-label="Site navigation" className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-white/40 px-1 mb-2">
              Menu
            </p>
            <DrawerNavLink
              href={ROUTES.home}
              label="Home"
              active={isActive(ROUTES.home)}
              onNavigate={closeAndNavigate}
            />
            <div>
              <button
                type="button"
                onClick={() => setCategoriesOpen((v) => !v)}
                aria-expanded={categoriesOpen}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-3 rounded-xl text-[15px] font-medium transition-colors',
                  isActive(ROUTES.categories) || pathname.startsWith('/products')
                    ? 'bg-bridge-primary/10 text-bridge-primary font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-white/85'
                )}
              >
                <span>Categories</span>
                <ChevronDown
                  className={cn('w-4 h-4 transition-transform', categoriesOpen && 'rotate-180')}
                  aria-hidden
                />
              </button>
              {categoriesOpen && (
                <div className="mt-1 ml-2 pl-2 border-l-2 border-bridge-primary/20 space-y-0.5">
                  <Link
                    href={ROUTES.categories}
                    onClick={closeAndNavigate}
                    className="block px-3 py-2 text-sm text-bridge-primary font-medium"
                  >
                    All Categories
                  </Link>
                  {NAV_CATEGORY_ITEMS.map((cat) => (
                    <Link
                      key={cat.key}
                      href={categoryProductsHref(cat.key)}
                      onClick={closeAndNavigate}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-white/80 hover:text-bridge-primary"
                    >
                      <span aria-hidden>{cat.icon}</span>
                      {cat.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {MAIN_NAV_LINKS.filter((l) => l.label !== 'Home').map((link) => (
              <DrawerNavLink
                key={link.href}
                href={link.href}
                label={link.label}
                active={isActive(link.href)}
                onNavigate={closeAndNavigate}
              />
            ))}
          </nav>

          <nav aria-label="Account" className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-white/40 px-1 mb-2">
              Account
            </p>
            {accountLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeAndNavigate}
                className={cn(
                  'flex items-center justify-between px-4 py-3 rounded-xl text-[15px] font-medium transition-colors',
                  item.highlight
                    ? 'bg-gradient-to-r from-bridge-primary to-bridge-primary-light text-white font-semibold shadow-[0_8px_20px_rgba(108,60,225,0.3)]'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-white/85 dark:hover:bg-white/5'
                )}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="min-w-[20px] h-5 px-1.5 bg-bridge-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {showBecomeSellerCard && (
          <Link
            href={becomeSellerHref}
            onClick={closeAndNavigate}
            className="mt-6 flex items-center gap-4 p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-gradient-to-br from-slate-50 to-white dark:from-bridge-dark-3/50 dark:to-bridge-dark-2 hover:border-bridge-primary/30 transition-colors group"
          >
            <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-bridge-primary to-bridge-primary-light flex items-center justify-center text-white shadow-[0_8px_20px_rgba(108,60,225,0.35)]">
              <Store className="w-6 h-6" aria-hidden />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-text-primary text-sm">Become a Seller</p>
              <p className="text-xs text-slate-500 dark:text-white/60 mt-0.5 leading-snug">
                Join Bridge IT Park and start growing your business today.
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-bridge-primary shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}

        {cartCount > 0 && (
          <p className="mt-4 text-center text-xs text-slate-500">
            {cartCount} item{cartCount !== 1 ? 's' : ''} in cart
          </p>
        )}
      </div>
    </div>
  );
}
