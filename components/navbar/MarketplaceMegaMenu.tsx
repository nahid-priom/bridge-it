'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { NavMenuTrigger } from '@/components/navbar/navShared';
import { cn } from '@/lib/cn';

/** Shared mega-menu panel widths (viewport-capped). */
export const MEGA_MENU_PANEL_CLASS = 'w-[min(100vw-2rem,768px)]';
export const MEGA_MENU_EXPLORE_PANEL_CLASS = 'w-96';

type MegaMenuShellProps = {
  label: string;
  open: boolean;
  active?: boolean;
  onToggle: () => void;
  onClose?: () => void;
  children: ReactNode;
  panelClassName?: string;
  className?: string;
};

export function MegaMenuShell({
  label,
  open,
  active,
  onToggle,
  children,
  panelClassName,
  className,
}: MegaMenuShellProps) {
  return (
    <div className={cn('relative hidden lg:block', className)}>
      <NavMenuTrigger label={label} open={open} onClick={onToggle} active={active || open} />
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'absolute top-[calc(100%+10px)] left-0 z-50',
              'rounded-2xl border border-slate-200/90 dark:border-white/10',
              'bg-white/96 dark:bg-slate-900/96 backdrop-blur-2xl',
              'shadow-[0_24px_60px_rgba(15,23,42,0.14)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.5)]',
              'overflow-hidden',
              panelClassName
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type FeaturedLink = {
  label: string;
  href: string;
  meta?: string;
};

export function MegaMenuFeaturedColumn({
  title,
  items,
  onClose,
  accent = 'emerald',
}: {
  title: string;
  items: FeaturedLink[];
  onClose: () => void;
  accent?: 'emerald' | 'sky' | 'blue';
}) {
  const accentMap = {
    emerald: 'from-emerald-50 to-teal-50/50 dark:from-emerald-500/10 dark:to-teal-500/5 border-emerald-100/80 dark:border-emerald-500/20',
    sky: 'from-sky-50 to-blue-50/50 dark:from-sky-500/10 dark:to-blue-500/5 border-sky-100/80 dark:border-sky-500/20',
    blue: 'from-blue-50 to-sky-50/50 dark:from-blue-500/10 dark:to-sky-500/5 border-blue-100/80 dark:border-blue-500/20',
  };

  return (
    <div
      className={cn(
        'p-3 rounded-xl border bg-gradient-to-br',
        accentMap[accent]
      )}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2 px-1">
        {title}
      </p>
      <ul className="space-y-0.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onClose}
              className="flex items-center justify-between gap-2 px-2 py-2 rounded-lg hover:bg-white/70 dark:hover:bg-white/5 transition-colors group"
            >
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-text-primary group-hover:text-deshi-green truncate">
                  {item.label}
                </span>
                {item.meta && (
                  <span className="block text-[11px] text-text-muted">{item.meta}</span>
                )}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-text-muted opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MegaMenuFooterLink({
  href,
  label,
  onClose,
}: {
  href: string;
  label: string;
  onClose: () => void;
}) {
  return (
    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-white/10 px-1">
      <Link
        href={href}
        onClick={onClose}
        className="flex items-center justify-center gap-1 text-xs font-semibold text-deshi-green py-2.5 hover:underline"
      >
        {label}
        <ArrowRight className="w-3.5 h-3.5" aria-hidden />
      </Link>
    </div>
  );
}
