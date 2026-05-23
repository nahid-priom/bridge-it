'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
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

  const description =
    initialDescription ??
    (category
      ? `Browse professional ${category.label} services from verified Bridge IT Park sellers.`
      : 'Discover trusted digital services, products, courses, software, and creative solutions.');

  const catalogTotal = totalCatalogHint ?? categoryCountsFallback(resultCount);
  const resultLabel = category
    ? `Showing ${resultCount} ${category.label} service${resultCount === 1 ? '' : 's'}`
    : `Showing ${resultCount} of ${catalogTotal}+ products & services`;

  return (
    <header className=" border-b border-border-subtle pb-5 md:mb-4 md:pb-6">
      <section className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-10">
        <div className="min-w-0 lg:w-full">
          <h1 className="font-display text-xl font-bold text-text-primary md:text-2xl">
            {category ? (
              <>
                {category.label} <span className="gradient-text">Services</span>
              </>
            ) : (
              <>
                Explore <span className="gradient-text">Products & Services</span>
              </>
            )}
          </h1>
          <p className="mt-1 max-w-xl text-sm text-text-muted">{description}</p>
          <p className="mt-1.5 text-xs font-medium text-bridge-primary-light">{resultLabel}</p>
        </div>

        <div className="min-w-0 lg:w-full">
          <ProductSearchBar categoryLabel={category?.label ?? null} />
        </div>
      </section>
    </header>
  );
}

function categoryCountsFallback(count: number) {
  return Math.max(count, 80);
}
