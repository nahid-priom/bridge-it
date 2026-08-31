import { Hero } from '@/components/Hero';
import { MarketplaceHomeSections } from '@/components/marketplace/MarketplaceHomeSections';
import { WhyBridgeItParkSection } from '@/components/home/WhyBridgeItParkSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { FeaturedPortfolioSection } from '@/components/home/FeaturedPortfolioSection';
import { ClientTestimonials } from '@/components/home/ClientTestimonials';
import { HomeCtaBanner } from '@/components/home/HomeCtaBanner';
import { TrustSecurityStrip } from '@/components/home/TrustSecurityStrip';
import type { MarketplaceHomeData } from '@/types/marketplace';
import type { MarketplaceProduct } from '@/types/marketplaceProduct';
import type { PlatformTestimonial } from '@/types';
import type { BitpPortfolioItem } from '@/types/bitp';

type HomePageProps = {
  marketplace: MarketplaceHomeData;
  popularProducts: MarketplaceProduct[];
  testimonials: PlatformTestimonial[];
  portfolio?: BitpPortfolioItem[];
};

export function HomePage({ marketplace, popularProducts, testimonials, portfolio = [] }: HomePageProps) {
  return (
    <>
      <Hero />
      <MarketplaceHomeSections data={marketplace} popularProducts={popularProducts} />
      <WhyBridgeItParkSection />
      <HowItWorksSection />
      <FeaturedPortfolioSection items={portfolio} />
      <ClientTestimonials testimonials={testimonials} />
      <HomeCtaBanner />
      <TrustSecurityStrip />
    </>
  );
}
