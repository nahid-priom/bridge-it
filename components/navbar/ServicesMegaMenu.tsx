'use client';

import Link from 'next/link';
import { Blocks, Bot, Globe, Megaphone, Smartphone } from 'lucide-react';
import { NAV_SERVICE_ITEMS, serviceCategoryHref } from '@/components/navbar/constants';
import {
  MegaMenuShell,
  MegaMenuFeaturedColumn,
  MegaMenuFooterLink,
  MEGA_MENU_PANEL_CLASS,
} from '@/components/navbar/MarketplaceMegaMenu';
import {
  MAIN_MARKETPLACE_CATEGORIES,
  type MainCategoryIcon,
} from '@/constants/mainMarketplaceCategories';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/cn';

const ICON_MAP: Record<MainCategoryIcon, React.ComponentType<{ className?: string }>> = {
  Blocks,
  Globe,
  Smartphone,
  Megaphone,
  Bot,
};

const POPULAR_SERVICES = [
  { label: 'Ecommerce Website', href: '/search?category=web-development', meta: 'From ৳15,000' },
  { label: 'Android App Development', href: '/search?category=app-development', meta: 'Top rated' },
  { label: 'Facebook Ads Setup', href: '/search?category=digital-marketing', meta: 'BD agencies' },
  { label: 'AI Chatbot Integration', href: '/search?category=ai-automations', meta: 'Automation' },
];

type ServicesMegaMenuProps = {
  open: boolean;
  active?: boolean;
  onToggle: () => void;
  onClose: () => void;
};

export function ServicesMegaMenu({ open, active, onToggle, onClose }: ServicesMegaMenuProps) {
  return (
    <MegaMenuShell
      label="Services"
      open={open}
      active={active}
      onToggle={onToggle}
      panelClassName={cn(MEGA_MENU_PANEL_CLASS, 'p-3')}
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
          {NAV_SERVICE_ITEMS.map((item) => {
            const iconKey =
              MAIN_MARKETPLACE_CATEGORIES.find((c) => c.slug === item.slug)?.icon ?? 'Globe';
            const Icon = ICON_MAP[iconKey as MainCategoryIcon] ?? Globe;
            return (
              <Link
                key={item.slug}
                href={serviceCategoryHref(item.slug)}
                onClick={onClose}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40 hover:-translate-y-0.5"
              >
                <span className="shrink-0 w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-deshi-green group-hover:scale-105 transition-transform shadow-sm">
                  <Icon className="w-5 h-5" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-text-primary group-hover:text-deshi-green">
                    {item.label}
                  </span>
                  <span className="block text-xs text-text-muted mt-0.5 line-clamp-2">{item.short}</span>
                </span>
              </Link>
            );
          })}
        </div>
        <MegaMenuFeaturedColumn
          title="Popular Services"
          items={POPULAR_SERVICES}
          onClose={onClose}
          accent="emerald"
        />
      </div>
      <MegaMenuFooterLink href={ROUTES.search} label="Browse all services" onClose={onClose} />
    </MegaMenuShell>
  );
}
