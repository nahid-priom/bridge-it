'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { PageFallback } from './PageFallback';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { Star, Clock, ShoppingCart, Shield, CheckCircle, MessageCircle, Phone, ArrowLeft, Copy, Eye, Lock } from 'lucide-react';
import type { Category, Review, Service } from '@/types';
import { BRANDING } from '@/lib/config/branding';

type ServiceDetailProps = {
  service: Service;
  reviews: Review[];
  categories: Category[];
  slug: string;
};

export const ServiceDetail: React.FC<ServiceDetailProps> = ({
  service,
  reviews,
  categories,
  slug,
}) => {
  const { addToCart, setNotification } = useStore();
  const { goHome, goToMessages, goToSeller } = useAppNavigation();
  const [activeTab, setActiveTab] = useState<'overview' | 'gallery' | 'reviews'>('overview');

  const cat = categories.find((c) => c.id === service.category);

  const handleOrder = () => {
    addToCart(service);
    setNotification('Added to cart! Proceed to checkout.');
  };

  const handleContactSeller = () => {
    goToMessages();
  };

  const shareUrl = `${BRANDING.siteUrl.replace(/^https?:\/\//, '')}/solutions/${slug}`;
  const sellerSlug = service.sellerSlug;

  return (
    <article className="min-h-screen pb-20">
      <div className="container  mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <button
              onClick={goHome}
              className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-bridge-primary mb-6 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </button>

            <div className="relative rounded-2xl overflow-hidden mb-6 aspect-video">
              <img src={service.thumbnail} alt={service.title} className="w-full h-full object-cover" />
              {cat && (
                <div className="absolute top-4 left-4 px-3 py-1.5 glass-strong rounded-lg text-sm font-semibold">
                  {cat.icon} {cat.name}
                </div>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">{service.title}</h1>
            <p className="text-text-muted leading-relaxed mb-6">{service.description}</p>

            <div className="flex flex-wrap gap-2 mb-8">
              {service.features.map((f, i) => (
                <span key={i} className="px-3 py-1.5 text-xs font-medium bg-surface border border-border-subtle rounded-lg">
                  {f}
                </span>
              ))}
            </div>

            <div className="flex gap-2 border-b border-border-subtle mb-6">
              {(['overview', 'gallery', 'reviews'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium capitalize cursor-pointer border-b-2 transition-colors ${
                    activeTab === tab ? 'border-bridge-primary text-bridge-primary' : 'border-transparent text-text-muted'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-text-muted text-sm">No reviews yet.</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="glass rounded-xl p-4 border border-border-subtle">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-bridge-gold fill-bridge-gold" />
                        <span className="font-semibold text-sm">{review.rating}</span>
                        <span className="text-text-muted text-xs">{review.userName}</span>
                      </div>
                      <p className="text-sm text-text-secondary">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <aside className="lg:col-span-1">
            <div className="glass rounded-2xl p-6 border border-border-subtle sticky top-24">
              <div className="flex items-center gap-3 mb-4">
                <img src={service.sellerAvatar} alt={service.sellerName} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-text-primary">{service.sellerName}</p>
                  <div className="flex items-center gap-1 text-xs text-text-muted">
                    <Star className="w-3 h-3 text-bridge-gold fill-bridge-gold" />
                    {service.rating} ({service.reviewCount} reviews)
                  </div>
                </div>
              </div>

              <p className="text-3xl font-black text-text-primary mb-1">৳{service.price.toLocaleString()}</p>
              <p className="text-xs text-text-muted mb-4 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Delivery: {service.deliveryTime}
              </p>

              <button onClick={handleOrder} className="w-full py-3 bg-bridge-primary text-white font-semibold rounded-xl mb-3 flex items-center justify-center gap-2 cursor-pointer">
                <ShoppingCart className="w-4 h-4" /> Order Now
              </button>
              <button onClick={handleContactSeller} className="w-full py-3 glass border border-border-subtle text-text-primary font-medium rounded-xl mb-3 flex items-center justify-center gap-2 cursor-pointer">
                <MessageCircle className="w-4 h-4" /> Contact Seller
              </button>
              {sellerSlug && (
                <button onClick={() => goToSeller(sellerSlug)} className="w-full py-2 text-sm text-bridge-primary hover:underline cursor-pointer">
                  View Seller Profile
                </button>
              )}

              <div className="mt-4 pt-4 border-t border-border-subtle space-y-2 text-xs text-text-muted">
                <p className="flex items-center gap-2"><Shield className="w-4 h-4 text-bridge-secondary" /> Escrow protected payment</p>
                <p className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-bridge-secondary" /> Verified seller</p>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <code className="text-xs text-text-muted flex-1 truncate">{shareUrl}</code>
                <button
                  onClick={() => navigator.clipboard.writeText(shareUrl)}
                  className="p-2 rounded-lg bg-surface cursor-pointer"
                  aria-label="Copy link"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
};
