import { Suspense } from 'react';
import { buildPageMetadata } from '@/lib/metadata';
import { MarketplaceSearchPage } from '@/components/search/MarketplaceSearchPage';
import { PageLoading } from '@/components/PageLoading';
import { PageBreadcrumbJsonLd } from '@/components/seo/PageBreadcrumbJsonLd';
import { formatQueryLabel } from '@/lib/search/searchHelpers';
import { getMarketplaceHomeData } from '@/lib/marketplace/getMarketplaceData';
import { getTopMarketplaceSellers } from '@/lib/marketplace/getSeller';
import { BRANDING } from '@/lib/config/branding';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const revalidate = 60;

export async function generateMetadata({ searchParams }: Props) {
  const params = await searchParams;
  const q =
    typeof params.q === 'string'
      ? params.q
      : Array.isArray(params.q)
        ? (params.q[0] ?? '')
        : '';
  const label = formatQueryLabel(q);

  return buildPageMetadata({
    title: q ? `Results for "${label}"` : 'Search Services',
    description: q
      ? `Explore digital solutions for ${label} on ${BRANDING.appName} — ${BRANDING.description}`
      : `Search software, web, marketing and creative solutions on ${BRANDING.appName}.`,
    path: q ? `/search?q=${encodeURIComponent(q)}` : '/search',
    keywords: [label, 'freelance', 'Bangladesh', 'marketplace'],
  });
}

export default async function SearchRoute({ searchParams }: Props) {
  const params = await searchParams;
  const q =
    typeof params.q === 'string'
      ? params.q
      : Array.isArray(params.q)
        ? (params.q[0] ?? '')
        : '';

  const [marketplace, topSellers] = await Promise.all([
    getMarketplaceHomeData(),
    getTopMarketplaceSellers(8),
  ]);

  return (
    <>
      <PageBreadcrumbJsonLd path="/search" />
      <Suspense fallback={<PageLoading variant="minimal" />}>
        <MarketplaceSearchPage
          services={marketplace.services}
          topSellers={topSellers}
          initialQuery={q}
        />
      </Suspense>
    </>
  );
}
