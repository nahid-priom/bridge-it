import React from 'react';
import { useStore } from '../store/useStore';
import { ArrowLeft, Shield, Globe, Heart, Users, Award, Lock, MessageCircle, CreditCard, TrendingUp, CheckCircle } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setPage } = useStore();

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
      description: 'Escrow-based payment system ensures sellers get paid and buyers get quality work.',
      color: 'from-bridge-gold to-orange-500',
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: 'Real-time Communication',
      description: 'Built-in messaging and calling features for seamless buyer-seller interaction.',
      color: 'from-bridge-primary to-purple-500',
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: 'Multiple Payment Options',
      description: 'Support for bKash, Nagad, Rocket, bank transfer, and international cards.',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Custom URLs & Advertising',
      description: 'Each seller gets a unique URL for sharing on Facebook, Instagram, or any platform.',
      color: 'from-bridge-cyan to-blue-500',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Verified Sellers',
      description: 'All sellers go through a verification process to ensure quality and reliability.',
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
    <div className="min-h-screen pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => setPage('home')}
          className="flex items-center gap-2 text-bridge-gray hover:text-white transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Home
        </button>

        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-bridge-primary/10 border border-bridge-primary/20 rounded-full mb-6">
            <Heart className="w-4 h-4 text-bridge-accent" />
            <span className="text-sm text-bridge-primary-light">About Bridge</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-display text-white mb-6">
            Building the Future of
            <br />
            <span className="gradient-text">Digital Commerce</span>
          </h1>
          <p className="text-lg text-bridge-gray max-w-3xl mx-auto leading-relaxed">
            Bridge is Bangladesh's premier Smart Virtual IT Park — a revolutionary platform where digital 
            service providers and customers connect seamlessly. We're building the largest ecosystem for 
            digital products, creative services, and IT solutions.
          </p>
        </div>

        {/* Mission */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            { title: 'Our Mission', desc: 'To democratize access to quality digital services and empower every creator and business in Bangladesh.', icon: '🎯' },
            { title: 'Our Vision', desc: 'To become the largest trusted marketplace for digital services in South Asia, connecting millions of buyers and sellers.', icon: '🌟' },
            { title: 'Our Promise', desc: 'Guaranteed quality, secure transactions, piracy protection, and reliable customer support — every single time.', icon: '🤝' },
          ].map((item, i) => (
            <div key={i} className="glass rounded-2xl p-8 border border-white/5 text-center">
              <span className="text-4xl block mb-4">{item.icon}</span>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-sm text-bridge-gray leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-black font-display text-white text-center mb-12">
            What Makes <span className="gradient-text">Bridge</span> Special
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="glass rounded-2xl p-6 border border-white/5 card-hover">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-bridge-gray">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* For Sellers Section */}
        <div className="glass rounded-2xl p-8 md:p-12 border border-white/10 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-bridge-secondary/10 text-bridge-secondary text-sm font-medium rounded-full mb-4">
                For Sellers
              </span>
              <h2 className="text-3xl font-bold text-white mb-4">Grow Your Business with Bridge</h2>
              <p className="text-bridge-gray mb-6 leading-relaxed">
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
                  <li key={i} className="flex items-center gap-2 text-sm text-bridge-gray">
                    <CheckCircle className="w-4 h-4 text-bridge-secondary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => setPage('dashboard')}
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
                <div key={i} className="bg-bridge-dark-3 rounded-xl p-6 text-center">
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-bridge-gray">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-block glass rounded-2xl p-8 md:p-12 border border-bridge-primary/20 bg-gradient-to-r from-bridge-primary/5 to-bridge-secondary/5">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-bridge-gray mb-6 max-w-lg mx-auto">
              Join thousands of buyers and sellers on Bangladesh's smartest digital marketplace.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button 
                onClick={() => setPage('categories')}
                className="px-8 py-3 bg-gradient-to-r from-bridge-primary to-bridge-primary-light text-white font-semibold rounded-xl cursor-pointer"
              >
                Browse Services
              </button>
              <button 
                onClick={() => setPage('dashboard')}
                className="px-8 py-3 glass border border-white/10 text-white font-semibold rounded-xl cursor-pointer"
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
