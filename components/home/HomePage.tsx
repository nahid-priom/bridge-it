import { Hero } from '@/components/Hero';
import { TrustBanner } from '@/components/TrustBanner';
import { CategoriesSection } from '@/components/CategoriesSection';
import { FeaturedServices } from '@/components/FeaturedServices';
import { HowItWorks } from '@/components/HowItWorks';
import { TopSellers } from '@/components/TopSellers';
import { Testimonials } from '@/components/Testimonials';
import { CTASection } from '@/components/CTASection';
import type { Category, Seller, Service } from '@/types';
import type { PlatformTestimonial } from '@/types';

type HomePageProps = {
  categories: Category[];
  featuredServices: Service[];
  topSellers: Seller[];
  testimonials: PlatformTestimonial[];
};

export function HomePage({
  categories,
  featuredServices,
  topSellers,
  testimonials,
}: HomePageProps) {
  return (
    <>
      <Hero />
      <TrustBanner />
      <CategoriesSection categories={categories} />
      <FeaturedServices services={featuredServices} categories={categories} />
      <HowItWorks />
      <TopSellers sellers={topSellers} categories={categories} />
      <Testimonials testimonials={testimonials} />
      <CTASection />
    </>
  );
}
