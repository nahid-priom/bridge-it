'use client';

import dynamic from 'next/dynamic';
import { cn } from '@/lib/cn';
import type { SmartSearchBarProps } from '@/components/navbar/SmartSearchBar';

function NavbarSmartSearchBarFallback({
  className,
  compact,
  scrolled,
}: Pick<SmartSearchBarProps, 'className' | 'compact' | 'scrolled'>) {
  return (
    <div
      className={cn(
        'w-full rounded-full border border-slate-200/90 dark:border-white/12',
        'bg-white/95 dark:bg-white/[0.07]',
        'shadow-none',
        compact || scrolled ? 'h-11' : 'h-12',
        className
      )}
      aria-hidden
    />
  );
}

/** Client-only navbar search — avoids SSR/client hydration mismatches. */
export const NavbarSmartSearchBar = dynamic(
  () => import('@/components/navbar/SmartSearchBar').then((m) => m.SmartSearchBar),
  {
    ssr: false,
    loading: () => <NavbarSmartSearchBarFallback />,
  }
);
