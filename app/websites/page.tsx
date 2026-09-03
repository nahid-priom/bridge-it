import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { buildPageMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/layout/JsonLd';
import { SITE_URL } from '@/lib/site';
import { STALE_PUBLIC_LISTING, showcaseListingQueryKey } from '@/lib/query/client';
import { listProjectCards } from '@/src/features/ecommerce-showcase/api/projects';
import { WebsitesCatalog } from '@/src/features/ecommerce-showcase/public/WebsitesCatalog';
import { LISTING_LIMIT } from '@/src/features/ecommerce-showcase/public/websites-listing';

export const revalidate = 60;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

function parseListingFilters(sp: Record<string, string | string[] | undefined>) {
  const view = first(sp.view).trim() || first(sp.page).trim() || 'all';
  const category = first(sp.category).trim() || 'all';
  const q = first(sp.q).trim();
  return {
    view: view === 'all' ? undefined : view,
    category: category === 'all' ? undefined : category,
    q: q || undefined,
  };
}

export async function generateMetadata() {
  return buildPageMetadata({
    title: 'E-commerce Website Designs',
    description:
      'Browse premium custom e-commerce website designs. Choose a ready storefront or customize one for your brand.',
    path: '/websites',
    keywords: [
      'custom ecommerce website Bangladesh',
      'ecommerce website designs',
      'Next.js ecommerce website',
    ],
  });
}

export default async function WebsitesPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const filters = parseListingFilters(sp);
  const listingFilters = {
    q: filters.q,
    category: filters.category,
    view: filters.view,
    limit: LISTING_LIMIT,
    offset: 0,
  };
  const result = await listProjectCards(listingFilters);

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
    result
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'E-commerce Website Designs',
    description:
      'Browse premium custom e-commerce website designs. Choose a ready storefront or customize one for your brand.',
    url: `${SITE_URL}/websites`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: result.total,
      itemListElement: result.items.slice(0, 12).map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}/websites/${item.slug}`,
        name: item.title,
      })),
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-8">
        <header className="max-w-3xl">
          <h1 className="font-display text-3xl font-black tracking-tight text-[#0f2744] dark:text-white md:text-4xl">
            E-commerce Website Designs
          </h1>
          <p className="mt-2 text-base text-text-secondary md:text-lg">
            আপনার Business-এর জন্য Premium E-commerce Design বেছে নিন।
          </p>
          <p className="mt-1 text-sm text-text-muted">
            Ready design থেকে পছন্দ করুন অথবা আপনার Brand অনুযায়ী Customize করুন।
          </p>
          <p className="mt-3 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            Starting from ৳5,000
          </p>
        </header>

        <HydrationBoundary state={dehydrate(queryClient)}>
          <WebsitesCatalog
            initialFilters={{
              q: filters.q ?? '',
              category: filters.category ?? 'all',
              view: filters.view ?? 'all',
            }}
            initialData={result}
          />
        </HydrationBoundary>
      </div>
    </>
  );
}
