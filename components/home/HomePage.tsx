import { Hero } from '@/components/Hero';
import { MarketplaceHomeSections } from '@/components/marketplace/MarketplaceHomeSections';
import { FreelancerBenefitsSection } from '@/components/home/FreelancerBenefitsSection';
import { HowDeshiFiverrWorks } from '@/components/home/HowDeshiFiverrWorks';
import { TopRatedFreelancers } from '@/components/home/TopRatedFreelancers';
import { ClientTestimonials } from '@/components/home/ClientTestimonials';
import { HomeCtaBanner } from '@/components/home/HomeCtaBanner';
import { TrustSecurityStrip } from '@/components/home/TrustSecurityStrip';
import type { MarketplaceHomeData } from '@/types/marketplace';
import type { MarketplaceProduct } from '@/types/marketplaceProduct';
import type { PlatformTestimonial } from '@/types';

type HomePageProps = {
  marketplace: MarketplaceHomeData;
  popularProducts: MarketplaceProduct[];
  testimonials: PlatformTestimonial[];
};

export function HomePage({ marketplace, popularProducts, testimonials }: HomePageProps) {
  return (
    <>
      <Hero />
      <MarketplaceHomeSections data={marketplace} popularProducts={popularProducts} />
      <FreelancerBenefitsSection />
      <HowDeshiFiverrWorks />
      <TopRatedFreelancers />
      <ClientTestimonials testimonials={testimonials} />
      <HomeCtaBanner />
      <TrustSecurityStrip />
    </>
  );
}
