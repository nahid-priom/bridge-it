import { EcommerceHero } from '@/src/features/ecommerce-showcase/public/EcommerceHero';
import { HomeGallery } from '@/src/features/ecommerce-showcase/public/HomeGallery';
import type { HomepageLegacyCategorySection, HomepageSectionsResult } from '@/src/features/ecommerce-showcase/types';

export function HomePage({
  sections,
  legacySections,
}: {
  sections: HomepageSectionsResult;
  legacySections: HomepageLegacyCategorySection[];
}) {
  return (
    <>
      <EcommerceHero />
      <HomeGallery sections={sections} legacySections={legacySections} />
    </>
  );
}
