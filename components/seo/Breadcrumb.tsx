import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { BreadcrumbItem } from '@/lib/seo/breadcrumbs';

export type { BreadcrumbItem };

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        'pt-[calc(var(--header-offset)+var(--breadcrumb-gap))] pb-1 md:pb-1.5',
        className
      )}
    >
      <div className="container  mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="border-b border-border-subtle/50 pb-2 md:pb-2.5"
        >
          <ol
            className={cn(
              'flex items-center gap-2 min-h-[1.75rem] min-w-0',
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
                  className="flex items-center gap-2 shrink-0 min-w-0"
                >
                  {index > 0 && (
                    <ChevronRight
                      className="w-3.5 h-3.5 text-text-muted/40 shrink-0"
                      aria-hidden
                    />
                  )}
                  {isLast ? (
                    <span
                      className="text-sm font-semibold text-text-primary truncate max-w-[10rem] sm:max-w-xs md:max-w-none"
                      aria-current="page"
                    >
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href ?? '/'}
                      className={cn(
                        'inline-flex items-center gap-1.5 text-sm font-medium text-text-muted',
                        'hover:text-bridge-primary transition-colors',
                        'focus:outline-none focus-visible:text-bridge-primary'
                      )}
                    >
                      {isHome ? (
                        <>
                          <Home
                            className="w-4 h-4 text-bridge-primary/90 shrink-0"
                            aria-hidden
                          />
                          <span className="sr-only">Home</span>
                          <span className="hidden sm:inline truncate">Home</span>
                        </>
                      ) : (
                        <span className="truncate max-w-[8rem] sm:max-w-none">
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
      </div>
    </div>
  );
}
