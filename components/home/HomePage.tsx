import { EcommerceHero } from '@/src/features/ecommerce-showcase/public/EcommerceHero';
import { HomeGallery } from '@/src/features/ecommerce-showcase/public/HomeGallery';
import type { HomepageSectionsResult } from '@/src/features/ecommerce-showcase/types';

export function HomePage({ sections }: { sections: HomepageSectionsResult }) {
  return (
    <>
      <EcommerceHero />
      <HomeGallery sections={sections} />
    </>
  );
}
