import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { useNavigateToSearch } from '../hooks/useNavigateToSearch';
import { ChevronLeft, ChevronRight, Search, ExternalLink, Megaphone } from 'lucide-react';

const heroSlides = [
  {
    image: 'https://images.pexels.com/photos/20043053/pexels-photo-20043053.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600',
    title: 'Bangladesh\'s #1 Smart',
    highlight: 'Virtual IT Park',
    subtitle: 'Buy, sell & discover premium digital services — animations, software, video ads, courses and more.',
    cta: 'Explore Services',
    ctaPage: 'categories' as const,
  },
  {
    image: 'https://images.pexels.com/photos/8728284/pexels-photo-8728284.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600',
    title: 'Grow Your Business',
    highlight: 'With Bridge',
    subtitle: 'Get your own custom URL, piracy-protected gallery & direct customer access from any platform.',
    cta: 'Become a Seller',
    ctaPage: 'dashboard' as const,
  },
  {
    image: 'https://images.pexels.com/photos/29506609/pexels-photo-29506609.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600',
    title: 'Secure Payments &',
    highlight: 'Guaranteed Delivery',
    subtitle: 'Escrow protection, bKash/Nagad/Card support, real-time messaging & 24/7 customer support.',
    cta: 'How It Works',
    ctaPage: 'about' as const,
  },
];

const customerAds = [
  {
    image: 'https://images.pexels.com/photos/8833485/pexels-photo-8833485.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=800',
    title: '🎨 Professional 2D & 3D Animation',
    seller: 'AnimateX Studio',
    badge: 'Featured Ad',
    color: '#FF6B6B',
  },
  {
    image: 'https://images.pexels.com/photos/7988745/pexels-photo-7988745.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=800',
    title: '🚀 Facebook & YouTube Video Ads',
    seller: 'AdVision Pro',
    badge: 'Sponsored',
    color: '#06D6A0',
  },
  {
    image: 'https://images.pexels.com/photos/270694/pexels-photo-270694.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=800',
    title: '💻 Custom Software Development',
    seller: 'CodeBridge Solutions',
    badge: 'Promoted',
    color: '#06B6D4',
  },
];

