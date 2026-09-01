import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FolderKanban,
  Users,
  CreditCard,
  FileQuestion,
  MessageSquare,
  Image,
  Star,
  Settings,
  Phone,
} from 'lucide-react';
import type { AdminNavItem } from '@/types/admin';

export const adminNavItems: AdminNavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'bitp-products', label: 'Products & Services', icon: Package },
  { id: 'bitp-categories', label: 'Categories', icon: Package },
  { id: 'bitp-orders', label: 'Orders', icon: ShoppingBag },
  { id: 'bitp-projects', label: 'Projects', icon: FolderKanban },
  { id: 'bitp-quotations', label: 'Quotations', icon: FileQuestion },
  { id: 'bitp-clients', label: 'Clients', icon: Users },
  { id: 'bitp-payments', label: 'Payments', icon: CreditCard },
  { id: 'bitp-consultations', label: 'Consultations', icon: Phone },
  { id: 'bitp-portfolio', label: 'Portfolio', icon: Image },
  { id: 'bitp-reviews', label: 'Reviews', icon: Star },
  { id: 'bitp-messages', label: 'Messages', icon: MessageSquare },
  { id: 'bitp-content', label: 'Site Content', icon: Settings },
  { id: 'bitp-software', label: 'Software Demos', icon: Settings },
];
