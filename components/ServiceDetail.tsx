'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { allMarketplaceServices, sampleReviews } from '@/data/services';
import { categories } from '@/data/categories';
import { PageFallback } from './PageFallback';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { getServiceBySlug } from '@/lib/slugs';
import { getSellerSlugById } from '@/lib/sellers';
import { Star, Clock, ShoppingCart, Shield, CheckCircle, MessageCircle, Phone, ArrowLeft, Copy, Eye, Lock } from 'lucide-react';

export const ServiceDetail: React.FC<{ slug: string }> = ({ slug }) => {
  const { addToCart, setNotification } = useStore();
  const { goHome, goToMessages, goToSeller } = useAppNavigation();
  const [activeTab, setActiveTab] = useState<'overview' | 'gallery' | 'reviews'>('overview');

  const service = getServiceBySlug(slug);
  if (!service) {
    return (
      <PageFallback
        title="Service not found"
        message="This listing may have been removed. Browse featured services on the home page."
        backLabel="Back to Home"
        onBack={goHome}
      />
    );
  }

  const cat = categories.find(c => c.id === service.category);
  const reviews = sampleReviews.filter(r => r.serviceId === service.id).slice(0, 4);

  const handleOrder = () => {
    addToCart(service);
    setNotification('Added to cart! Proceed to checkout.');
  };

  const handleContactSeller = () => {
    goToMessages();
  };

  const shareUrl = `bridge.app/services/${slug}`;
  const sellerSlug = getSellerSlugById(service.sellerId);

  return (
    <article className="min-h-screen pb-20">
      <div className="container  mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden mb-6 watermark-overlay">
              <img
                src={service.thumbnail}
                alt={service.title}
                className="w-full aspect-video object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div className="px-3 py-1.5 glass-strong rounded-lg text-xs text-text-primary">
                  {cat?.icon} {cat?.name}
                </div>
                <div className="flex items-center gap-1 px-3 py-1.5 glass-strong rounded-lg text-xs text-text-primary">
                  <Lock className="w-3 h-3 text-bridge-gold" />
                  Piracy Protected
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">{service.title}</h1>

            {/* Seller Info */}
            <div className="flex items-center gap-3 mb-6">
              <img src={service.sellerAvatar} alt={service.sellerName} className="w-10 h-10 rounded-full object-cover border-2 border-bridge-primary/30" />
              <div>
                <button 
                  onClick={() => sellerSlug && goToSeller(sellerSlug)}
                  className="text-sm font-semibold text-text-primary hover:text-bridge-primary-light transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {service.sellerName}
                  <CheckCircle className="w-3.5 h-3.5 text-bridge-secondary" />
                </button>
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-bridge-gold fill-bridge-gold" />
                    {service.rating} ({service.reviewCount} reviews)
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-surface rounded-xl mb-6">
              {(['overview', 'gallery', 'reviews'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all capitalize cursor-pointer ${
                    activeTab === tab ? 'bg-bridge-primary text-white' : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-text-primary mb-3">Description</h3>
                  <p className="text-text-muted leading-relaxed">{service.description}</p>
                </div>

                <div className="glass rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-text-primary mb-4">What's Included</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-bridge-secondary flex-shrink-0" />
                        <span className="text-sm text-text-muted">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-text-primary mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-bridge-primary/10 text-bridge-primary-light text-xs rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="w-5 h-5 text-bridge-primary" />
                  <h3 className="text-lg font-bold text-text-primary">Demo Gallery</h3>
                  <span className="px-2 py-0.5 bg-bridge-gold/10 text-bridge-gold text-xs rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Protected
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="relative aspect-video bg-surface-elevated rounded-xl overflow-hidden watermark-overlay no-select">
                      <img 
                        src={service.thumbnail} 
                        alt="Demo" 
                        className="w-full h-full object-cover opacity-80"
                        onContextMenu={(e) => e.preventDefault()}
                        draggable={false}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white/20 text-lg font-bold rotate-[-30deg] tracking-widest">BRIDGE PREVIEW</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-text-muted mt-3 text-center">
                  🔒 All demo content is watermarked and protected against piracy. Full quality delivered after purchase.
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review.id} className="glass rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-bridge-primary to-bridge-secondary flex items-center justify-center text-white font-bold text-sm">
                        {review.userName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-text-primary">{review.userName}</h4>
                        <p className="text-xs text-text-muted">{review.date}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-1">
                        {Array.from({ length: review.rating }, (_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 text-bridge-gold fill-bridge-gold" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-text-muted">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Pricing Card */}
              <div className="glass rounded-2xl p-6 border border-border-subtle animate-pulse-glow">
                <div className="text-center mb-6">
                  <span className="text-sm text-text-muted">Starting at</span>
                  <div className="text-4xl font-black text-text-primary mt-1">
                    ৳{service.price.toLocaleString()}
                  </div>
                  <span className="text-sm text-text-muted">{service.currency}</span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted flex items-center gap-2"><Clock className="w-4 h-4" /> Delivery Time</span>
                    <span className="text-text-primary font-medium">{service.deliveryTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted flex items-center gap-2"><Star className="w-4 h-4" /> Rating</span>
                    <span className="text-text-primary font-medium">{service.rating}/5.0</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted flex items-center gap-2"><Shield className="w-4 h-4" /> Guarantee</span>
                    <span className="text-bridge-secondary font-medium">Money Back</span>
                  </div>
                </div>

                <button 
                  onClick={handleOrder}
                  className="w-full py-3.5 bg-gradient-to-r from-bridge-primary to-bridge-primary-light text-white font-bold rounded-xl hover:shadow-xl hover:shadow-bridge-primary/30 transition-all flex items-center justify-center gap-2 cursor-pointer mb-3"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Order Now
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={handleContactSeller}
                    className="py-2.5 glass border border-border-subtle text-text-primary text-sm font-medium rounded-xl hover:bg-background-soft transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat
                  </button>
                  <button className="py-2.5 glass border border-border-subtle text-text-primary text-sm font-medium rounded-xl hover:bg-background-soft transition-all flex items-center justify-center gap-1 cursor-pointer">
                    <Phone className="w-4 h-4" />
                    Call
                  </button>
                </div>
              </div>

              {/* Share Card */}
              <div className="glass rounded-2xl p-5">
                <h4 className="text-sm font-bold text-text-primary mb-3">Share This Service</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-surface-elevated border border-border-subtle rounded-lg text-xs text-text-muted"
                  />
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl);
                      setNotification('Link copied!');
                      setTimeout(() => setNotification(null), 3000);
                    }}
                    className="p-2 bg-bridge-primary/20 text-bridge-primary-light rounded-lg hover:bg-bridge-primary/30 transition-colors cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-text-muted mt-2">
                  📢 Share on Facebook, Instagram, or any platform. Customers will land directly on this service page.
                </p>
              </div>

              {/* Safety */}
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-bridge-secondary" />
                  <h4 className="text-sm font-bold text-text-primary">Buyer Protection</h4>
                </div>
                <ul className="space-y-2">
                  {['Secure payment processing', 'Money-back guarantee', 'Anti-piracy protection', '24/7 customer support'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-text-muted">
                      <CheckCircle className="w-3.5 h-3.5 text-bridge-secondary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
