import type { LucideIcon } from 'lucide-react';
import {
  BadgeDollarSign,
  BarChart3,
  Boxes,
  ClipboardList,
  Factory,
  FileBarChart,
  Layers3,
  Package,
  ShoppingCart,
  Truck,
  Users,
  WalletCards,
  Warehouse,
  Settings,
  Sparkles,
} from 'lucide-react';

/** Canonical Lucide map for software_product_features.icon_key */
export const FEATURE_ICON_MAP: Record<string, LucideIcon> = {
  'shopping-cart': ShoppingCart,
  'clipboard-list': ClipboardList,
  package: Package,
  boxes: Boxes,
  users: Users,
  'bar-chart-3': BarChart3,
  truck: Truck,
  'wallet-cards': WalletCards,
  'file-bar-chart': FileBarChart,
  factory: Factory,
  warehouse: Warehouse,
  'badge-dollar-sign': BadgeDollarSign,
  settings: Settings,
  layers: Layers3,
  sparkles: Sparkles,
};

export function resolveFeatureIcon(iconKey: string | null | undefined): LucideIcon {
  if (!iconKey) return Layers3;
  const key = iconKey.trim().toLowerCase();
  return FEATURE_ICON_MAP[key] ?? Layers3;
}

/** Heuristic icon from feature title when icon_key is missing. */
export function inferIconKeyFromTitle(title: string): string {
  const t = title.toLowerCase();
  if (/order/.test(t)) return 'shopping-cart';
  if (/inventor|stock|raw.?material|ready.?stock|warehouse/.test(t)) return 'warehouse';
  if (/customer|dealer|buyer|client/.test(t)) return 'users';
  if (/analytic|report|insight|dashboard/.test(t)) return 'bar-chart-3';
  if (/courier|dispatch|deliver|ship/.test(t)) return 'truck';
  if (/payment|account|ledger|billing|costing|collection|due|p&l|profit/.test(t))
    return 'badge-dollar-sign';
  if (/formula|recipe|bom/.test(t)) return 'clipboard-list';
  if (/product(?!ion)|catalog|sku/.test(t)) return 'package';
  if (/produc|cutting|sewing|finishing|batch|mixer/.test(t)) return 'factory';
  if (/pack/.test(t)) return 'boxes';
  if (/setting/.test(t)) return 'settings';
  if (/qc|quality/.test(t)) return 'file-bar-chart';
  return 'layers';
}

export function inferShortDescription(title: string): string {
  const t = title.toLowerCase();
  if (/order/.test(t)) return 'Track & manage orders';
  if (/inventor|stock|warehouse/.test(t)) return 'Real-time stock tracking';
  if (/customer|dealer|buyer/.test(t)) return 'Manage customers easily';
  if (/analytic|report/.test(t)) return 'Business insights';
  if (/courier|dispatch|deliver/.test(t)) return 'Delivery & logistics';
  if (/payment|account|billing/.test(t)) return 'Payments & ledgers';
  if (/formula|recipe/.test(t)) return 'Recipes & costing';
  if (/produc/.test(t)) return 'Production control';
  if (/product/.test(t)) return 'Catalog & SKUs';
  return 'Core capability';
}
