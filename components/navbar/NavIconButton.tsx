'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';

type NavIconButtonProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
  badge?: number;
  size?: 'md' | 'lg';
} & (
  | { href: string; onClick?: never }
  | { href?: never; onClick: () => void }
);

export function NavIconButton({
  label,
  children,
  className,
  badge,
  size = 'md',
  href,
  onClick,
}: NavIconButtonProps) {
  const classes = cn(
    'relative inline-flex items-center justify-center rounded-full shrink-0',
    'text-slate-600 hover:text-bridge-primary hover:bg-bridge-primary/10',
    'dark:text-white/85 dark:hover:text-white dark:hover:bg-white/10',
    'transition-colors cursor-pointer',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-bridge-primary/40',
    size === 'lg' ? 'h-12 w-12' : 'h-10 w-10',
    className
  );

  const badgeEl =
    badge !== undefined && badge > 0 ? (
      <span className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 bg-bridge-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-bridge-dark-2">
        {badge > 99 ? '99+' : badge}
      </span>
    ) : null;

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={label}>
        {children}
        {badgeEl}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes} aria-label={label}>
      {children}
      {badgeEl}
    </button>
  );
}
