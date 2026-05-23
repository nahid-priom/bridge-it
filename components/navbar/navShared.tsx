'use client';

import Link from 'next/link';
import { useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

export function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  onClose: () => void,
  enabled: boolean
) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, onClose, enabled]);
}

type NavMenuTriggerProps = {
  label: string;
  open: boolean;
  onClick: () => void;
  active?: boolean;
  className?: string;
};

export function NavMenuTrigger({ label, open, onClick, active, className }: NavMenuTriggerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      className={cn(
        'relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[15px] font-medium transition-all duration-200',
        'text-slate-600 dark:text-slate-300 hover:text-text-primary',
        'hover:bg-slate-100/90 dark:hover:bg-white/6',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40',
        (active || open) && 'text-deshi-green dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-500/10',
        className
      )}
    >
      {(active || open) && (
        <span
          className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-deshi-green dark:bg-emerald-400"
          aria-hidden
        />
      )}
      {label}
      <ChevronDown
        className={cn('w-3.5 h-3.5 opacity-60 transition-transform duration-200', open && 'rotate-180')}
        aria-hidden
      />
    </button>
  );
}

type NavDropdownPanelProps = {
  open: boolean;
  children: ReactNode;
  className?: string;
  align?: 'left' | 'right';
};

export function NavDropdownPanel({ open, children, className, align = 'left' }: NavDropdownPanelProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.98 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'absolute top-[calc(100%+8px)] z-50',
            align === 'left' ? 'left-0' : 'right-0',
            'rounded-2xl border border-slate-200/90 dark:border-white/10',
            'bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl',
            'shadow-[0_20px_50px_rgba(15,23,42,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)]',
            'overflow-hidden',
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function NavDropdownSection({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="py-2">
      {title && (
        <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted">
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

export function NavDropdownItem({
  href,
  onClick,
  icon,
  label,
  description,
  badge,
  external,
}: {
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  label: string;
  description?: string;
  badge?: number;
  external?: boolean;
}) {
  const className = cn(
    'flex items-start gap-3 w-full px-3 py-2.5 rounded-xl text-left transition-colors',
    'hover:bg-slate-50 dark:hover:bg-white/5',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40'
  );

  const content = (
    <>
      {icon && (
        <span className="shrink-0 w-9 h-9 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-lg">
          {icon}
        </span>
      )}
      <span className="flex-1 min-w-0">
        <span className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-text-primary">{label}</span>
          {badge !== undefined && badge > 0 && (
            <span className="min-w-[18px] h-[18px] px-1 bg-deshi-green text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {badge > 99 ? '99+' : badge}
            </span>
          )}
        </span>
        {description && (
          <span className="block text-xs text-text-muted mt-0.5 line-clamp-1">{description}</span>
        )}
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={className}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}
