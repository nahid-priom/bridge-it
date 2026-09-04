'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Code2, LayoutTemplate, Megaphone } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useClickOutside } from '@/components/navbar/navShared';
import {
  isCategoryNavPath,
  NAV_CATEGORY_PILLARS,
  type NavCategoryPillar,
} from '@/components/navbar/categoryNav';

const PILLAR_ICONS = {
  websites: LayoutTemplate,
  software: Code2,
  marketing: Megaphone,
} as const;

function PillarColumn({
  pillar,
  onNavigate,
}: {
  pillar: NavCategoryPillar;
  onNavigate: () => void;
}) {
  const Icon = PILLAR_ICONS[pillar.id];

  return (
    <div className="min-w-0">
      <Link
        href={pillar.href}
        onClick={onNavigate}
        className="mb-2 flex items-center gap-2 rounded-xl px-2 py-2 transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.04]"
      >
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2563eb]/10 text-[#2563eb] dark:bg-[#2563eb]/20 dark:text-[#60a5fa]">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-bold text-text-primary">{pillar.label}</span>
          <span className="block text-[11px] font-medium text-text-muted">View all</span>
        </span>
      </Link>

      <ul className="space-y-0.5">
        {pillar.children.map((child) => (
          <li key={child.id}>
            <Link
              href={child.href}
              onClick={onNavigate}
              className="block truncate rounded-lg px-2 py-1.5 text-[13px] font-medium text-text-secondary transition-colors hover:bg-slate-50 hover:text-text-primary dark:hover:bg-white/[0.04]"
            >
              {child.label}
            </Link>
          </li>
        ))}
      </ul>

      {pillar.moreChildren && pillar.moreChildren.length > 0 ? (
        <>
          <p className="mb-1 mt-3 px-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">
            More
          </p>
          <ul className="space-y-0.5">
            {pillar.moreChildren.map((child) => (
              <li key={child.id}>
                <Link
                  href={child.href}
                  onClick={onNavigate}
                  className="block truncate rounded-lg px-2 py-1.5 text-[13px] font-medium text-text-secondary transition-colors hover:bg-slate-50 hover:text-text-primary dark:hover:bg-white/[0.04]"
                >
                  {child.label}
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}

export function CategoryDropdown({ className }: { className?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const active = isCategoryNavPath(pathname);

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const close = useCallback(() => {
    clearCloseTimer();
    setOpen(false);
  }, [clearCloseTimer]);

  const openMenu = useCallback(() => {
    clearCloseTimer();
    setOpen(true);
  }, [clearCloseTimer]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  }, [clearCloseTimer]);

  useClickOutside(ref, close, open);

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  return (
    <div
      ref={ref}
      className={cn('relative', className)}
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          'relative inline-flex items-center gap-1 whitespace-nowrap rounded-xl px-2.5 py-2 text-sm font-semibold transition-colors xl:px-3.5',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40',
          active || open
            ? 'bg-emerald-50/80 text-deshi-green dark:bg-emerald-500/10'
            : 'text-text-primary hover:bg-emerald-50/50 hover:text-deshi-green dark:hover:bg-emerald-500/5'
        )}
      >
        Categories
        <ChevronDown
          className={cn('h-3.5 w-3.5 opacity-70 transition-transform', open && 'rotate-180')}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'absolute left-1/2 top-[calc(100%+10px)] z-50 w-[min(100vw-2rem,900px)] -translate-x-1/2',
              'overflow-hidden rounded-2xl border border-slate-200/90 dark:border-white/10',
              'bg-white/96 dark:bg-slate-900/96 backdrop-blur-2xl',
              'shadow-[0_24px_60px_rgba(15,23,42,0.14)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.5)]'
            )}
            role="menu"
            aria-label="Categories"
          >
            <div className="grid grid-cols-3 gap-3 p-4">
              {NAV_CATEGORY_PILLARS.map((pillar) => (
                <PillarColumn key={pillar.id} pillar={pillar} onNavigate={close} />
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
