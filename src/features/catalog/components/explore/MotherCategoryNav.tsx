'use client';

import Link from 'next/link';
import { cn, focusVisibleRing } from '@/lib/cn';
import type { CatalogCategoryRoot } from '../../types';
import { CATALOG_MOTHER_NAV } from './types';

export function MotherCategoryNav({
  activeRoot,
  onNavigate,
}: {
  activeRoot: CatalogCategoryRoot;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Browse categories">
      <ul className="space-y-0.5">
        {CATALOG_MOTHER_NAV.map((item) => {
          const active = item.root === activeRoot;
          return (
            <li key={item.root}>
              <Link
                href={item.href}
                title={item.title}
                onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  focusVisibleRing,
                  'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors',
                  active
                    ? 'bg-[#0f2744] font-semibold text-white dark:bg-white/15'
                    : 'font-medium text-text-secondary hover:bg-surface hover:text-text-primary'
                )}
              >
                <span
                  className={cn(
                    'flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border',
                    active ? 'border-white bg-white' : 'border-current'
                  )}
                  aria-hidden
                >
                  {active ? <span className="h-1.5 w-1.5 rounded-full bg-[#0f2744] dark:bg-white" /> : null}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
