import { Suspense, type ReactNode } from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { buildPageMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/layout/JsonLd';
import { PageBreadcrumbJsonLd } from '@/components/seo/PageBreadcrumbJsonLd';
import { SITE_URL } from '@/lib/site';
import { ROUTES } from '@/lib/routes';
import { STALE_PUBLIC_LISTING, showcaseListingQueryKey } from '@/lib/query/client';
import { listProjectCards } from '@/src/features/ecommerce-showcase/api/projects';
import { WebsitesCatalog } from '@/src/features/ecommerce-showcase/public/WebsitesCatalog';
import { LISTING_LIMIT } from '@/src/features/ecommerce-showcase/public/websites-listing';
import { parseFilterList, serializeFilterList } from '@/src/features/ecommerce-showcase/utils/filters';
import {
  listShowcaseTaxonomy,
  listSoftwareProjectCards,
} from '@/src/features/software-showcase/api/projects';
import {
  SOFTWARE_GALLERY_PAGE_SIZE,
  SOFTWARE_PRIMARY_FILTERS,
  parseSoftwareGroupParam,
  parseSoftwareMoreParam,
  primaryFilterToTaxonomySlug,
} from '@/src/features/software-showcase/config/constants';
import { SoftwareCatalog } from '@/src/features/software-showcase/public/SoftwareCatalog';
import { SoftwareCardSkeleton } from '@/src/features/software-showcase/public/SoftwareCard';
import { FilterSkeleton } from '@/src/components/skeletons/FilterSkeleton';
import { ProjectGridSkeleton } from '@/src/components/skeletons/ProjectGridSkeleton';
import { ExploreFilterChrome } from '@/components/explore/ExploreFilterChrome';
import { ExploreMarketingPanel } from '@/components/explore/ExploreMarketingPanel';
import { parseExploreType } from '@/components/explore/explore-types';
import { listCreativeMarketingCards } from '@/src/features/creative-marketing-showcase/api/projects';
import {
  CREATIVE_MARKETING_GALLERY_PAGE_SIZE,
  parseCreativeGroupParam,
  parseCreativeMoreParam,
} from '@/src/features/creative-marketing-showcase/config/constants';
import { CreativeMarketingCatalog } from '@/src/features/creative-marketing-showcase/public/CreativeMarketingCatalog';
import { CreativeMarketingCardSkeleton } from '@/src/features/creative-marketing-showcase/public/CreativeMarketingCard';

export const revalidate = 60;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

function CatalogFallback() {
  return (
    <>
      <FilterSkeleton />
      <div className="mt-6">
        <ProjectGridSkeleton count={6} />
      </div>
    </>
  );
}

function SoftwareFallback() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <SoftwareCardSkeleton key={i} />
      ))}
    </div>
  );
}

function MarketingFallback() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <CreativeMarketingCardSkeleton key={i} />
      ))}
    </div>
  );
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }) {
  const type = parseExploreType(first((await searchParams).type));
  const titles = {
    websites: 'Explore Custom Websites',
    software: 'Explore Software Solutions',
    marketing: 'Explore Creative & Digital Marketing',
  } as const;
  return buildPageMetadata({
    title: titles[type],
    description:
      'Explore Bridge IT Park solutions — custom e-commerce websites, business software, and digital marketing.',
    path: ROUTES.explore,
    keywords: [
      'explore bridge it park',
      'ecommerce websites Bangladesh',
      'business software solutions',
      'digital marketing services',
    ],
  });
}

