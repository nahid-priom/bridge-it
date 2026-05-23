'use client';

import { Hero } from '@/components/Hero';
import { TrustBanner } from '@/components/TrustBanner';
import { CategoriesSection } from '@/components/CategoriesSection';
import { FeaturedServices } from '@/components/FeaturedServices';
import { HowItWorks } from '@/components/HowItWorks';
import { TopSellers } from '@/components/TopSellers';
import { Testimonials } from '@/components/Testimonials';
import { CTASection } from '@/components/CTASection';

export function HomePage() {
  return (
    <>
      <Hero />
      <TrustBanner />
      <CategoriesSection />
      <FeaturedServices />
      <HowItWorks />
      <TopSellers />
      <Testimonials />
      <CTASection />
    </>
  );
}