export const Hero: React.FC = () => {
  const { setPage, searchQuery, setSearchQuery } = useStore();
  const { goToSearch } = useNavigateToSearch();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideKey, setSlideKey] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setSlideKey((k) => k + 1);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setSlideKey((k) => k + 1);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = heroSlides[currentSlide];

  return (
    <section className="relative pt-16 md:pt-20">
      {/* ====== HERO SLIDESHOW ====== */}
      <div className="relative w-full h-[55vh] sm:h-[60vh] md:h-[70vh] lg:h-[75vh] overflow-hidden">
        {/* Slide Images */}
        {heroSlides.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: currentSlide === i ? 1 : 0, zIndex: currentSlide === i ? 1 : 0 }}
          >
            <img
              src={s.image}
              alt={s.title}
              className="w-full h-full object-cover"
              style={{ transform: currentSlide === i ? 'scale(1)' : 'scale(1.08)', transition: 'transform 6s ease-out' }}
            />
          </div>
        ))}

        {/* Dark Overlay Gradient */}
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-bridge-dark via-bridge-dark/80 to-bridge-dark/40"></div>
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-bridge-dark via-transparent to-bridge-dark/60"></div>

        {/* Content */}
        <div className="absolute inset-0 z-[3] flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl" key={slideKey}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-bridge-primary/20 border border-bridge-primary/30 rounded-full mb-5 animate-slide-up">
                <span className="w-2 h-2 bg-bridge-secondary rounded-full animate-pulse"></span>
                <span className="text-xs sm:text-sm text-bridge-primary-light font-medium">🌟 Smart Virtual IT Park</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-display leading-[1.1] mb-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <span className="text-white">{slide.title}</span>
                <br />
                <span className="gradient-text">{slide.highlight}</span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-bridge-gray/90 mb-6 max-w-lg leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
                {slide.subtitle}
              </p>

              <button
                onClick={() => setPage(slide.ctaPage)}
                className="px-6 py-3 md:px-8 md:py-3.5 bg-gradient-to-r from-bridge-primary to-bridge-primary-light text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-bridge-primary/40 hover:-translate-y-0.5 transition-all cursor-pointer animate-slide-up flex items-center gap-2 text-sm md:text-base"
                style={{ animationDelay: '0.3s' }}
              >
                {slide.cta}
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Slide Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[4] flex items-center gap-3">
          <button onClick={prevSlide} className="p-2 glass-strong rounded-full text-white/70 hover:text-white transition-colors cursor-pointer">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrentSlide(i); setSlideKey(k => k + 1); }}
                className="relative h-1.5 rounded-full overflow-hidden cursor-pointer transition-all"
                style={{ width: currentSlide === i ? '40px' : '16px', background: currentSlide === i ? 'transparent' : 'rgba(255,255,255,0.25)' }}
              >
                {currentSlide === i && (
                  <>
                    <div className="absolute inset-0 bg-white/20 rounded-full"></div>
                    <div className="absolute inset-0 bg-bridge-primary rounded-full slideshow-progress"></div>
                  </>
                )}
              </button>
            ))}
          </div>
          <button onClick={nextSlide} className="p-2 glass-strong rounded-full text-white/70 hover:text-white transition-colors cursor-pointer">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Slide Counter */}
        <div className="absolute top-24 right-6 z-[4] hidden md:flex items-center gap-2 glass rounded-full px-3 py-1.5">
          <span className="text-xs text-white font-bold">{String(currentSlide + 1).padStart(2, '0')}</span>
          <span className="text-xs text-bridge-gray">/</span>
          <span className="text-xs text-bridge-gray">{String(heroSlides.length).padStart(2, '0')}</span>
        </div>
      </div>

      {/* ====== CUSTOMER ADS / MARKETING DISPLAY ====== */}
      <div className="relative z-10 -mt-16 md:-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4 pl-1">
            <Megaphone className="w-4 h-4 text-bridge-gold" />
            <span className="text-xs font-semibold text-bridge-gold uppercase tracking-wider">Promoted Services</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {customerAds.map((ad, i) => (
              <button
                key={i}
                onClick={() => setPage('categories')}
                className="group relative overflow-hidden rounded-2xl cursor-pointer text-left card-float"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Image */}
                <div className="relative h-36 sm:h-40 overflow-hidden rounded-2xl">
                  <img src={ad.image} alt={ad.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  
                  {/* Ad Badge */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-white" style={{ background: ad.color + 'CC' }}>
                    {ad.badge}
                  </div>
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-sm font-bold text-white mb-1 line-clamp-2">{ad.title}</h3>
                    <p className="text-xs text-white/60">by {ad.seller}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ====== SEARCH BAR ====== */}
      <div className="relative z-10 mt-8 md:mt-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <form
            onSubmit={(e) => { e.preventDefault(); goToSearch(); }}
          >
            <div className="relative group">
              <div className="absolute -inset-[2px] bg-gradient-to-r from-bridge-primary via-bridge-secondary to-bridge-cyan rounded-2xl opacity-40 blur-md group-hover:opacity-60 transition-opacity"></div>
              <div className="relative flex items-center bg-bridge-dark-2 border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/30">
                <Search className="ml-5 w-5 h-5 text-bridge-gray flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="সার্ভিস খুঁজুন... Animation, Software, Courses, Editing..."
                  className="flex-1 px-4 py-4 md:py-5 bg-transparent text-white placeholder-bridge-gray/60 text-sm md:text-base focus:outline-none"
                />
                <button
                  type="submit"
                  className="mr-2 px-5 py-2.5 md:px-7 md:py-3 bg-gradient-to-r from-bridge-primary to-bridge-primary-light text-white font-bold rounded-xl hover:shadow-lg hover:shadow-bridge-primary/30 transition-all text-sm cursor-pointer"
                >
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Quick Tags */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {['2D Animation', '3D Render', 'Video Ads', 'Web Dev', 'UI/UX', 'Digital Marketing'].map((tag) => (
              <button
                key={tag}
                onClick={() => goToSearch(tag)}
                className="px-3 py-1 text-xs text-bridge-gray/80 bg-white/5 hover:bg-bridge-primary/20 hover:text-bridge-primary-light border border-white/5 hover:border-bridge-primary/30 rounded-full transition-all cursor-pointer"
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
