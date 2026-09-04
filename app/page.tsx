import { HomePage } from '@/components/home/HomePage';
import { JsonLd } from '@/components/layout/JsonLd';
import { buildPageMetadata } from '@/lib/metadata';
import { HOME_SEO_DESCRIPTION, HOME_SEO_TITLE } from '@/lib/site';
import {
  customEcommerceServiceJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from '@/lib/structured-data';
import {
  listHomepageLegacyCategorySections,
  listHomepageSections,
} from '@/src/features/ecommerce-showcase/api/projects';
import { listHomepageSoftwareSections } from '@/src/features/software-showcase/api/projects';
import { listHomepageCreativeMarketingSections } from '@/src/features/creative-marketing-showcase/api/projects';

export const revalidate = 30;

export const metadata = buildPageMetadata({
  title: HOME_SEO_TITLE,
  description: HOME_SEO_DESCRIPTION,
  keywords: [
    'custom e-commerce website',
    'software solutions Bangladesh',
    'creative digital marketing bangladesh',
    'facebook ads management bangladesh',
    'graphic design services bangladesh',
  ],
  path: '/',
});

export default async function Home() {
  const [sections, legacySections, softwareSections, creativeSections] = await Promise.all([
    listHomepageSections(),
    listHomepageLegacyCategorySections(),
    listHomepageSoftwareSections(),
    listHomepageCreativeMarketingSections(),
  ]);
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={customEcommerceServiceJsonLd()} />
      <HomePage
        sections={sections}
        legacySections={legacySections}
        softwareSections={softwareSections}
        creativeSections={creativeSections}
      />
    </>
  );
}
