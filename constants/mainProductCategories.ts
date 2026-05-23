import type { LucideIcon } from 'lucide-react';
import { Cpu, Headphones, Building2, Home, Package } from 'lucide-react';

export type MainProductCategoryIcon =
  | 'Cpu'
  | 'Headphones'
  | 'Building2'
  | 'Home'
  | 'Package';

export type MainProductCategory = {
  slug: string;
  name: string;
  short: string;
  description: string;
  icon: MainProductCategoryIcon;
  productCount: number;
};

export const MAIN_PRODUCT_CATEGORIES: MainProductCategory[] = [
  {
    slug: 'electronics',
    name: 'Electronics',
    short: 'Laptops, monitors & office tech',
    description: 'Business laptops, displays, and essential electronics for modern teams.',
    icon: 'Cpu',
    productCount: 120,
  },
  {
    slug: 'gadgets',
    name: 'Gadgets & Accessories',
    short: 'Audio, wearables & peripherals',
    description: 'Earbuds, power banks, hubs, and everyday tech accessories.',
    icon: 'Headphones',
    productCount: 200,
  },
  {
    slug: 'office-solutions',
    name: 'Office Solutions',
    short: 'POS, printers & business hardware',
    description: 'Point of sale, scanners, routers, and office infrastructure.',
    icon: 'Building2',
    productCount: 85,
  },
  {
    slug: 'smart-devices',
    name: 'Smart Devices',
    short: 'CCTV, locks & automation',
    description: 'Smart security, lighting, and connected devices for workplaces.',
    icon: 'Home',
    productCount: 95,
  },
  {
    slug: 'digital-products',
    name: 'Digital Products',
    short: 'Software licenses & templates',
    description: 'POS, accounting, ERP licenses and ready-to-use business templates.',
    icon: 'Package',
    productCount: 60,
  },
];

export const MAIN_PRODUCT_CATEGORY_SLUGS = MAIN_PRODUCT_CATEGORIES.map((c) => c.slug);

export const MAIN_PRODUCT_CATEGORY_BY_SLUG = Object.fromEntries(
  MAIN_PRODUCT_CATEGORIES.map((c) => [c.slug, c])
) as Record<string, MainProductCategory>;

const LUCIDE_MAP: Record<MainProductCategoryIcon, LucideIcon> = {
  Cpu,
  Headphones,
  Building2,
  Home,
  Package,
};

export function getMainProductCategoryIcon(icon: MainProductCategoryIcon): LucideIcon {
  return LUCIDE_MAP[icon];
}

export const MAIN_PRODUCT_CATEGORY_EMOJI: Record<string, string> = {
  electronics: '💻',
  gadgets: '🎧',
  'office-solutions': '🖨️',
  'smart-devices': '📷',
  'digital-products': '📦',
};

export function isMainProductCategorySlug(slug: string): boolean {
  return slug in MAIN_PRODUCT_CATEGORY_BY_SLUG;
}
