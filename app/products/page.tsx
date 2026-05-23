import { Suspense } from 'react';
import { ProductsListing } from '@/components/products/ProductsListing';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { BreadcrumbOverrideProvider } from '@/components/seo/BreadcrumbOverride';
import { PageLoading } from '@/components/PageLoading';
import { buildProductsPageMetadata } from '@/lib/products/page-meta';
import { buildProductsBreadcrumbItems } from '@/lib/products/breadcrumbs';
import { parseProductsSearchParams } from '@/lib/products/url';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: Props) {
  const params = await searchParams;
  const state = parseProductsSearchParams(params);
  return buildProductsPageMetadata(state);
}

export default async function ProductsRoute({ searchParams }: Props) {
  const params = await searchParams;
  const state = parseProductsSearchParams(params);
  const breadcrumbItems = buildProductsBreadcrumbItems(state.categoryKey);

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <BreadcrumbOverrideProvider items={breadcrumbItems}>
        <Suspense fallback={<PageLoading />}>
          <ProductsListing initialState={state} />
        </Suspense>
      </BreadcrumbOverrideProvider>
    </>
  );
}
