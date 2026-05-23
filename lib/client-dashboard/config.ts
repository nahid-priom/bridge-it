import {
  LayoutDashboard,
  ShoppingBag,
  FolderKanban,
  Package,
  Briefcase,
  MessageSquare,
  Wallet,
  FileText,
  CreditCard,
  Settings,
  LifeBuoy,
  type LucideIcon,
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';

export type ClientNavItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
};

export const clientNavItems: ClientNavItem[] = [
  { id: 'overview', label: 'Dashboard Overview', href: ROUTES.dashboard, icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', href: ROUTES.clientOrders, icon: ShoppingBag },
  { id: 'projects', label: 'Active Projects', href: ROUTES.clientProjects, icon: FolderKanban },
  { id: 'products', label: 'Purchased Products', href: ROUTES.clientProducts, icon: Package },
  { id: 'services', label: 'Purchased Services', href: ROUTES.clientServices, icon: Briefcase },
  { id: 'messages', label: 'Messages', href: ROUTES.clientMessages, icon: MessageSquare, badge: 3 },
  { id: 'wallet', label: 'Wallet & Balance', href: ROUTES.clientWallet, icon: Wallet },
  { id: 'invoices', label: 'Invoices', href: ROUTES.clientInvoices, icon: FileText },
  { id: 'payments', label: 'Payments', href: ROUTES.clientPayments, icon: CreditCard },
  { id: 'support', label: 'Support Tickets', href: ROUTES.clientSupport, icon: LifeBuoy },
  { id: 'settings', label: 'Settings', href: ROUTES.clientSettings, icon: Settings },
];

export function getClientNavItem(pathname: string): ClientNavItem | undefined {
  if (pathname === ROUTES.dashboard) {
    return clientNavItems.find((n) => n.id === 'overview');
  }
  return clientNavItems.find(
    (n) => n.href !== ROUTES.dashboard && pathname.startsWith(n.href)
  );
}
