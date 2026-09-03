import { ShowcaseHero } from '@/src/features/ecommerce-showcase/public/ShowcaseHero';
import { HomeGallery } from '@/src/features/ecommerce-showcase/public/HomeGallery';
import type { EcommerceProjectCard } from '@/src/features/ecommerce-showcase/types';

export function HomePage({ projects }: { projects: EcommerceProjectCard[] }) {
  return (
    <>
      <ShowcaseHero />
      <HomeGallery projects={projects} />
    </>
  );
}
