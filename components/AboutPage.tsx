'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { ArrowLeft, Shield, Globe, Heart, Users, Award, Lock, MessageCircle, CreditCard, TrendingUp, CheckCircle } from 'lucide-react';
import { BRANDING } from '@/lib/config/branding';

export const AboutPage: React.FC = () => {
  const { goHome, goToDashboard, goToCategories } = useAppNavigation();

  const features = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Virtual IT Park',
      description: 'A complete digital ecosystem where all IT services and products converge in one smart platform.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Anti-Piracy Protection',
      description: 'All demos and previews are watermarked and DRM-protected to prevent unauthorized copying.',
      color: 'from-bridge-secondary to-emerald-500',
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'Secure Payments',
      description: 'Transparent pricing and milestone-based project delivery with secure payment options.',
      color: 'from-bridge-gold to-orange-500',
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: 'Dedicated Support',
      description: 'Direct communication with Bridge IT Park from consultation through delivery and launch.',
      color: 'from-bridge-primary to-blue-500',
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: 'Multiple Payment Options',
      description: 'Support for bKash, Nagad, Rocket, bank transfer, and international cards.',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Live Solution Demos',
      description: 'Try interactive software and e-commerce demos before you commit to a package.',
      color: 'from-bridge-cyan to-blue-500',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Expert Delivery',
      description: 'In-house specialists across software, web, marketing, and design — no freelancer roulette.',
      color: 'from-bridge-accent to-red-600',
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Quality Guarantee',
      description: 'Money-back guarantee if the delivered work doesn\'t meet the agreed requirements.',
      color: 'from-emerald-400 to-teal-500',
    },
  ];

  return (
    <div className="min-h-screen pb-20">
      <div className="container  mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-bridge-primary/10 border border-bridge-primary/20 rounded-full mb-6">
            <Heart className="w-4 h-4 text-bridge-accent" />
            <span className="text-sm text-bridge-primary-light">About {BRANDING.appName}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-display text-text-primary mb-6">
            Building the Future of
            <br />
            <span className="gradient-text">Digital Commerce</span>
          </h1>
          <p className="text-lg text-text-muted max-w-3xl mx-auto leading-relaxed">
            {BRANDING.appName} delivers software, websites, digital marketing, and creative solutions
            for growing businesses. We help you build, market, and grow — all in one trusted partner.
          </p>
        </header>

        {/* Mission */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            { title: 'Our Mission', desc: 'To give growing businesses in Bangladesh access to professional software, web, marketing, and creative solutions — delivered by one trusted partner.', icon: '🎯' },
            { title: 'Our Vision', desc: 'To become the leading digital solutions partner for SMEs across South Asia — build, market, and grow in one place.', icon: '🌟' },
            { title: 'Our Promise', desc: 'Clear pricing, live demos where available, secure delivery, and dedicated support from order to launch.', icon: '🤝' },
          ].map((item, i) => (
            <div key={i} className="glass rounded-2xl p-8 border border-border-subtle text-center">
              <span className="text-4xl block mb-4">{item.icon}</span>
              <h3 className="text-xl font-bold text-text-primary mb-3">{item.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-black font-display text-text-primary text-center mb-12">
            What Makes <span className="gradient-text">{BRANDING.appName}</span> Special
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="glass rounded-2xl p-6 border border-border-subtle card-hover">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-sm text-text-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* For Sellers Section */}
        <div className="glass rounded-2xl p-8 md:p-12 border border-border-subtle mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-bridge-secondary/10 text-bridge-secondary text-sm font-medium rounded-full mb-4">
                For Sellers
              </span>
              <h2 className="text-3xl font-bold text-text-primary mb-4">Grow Your Business with {BRANDING.appName}</h2>
              <p className="text-text-muted mb-6 leading-relaxed">
                Set up your shop, showcase your portfolio with piracy-protected demos, and reach thousands 
                of potential customers. Get your own custom URL to share anywhere — Facebook, Instagram, 
                WhatsApp, or any ad platform.
              </p>
              <ul className="space-y-3">
                {[
                  'Free seller account setup',
                  'Custom URL for external advertising',
                  'Anti-piracy watermarked gallery',
                  'Built-in messaging & calling',
                  'Analytics & revenue tracking',
                  'Secure payment processing',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-text-muted">
                    <CheckCircle className="w-4 h-4 text-bridge-secondary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button 
                onClick={goToDashboard}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-bridge-primary to-bridge-primary-light text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-bridge-primary/30 transition-all cursor-pointer"
              >
                Start Selling Today →
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Active Sellers', value: '2,500+' },
                { label: 'Monthly Revenue', value: '৳5Cr+' },
                { label: 'Avg. Rating', value: '4.9/5' },
                { label: 'Countries', value: '15+' },
              ].map((stat, i) => (
                <div key={i} className="bg-surface-elevated rounded-xl p-6 text-center">
                  <div className="text-2xl font-bold text-text-primary mb-1">{stat.value}</div>
                  <div className="text-xs text-text-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-block glass rounded-2xl p-8 md:p-12 border border-bridge-primary/20 bg-gradient-to-r from-bridge-primary/5 to-bridge-secondary/5">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">Ready to Get Started?</h2>
            <p className="text-text-muted mb-6 max-w-lg mx-auto">
              Join businesses across Bangladesh who trust {BRANDING.appName} for digital solutions.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button 
                onClick={goToCategories}
                className="px-8 py-3 bg-gradient-to-r from-bridge-primary to-bridge-primary-light text-white font-semibold rounded-xl cursor-pointer"
              >
                Browse Services
              </button>
              <button 
                onClick={goToDashboard}
                className="px-8 py-3 glass border border-border-subtle text-text-primary font-semibold rounded-xl cursor-pointer"
              >
                Start Selling
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
