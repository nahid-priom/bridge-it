import { notFound } from 'next/navigation';
import { buildPageMetadata } from '@/lib/metadata';
import { SellerProfile } from '@/components/SellerProfile';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { BreadcrumbOverrideProvider } from '@/components/seo/BreadcrumbOverride';
import { fetchSellerWithStats, fetchCategoriesForSellers } from '@/lib/catalog/sellers';
import type { BreadcrumbItem } from '@/lib/seo/breadcrumbs';

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const data = await fetchSellerWithStats(slug);
  if (!data) return {};
  return buildPageMetadata({
    title: `${data.seller.name} — Seller Profile`,
    description: data.seller.description,
    path: `/sellers/${slug}`,
    keywords: [data.seller.name, data.seller.tagline, data.seller.location, 'Bridge seller'],
  });
}

export default async function SellerDetailRoute({ params }: Props) {
  const { slug } = await params;
  const data = await fetchSellerWithStats(slug);
  if (!data) notFound();

  const categories = await fetchCategoriesForSellers();

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Sellers', href: '/search' },
    { label: data.seller.name, href: `/sellers/${slug}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <BreadcrumbOverrideProvider items={breadcrumbItems}>
        <SellerProfile
          seller={data.seller}
          services={data.services}
          categories={categories}
        />
      </BreadcrumbOverrideProvider>
    </>
  );
}
