'use client';

import Link from 'next/link';
import { Building2, Cpu, Headphones, Home, Package } from 'lucide-react';
import { productCategoryHref } from '@/components/navbar/constants';
import {
  MegaMenuShell,
  MegaMenuFeaturedColumn,
  MegaMenuFooterLink,
  MEGA_MENU_PANEL_CLASS,
} from '@/components/navbar/MarketplaceMegaMenu';
import {
  MAIN_PRODUCT_CATEGORIES,
  type MainProductCategoryIcon,
} from '@/constants/mainProductCategories';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/cn';

const ICON_MAP: Record<MainProductCategoryIcon, React.ComponentType<{ className?: string }>> = {
  Cpu,
  Headphones,
  Building2,
  Home,
  Package,
};

const TRENDING_PRODUCTS = [
  { label: 'Wireless Earbuds Pro', href: ROUTES.websites, meta: '৳3,500' },
  { label: 'Dell Business Laptop', href: ROUTES.softwareShowroom, meta: '৳72,000' },
  { label: 'Smart CCTV Kit', href: ROUTES.websites, meta: '৳22,000' },
  { label: 'POS Software License', href: ROUTES.softwareShowroom, meta: '৳15,000' },
];

type ProductsMegaMenuProps = {
  open: boolean;
  active?: boolean;
  onToggle: () => void;
  onClose: () => void;
};

export function ProductsMegaMenu({ open, active, onToggle, onClose }: ProductsMegaMenuProps) {
  return (
    <MegaMenuShell
      label="Products"
      open={open}
      active={active}
      onToggle={onToggle}
      panelClassName={cn(MEGA_MENU_PANEL_CLASS, 'p-3')}
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
          {MAIN_PRODUCT_CATEGORIES.map((item) => {
            const Icon = ICON_MAP[item.icon] ?? Package;
            return (
              <Link
                key={item.slug}
                href={productCategoryHref(item.slug)}
                onClick={onClose}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40 hover:-translate-y-0.5"
              >
                <span className="shrink-0 w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:scale-105 transition-transform shadow-sm">
                  <Icon className="w-5 h-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-text-primary group-hover:text-deshi-green">
                    {item.name}
                  </span>
                  <span className="block text-xs text-text-muted mt-0.5">{item.short}</span>
                  <span className="block text-[10px] font-semibold text-sky-600 dark:text-sky-400 mt-1">
                    {item.productCount}+ items
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
        <MegaMenuFeaturedColumn
          title="Trending Products"
          items={TRENDING_PRODUCTS}
          onClose={onClose}
          accent="sky"
        />
      </div>
      <MegaMenuFooterLink href={ROUTES.websites} label="View all websites" onClose={onClose} />
    </MegaMenuShell>
  );
}
