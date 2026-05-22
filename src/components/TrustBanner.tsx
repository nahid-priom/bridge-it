import React from 'react';
import { Shield, Lock, CreditCard, Clock, Headphones, Star, Users, Zap } from 'lucide-react';

export const TrustBanner: React.FC = () => {
  const items = [
    { icon: <Shield className="w-4 h-4" />, text: 'Verified Sellers' },
    { icon: <Lock className="w-4 h-4" />, text: 'Anti-Piracy' },
    { icon: <CreditCard className="w-4 h-4" />, text: 'Secure Payment' },
    { icon: <Clock className="w-4 h-4" />, text: 'On-Time Delivery' },
    { icon: <Headphones className="w-4 h-4" />, text: '24/7 Support' },
    { icon: <Star className="w-4 h-4" />, text: '4.9★ Rating' },
    { icon: <Users className="w-4 h-4" />, text: '2,500+ Sellers' },
    { icon: <Zap className="w-4 h-4" />, text: 'Instant Setup' },
  ];

  return (
    <div className="py-5 border-y border-white/[0.04] bg-bridge-dark-2/30 overflow-hidden">
      <div className="flex animate-marquee gap-8 whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-bridge-gray/70 flex-shrink-0">
            <span className="text-bridge-primary/60">{item.icon}</span>
            <span className="text-xs font-medium">{item.text}</span>
            <span className="text-bridge-dark-3 ml-4">•</span>
          </div>
        ))}
      </div>
    </div>
  );
};
