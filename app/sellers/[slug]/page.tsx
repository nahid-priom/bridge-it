import { notFound } from 'next/navigation';
import { buildPageMetadata } from '@/lib/metadata';
import { getSellerBySlug, getAllSellerSlugs } from '@/lib/slugs';
import { SellerProfile } from '@/components/SellerProfile';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { BreadcrumbOverrideProvider } from '@/components/seo/BreadcrumbOverride';
import type { BreadcrumbItem } from '@/lib/seo/breadcrumbs';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllSellerSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const seller = getSellerBySlug(slug);
  if (!seller) return {};
  return buildPageMetadata({
    title: `${seller.name} — Seller Profile`,
    description: seller.description,
    path: `/sellers/${slug}`,
    keywords: [seller.name, seller.tagline, seller.location, 'Bridge seller'],
  });
}

export default async function SellerDetailRoute({ params }: Props) {
  const { slug } = await params;
  const seller = getSellerBySlug(slug);
  if (!seller) notFound();

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Sellers', href: '/search' },
    { label: seller.name, href: `/sellers/${slug}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <BreadcrumbOverrideProvider items={breadcrumbItems}>
        <SellerProfile slug={slug} />
      </BreadcrumbOverrideProvider>
    </>
  );
}
