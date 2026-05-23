import { Suspense } from 'react';
import { buildPageMetadata } from '@/lib/metadata';
import { SearchPage } from '@/components/SearchPage';
import { PageLoading } from '@/components/PageLoading';
import { PageBreadcrumbJsonLd } from '@/components/seo/PageBreadcrumbJsonLd';

export const metadata = buildPageMetadata({
  title: 'Search Bridge Marketplace',
  description:
    'Search verified services, digital products, sellers, and virtual offices on Bridge Smart IT Park.',
  path: '/search',
  keywords: ['search', 'marketplace', 'digital services Bangladesh'],
});

export default function SearchRoute() {
  return (
    <>
      <PageBreadcrumbJsonLd path="/search" />
      <Suspense fallback={<PageLoading />}>
        <SearchPage />
      </Suspense>
    </>
  );
}
