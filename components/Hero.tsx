'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { useNavigateToSearch } from '@/hooks/useNavigateToSearch';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { BridgeImage } from '@/components/ui/BridgeImage';
import { HeroMetric } from '@/components/hero/HeroMetric';
import { PromotedServiceCard } from '@/components/hero/PromotedServiceCard';
import {
  heroSlides,
  promotedServices,
  heroTrustMetrics,
  heroSearchQuickTags,
} from '@/data/heroContent';
import type { HeroCtaPage } from '@/data/heroContent';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ExternalLink,
  ArrowRight,
  Megaphone,
  Sun,
} from 'lucide-react';

const SLIDE_INTERVAL_MS = 5000;

export const Hero: React.FC = () => {
  const { searchQuery, setSearchQuery } = useStore();
  const { goToPageKey, goToCategories } = useAppNavigation();
  const { goToSearch } = useNavigateToSearch();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideKey, setSlideKey] = useState(0);
  const [promoIndex, setPromoIndex] = useState(0);
  const promoScrollRef = useRef<HTMLDivElement>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setSlideKey((k) => k + 1);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setSlideKey((k) => k + 1);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = heroSlides[currentSlide];
  const goCta = (page: HeroCtaPage) => goToPageKey(page);

  const scrollPromo = (dir: -1 | 1) => {
    setPromoIndex((prev) => {
      const next = (prev + dir + promotedServices.length) % promotedServices.length;
      return next;
    });
    if (promoScrollRef.current) {
      const card = promoScrollRef.current.querySelector('[data-promo-card]') as HTMLElement | null;
      const gap = 16;
      const width = card?.offsetWidth ?? 320;
      promoScrollRef.current.scrollBy({ left: dir * (width + gap), behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-x-hidden">
      {/* ===== Premium hero ===== */}
      <div className="relative min-h-[680px] md:min-h-[760px] lg:min-h-[850px] hero-premium-bg">
        {/* Background images — right weighted */}
        <div className="absolute inset-0 overflow-hidden">
          {heroSlides.map((s, i) => (
            <div
              key={s.id}
              className="absolute inset-0 transition-opacity duration-1000 ease-out"
              style={{ opacity: currentSlide === i ? 1 : 0, zIndex: currentSlide === i ? 1 : 0 }}
            >
              <div className="absolute inset-0 md:left-[30%] lg:left-[38%]">
                <BridgeImage
                  src={s.image}
                  alt={`${s.title} ${s.highlight}`}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 768px) 100vw, 65vw"
                  className="object-cover object-center opacity-[0.62] dark:opacity-[0.75]"
                  style={{
                    transform: currentSlide === i ? 'scale(1)' : 'scale(1.06)',
                    transition: 'transform 6s ease-out',
                  }}
                />
              </div>
            </div>
          ))}
          <div className="absolute inset-0 z-[2] hero-overlay-premium" />
          <div className="absolute inset-0 z-[2] hero-gradient opacity-40 dark:opacity-70 pointer-events-none" />
        </div>

        {/* Slide counter */}
        <div
          className="absolute top-28 md:top-32 right-4 sm:right-8 z-[4] hidden sm:flex items-center gap-1.5 glass rounded-full px-3.5 py-1.5 shadow-sm border border-border-subtle"
          aria-live="polite"
        >
          <span className="text-xs font-bold text-text-primary">
            {String(currentSlide + 1).padStart(2, '0')}
          </span>
          <span className="text-xs text-text-muted">/</span>
          <span className="text-xs text-text-muted">
            {String(heroSlides.length).padStart(2, '0')}
          </span>
        </div>

        {/* Hero content */}
        <div className="relative z-[3] pt-28 md:pt-36 pb-8 md:pb-12">
          <div className="container  mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl lg:max-w-2xl" key={slideKey}>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-bridge-primary/10 border border-bridge-primary/25 rounded-full mb-5 animate-slide-up"
                style={{ animationDelay: '0s' }}
              >
                <Sun className="w-3.5 h-3.5 text-bridge-primary" aria-hidden />
                <span className="text-xs sm:text-sm text-violet-800 dark:text-bridge-primary-light font-medium">
                  {slide.badge}
                </span>
              </div>

              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black font-display leading-[1.08] mb-4 animate-slide-up"
                style={{ animationDelay: '0.08s' }}
              >
                <span className="block text-text-primary">{slide.title}</span>
                <span className="hero-headline-gradient">{slide.highlight}</span>
              </h1>

              <p
                className="text-sm sm:text-base md:text-lg text-text-secondary mb-7 max-w-lg leading-relaxed animate-slide-up"
                style={{ animationDelay: '0.16s' }}
              >
                {slide.subtitle}
              </p>

              <div
                className="flex flex-col sm:flex-row flex-wrap gap-3 mb-8 animate-slide-up"
                style={{ animationDelay: '0.24s' }}
              >
                <button
                  type="button"
                  onClick={() => goCta(slide.primaryCtaPage)}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-bridge-primary to-bridge-primary-light text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-bridge-primary/30 hover:-translate-y-0.5 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-bridge-primary/50 text-sm md:text-base"
                >
                  {slide.primaryCta}
                  <ExternalLink className="w-4 h-4" aria-hidden />
                </button>
                {slide.secondaryCta && slide.secondaryCtaPage && (
                  <button
                    type="button"
                    onClick={() => goCta(slide.secondaryCtaPage!)}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-surface text-bridge-primary font-bold rounded-2xl border border-border-subtle hover:border-bridge-primary/40 hover:shadow-md transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-bridge-primary/30 text-sm md:text-base"
                  >
                    {slide.secondaryCta}
                    <ArrowRight className="w-4 h-4" aria-hidden />
                  </button>
                )}
              </div>

              <div
                className="flex flex-wrap gap-6 sm:gap-8 animate-slide-up"
                style={{ animationDelay: '0.32s' }}
              >
                {heroTrustMetrics.map((m) => (
                  <HeroMetric key={m.id} metric={m} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Slide dots — subtle, above promoted */}
        <div className="relative z-[4] flex justify-center gap-2 pb-4">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setCurrentSlide(i);
                setSlideKey((k) => k + 1);
              }}
              className={`h-1.5 rounded-full transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-bridge-primary/40 ${
                currentSlide === i ? 'w-8 bg-bridge-primary' : 'w-2 bg-slate-300 dark:bg-white/25'
              }`}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={currentSlide === i}
            />
          ))}
        </div>

        {/* ===== Promoted services ===== */}
        <div className="relative z-[4] pb-10 md:pb-14">
          <div className="container  mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-5">
              <Megaphone className="w-4 h-4 text-orange-500" aria-hidden />
              <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">
                Promoted Services
              </span>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => scrollPromo(-1)}
                className="hidden md:flex absolute -left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-surface border border-border-subtle shadow-lg text-text-secondary hover:text-bridge-primary transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-bridge-primary/40"
                aria-label="Previous promoted services"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollPromo(1)}
                className="hidden md:flex absolute -right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-surface border border-border-subtle shadow-lg text-text-secondary hover:text-bridge-primary transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-bridge-primary/40"
                aria-label="Next promoted services"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div
                ref={promoScrollRef}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 md:overflow-visible md:snap-none md:grid md:grid-cols-2 lg:grid-cols-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {promotedServices.map((ad, i) => (
                  <div key={ad.id} data-promo-card className="snap-center shrink-0 w-[min(100%,320px)] md:w-auto md:shrink">
                    <PromotedServiceCard
                      ad={ad}
                      onClick={goToCategories}
                      priority={i === 0}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-2 mt-5 md:hidden">
                {promotedServices.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPromoIndex(i)}
                    className={`h-2 rounded-full transition-all ${
                      promoIndex === i ? 'w-6 bg-bridge-primary' : 'w-2 bg-slate-300'
                    }`}
                    aria-label={`Promoted card ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Search bar ===== */}
      <div className="relative z-10 bg-background pb-10 md:pb-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              goToSearch();
            }}
            role="search"
          >
            <div className="relative group">
              <div className="absolute -inset-[2px] bg-gradient-to-r from-bridge-primary via-bridge-secondary to-bridge-cyan rounded-2xl opacity-30 blur-md group-hover:opacity-50 transition-opacity duration-300" />
              <div className="relative flex items-center bg-surface border border-border-subtle rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(15,14,23,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
                <Search className="ml-5 w-5 h-5 text-text-muted flex-shrink-0" aria-hidden />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="সার্ভিস খুঁজুন... Animation, Software, Courses, Editing..."
                  aria-label="Search services"
                  className="flex-1 px-4 py-4 md:py-5 bg-transparent text-text-primary placeholder:text-text-muted text-sm md:text-base focus:outline-none"
                />
                <button
                  type="submit"
                  className="mr-2 px-5 py-2.5 md:px-7 md:py-3 bg-gradient-to-r from-bridge-primary to-bridge-primary-light text-white font-bold rounded-xl hover:shadow-lg hover:shadow-bridge-primary/25 transition-all text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  Search
                </button>
              </div>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {heroSearchQuickTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => goToSearch(tag)}
                className="px-3 py-1.5 text-xs text-text-secondary bg-background-soft hover:bg-bridge-primary/10 hover:text-bridge-primary border border-border-subtle hover:border-bridge-primary/30 rounded-full transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-bridge-primary/30"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
