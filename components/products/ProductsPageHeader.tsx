'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { products as allProducts } from '@/data/products';
import { filterProductsListing } from '@/lib/products/listing';
import {
  getCategoryBySlug,
  parseProductsSearchParams,
  searchParamsToRecord,
} from '@/lib/products/url';
import { ProductSearchBar } from './ProductSearchBar';

interface ProductsPageHeaderProps {
  initialDescription?: string;
}

export function ProductsPageHeader({ initialDescription }: ProductsPageHeaderProps) {
  const searchParams = useSearchParams();

  const state = useMemo(
    () => parseProductsSearchParams(searchParamsToRecord(searchParams)),
    [searchParams]
  );

  const category = getCategoryBySlug(state.categoryKey);
  const results = useMemo(() => filterProductsListing(state), [state]);

  const description =
    initialDescription ??
    (category
      ? `Browse professional ${category.label} services from verified Bridge IT Park sellers.`
      : 'Discover trusted digital services, products, courses, software, and creative solutions.');

  const resultLabel = category
    ? `Showing ${results.length} ${category.label} service${results.length === 1 ? '' : 's'}`
    : `Showing ${results.length} of ${allProducts.length}+ products & services`;

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
