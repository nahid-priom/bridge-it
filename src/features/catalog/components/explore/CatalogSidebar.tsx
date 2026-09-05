'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { RotateCcw } from 'lucide-react';
import { cn, focusVisibleRing } from '@/lib/cn';
import type { CatalogCategoryRoot } from '../../types';
import { BusinessSizeFilter } from './BusinessSizeFilter';
import { CatalogSidebarSection } from './CatalogSidebarSection';
import { IndustryFilter } from './IndustryFilter';
import { MotherCategoryNav } from './MotherCategoryNav';
import { PriceFilter } from './PriceFilter';
import { TypeFilter } from './TypeFilter';
import type { CatalogSidebarIndustry } from './types';

const CLEARABLE_PARAMS = [
  'view',
  'price',
  'size',
  'sort',
  'q',
  'page',
  'category',
  'more',
  'group',
  'child',
  'solutionGroup',
] as const;

export function CatalogSidebar({
  activeRoot,
  activeIndustrySlug,
  industries,
  onNavigate,
  className,
}: {
  activeRoot: CatalogCategoryRoot;
  activeIndustrySlug?: string | null;
  industries: CatalogSidebarIndustry[];
  onNavigate?: () => void;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const hasClearable = CLEARABLE_PARAMS.some((key) => searchParams.has(key));

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    for (const key of CLEARABLE_PARAMS) params.delete(key);
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
    onNavigate?.();
  };

  return (
    <aside className={cn('space-y-5', className)} aria-label="Catalog filters">
      <CatalogSidebarSection title="Browse Categories" defaultOpen>
        <MotherCategoryNav activeRoot={activeRoot} onNavigate={onNavigate} />
      </CatalogSidebarSection>

      <CatalogSidebarSection
        title={activeRoot === 'marketing' ? 'Service Types' : 'Industries'}
        defaultOpen
      >
        <IndustryFilter
          root={activeRoot}
          industries={industries}
          activeIndustrySlug={activeIndustrySlug}
          onNavigate={onNavigate}
        />
      </CatalogSidebarSection>

      {activeRoot === 'websites' ? (
        <CatalogSidebarSection title="Template Type" defaultOpen>
          <TypeFilter onApplied={onNavigate} />
        </CatalogSidebarSection>
      ) : null}

      {activeRoot === 'software' ? (
        <>
          <CatalogSidebarSection title="Price" defaultOpen>
            <PriceFilter onApplied={onNavigate} />
          </CatalogSidebarSection>
          <CatalogSidebarSection title="Business Size" defaultOpen>
            <BusinessSizeFilter onApplied={onNavigate} />
          </CatalogSidebarSection>
        </>
      ) : null}

      {hasClearable ? (
        <button
          type="button"
          onClick={clearFilters}
          className={cn(
            focusVisibleRing,
            'inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border-subtle px-3 py-2.5 text-sm font-semibold text-text-secondary hover:bg-surface hover:text-text-primary'
          )}
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          Clear Filters
        </button>
      ) : null}
    </aside>
  );
}
