import {
  LayoutDashboard,
  ShoppingBag,
  Wrench,
  Package,
  Wallet,
  MessageSquare,
  BarChart3,
  Star,
  Users,
  CreditCard,
  Banknote,
  UserCircle,
  Settings,
  Rocket,
  type LucideIcon,
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';

export type SellerNavItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  section?: 'main' | 'finance' | 'growth' | 'account';
};

export const sellerNavItems: SellerNavItem[] = [
  { id: 'overview', label: 'Overview', href: ROUTES.sellerDashboard, icon: LayoutDashboard, section: 'main' },
  { id: 'orders', label: 'Orders', href: ROUTES.sellerDashboardOrders, icon: ShoppingBag, section: 'main' },
  { id: 'services', label: 'Services', href: ROUTES.sellerDashboardServices, icon: Wrench, section: 'main' },
  { id: 'products', label: 'Products', href: ROUTES.sellerDashboardProducts, icon: Package, section: 'main' },
  { id: 'messages', label: 'Messages', href: ROUTES.sellerDashboardMessages, icon: MessageSquare, section: 'main' },
  { id: 'earnings', label: 'Earnings', href: ROUTES.sellerDashboardEarnings, icon: Banknote, section: 'finance' },
  { id: 'wallet', label: 'Wallet', href: ROUTES.sellerDashboardWallet, icon: Wallet, section: 'finance' },
  { id: 'payouts', label: 'Payouts', href: ROUTES.sellerDashboardPayouts, icon: CreditCard, section: 'finance' },
  { id: 'analytics', label: 'Analytics', href: ROUTES.sellerDashboardAnalytics, icon: BarChart3, section: 'growth' },
  { id: 'reviews', label: 'Reviews', href: ROUTES.sellerDashboardReviews, icon: Star, section: 'growth' },
  { id: 'clients', label: 'Clients', href: ROUTES.sellerDashboardClients, icon: Users, section: 'growth' },
  { id: 'profile', label: 'Profile', href: ROUTES.sellerDashboardProfile, icon: UserCircle, section: 'account' },
  { id: 'settings', label: 'Settings', href: ROUTES.sellerDashboardSettings, icon: Settings, section: 'account' },
  { id: 'onboarding', label: 'Setup Guide', href: ROUTES.sellerDashboardOnboarding, icon: Rocket, section: 'account' },
];

export const sellerSettingsNavItems = [
  { id: 'general', label: 'Profile Settings', href: ROUTES.sellerDashboardSettings },
  { id: 'notifications', label: 'Notifications', href: ROUTES.sellerDashboardSettingsNotifications },
  { id: 'security', label: 'Security', href: ROUTES.sellerDashboardSettingsSecurity },
  { id: 'verification', label: 'Identity Verification', href: ROUTES.sellerDashboardSettingsVerification },
  { id: 'payouts', label: 'Payout Settings', href: ROUTES.sellerDashboardPayouts },
] as const;

export function getSellerNavItem(pathname: string): SellerNavItem | undefined {
  if (pathname === ROUTES.sellerDashboard) {
    return sellerNavItems.find((n) => n.id === 'overview');
  }
  return sellerNavItems.find(
    (n) => n.href !== ROUTES.sellerDashboard && pathname.startsWith(n.href)
  );
}

export function isSellerNavActive(pathname: string, href: string): boolean {
  if (href === ROUTES.sellerDashboard) return pathname === ROUTES.sellerDashboard;
  return pathname === href || pathname.startsWith(`${href}/`);
}
