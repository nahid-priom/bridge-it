'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { HeroStatsCard } from '@/components/hero/HeroStatsCard';
import { HeroSearchInput } from '@/components/hero/HeroSearchInput';
import { PageHero } from '@/components/ui/PageHero';
import { PAGE_HEROES } from '@/lib/config/page-heroes';
import { HERO_DESCRIPTION } from '@/data/homeContent';
import { ROUTES, solutionsSearchUrl } from '@/lib/routes';
import { useStore } from '@/store/useStore';
import { Search, ArrowRight, ShieldCheck } from 'lucide-react';
import { heroMotion } from '@/lib/styles/design-tokens';

const ease = heroMotion.ease;

export const Hero: React.FC = () => {
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = useStore.getState().searchQuery.trim();
    router.push(solutionsSearchUrl(q));
  };

  return (
    <section className="relative w-full overflow-x-hidden" aria-labelledby="hero-heading">
      <div className="marketplace-hero-bg relative w-full min-h-0 md:min-h-[500px] lg:min-h-[560px] px-5 md:px-8">
        <PageHero
          id="hero-heading"
          variant="marketing"
          eyebrow={
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 dark:bg-white/5 border border-slate-200/90 dark:border-white/15 shadow-sm text-sm font-semibold text-[#10B981] dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden />
              {PAGE_HEROES.home.eyebrow}
            </span>
          }
          title={PAGE_HEROES.home.title}
          highlightedText={PAGE_HEROES.home.highlightedText}
          accentLine={PAGE_HEROES.home.accentLine}
          subtitle={HERO_DESCRIPTION}
          className="!pb-0"
        />

        <div className="relative z-[1] w-full">
          <motion.div
            className="mx-auto w-full"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28, ease }}
          >
            <form
              onSubmit={handleSearch}
              role="search"
              className="mb-4 mx-auto w-full max-w-[44.8rem]"
              aria-label="Search digital solutions"
            >
              <div className="hero-search-bar group flex flex-row items-stretch w-full bg-white dark:bg-surface/95 border border-slate-200/90 dark:border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(8,11,22,0.06)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.35)] overflow-hidden transition-shadow hover:shadow-[0_14px_48px_rgba(16,185,129,0.1)]">
                <div className="flex-1 min-w-0">
                  <HeroSearchInput />
                </div>

                <button
                  type="submit"
                  aria-label="Search"
                  className="hero-search-submit shrink-0 m-1 sm:m-1.5 w-10 h-10 sm:w-12 sm:h-12 self-center rounded-xl inline-flex items-center justify-center text-white transition-transform hover:scale-[1.03] active:scale-[0.98]"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} aria-hidden />
                </button>
              </div>
            </form>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8 md:mb-10 mt-6 md:mt-8">
              <Link
                href={ROUTES.solutions}
                className="deshi-btn-primary w-full sm:w-auto px-8 py-3.5 text-sm md:text-base gap-2 inline-flex items-center justify-center"
              >
                Explore Solutions
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
              <Link
                href={ROUTES.consultation}
                className="deshi-btn-outline w-full sm:w-auto px-8 py-3.5 text-sm md:text-base bg-white dark:bg-transparent inline-flex items-center justify-center"
              >
                Get Free Consultation
              </Link>
            </div>

            <HeroStatsCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
