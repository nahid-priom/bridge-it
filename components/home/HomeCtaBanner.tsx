'use client';

import { Briefcase, ArrowRight } from 'lucide-react';
import { useAuthProfile } from '@/components/auth/AuthProfileContext';
import { useBecomeSeller } from '@/hooks/useBecomeSeller';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { HOME_CTA } from '@/data/homeContent';

export function HomeCtaBanner() {
  const authProfile = useAuthProfile();
  const goBecomeSeller = useBecomeSeller(authProfile);
  const { goToCategories } = useAppNavigation();

  return (
    <section className="py-10 md:py-12" aria-labelledby="home-cta-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="deshi-cta-banner relative overflow-hidden rounded-3xl px-6 py-10 md:px-12 md:py-14">
          <div className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 opacity-20 md:opacity-30 pointer-events-none" aria-hidden>
            <div className="relative w-32 h-32 md:w-48 md:h-48">
              <div className="absolute inset-0 rounded-3xl bg-white/20 rotate-12" />
              <Briefcase className="absolute inset-0 m-auto w-16 h-16 md:w-24 md:h-24 text-white" />
              <div className="absolute -top-4 -right-4 w-12 h-16 rounded-lg bg-white/15 rotate-[-8deg]" />
              <div className="absolute -bottom-2 left-0 w-14 h-10 rounded-lg bg-white/10 rotate-[6deg]" />
            </div>
          </div>

          <div className="relative z-10 max-w-2xl">
            <h2 id="home-cta-heading" className="text-xl md:text-3xl font-black text-white leading-tight mb-3">
              {HOME_CTA.title}
            </h2>
            <p className="text-sm md:text-base text-white/90 mb-6">{HOME_CTA.subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={goToCategories}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-deshi-green-dark font-bold rounded-xl hover:bg-white/95 transition-colors"
              >
                Explore Services
                <ArrowRight className="w-4 h-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={goBecomeSeller}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
              >
                Become a Seller
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
