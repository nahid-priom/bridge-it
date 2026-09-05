import { Suspense } from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { buildPageMetadata } from '@/lib/metadata';
import { listingHasSeoFilters } from '@/lib/seo/listing-index';
import { JsonLd } from '@/components/layout/JsonLd';
import { PageBreadcrumbJsonLd } from '@/components/seo/PageBreadcrumbJsonLd';
import { SITE_URL } from '@/lib/site';
import { ROUTES } from '@/lib/routes';
import { STALE_PUBLIC_LISTING } from '@/lib/query/client';
import {
  ExploreCatalogLayout,
  buildCategoryBreadcrumbs,
  listIndustries,
  productPath,
} from '@/src/features/catalog';
import { listCreativeMarketingCards } from '@/src/features/creative-marketing-showcase/api/projects';
import {
  CREATIVE_MARKETING_GALLERY_PAGE_SIZE,
  parseCreativeGroupParam,
  parseCreativeMoreParam,
} from '@/src/features/creative-marketing-showcase/config/constants';
import { CreativeMarketingCatalog } from '@/src/features/creative-marketing-showcase/public/CreativeMarketingCatalog';
import { creativeMarketingListingQueryKey } from '@/src/features/creative-marketing-showcase/utils/query-keys';
import { CatalogGridSkeleton } from '@/src/components/skeletons/CatalogCardSkeleton';

export const revalidate = 60;

const PAGE_TITLE = 'Digital Marketing';
const PAGE_DESCRIPTION =
  'Graphic design, branding, Facebook ads, e-commerce marketing, and lead generation services for growing brands.';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const group = parseCreativeGroupParam(first(sp.group), first(sp.serviceGroup));
  const more = parseCreativeMoreParam(first(sp.more));
  const noIndex = listingHasSeoFilters({
    q: first(sp.q),
    page: first(sp.page),
    filters: [group === 'all' ? undefined : group, more.join(',')],
  });
  return buildPageMetadata({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    path: ROUTES.marketingShowroom,
    keywords: [
      'graphic design services bangladesh',
      'social media post design bangladesh',
      'facebook ads management bangladesh',
      'digital marketing agency bangladesh',
      'meta ads management',
      'ecommerce marketing services',
      'brand identity design',
    ],
    noIndex,
  });
}

export default async function MarketingShowroomPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const q = first(sp.q).trim();
  const group = parseCreativeGroupParam(first(sp.group), first(sp.serviceGroup));
  const more = parseCreativeMoreParam(first(sp.more));
  const page = Math.max(1, Number(first(sp.page)) || 1);

  const [result, industries] = await Promise.all([
    listCreativeMarketingCards({
      q: q || undefined,
      group: group === 'all' ? undefined : group,
      more: more.length ? more : undefined,
      page,
      pageSize: CREATIVE_MARKETING_GALLERY_PAGE_SIZE,
    }),
    listIndustries('marketing'),
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: `${SITE_URL}${ROUTES.marketingShowroom}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: result.total,
      itemListElement: result.items.slice(0, 12).map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}${
          item.canonical_path ||
          (item.industry_slug
            ? productPath('marketing', item.industry_slug, item.slug)
            : ROUTES.marketingIndustry(item.slug))
        }`,
        name: item.title,
      })),
    },
  };

  const sidebarIndustries = industries.map((i) => ({ slug: i.slug, name: i.name }));

  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: STALE_PUBLIC_LISTING } },
  });
  queryClient.setQueryData(
    creativeMarketingListingQueryKey({
      q,
      group: group || 'all',
      more,
      page,
      pageSize: CREATIVE_MARKETING_GALLERY_PAGE_SIZE,
      industrySlug: '',
    }),
    result
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageBreadcrumbJsonLd path={ROUTES.marketingShowroom} />
      <ExploreCatalogLayout
        activeRoot="marketing"
        industries={sidebarIndustries}
        breadcrumbs={buildCategoryBreadcrumbs('marketing')}
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        resultCount={result.total}
      >
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<CatalogGridSkeleton count={6} />}>
            <CreativeMarketingCatalog
              initialFilters={{ q, group, more, page }}
              initialData={result}
              hideChrome
            />
          </Suspense>
        </HydrationBoundary>
      </ExploreCatalogLayout>
    </>
  );
}
