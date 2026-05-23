'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHero } from '@/components/ui/PageHero';
import { PAGE_HEROES } from '@/lib/config/page-heroes';
import { BRANDING } from '@/lib/config/branding';
import {
  findCategoryInList,
  parseProductsSearchParams,
  searchParamsToRecord,
} from '@/lib/products/url';
import type { ProductCategory } from '@/types/product';
import { ProductSearchBar } from './ProductSearchBar';

interface ProductsPageHeaderProps {
  categories: ProductCategory[];
  resultCount: number;
  totalCatalogHint?: number;
  initialDescription?: string;
}

export function ProductsPageHeader({
  categories,
  resultCount,
  totalCatalogHint,
  initialDescription,
}: ProductsPageHeaderProps) {
  const searchParams = useSearchParams();

  const state = useMemo(
    () => parseProductsSearchParams(searchParamsToRecord(searchParams)),
    [searchParams]
  );

  const category = findCategoryInList(categories, state.categoryKey);
  const hero = PAGE_HEROES.products;

  const description =
    initialDescription ??
    (category
      ? `Browse professional ${category.label} services from verified ${BRANDING.appName} sellers.`
      : hero.subtitle);

  const catalogTotal = totalCatalogHint ?? categoryCountsFallback(resultCount);
  const resultLabel = category
    ? `Showing ${resultCount} ${category.label} service${resultCount === 1 ? '' : 's'}`
    : `Showing ${resultCount} of ${catalogTotal}+ products & services`;

  if (category) {
    return (
      <header className="border-b border-border-subtle pb-5 md:mb-4 md:pb-6">
        <section className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-10">
          <div className="min-w-0 lg:w-full">
            <PageHero
              variant="compact"
              alignment="left"
              showDecorations={false}
              showUnderline={false}
              className="!p-0 !pt-0 !pb-0"
              title={category.label}
              highlightedText="Services"
              subtitle={description}
            />
            <p className="mt-1.5 text-xs font-medium text-deshi-green">{resultLabel}</p>
          </div>
          <div className="min-w-0 lg:w-full">
            <ProductSearchBar categoryLabel={category.label} />
          </div>
        </section>
      </header>
    );
  }

  return (
    <header className="border-b border-border-subtle pb-5 md:mb-4 md:pb-6">
      <PageHero
        variant="compact"
        alignment="left"
        showDecorations
        showUnderline={false}
        className="!p-0 !pt-0 !pb-4"
        title={hero.title}
        highlightedText={hero.highlightedText}
        subtitle={description}
      />
      <p className="text-xs font-medium text-deshi-green -mt-2 mb-4">{resultLabel}</p>
      <ProductSearchBar categoryLabel={null} />
    </header>
  );
}

function categoryCountsFallback(count: number) {
  return Math.max(count, 80);
}
