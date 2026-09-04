'use client';

import {
  Bookmark,
  LayoutDashboard,
  Package,
  Settings,
  Store,
  Wrench,
  Wallet,
  ShoppingBag,
  ArrowLeftRight,
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { becomeSellerPath } from '@/lib/auth/become-seller';
import {
  dashboardLabelForRole,
  resolveDashboardHref,
  type DashboardMode,
} from '@/lib/auth/dashboard-routes';
import type { AuthProfile } from '@/lib/auth/types';
export type ProfileMenuItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
};

export function buildProfileMenuItems(
  profile: AuthProfile | null,
  mode: DashboardMode,
  close: () => void
): {
  dashboardHref: string;
  dashboardLabel: string;
  primaryItems: ProfileMenuItem[];
  sellerItems: ProfileMenuItem[];
  showBecomeSeller: boolean;
  becomeSellerHref: string;
  showModeSwitcher: boolean;
  buyerModeHref: string;
} {
  const role = profile?.role ?? null;
  const dashboardHref = resolveDashboardHref(role, mode);
  const dashboardLabel = dashboardLabelForRole(role);

  const primaryItems: ProfileMenuItem[] = profile
    ? [
        {
          href: dashboardHref,
          label: dashboardLabel,
          icon: <LayoutDashboard className="w-4 h-4 text-deshi-green" />,
          onClick: close,
        },
      ]
    : [];

  if (profile && (role === 'buyer' || role === 'seller')) {
    primaryItems.push(
      {
        href: ROUTES.clientOrders,
        label: 'Orders',
        icon: <Package className="w-4 h-4 text-sky-500" />,
        onClick: close,
      },
      {
        href: ROUTES.search,
        label: 'Saved',
        icon: <Bookmark className="w-4 h-4 text-amber-500" />,
        onClick: close,
      },
      {
        href: role === 'seller' && mode === 'seller' ? ROUTES.sellerDashboardSettings : ROUTES.clientSettings,
        label: 'Settings',
        icon: <Settings className="w-4 h-4 text-slate-500" />,
        onClick: close,
      }
    );
  }

  const sellerItems: ProfileMenuItem[] =
    role === 'seller'
      ? [
          {
            href: ROUTES.sellerDashboard,
            label: 'Seller Dashboard',
            icon: <LayoutDashboard className="w-4 h-4 text-deshi-green" />,
            onClick: close,
          },
          {
            href: ROUTES.sellerDashboardServices,
            label: 'My Services',
            icon: <Wrench className="w-4 h-4 text-blue-500" />,
            onClick: close,
          },
          {
            href: ROUTES.sellerDashboardEarnings,
            label: 'Earnings',
            icon: <Wallet className="w-4 h-4 text-amber-500" />,
            onClick: close,
          },
          {
            href: ROUTES.sellerDashboardOrders,
            label: 'Seller Orders',
            icon: <ShoppingBag className="w-4 h-4 text-sky-500" />,
            onClick: close,
          },
        ]
      : [];

  return {
    dashboardHref,
    dashboardLabel,
    primaryItems,
    sellerItems,
    showBecomeSeller: !profile || profile.role === 'buyer',
    becomeSellerHref: becomeSellerPath(profile),
    showModeSwitcher: role === 'seller',
    buyerModeHref: ROUTES.dashboard,
  };
}
