'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { featuredServices } from '@/data/services';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { Star, Clock, ShoppingCart, Heart, Eye, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { categories } from '@/data/categories';

export const FeaturedServices: React.FC = () => {
  const { addToCart } = useStore();
  const { goToService, goToCategories } = useAppNavigation();

  const handleServiceClick = (serviceId: string) => {
    const service = featuredServices.find((s) => s.id === serviceId);
    if (service) goToService(service);
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(c => c.id === categoryId);
  };

  return (
    <section className="py-16 md:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-bridge-primary/20 to-transparent"></div>
      <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-bridge-secondary/5 rounded-full blur-[150px]"></div>

      <div className="container  mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-bridge-gold/10 border border-bridge-gold/20 rounded-full text-bridge-gold text-xs font-semibold mb-3 uppercase tracking-wider">
              <Sparkles className="w-3 h-3" /> Trending Now
            </span>
            <h2 className="text-2xl md:text-4xl font-black font-display text-text-primary">
              Featured <span className="gradient-text-gold">Services</span>
            </h2>
            <p className="text-text-muted text-sm mt-1">Top-rated services from verified sellers</p>
          </div>
          <button
            onClick={goToCategories}
            className="mt-3 sm:mt-0 text-bridge-primary-light hover:text-text-primary text-sm font-medium flex items-center gap-1 cursor-pointer transition-colors"
          >
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 2-per-row Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
          {featuredServices.map((service) => {
            const cat = getCategoryInfo(service.category);
            return (
              <div
                key={service.id}
                className="group relative flex flex-col sm:flex-row gap-0 sm:gap-0 overflow-hidden rounded-2xl bg-surface/60 border border-border-subtle hover:border-border-subtle transition-all duration-500 card-float"
              >
                {/* Image Side */}
                <div className="relative w-full sm:w-[45%] lg:w-[42%] flex-shrink-0 overflow-hidden">
                  <div className="aspect-[4/3] sm:aspect-auto sm:h-full">
                    <img
                      src={service.thumbnail}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-surface/60 hidden sm:block"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent sm:hidden"></div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleServiceClick(service.id); }}
                        className="p-2.5 glass-strong rounded-xl text-white hover:bg-bridge-primary/60 transition-colors cursor-pointer"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="p-2.5 glass-strong rounded-xl text-white hover:bg-bridge-accent/60 transition-colors cursor-pointer">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Badges */}
                  {service.popular && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-bridge-accent text-white text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-lg">
                      🔥 Hot
                    </div>
                  )}
                  <div className="absolute top-3 right-3 px-2.5 py-1 glass-strong text-text-primary text-[10px] font-semibold rounded-lg">
                    {cat?.icon} {cat?.name}
                  </div>
                </div>

                {/* Content Side */}
                <div className="flex-1 flex flex-col p-4 sm:p-5">
                  {/* Seller */}
                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src={service.sellerAvatar}
                      alt={service.sellerName}
                      className="w-7 h-7 rounded-full object-cover border-2 border-bridge-primary/20"
                    />
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-white/90">{service.sellerName}</span>
                      <CheckCircle className="w-3.5 h-3.5 text-bridge-secondary" />
                    </div>
                  </div>

                  {/* Title */}
                  <button
                    onClick={() => handleServiceClick(service.id)}
                    className="text-left cursor-pointer mb-2"
                  >
                    <h3 className="text-base md:text-lg font-bold text-text-primary group-hover:text-bridge-primary-light transition-colors line-clamp-2 leading-snug">
                      {service.title}
                    </h3>
                  </button>

                  {/* Description */}
                  <p className="text-xs text-text-muted line-clamp-2 mb-3 leading-relaxed">{service.description}</p>

                  {/* Features Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {service.features.slice(0, 3).map((f, fi) => (
                      <span key={fi} className="px-2 py-0.5 text-[10px] font-medium bg-background-soft text-text-muted rounded-md border border-border-subtle">
                        {f}
                      </span>
                    ))}
                    {service.features.length > 3 && (
                      <span className="px-2 py-0.5 text-[10px] font-medium text-bridge-primary-light">
                        +{service.features.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Spacer */}
                  <div className="flex-1"></div>

                  {/* Rating & Delivery & Price */}
                  <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-bridge-gold fill-bridge-gold" />
                        <span className="text-xs font-bold text-text-primary">{service.rating}</span>
                        <span className="text-[10px] text-text-muted">({service.reviewCount})</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-text-muted">
                        <Clock className="w-3 h-3" />
                        {service.deliveryTime}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-[10px] text-text-muted">From</p>
                        <p className="text-lg font-black text-text-primary leading-none">৳{service.price.toLocaleString()}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); addToCart(service); }}
                        className="p-2.5 bg-gradient-to-br from-bridge-primary to-bridge-primary-light hover:shadow-lg hover:shadow-bridge-primary/30 rounded-xl text-white transition-all cursor-pointer"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More */}
        <div className="text-center mt-10">
          <button
            onClick={goToCategories}
            className="inline-flex items-center gap-2 px-8 py-3 glass border border-border-subtle hover:border-bridge-primary/30 text-text-primary font-semibold rounded-xl hover:bg-bridge-primary/10 transition-all cursor-pointer"
          >
            Explore All Services
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
