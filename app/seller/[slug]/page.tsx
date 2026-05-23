import { notFound } from 'next/navigation';
import { buildPageMetadata } from '@/lib/metadata';
import { getSellerProfile } from '@/lib/marketplace/getSeller';
import { MarketplaceSellerProfile } from '@/components/seller/profile/MarketplaceSellerProfile';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { BreadcrumbOverrideProvider } from '@/components/seo/BreadcrumbOverride';
import type { BreadcrumbItem } from '@/lib/seo/breadcrumbs';
import { ROUTES } from '@/lib/routes';

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const profile = await getSellerProfile(slug);
  if (!profile) return {};
  const { seller } = profile;
  return buildPageMetadata({
    title: `${seller.fullName} — ${seller.title}`,
    description: seller.shortBio ?? seller.about ?? `Hire ${seller.fullName} on Deshi Fiverr`,
    path: ROUTES.marketplaceSeller(slug),
    keywords: [seller.fullName, seller.title, seller.city ?? 'Bangladesh', 'freelancer'],
  });
}

export default async function MarketplaceSellerPage({ params }: Props) {
  const { slug } = await params;
  const profile = await getSellerProfile(slug);
  if (!profile) notFound();

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', href: ROUTES.home },
    { label: 'Search', href: ROUTES.search },
    { label: profile.seller.fullName, href: ROUTES.marketplaceSeller(slug) },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <BreadcrumbOverrideProvider items={breadcrumbItems}>
        <MarketplaceSellerProfile profile={profile} />
      </BreadcrumbOverrideProvider>
    </>
  );
}
