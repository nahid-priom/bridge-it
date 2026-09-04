'use client';

import type { ReactNode } from 'react';
import {
  HelpCircle,
  ShoppingBag,
  Sparkles,
  Star,
  Globe,
  Code,
} from 'lucide-react';
import {
  MegaMenuShell,
  MEGA_MENU_EXPLORE_PANEL_CLASS,
} from '@/components/navbar/MarketplaceMegaMenu';
import { cn } from '@/lib/cn';
import { NavDropdownItem } from '@/components/navbar/navShared';
import { EXPLORE_MOBILE_LINKS } from '@/components/navbar/exploreLinks';

const EXPLORE_ICONS: Record<string, ReactNode> = {
  'Software Solutions': <Code className="w-4 h-4 text-emerald-500" />,
  'E-commerce Showroom': <ShoppingBag className="w-4 h-4 text-teal-500" />,
  'Creative & Digital Marketing': <Sparkles className="w-4 h-4 text-amber-500" />,
  'Web & App Solutions': <Globe className="w-4 h-4 text-blue-500" />,
  'Success Stories': <Star className="w-4 h-4 text-amber-500" />,
  'Help Center': <HelpCircle className="w-4 h-4 text-slate-500" />,
};

const EXPLORE_DESCRIPTIONS: Record<string, string> = {
  'Software Solutions': 'ERP, POS, CRM & more',
  'E-commerce Showroom': 'Store demos & packages',
  'Creative & Digital Marketing': 'Design + performance marketing',
  'Web & App Solutions': 'Websites & mobile apps',
  'Success Stories': 'Client wins',
  'Help Center': 'Support & guides',
};

type ExploreDropdownProps = {
  open: boolean;
  active?: boolean;
  onToggle: () => void;
  onClose: () => void;
};

export function ExploreDropdown({ open, active, onToggle, onClose }: ExploreDropdownProps) {
  return (
    <MegaMenuShell
      label="Explore"
      open={open}
      active={active}
      onToggle={onToggle}
      panelClassName={cn(MEGA_MENU_EXPLORE_PANEL_CLASS, 'p-2')}
    >
      {EXPLORE_MOBILE_LINKS.map((item) => (
        <NavDropdownItem
          key={item.label}
          href={item.href}
          onClick={onClose}
          icon={EXPLORE_ICONS[item.label]}
          label={item.label}
          description={EXPLORE_DESCRIPTIONS[item.label]}
        />
      ))}
    </MegaMenuShell>
  );
}
