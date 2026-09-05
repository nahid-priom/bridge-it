import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { buildPageMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/layout/JsonLd';
import { SITE_URL } from '@/lib/site';
import { STALE_PUBLIC_LISTING, showcaseListingQueryKey } from '@/lib/query/client';
import {
  CatalogAnalytics,
  CatalogFaqList,
  ExploreCatalogLayout,
  buildIndustryBreadcrumbs,
  buildIndustryMetadata,
  getIndustryByPath,
  industryPath,
  listFaqs,
  listIndustries,
  lookupRedirect,
  productPath,
} from '@/src/features/catalog';
import { listProjectCards } from '@/src/features/ecommerce-showcase/api/projects';
import { WebsitesCatalog } from '@/src/features/ecommerce-showcase/public/WebsitesCatalog';
import { LISTING_LIMIT } from '@/src/features/ecommerce-showcase/public/websites-listing';
import { parseFilterList, serializeFilterList } from '@/src/features/ecommerce-showcase/utils/filters';
import { ProjectGridSkeleton } from '@/src/components/skeletons/ProjectGridSkeleton';

export const revalidate = 60;

type Props = {
  params: Promise<{ industry: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

export async function generateMetadata({ params }: Props) {
  const { industry: industrySlug } = await params;
  const industry = await getIndustryByPath('websites', industrySlug);
  if (!industry) {
    return buildPageMetadata({
      title: 'Website industry',
      path: industryPath('websites', industrySlug),
    });
  }
  const meta = buildIndustryMetadata('websites', industry);
  const title =
    industry.seo_title?.trim() ||
    `${industry.name} E-commerce Templates | Bridge IT Park`;
  const description = (
    industry.seo_description?.trim() ||
    industry.short_description?.trim() ||
    `Browse ${industry.name.toLowerCase()} e-commerce website templates for Bangladesh brands.`
  ).replace(/website designs?/gi, 'website templates');
  return buildPageMetadata({
    title: industry.seo_title?.trim() || title,
    description,
    path: meta.canonicalPath,
  });
}

export default async function WebsitesIndustryPage({ params, searchParams }: Props) {
  const { industry: industrySlug } = await params;
  const sp = await searchParams;
  const industry = await getIndustryByPath('websites', industrySlug);

  if (!industry) {
    const redir = await lookupRedirect(`/websites/${industrySlug}`);
    if (redir?.to_path) redirect(redir.to_path);
    notFound();
  }

  const view = serializeFilterList(parseFilterList(first(sp.view) || first(sp.page))) ?? undefined;
  const q = first(sp.q).trim() || first(sp.search).trim() || undefined;

  const [result, faqs, industries] = await Promise.all([
    listProjectCards({
      q,
      view: view === 'all' ? undefined : view,
      industrySlug: industry.slug,
      limit: LISTING_LIMIT,
      offset: 0,
    }),
    listFaqs({ industryId: industry.id }),
    listIndustries('websites'),
  ]);

  const crumbs = buildIndustryBreadcrumbs('websites', industry);
  const h1 =
    industry.seo_h1?.trim() ||
    (industry.slug === 'fashion'
      ? 'Fashion E-commerce Templates'
      : `${industry.name} E-commerce Templates`);
  const intro =
    industry.seo_intro?.trim() ||
    industry.description?.trim() ||
    industry.short_description?.trim() ||
    `Browse ${industry.name.toLowerCase()} e-commerce website templates from Bridge IT Park.`;

  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: STALE_PUBLIC_LISTING } },
  });
  queryClient.setQueryData(
    showcaseListingQueryKey({
      q: q ?? '',
      category: industry.slug,
      view: view ?? 'all',
      limit: LISTING_LIMIT,
      offset: 0,
    }),
    result
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: h1,
    description: intro,
    url: `${SITE_URL}${industryPath('websites', industry.slug)}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: result.total,
      itemListElement: result.items.slice(0, 12).map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}${item.canonical_path || productPath('websites', industry.slug, item.slug)}`,
        name: item.title,
      })),
    },
  };

  const sidebarIndustries = industries.map((i) => ({ slug: i.slug, name: i.name }));

  return (
    <>
      <JsonLd data={jsonLd} />
      <CatalogAnalytics
        payload={{
          event: 'catalog_industry_view',
          category_root: 'websites',
          industry: industry.slug,
        }}
      />
      <ExploreCatalogLayout
        activeRoot="websites"
        activeIndustrySlug={industry.slug}
        industries={sidebarIndustries}
        breadcrumbs={crumbs}
        title={h1}
        description={intro}
        resultCount={result.total}
      >
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<ProjectGridSkeleton count={6} />}>
            <WebsitesCatalog
              initialFilters={{
                q: q ?? '',
                category: 'all',
                view: view ?? 'all',
                industrySlug: industry.slug,
              }}
              initialData={result}
              hideChrome
              lockedIndustrySlug={industry.slug}
            />
          </Suspense>
        </HydrationBoundary>
        <CatalogFaqList faqs={faqs} />
      </ExploreCatalogLayout>
    </>
  );
}
