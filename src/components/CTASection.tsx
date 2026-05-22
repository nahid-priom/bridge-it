import React from 'react';
import { useStore } from '../store/useStore';
import { ArrowRight, Sparkles, Shield, Globe, Rocket, Users, TrendingUp } from 'lucide-react';

export const CTASection: React.FC = () => {
  const { setPage } = useStore();

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-bridge-primary/15 via-bridge-dark to-bridge-secondary/10"></div>
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-bridge-primary/8 rounded-full blur-[180px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-bridge-secondary/6 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 md:p-14 text-center relative overflow-hidden border border-bridge-primary/10">
          {/* Decorative Elements */}
          <div className="absolute top-6 left-6 w-16 h-16 border border-bridge-primary/10 rounded-2xl rotate-12 opacity-30"></div>
          <div className="absolute bottom-8 right-8 w-12 h-12 border border-bridge-secondary/10 rounded-full opacity-30"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-bridge-gold/10 border border-bridge-gold/20 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-bridge-gold" />
              <span className="text-xs text-bridge-gold font-semibold uppercase tracking-wider">Join the Revolution</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black font-display text-white mb-4 leading-tight">
              Start Your Journey on
              <br />
              <span className="gradient-text">Bridge</span> Today
            </h2>

            <p className="text-sm md:text-base text-bridge-gray max-w-xl mx-auto mb-8 leading-relaxed">
              Whether you're a buyer looking for quality digital services or a seller wanting to grow your business — Bridge is built for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
              <button
                onClick={() => setPage('categories')}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-bridge-primary to-bridge-primary-light text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-bridge-primary/30 hover:-translate-y-1 transition-all cursor-pointer"
              >
                <Globe className="w-5 h-5" />
                Explore Services
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => setPage('dashboard')}
                className="flex items-center justify-center gap-2 px-8 py-4 glass border border-white/15 text-white font-bold rounded-2xl hover:bg-white/10 hover:-translate-y-1 transition-all cursor-pointer"
              >
                <Rocket className="w-5 h-5" />
                Become a Seller
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { icon: <Users className="w-4 h-4" />, value: '2,500+', label: 'Sellers' },
                { icon: <Shield className="w-4 h-4" />, value: '50K+', label: 'Orders' },
                { icon: <TrendingUp className="w-4 h-4" />, value: '98%', label: 'Satisfaction' },
                { icon: <Globe className="w-4 h-4" />, value: '15+', label: 'Countries' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="flex items-center justify-center gap-1 text-bridge-primary-light mb-1">{stat.icon}</div>
                  <div className="text-xl font-black text-white">{stat.value}</div>
                  <div className="text-[10px] text-bridge-gray">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
