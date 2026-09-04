'use client';

import { useEffect, useId } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ROUTES, marketplaceProductCategoryUrl } from '@/lib/routes';
import { DesktopNavLink } from '@/components/navbar/DesktopNavLink';
import { NAV_PRODUCT_ITEMS } from '@/components/navbar/constants';
import { cn } from '@/lib/cn';

type ProductCategoryDropdownProps = {
  active: boolean;
  open: boolean;
  onOpen: () => void;
  onToggle: () => void;
  onClose: () => void;
};

export function ProductCategoryDropdown({
  active,
  open,
  onOpen,
  onToggle,
  onClose,
}: ProductCategoryDropdownProps) {
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div
      className="relative shrink-0"
      onMouseEnter={() => {
        if (window.matchMedia('(min-width: 1280px)').matches) onOpen();
      }}
      onMouseLeave={() => {
        if (window.matchMedia('(min-width: 1280px)').matches) onClose();
      }}
    >
      <DesktopNavLink
        label="Categories"
        href={ROUTES.websites}
        active={active}
        hasChevron
        onClick={(e) => {
          e.preventDefault();
          onToggle();
        }}
        ariaExpanded={open}
        ariaControls={panelId}
      />

      {open && (
        <div
          id={panelId}
          role="menu"
          className="absolute top-full left-0 mt-2 w-[min(100vw-2rem,22rem)] py-2 rounded-2xl bg-white dark:bg-bridge-dark-2 border border-slate-200/80 dark:border-white/10 shadow-[0_20px_50px_rgba(37,99,235,0.14)] z-[60]"
        >
          <div className="px-4 py-2.5 border-b border-slate-100 dark:border-white/10">
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              Product Marketplace
            </p>
            <p className="text-[11px] text-text-muted mt-0.5">
              Gadgets, electronics & business solutions
            </p>
          </div>
          <Link
            href={ROUTES.websites}
            role="menuitem"
            onClick={onClose}
            className="flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-bridge-primary hover:bg-slate-50 dark:hover:bg-white/5"
          >
            Shop all products
            <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
          <div className="my-1 border-t border-slate-200/80 dark:border-white/10" />
          {NAV_PRODUCT_ITEMS.map((cat) => (
            <Link
              key={cat.slug}
              href={marketplaceProductCategoryUrl(cat.slug)}
              role="menuitem"
              onClick={onClose}
              className={cn(
                'flex gap-3 px-4 py-3 text-left transition-colors',
                'hover:bg-slate-50 dark:hover:bg-white/5 group'
              )}
            >
              <span className="text-xl leading-none shrink-0 mt-0.5" aria-hidden>
                {cat.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-text-primary group-hover:text-deshi-green transition-colors">
                  {cat.label}
                </span>
                <span className="block text-[11px] text-text-muted mt-0.5 line-clamp-1">
                  {cat.short}
                </span>
              </span>
              <span className="text-[10px] font-bold text-text-muted shrink-0">
                {cat.productCount}+
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
