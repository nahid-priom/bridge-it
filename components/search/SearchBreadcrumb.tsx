'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/cn';

export type SearchBreadcrumbItem = {
  label: string;
  href?: string;
};

type SearchBreadcrumbProps = {
  items: SearchBreadcrumbItem[];
  className?: string;
};

export function SearchBreadcrumb({ items, className }: SearchBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('text-xs text-text-muted', className)}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-1 min-w-0">
            {i > 0 && (
              <span className="text-slate-300 dark:text-slate-600 shrink-0" aria-hidden>
                /
              </span>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-deshi-green transition-colors truncate max-w-[140px] sm:max-w-none"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-text-primary font-medium truncate" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function buildSearchBreadcrumbItems(
  categorySlug: string,
  categoryName: string | null,
  queryLabel: string
): SearchBreadcrumbItem[] {
  const items: SearchBreadcrumbItem[] = [
    { label: 'Home', href: ROUTES.home },
    { label: 'Services', href: ROUTES.search },
  ];

  const isBrowseAll = queryLabel === 'All Services';

  if (categorySlug !== 'all' && categoryName) {
    if (!isBrowseAll) {
      items.push({
        label: categoryName,
        href: `${ROUTES.search}?category=${encodeURIComponent(categorySlug)}`,
      });
    } else {
      items.push({ label: categoryName });
    }
  }

  if (!isBrowseAll && queryLabel) {
    items.push({ label: queryLabel });
  } else if (categorySlug === 'all' && isBrowseAll) {
    items.push({ label: 'All Services' });
  }

  return items;
}
