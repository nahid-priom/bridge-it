import {
  LayoutDashboard,
  ShoppingBag,
  FolderKanban,
  MessageSquare,
  CreditCard,
  FileText,
  Settings,
  LifeBuoy,
  FileQuestion,
  ClipboardList,
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
  { id: 'overview', label: 'Dashboard', href: ROUTES.dashboard, icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', href: ROUTES.clientOrders, icon: ShoppingBag },
  { id: 'consultations', label: 'My Requests', href: ROUTES.clientConsultations, icon: ClipboardList },
  { id: 'projects', label: 'Projects', href: ROUTES.clientProjects, icon: FolderKanban },
  { id: 'quotations', label: 'Quotations', href: ROUTES.clientQuotations, icon: FileQuestion },
  { id: 'payments', label: 'Payments', href: ROUTES.clientPayments, icon: CreditCard },
  { id: 'files', label: 'Files', href: ROUTES.clientFiles, icon: FileText },
  { id: 'messages', label: 'Support', href: ROUTES.clientMessages, icon: MessageSquare },
  { id: 'support', label: 'Help', href: ROUTES.clientSupport, icon: LifeBuoy },
  { id: 'settings', label: 'Profile', href: ROUTES.clientSettings, icon: Settings },
];

export const clientMobileNavItems = [
  { id: 'home', label: 'Home', href: ROUTES.dashboard, icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', href: ROUTES.clientOrders, icon: ShoppingBag },
  { id: 'projects', label: 'Projects', href: ROUTES.clientProjects, icon: FolderKanban },
  { id: 'support', label: 'Support', href: ROUTES.clientSupport, icon: LifeBuoy },
  { id: 'more', label: 'More', href: ROUTES.clientSettings, icon: Settings },
];

export function getClientNavItem(pathname: string): ClientNavItem | undefined {
  if (pathname === ROUTES.dashboard) {
    return clientNavItems.find((n) => n.id === 'overview');
  }
  return clientNavItems.find(
    (n) => n.href !== ROUTES.dashboard && pathname.startsWith(n.href)
  );
}
