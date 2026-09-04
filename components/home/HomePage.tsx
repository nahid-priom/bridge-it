import { HomepageHero } from '@/components/home/hero/HomepageHero';
import { HomeBusinessPillars } from '@/components/home/hero/HomeBusinessPillars';
import { HomeGallery } from '@/src/features/ecommerce-showcase/public/HomeGallery';
import type { HomepageLegacyCategorySection, HomepageSectionsResult } from '@/src/features/ecommerce-showcase/types';
import { SoftwareHomeGallery } from '@/src/features/software-showcase/public/SoftwareHomeGallery';
import type { SoftwareHomepageSectionsResult } from '@/src/features/software-showcase/types';
import { CreativeMarketingHomeGallery } from '@/src/features/creative-marketing-showcase/public/CreativeMarketingHomeGallery';
import type { CreativeMarketingHomepageSectionsResult } from '@/src/features/creative-marketing-showcase/types';

export function HomePage({
  sections,
  legacySections,
  softwareSections,
  creativeSections,
}: {
  sections: HomepageSectionsResult;
  legacySections: HomepageLegacyCategorySection[];
  softwareSections?: SoftwareHomepageSectionsResult | null;
  creativeSections?: CreativeMarketingHomepageSectionsResult | null;
}) {
  return (
    <>
      <HomepageHero />
      <HomeBusinessPillars />
      <HomeGallery sections={sections} legacySections={legacySections} />
      {softwareSections ? <SoftwareHomeGallery sections={softwareSections} /> : null}
      {creativeSections ? <CreativeMarketingHomeGallery sections={creativeSections} /> : null}
    </>
  );
}
