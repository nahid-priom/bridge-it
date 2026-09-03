import { HomePage } from '@/components/home/HomePage';
import { JsonLd } from '@/components/layout/JsonLd';
import { buildPageMetadata } from '@/lib/metadata';
import { HOME_SEO_DESCRIPTION, HOME_SEO_TITLE } from '@/lib/site';
import { customEcommerceServiceJsonLd } from '@/lib/structured-data';
import {
  listHomepageLegacyCategorySections,
  listHomepageSections,
} from '@/src/features/ecommerce-showcase/api/projects';

export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: HOME_SEO_TITLE,
  description: HOME_SEO_DESCRIPTION,
  keywords: [
    'custom e-commerce website',
    'custom ecommerce website Bangladesh',
    'e-commerce website design',
    'ecommerce website development',
  ],
  path: '/',
});

export default async function Home() {
  const [sections, legacySections] = await Promise.all([
    listHomepageSections(),
    listHomepageLegacyCategorySections(),
  ]);
  return (
    <>
      <JsonLd data={customEcommerceServiceJsonLd()} />
      <HomePage sections={sections} legacySections={legacySections} />
    </>
  );
}