export default async function ExplorePage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const type = parseExploreType(first(sp.type));
  const q = first(sp.q).trim() || first(sp.search).trim();

  const view = serializeFilterList(parseFilterList(first(sp.view) || first(sp.page))) ?? 'all';
  const category = serializeFilterList(parseFilterList(first(sp.category))) ?? 'all';

  let websitesBlock: ReactNode = null;
  let softwareBlock: ReactNode = null;
  let marketingBlock: ReactNode = null;

  if (type === 'websites') {
    const listingFilters = {
      q: q || undefined,
      category: category === 'all' ? undefined : category,
      view: view === 'all' ? undefined : view,
      limit: LISTING_LIMIT,
      offset: 0,
    };
    const result = await listProjectCards(listingFilters);
    const queryClient = new QueryClient({
      defaultOptions: { queries: { staleTime: STALE_PUBLIC_LISTING } },
    });
    queryClient.setQueryData(
      showcaseListingQueryKey({
        q: q || undefined,
        category: category === 'all' ? 'all' : category,
        view: view === 'all' ? 'all' : view,
        limit: LISTING_LIMIT,
        offset: 0,
      }),
      result
    );
    websitesBlock = (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<CatalogFallback />}>
          <WebsitesCatalog
            initialFilters={{
              q: q || '',
              category: category === 'all' ? 'all' : category,
              view: view === 'all' ? 'all' : view,
            }}
            initialData={result}
            hideChrome
          />
        </Suspense>
      </HydrationBoundary>
    );
  }

  if (type === 'software') {
    const page = Math.max(1, Number(first(sp.page)) || 1);
    const group = parseSoftwareGroupParam(first(sp.group), first(sp.solutionGroup));
    const categoryRaw = first(sp.category).trim();
    const child = first(sp.child).trim() || 'all';
    const more = parseSoftwareMoreParam(first(sp.more));

    const primaryIds = new Set(SOFTWARE_PRIMARY_FILTERS.map((f) => f.id));
    let category = 'all';
    let taxonomyCategory: string | undefined;
    if (categoryRaw && categoryRaw !== 'all') {
      if (primaryIds.has(categoryRaw as (typeof SOFTWARE_PRIMARY_FILTERS)[number]['id'])) {
        category = categoryRaw;
        taxonomyCategory = primaryFilterToTaxonomySlug(categoryRaw);
      } else {
        const byTax = SOFTWARE_PRIMARY_FILTERS.find((f) => f.taxonomySlug === categoryRaw);
        category = byTax?.id ?? categoryRaw;
        taxonomyCategory = categoryRaw;
      }
    } else if (group !== 'all') {
      category = group;
      taxonomyCategory = primaryFilterToTaxonomySlug(group);
    }

    const [result, taxonomy] = await Promise.all([
      listSoftwareProjectCards({
        q: q || undefined,
        taxonomyCategory,
        child: child === 'all' ? undefined : child,
        group: group === 'all' ? undefined : group,
        more: more.length ? more : undefined,
        page,
        pageSize: SOFTWARE_GALLERY_PAGE_SIZE,
      }),
      listShowcaseTaxonomy(),
    ]);

    const softwareMain = taxonomy.mains.find((m) => m.slug === 'software');
    const softwareCats = taxonomy.categories.filter((c) => c.main_category_id === softwareMain?.id);
    const catById = new Map(softwareCats.map((c) => [c.id, c]));
    const childOptions = taxonomy.children
      .filter((ch) => catById.has(ch.category_id))
      .map((ch) => ({
        id: ch.id,
        label: ch.name,
        slug: ch.slug,
        categorySlug: catById.get(ch.category_id)?.slug,
      }));

    softwareBlock = (
      <Suspense fallback={<SoftwareFallback />}>
        <SoftwareCatalog
          initialFilters={{
            q: q || '',
            category,
            group,
            child,
            more,
            page,
          }}
          initialData={result}
          childOptions={childOptions}
        />
      </Suspense>
    );
  }

  if (type === 'marketing') {
    const page = Math.max(1, Number(first(sp.page)) || 1);
    const group = parseCreativeGroupParam(first(sp.group), first(sp.serviceGroup));
    const more = parseCreativeMoreParam(first(sp.more));
    const result = await listCreativeMarketingCards({
      q: q || undefined,
      group: group === 'all' ? undefined : group,
      more: more.length ? more : undefined,
      page,
      pageSize: CREATIVE_MARKETING_GALLERY_PAGE_SIZE,
    });

    marketingBlock =
      result.total > 0 || result.items.length > 0 ? (
        <Suspense fallback={<MarketingFallback />}>
          <CreativeMarketingCatalog
            initialFilters={{
              q: q || '',
              group,
              more,
              page,
            }}
            initialData={result}
          />
        </Suspense>
      ) : (
        <ExploreMarketingPanel />
      );
  }

  const heading =
    type === 'software'
      ? 'Software Solutions'
      : type === 'marketing'
        ? 'Creative & Digital Marketing'
        : 'Custom Websites';

  const description =
    type === 'software'
      ? 'Ready and custom ERP / admin systems for real business operations.'
      : type === 'marketing'
        ? 'Creatives and growth support matched to your business goals.'
        : '100+ custom premium e-commerce website designs for your brand.';

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Explore Bridge IT Park',
          description:
            'Explore custom e-commerce websites, business software, and digital marketing solutions.',
          url: `${SITE_URL}${ROUTES.explore}`,
        }}
      />
      <PageBreadcrumbJsonLd path={ROUTES.explore} />
      <div className="mx-auto w-full max-w-[1480px] px-4 pb-16 pt-0 sm:px-6 lg:px-8 xl:px-10">
        <header className="mb-5 max-w-3xl sm:mb-6">
          <h1 className="font-display text-2xl font-black text-text-primary sm:text-3xl">{heading}</h1>
          <p className="mt-2 text-sm text-text-secondary sm:text-base">{description}</p>
        </header>

        <Suspense fallback={<div className="mb-6 h-24 animate-pulse rounded-2xl bg-background-soft" />}>
          <ExploreFilterChrome active={type} />
        </Suspense>

        <div className="mt-5 sm:mt-6">
          {type === 'websites' ? websitesBlock : null}
          {type === 'software' ? softwareBlock : null}
          {type === 'marketing' ? marketingBlock : null}
        </div>
      </div>
    </>
  );
}
