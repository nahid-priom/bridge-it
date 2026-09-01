import { Hero } from '@/components/Hero';
import { CategoryIconGrid } from '@/components/home/CategoryIconGrid';
import { HomeFeaturedSolutions, HomeShowroomPromos } from '@/components/home/HomeSolutionsSections';
import { WhyBridgeItParkSection } from '@/components/home/WhyBridgeItParkSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { FeaturedPortfolioSection } from '@/components/home/FeaturedPortfolioSection';
import { ClientTestimonials } from '@/components/home/ClientTestimonials';
import { HomeCtaBanner } from '@/components/home/HomeCtaBanner';
import { TrustSecurityStrip } from '@/components/home/TrustSecurityStrip';
import type { PlatformTestimonial } from '@/types';
import type { BitpPortfolioItem, BitpProduct } from '@/types/bitp';

type HomePageProps = {
  featuredProducts: BitpProduct[];
  testimonials: PlatformTestimonial[];
  portfolio?: BitpPortfolioItem[];
};

export function HomePage({ featuredProducts, testimonials, portfolio = [] }: HomePageProps) {
  return (
    <>
      <Hero />
      <CategoryIconGrid />
      <HomeShowroomPromos />
      <HomeFeaturedSolutions products={featuredProducts} />
      <WhyBridgeItParkSection />
      <HowItWorksSection />
      <FeaturedPortfolioSection items={portfolio} />
      <ClientTestimonials testimonials={testimonials} />
      <HomeCtaBanner />
      <TrustSecurityStrip />
    </>
  );
}
