import { Suspense } from 'react';
import Link from 'next/link';
import { buildPageMetadata } from '@/lib/metadata';
import { listingHasSeoFilters } from '@/lib/seo/listing-index';
import { JsonLd } from '@/components/layout/JsonLd';
import { PageBreadcrumbJsonLd } from '@/components/seo/PageBreadcrumbJsonLd';
import { SITE_URL } from '@/lib/site';
import { ROUTES } from '@/lib/routes';
import { IndustryGrid, listIndustries, productPath } from '@/src/features/catalog';
import { listCreativeMarketingCards } from '@/src/features/creative-marketing-showcase/api/projects';
import {
  CREATIVE_MARKETING_GALLERY_PAGE_SIZE,
  parseCreativeGroupParam,
  parseCreativeMoreParam,
} from '@/src/features/creative-marketing-showcase/config/constants';
import { CreativeMarketingCatalog } from '@/src/features/creative-marketing-showcase/public/CreativeMarketingCatalog';
import { CreativeMarketingCardSkeleton } from '@/src/features/creative-marketing-showcase/public/CreativeMarketingCard';

export const revalidate = 60;

const PAGE_TITLE = 'Creative & Digital Marketing';
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

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageBreadcrumbJsonLd path={ROUTES.marketingShowroom} />
      <div className="mx-auto w-full max-w-[1480px] px-4 pb-16 pt-3 sm:px-6 sm:pt-4 lg:px-8 xl:px-10">
        <header className="mb-6 md:mb-8">
          <h1 className="font-display text-3xl font-black tracking-tight text-[#0f2744] dark:text-white md:text-4xl">
            Creative &amp; Digital Marketing
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-text-secondary md:text-base">{PAGE_DESCRIPTION}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="#cm-catalog"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#0f2744] px-5 text-sm font-semibold text-white"
            >
              Explore Services
            </a>
            <Link
              href={ROUTES.consultation}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border-subtle px-5 text-sm font-semibold"
            >
              Free Consultation
            </Link>
          </div>
        </header>
        {industries.length > 0 ? (
          <section className="mb-8 md:mb-10" aria-labelledby="marketing-industries-heading">
            <h2
              id="marketing-industries-heading"
              className="mb-3 font-display text-lg font-bold text-[#0f2744] dark:text-white md:text-xl"
            >
              Browse by industry
            </h2>
            <IndustryGrid industries={industries} root="marketing" />
          </section>
        ) : null}
        <div id="cm-catalog">
          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <CreativeMarketingCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <CreativeMarketingCatalog
              initialFilters={{ q, group, more, page }}
              initialData={result}
            />
          </Suspense>
        </div>
      </div>
    </>
  );
}
