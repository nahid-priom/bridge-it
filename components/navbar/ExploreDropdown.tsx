'use client';

import type { ReactNode } from 'react';
import {
  BookOpen,
  HelpCircle,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Package,
} from 'lucide-react';
import {
  MegaMenuShell,
  MEGA_MENU_EXPLORE_PANEL_CLASS,
} from '@/components/navbar/MarketplaceMegaMenu';
import { cn } from '@/lib/cn';
import { NavDropdownItem } from '@/components/navbar/navShared';
import { EXPLORE_MOBILE_LINKS } from '@/components/navbar/exploreLinks';

const EXPLORE_ICONS: Record<string, ReactNode> = {
  'Top Freelancers': <Users className="w-4 h-4 text-deshi-green" />,
  'Popular Services': <TrendingUp className="w-4 h-4 text-violet-500" />,
  'Popular Products': <Package className="w-4 h-4 text-sky-500" />,
  'Success Stories': <Star className="w-4 h-4 text-amber-500" />,
  Community: <Sparkles className="w-4 h-4 text-fuchsia-500" />,
  Blog: <BookOpen className="w-4 h-4 text-slate-500" />,
  'Help Center': <HelpCircle className="w-4 h-4 text-slate-500" />,
};

const EXPLORE_DESCRIPTIONS: Record<string, string> = {
  'Top Freelancers': 'Highest rated talent',
  'Popular Services': 'Trending this week',
  'Popular Products': 'Best-selling items',
  'Success Stories': 'Client wins',
  Community: 'Connect & learn',
  Blog: 'Tips & insights',
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
