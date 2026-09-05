import { Suspense } from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { buildPageMetadata } from '@/lib/metadata';
import { listingHasSeoFilters } from '@/lib/seo/listing-index';
import { JsonLd } from '@/components/layout/JsonLd';
import { PageBreadcrumbJsonLd } from '@/components/seo/PageBreadcrumbJsonLd';
import { SITE_URL } from '@/lib/site';
import { STALE_PUBLIC_LISTING, showcaseListingQueryKey } from '@/lib/query/client';
import {
  ExploreCatalogLayout,
  buildCategoryBreadcrumbs,
  listIndustries,
  productPath,
} from '@/src/features/catalog';
import { listProjectCards } from '@/src/features/ecommerce-showcase/api/projects';
import { WebsitesCatalog } from '@/src/features/ecommerce-showcase/public/WebsitesCatalog';
import { LISTING_LIMIT, websitesListingCopy } from '@/src/features/ecommerce-showcase/public/websites-listing';
import { parseFilterList, serializeFilterList } from '@/src/features/ecommerce-showcase/utils/filters';

export const revalidate = 60;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

function parseListingFilters(sp: Record<string, string | string[] | undefined>) {
  const view = serializeFilterList(parseFilterList(first(sp.view) || first(sp.page))) ?? 'all';
  const category = serializeFilterList(parseFilterList(first(sp.category))) ?? 'all';
  const q = first(sp.q).trim() || first(sp.search).trim();
  return {
    view: view === 'all' ? undefined : view,
    category: category === 'all' ? undefined : category,
    q: q || undefined,
  };
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }) {
  const filters = parseListingFilters(await searchParams);
  const { title, description } = websitesListingCopy(filters);
  const keywords = [
    'custom ecommerce website Bangladesh',
    'ecommerce website templates',
    'Next.js ecommerce website',
  ];
  if (filters.category) keywords.unshift(`${filters.category} ecommerce website`);
  const noIndex = listingHasSeoFilters({
    q: filters.q,
    filters: [filters.view, filters.category],
  });
  return buildPageMetadata({
    title,
    description,
    path: '/websites',
    keywords,
    noIndex,
  });
}

export default async function WebsitesPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const filters = parseListingFilters(sp);
  const { title, description } = websitesListingCopy(filters);
  const listingFilters = {
    q: filters.q,
    category: filters.category,
    view: filters.view,
    limit: LISTING_LIMIT,
    offset: 0,
  };
  const [result, industries] = await Promise.all([
    listProjectCards(listingFilters),
    listIndustries('websites'),
  ]);

  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: STALE_PUBLIC_LISTING } },
  });
  queryClient.setQueryData(
    showcaseListingQueryKey({
      q: filters.q,
      category: filters.category ?? 'all',
      view: filters.view ?? 'all',
      limit: LISTING_LIMIT,
      offset: 0,
    }),
    { pages: [result], pageParams: [0] }
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: `${SITE_URL}/websites`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: result.total,
      itemListElement: result.items.slice(0, 12).map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}${
          item.canonical_path ||
          (item.industry_slug
            ? productPath('websites', item.industry_slug, item.slug)
            : `/websites/${item.slug}`)
        }`,
        name: item.title,
      })),
    },
  };

  const sidebarIndustries = industries.map((i) => ({ slug: i.slug, name: i.name }));

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageBreadcrumbJsonLd path="/websites" />
      <ExploreCatalogLayout
        activeRoot="websites"
        industries={sidebarIndustries}
        breadcrumbs={buildCategoryBreadcrumbs('websites')}
        title={title}
        description={description}
        resultCount={result.total}
      >
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={null}>
            <WebsitesCatalog
              initialFilters={{
                q: filters.q ?? '',
                category: filters.category ?? 'all',
                view: filters.view ?? 'all',
              }}
              initialData={result}
              hideChrome
            />
          </Suspense>
        </HydrationBoundary>
      </ExploreCatalogLayout>
    </>
  );
}
