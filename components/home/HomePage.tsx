import { HomepageHero } from '@/components/home/hero/HomepageHero';
import { MainCategoryStrip } from '@/components/home/hero/MainCategoryStrip';
import { PortfolioExperience } from '@/components/home/portfolio';
import { WhyBridgeItParkSection } from '@/components/home/WhyBridgeItParkSection';
import { HomeCtaBanner } from '@/components/home/HomeCtaBanner';
import type { HomepageLegacyCategorySection, HomepageSectionsResult } from '@/src/features/ecommerce-showcase/types';
import type { SoftwareHomepageSectionsResult } from '@/src/features/software-showcase/types';
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
      <MainCategoryStrip />
      <PortfolioExperience
        sections={sections}
        legacySections={legacySections}
        softwareSections={softwareSections}
        creativeSections={creativeSections}
      />
      <WhyBridgeItParkSection />
      <HomeCtaBanner />
    </>
  );
}
