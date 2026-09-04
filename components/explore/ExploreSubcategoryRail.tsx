'use client';

import { useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/cn';
import type { ExploreTypeId } from '@/components/explore/explore-types';
import { LISTING_CATEGORIES } from '@/src/features/ecommerce-showcase/config/constants';
import { parseFilterList } from '@/src/features/ecommerce-showcase/utils/filters';
import {
  SOFTWARE_PRIMARY_FILTERS,
  primaryFilterToTaxonomySlug,
  parseSoftwareGroupParam,
} from '@/src/features/software-showcase/config/constants';
import {
  CREATIVE_PRIMARY_FILTERS,
  parseCreativeGroupParam,
} from '@/src/features/creative-marketing-showcase/config/constants';

type RailOption = { id: string; label: string; value: string };

function websitesOptions(): RailOption[] {
  return LISTING_CATEGORIES.map((item) => ({
    id: item.id,
    label: item.id === 'all' ? 'All' : item.label,
    value: item.slug ?? 'all',
  }));
}

function softwareOptions(): RailOption[] {
  return SOFTWARE_PRIMARY_FILTERS.map((item) => ({
    id: item.id,
    label: item.label,
    value: item.id,
  }));
}

function marketingOptions(): RailOption[] {
  return CREATIVE_PRIMARY_FILTERS.map((item) => ({
    id: item.id,
    label: item.label,
    value: item.id,
  }));
}

function resolveActive(type: ExploreTypeId, searchParams: URLSearchParams): string {
  if (type === 'websites') {
    const categories = parseFilterList(searchParams.get('category'));
    return categories[0] ?? 'all';
  }
  if (type === 'software') {
    const raw = (searchParams.get('category') ?? '').trim();
    if (raw && raw !== 'all') {
      const byId = SOFTWARE_PRIMARY_FILTERS.find((f) => f.id === raw);
      if (byId) return byId.id;
      const byTax = SOFTWARE_PRIMARY_FILTERS.find((f) => f.taxonomySlug === raw);
      if (byTax) return byTax.id;
    }
    return parseSoftwareGroupParam(searchParams.get('group'), searchParams.get('solutionGroup'));
  }
  return parseCreativeGroupParam(searchParams.get('group'), searchParams.get('serviceGroup'));
}

const RAIL_LABEL: Record<ExploreTypeId, string> = {
  websites: 'Industry',
  software: 'Category',
  marketing: 'Service type',
};

export function ExploreSubcategoryRail({ activeType }: { activeType: ExploreTypeId }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const options =
    activeType === 'websites'
      ? websitesOptions()
      : activeType === 'software'
        ? softwareOptions()
        : marketingOptions();

  const active = resolveActive(activeType, searchParams);

  const select = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('type', activeType);
    params.delete('page');
    params.delete('child');
    params.delete('more');
    params.delete('view');
    params.delete('industry');
    params.delete('solutionGroup');
    params.delete('serviceGroup');

    if (activeType === 'websites') {
      params.delete('group');
      if (value && value !== 'all') params.set('category', value);
      else params.delete('category');
    } else if (activeType === 'software') {
      params.delete('group');
      const slug = primaryFilterToTaxonomySlug(value) ?? (value !== 'all' ? value : undefined);
      if (slug) params.set('category', slug);
      else params.delete('category');
    } else {
      params.delete('category');
      if (value && value !== 'all') params.set('group', value);
      else params.delete('group');
    }

    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  };

  return (
    <div className="min-w-0">
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted">
        {RAIL_LABEL[activeType]}
      </p>
      <div
        className="flex w-full min-w-0 flex-nowrap gap-1.5 overflow-x-auto overscroll-x-contain pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="group"
        aria-label={`${RAIL_LABEL[activeType]} filters`}
      >
        {options.map((option) => {
          const isActive = active === option.value || active === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => select(option.value)}
              className={cn(
                'explore-filter-chip shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60a5fa]',
                isActive
                  ? 'explore-filter-chip--active'
                  : 'border-border-subtle bg-surface text-text-secondary hover:border-[#2563eb]/40 hover:text-text-primary'
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
