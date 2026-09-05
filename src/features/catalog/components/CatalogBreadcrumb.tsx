import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { CatalogBreadcrumbItem } from '../types';

export function CatalogBreadcrumb({
  items,
  className,
}: {
  items: CatalogBreadcrumbItem[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn('min-w-0', className)}>
      <ol className="flex min-w-0 flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isHome = index === 0 && item.path === '/';

          return (
            <li key={`${item.path}-${index}`} className="flex min-w-0 items-center gap-1.5">
              {index > 0 ? (
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-text-muted/40" aria-hidden />
              ) : null}
              {isLast ? (
                <span
                  className="max-w-[12rem] truncate font-semibold text-text-primary sm:max-w-none"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className="inline-flex items-center gap-1.5 font-medium text-text-muted transition-colors hover:text-[#2563eb]"
                >
                  {isHome ? (
                    <>
                      <Home className="h-4 w-4 shrink-0 text-[#2563eb]/90" aria-hidden />
                      <span className="sr-only sm:not-sr-only">Home</span>
                    </>
                  ) : (
                    <span className="max-w-[8rem] truncate sm:max-w-none">{item.name}</span>
                  )}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
