'use client';

import { cn } from '@/lib/cn';

export const SELLER_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'services', label: 'Services' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'about', label: 'About' },
  { id: 'faq', label: 'FAQ' },
] as const;

export type SellerTabId = (typeof SELLER_TABS)[number]['id'];

type SellerTabsProps = {
  active: SellerTabId;
  onChange: (id: SellerTabId) => void;
  reviewCount?: number;
};

export function SellerTabs({ active, onChange, reviewCount }: SellerTabsProps) {
  return (
    <nav
      className="sticky top-[calc(var(--header-offset)+0.25rem)] z-20 -mx-4 px-4 sm:mx-0 sm:px-0 py-2 mb-6 bg-background/95 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10"
      aria-label="Seller profile sections"
    >
      <div className="flex gap-1 overflow-x-auto scrollbar-none">
        {SELLER_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/50',
              active === tab.id
                ? 'bg-deshi-green text-white shadow-md shadow-deshi-green/25'
                : 'text-text-secondary hover:text-text-primary hover:bg-slate-100 dark:hover:bg-white/5'
            )}
            aria-current={active === tab.id ? 'true' : undefined}
          >
            {tab.label}
            {tab.id === 'reviews' && reviewCount !== undefined && (
              <span className="ml-1.5 opacity-80">({reviewCount})</span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
