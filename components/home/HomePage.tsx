import { EcommerceHero } from '@/src/features/ecommerce-showcase/public/EcommerceHero';
import { HomeGallery } from '@/src/features/ecommerce-showcase/public/HomeGallery';
import type { EcommerceProjectCard } from '@/src/features/ecommerce-showcase/types';

export function HomePage({ projects }: { projects: EcommerceProjectCard[] }) {
  return (
    <>
      <EcommerceHero />
      <HomeGallery projects={projects} />
    </>
  );
}
