import {
  LayoutDashboard,
  ClipboardList,
  ShieldCheck,
  Store,
  Users,
  ShoppingBag,
  Scale,
  FolderTree,
  Sparkles,
  BarChart3,
  Settings,
} from 'lucide-react';
import type { AdminNavItem } from '@/types/admin';

export const adminNavItems: AdminNavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'seller-applications', label: 'Seller Applications', icon: ClipboardList },
  { id: 'seller-verification', label: 'Seller Verification', icon: ShieldCheck },
  { id: 'sellers', label: 'Sellers', icon: Store },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'orders', label: 'Orders & Escrow', icon: ShoppingBag },
  { id: 'disputes', label: 'Disputes', icon: Scale },
  { id: 'categories', label: 'Categories', icon: FolderTree },
  { id: 'featured', label: 'Featured Services', icon: Sparkles },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'settings', label: 'Platform Settings', icon: Settings },
];
