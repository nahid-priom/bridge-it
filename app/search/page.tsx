import { Suspense } from 'react';
import { buildPageMetadata } from '@/lib/metadata';
import { SearchPage } from '@/components/SearchPage';
import { PageLoading } from '@/components/PageLoading';
import { PageBreadcrumbJsonLd } from '@/components/seo/PageBreadcrumbJsonLd';
import { buildSearchCatalogFromDb } from '@/lib/catalog/search';
import { fetchAllCategories } from '@/lib/catalog/categories';

export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: 'Search Bridge Marketplace',
  description:
    'Search verified services, digital products, sellers, and virtual offices on Bridge Smart IT Park.',
  path: '/search',
  keywords: ['search', 'marketplace', 'digital services Bangladesh'],
});

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SearchRoute({ searchParams }: Props) {
  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q : Array.isArray(params.q) ? params.q[0] ?? '' : '';

  const [searchCatalog, categories] = await Promise.all([
    buildSearchCatalogFromDb(q, 120),
    fetchAllCategories(),
  ]);

  return (
    <>
      <PageBreadcrumbJsonLd path="/search" />
      <Suspense fallback={<PageLoading />}>
        <SearchPage searchCatalog={searchCatalog} categories={categories} initialQuery={q} />
      </Suspense>
    </>
  );
}
