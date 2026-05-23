'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

type DesktopNavLinkProps = {
  label: string;
  href: string;
  active: boolean;
  hasChevron?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  ariaExpanded?: boolean;
  ariaControls?: string;
  className?: string;
};

export function DesktopNavLink({
  label,
  href,
  active,
  hasChevron,
  onClick,
  ariaExpanded,
  ariaControls,
  className,
}: DesktopNavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      aria-expanded={hasChevron ? ariaExpanded : undefined}
      aria-controls={ariaControls}
      className={cn(
        'relative flex items-center gap-0.5 px-2.5 py-2 text-[13px] xl:text-sm font-medium whitespace-nowrap transition-colors rounded-lg shrink-0',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-bridge-primary/40',
        active
          ? 'text-bridge-primary'
          : 'text-slate-600 hover:text-bridge-primary dark:text-white/80 dark:hover:text-white',
        className
      )}
    >
      {label}
      {hasChevron && (
        <ChevronDown
          className={cn('w-3.5 h-3.5 shrink-0 opacity-70', active && 'text-bridge-primary')}
          aria-hidden
        />
      )}
      {active && (
        <span
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-bridge-primary"
          aria-hidden
        />
      )}
    </Link>
  );
}
