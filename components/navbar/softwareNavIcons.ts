import type { LucideIcon } from 'lucide-react';
import {
  Boxes,
  Building2,
  Calculator,
  Cloud,
  Factory,
  GraduationCap,
  HeartPulse,
  Layers,
  Package,
  ShoppingBag,
  ShoppingCart,
  Sprout,
  Store,
  Truck,
  UserCog,
  Users,
  Warehouse,
  Zap,
} from 'lucide-react';

/** Icons for Software mega-menu / mobile category links. */
export const SOFTWARE_NAV_ICONS: Record<string, LucideIcon> = {
  erp: Building2,
  pos: ShoppingCart,
  crm: Users,
  hrm: UserCog,
  'business-automation': Zap,
  'ecommerce-admin': ShoppingBag,
  manufacturing: Factory,
  agro: Sprout,
  healthcare: HeartPulse,
  education: GraduationCap,
  logistics: Truck,
  distribution: Package,
  inventory: Warehouse,
  accounting: Calculator,
  saas: Cloud,
  automation: Layers,
  enterprise: Store,
};

export function softwareNavIcon(id: string): LucideIcon {
  return SOFTWARE_NAV_ICONS[id] ?? Boxes;
}
