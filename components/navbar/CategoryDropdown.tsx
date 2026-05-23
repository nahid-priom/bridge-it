'use client';

import React, { useId, useEffect } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { DesktopNavLink } from '@/components/navbar/DesktopNavLink';
import { NAV_CATEGORY_ITEMS, categoryProductsHref } from '@/components/navbar/constants';

type CategoryDropdownProps = {
  active: boolean;
  open: boolean;
  onOpen: () => void;
  onToggle: () => void;
  onClose: () => void;
};

export function CategoryDropdown({ active, open, onOpen, onToggle, onClose }: CategoryDropdownProps) {
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
        href={ROUTES.categories}
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
          className="absolute top-full left-0 mt-2 w-64 py-2 rounded-2xl bg-white dark:bg-bridge-dark-2 border border-slate-200/80 dark:border-white/10 shadow-[0_20px_50px_rgba(108,60,225,0.14)] z-[60]"
        >
          <Link
            href={ROUTES.categories}
            role="menuitem"
            onClick={onClose}
            className="block px-4 py-2.5 text-sm font-semibold text-bridge-primary hover:bg-slate-50 dark:hover:bg-white/5"
          >
            All Categories
          </Link>
          <div className="my-1 border-t border-slate-200/80 dark:border-white/10" />
          {NAV_CATEGORY_ITEMS.map((cat) => (
            <Link
              key={cat.key}
              href={categoryProductsHref(cat.key)}
              role="menuitem"
              onClick={onClose}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 dark:text-white/80 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-text-primary transition-colors"
            >
              <span className="text-base leading-none" aria-hidden>
                {cat.icon}
              </span>
              {cat.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
