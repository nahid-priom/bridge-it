'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { PageFallback } from './PageFallback';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { getServiceSlug } from '@/lib/slugs';
import type { Category, Seller, Service } from '@/types';
import { Star, MapPin, CheckCircle, Clock, ArrowLeft, MessageCircle, Phone, ExternalLink, Copy, Shield, Calendar, Award } from 'lucide-react';

type SellerProfileProps = {
  seller: Seller;
  services: Service[];
  categories: Category[];
};

export const SellerProfile: React.FC<SellerProfileProps> = ({ seller, services: sellerServices, categories }) => {
  const { setNotification } = useStore();
  const { goHome, goToService } = useAppNavigation();

  const cat = categories.find((c) => c.id === seller.category);

  return (
    <article className="min-h-screen pb-20">
      <div className="container  mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cover & Profile */}
        <div className="relative rounded-2xl overflow-hidden mb-8">
          <img src={seller.coverImage} alt={seller.name} className="w-full h-48 md:h-64 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="relative">
                <img src={seller.avatar} alt={seller.name} className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border-4 border-bridge-dark" />
                {seller.verified && (
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-bridge-secondary rounded-full flex items-center justify-center border-3 border-bridge-dark">
                    <CheckCircle className="w-4 h-4 text-text-primary" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-text-primary">{seller.name}</h1>
                  <span className="px-2 py-0.5 bg-bridge-secondary/20 text-bridge-secondary text-xs font-medium rounded-full">Verified</span>
                </div>
                <p className="text-text-muted">{seller.tagline}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2.5 bg-bridge-primary text-white font-medium rounded-xl hover:bg-bridge-primary-light transition-colors flex items-center gap-2 cursor-pointer">
                  <MessageCircle className="w-4 h-4" /> Message
                </button>
                <button className="px-4 py-2.5 glass border border-border-subtle text-text-primary font-medium rounded-xl hover:bg-background-soft transition-colors flex items-center gap-2 cursor-pointer">
                  <Phone className="w-4 h-4" /> Call
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Info */}
          <div className="space-y-4">
            {/* Stats */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-text-primary mb-4">Overview</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted flex items-center gap-2"><Star className="w-4 h-4 text-bridge-gold" /> Rating</span>
                  <span className="text-sm font-bold text-text-primary">{seller.rating}/5.0 ({seller.reviewCount})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted flex items-center gap-2"><Award className="w-4 h-4 text-bridge-secondary" /> Projects</span>
                  <span className="text-sm font-bold text-text-primary">{seller.completedProjects}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted flex items-center gap-2"><Clock className="w-4 h-4 text-bridge-cyan" /> Response</span>
                  <span className="text-sm font-bold text-text-primary">{seller.responseTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted flex items-center gap-2"><MapPin className="w-4 h-4 text-bridge-accent" /> Location</span>
                  <span className="text-sm text-text-primary">{seller.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted flex items-center gap-2"><Calendar className="w-4 h-4 text-bridge-pink" /> Joined</span>
                  <span className="text-sm text-text-primary">{seller.joinedDate}</span>
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-text-primary mb-3">Specialty</h3>
              <div className="flex items-center gap-2 px-3 py-2 bg-bridge-primary/10 rounded-xl">
                <span className="text-xl">{cat?.icon}</span>
                <span className="text-sm font-medium text-text-primary">{cat?.name}</span>
              </div>
            </div>

            {/* Custom URL */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-bridge-primary" /> Custom URL
              </h3>
              <div className="flex items-center gap-2">
                <input type="text" value={seller.customUrl} readOnly className="flex-1 px-3 py-2 bg-surface-elevated border border-border-subtle rounded-lg text-xs text-text-muted" />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(seller.customUrl);
                    setNotification('Seller URL copied!');
                    setTimeout(() => setNotification(null), 3000);
                  }}
                  className="p-2 bg-bridge-primary/20 text-bridge-primary-light rounded-lg cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-text-muted mt-2">
                Share this link on Facebook, Instagram, or any platform to bring customers directly here.
              </p>
            </div>

            {/* About */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-text-primary mb-3">About</h3>
              <p className="text-sm text-text-muted leading-relaxed">{seller.description}</p>
            </div>
          </div>

          {/* Right - Services & Gallery */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold text-text-primary">Services by {seller.name}</h3>
            
            {sellerServices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sellerServices.map(service => (
                  <div
                    key={service.id}
                    onClick={() => goToService(service)}
                    className="glass rounded-2xl overflow-hidden border border-border-subtle hover:border-border-subtle card-hover cursor-pointer"
                  >
                    <div className="relative aspect-video watermark-overlay">
                      <img src={service.thumbnail} alt={service.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
                    </div>
                    <div className="p-4">
                      <h4 className="text-sm font-bold text-text-primary mb-2 line-clamp-2">{service.title}</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-bridge-gold fill-bridge-gold" />
                          <span className="text-xs font-bold text-text-primary">{service.rating}</span>
                        </div>
                        <span className="text-lg font-bold text-text-primary">৳{service.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass rounded-2xl p-12 text-center">
                <Shield className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <p className="text-text-muted">This seller's full service catalog is coming soon.</p>
              </div>
            )}

            {/* Gallery Section */}
            <div>
              <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                Portfolio Gallery
                <span className="px-2 py-0.5 bg-bridge-gold/10 text-bridge-gold text-xs rounded-full">🔒 Protected</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="relative aspect-square bg-surface-elevated rounded-xl overflow-hidden watermark-overlay no-select group">
                    <img 
                      src={seller.coverImage} 
                      alt="Portfolio" 
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                      onContextMenu={(e) => e.preventDefault()}
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
