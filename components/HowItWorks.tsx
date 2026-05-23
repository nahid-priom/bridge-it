'use client';

import React from 'react';
import { Search, ShieldCheck, CreditCard, Package, MessageCircle, Star } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Search className="w-6 h-6" />,
      title: 'Browse & Search',
      titleBn: 'খুঁজুন',
      description: 'Explore categories or search for specific digital services and products.',
      color: '#3B82F6',
      num: '01',
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: 'Verify & Review',
      titleBn: 'যাচাই করুন',
      description: 'Check seller profiles, reviews and watermark-protected demo galleries.',
      color: '#8B5CF6',
      num: '02',
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'Connect & Discuss',
      titleBn: 'যোগাযোগ',
      description: 'Chat or call sellers directly. Discuss requirements before ordering.',
      color: '#06D6A0',
      num: '03',
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: 'Secure Payment',
      titleBn: 'নিরাপদ পেমেন্ট',
      description: 'Pay securely. Funds are held in escrow until you approve the work.',
      color: '#F59E0B',
      num: '04',
    },
    {
      icon: <Package className="w-6 h-6" />,
      title: 'Get Delivery',
      titleBn: 'ডেলিভারি',
      description: 'Receive your digital product, review it and request revisions.',
      color: '#EC4899',
      num: '05',
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Rate & Review',
      titleBn: 'রেটিং দিন',
      description: 'Share your experience by rating and reviewing the seller.',
      color: '#F59E0B',
      num: '06',
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-8 md:py-16 relative overflow-hidden"
      aria-labelledby="how-it-works-heading"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-bridge-cyan/20 to-transparent"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-bridge-primary/5 rounded-full blur-[200px]"></div>

      <div className="relative container  mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-bridge-cyan/10 border border-bridge-cyan/20 rounded-full text-bridge-cyan text-xs font-semibold mb-3 uppercase tracking-wider">
            🛤️ Simple Process
          </span>
          <h2
            id="how-it-works-heading"
            className="text-2xl md:text-4xl font-black font-display text-text-primary mb-3"
          >
            How <span className="gradient-text">Bridge</span> Works
          </h2>
          <p className="text-text-muted text-sm max-w-lg mx-auto">
            From discovery to delivery — hassle-free for buyers and sellers
          </p>
        </div>

        {/* Steps - Alternating Timeline on large screens */}
        <div className="relative max-w-4xl mx-auto">
          {/* Center Line (desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-bridge-primary/30 via-bridge-secondary/20 to-bridge-gold/30 -translate-x-1/2"></div>

          <div className="space-y-4 md:space-y-0">
            {steps.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div key={i} className="relative md:flex items-center">
                  {/* Timeline Dot (desktop) */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-text-primary text-xs font-black shadow-lg"
                      style={{ background: step.color, boxShadow: `0 0 20px ${step.color}40` }}
                    >
                      {step.num}
                    </div>
                  </div>

                  {/* Card */}
                  <div className={`md:w-1/2 ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12 md:ml-auto'}`}>
                    <div className="glass-card rounded-2xl p-5 md:p-6 card-hover">
                      <div className={`flex items-center gap-3 mb-3 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                        {/* Number badge (mobile only) */}
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-text-primary flex-shrink-0 md:hidden"
                          style={{ background: step.color }}
                        >
                          <span className="text-xs font-black">{step.num}</span>
                        </div>
                        {/* Icon */}
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: `${step.color}15`, border: `1px solid ${step.color}25` }}
                        >
                          <span style={{ color: step.color }}>{step.icon}</span>
                        </div>
                        <div className={isLeft ? 'md:text-right' : ''}>
                          <h3 className="text-sm md:text-base font-bold text-text-primary">{step.title}</h3>
                          <p className="text-[10px] text-bridge-primary-light font-medium">{step.titleBn}</p>
                        </div>
                      </div>
                      <p className={`text-xs text-text-muted leading-relaxed ${isLeft ? 'md:text-right' : ''}`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
