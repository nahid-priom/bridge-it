'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/cn';
import { PRICE_FILTERS, TECHNOLOGY_OPTIONS } from '../config/constants';
import type { EcommerceCategory } from '../types';
import { parseShowcaseFilters, showcaseQueryString } from '../utils/filters';

export function TechnologyFilter() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = parseShowcaseFilters(searchParams);

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={`${pathname}${showcaseQueryString({ ...current, tech: undefined })}`}
        scroll={false}
        className={cn(
          'rounded-full px-3 py-1.5 text-xs font-semibold border',
          !current.tech ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-200 dark:border-white/10'
        )}
      >
        All tech
      </Link>
      {TECHNOLOGY_OPTIONS.map((tech) => (
        <Link
          key={tech.slug}
          href={`${pathname}${showcaseQueryString({ ...current, tech: tech.slug })}`}
          scroll={false}
          className={cn(
            'rounded-full px-3 py-1.5 text-xs font-semibold border',
            current.tech === tech.slug
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'border-slate-200 dark:border-white/10'
          )}
        >
          {tech.id}
        </Link>
      ))}
    </div>
  );
}

export function PriceFilter() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = parseShowcaseFilters(searchParams);

  return (
    <div className="flex flex-wrap gap-2">
      {PRICE_FILTERS.map((item) => (
        <Link
          key={item.id}
          href={`${pathname}${showcaseQueryString({ ...current, price: item.id === 'all' ? undefined : item.id })}`}
          scroll={false}
          className={cn(
            'rounded-full px-3 py-1.5 text-xs font-semibold border',
            (current.price ?? 'all') === item.id
              ? 'bg-[#0f2744] text-white border-[#0f2744]'
              : 'border-slate-200 dark:border-white/10'
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

export function CategoryFilter({ categories }: { categories: EcommerceCategory[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = parseShowcaseFilters(searchParams);

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={`${pathname}${showcaseQueryString({ ...current, category: undefined })}`}
        scroll={false}
        className={cn(
          'rounded-full px-3 py-1.5 text-xs font-semibold border',
          !current.category ? 'bg-[#0f2744] text-white border-[#0f2744]' : 'border-slate-200 dark:border-white/10'
        )}
      >
        All categories
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`${pathname}${showcaseQueryString({ ...current, category: category.slug })}`}
          scroll={false}
          className={cn(
            'rounded-full px-3 py-1.5 text-xs font-semibold border',
            current.category === category.slug
              ? 'bg-[#0f2744] text-white border-[#0f2744]'
              : 'border-slate-200 dark:border-white/10'
          )}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
