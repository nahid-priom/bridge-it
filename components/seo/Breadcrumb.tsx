import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import type { BreadcrumbItem } from '@/lib/seo/breadcrumbs';

export type { BreadcrumbItem };

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  trailing?: ReactNode;
}

export function Breadcrumb({ items, className, trailing }: BreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <div className={cn('pt-[var(--header-offset)]', className)}>
      <div
        className={cn(
          'mx-auto flex w-full max-w-[1480px] items-center gap-3',
          'border-b border-border-subtle/50',
          'px-4 py-[var(--breadcrumb-gap)] sm:px-6 lg:px-8 xl:px-10'
        )}
      >
        <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
          <ol
            className={cn(
              'flex min-h-[1.75rem] min-w-0 items-center gap-2',
              'overflow-x-auto scrollbar-none',
              '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
            )}
          >
            {items.map((item, index) => {
              const isLast = index === items.length - 1;
              const isHome = index === 0 && item.href === '/';

              return (
                <li
                  key={`${item.label}-${index}`}
                  className="flex min-w-0 shrink-0 items-center gap-2"
                >
                  {index > 0 && (
                    <ChevronRight
                      className="h-3.5 w-3.5 shrink-0 text-text-muted/40"
                      aria-hidden
                    />
                  )}
                  {isLast ? (
                    <span
                      className="max-w-[10rem] truncate text-sm font-semibold text-text-primary sm:max-w-xs md:max-w-none"
                      aria-current="page"
                    >
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href ?? '/'}
                      className={cn(
                        'inline-flex items-center gap-1.5 text-sm font-medium text-text-muted',
                        'transition-colors hover:text-bridge-primary',
                        'focus:outline-none focus-visible:text-bridge-primary'
                      )}
                    >
                      {isHome ? (
                        <>
                          <Home
                            className="h-4 w-4 shrink-0 text-bridge-primary/90"
                            aria-hidden
                          />
                          <span className="sr-only">Home</span>
                          <span className="hidden truncate sm:inline">Home</span>
                        </>
                      ) : (
                        <span className="max-w-[8rem] truncate sm:max-w-none">
                          {item.label}
                        </span>
                      )}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
        {trailing ? <div className="shrink-0 self-center lg:hidden">{trailing}</div> : null}
      </div>
    </div>
  );
}
