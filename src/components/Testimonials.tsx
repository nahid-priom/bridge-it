import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    name: 'Rahim Ahmed',
    role: 'Business Owner',
    comment: 'Bridge transformed how I find digital services. The quality of sellers and the anti-piracy protection gave me confidence to invest in premium animations for my brand.',
    rating: 5,
    color: '#6C3CE1',
  },
  {
    name: 'Fatima Khan',
    role: 'Marketing Manager',
    comment: 'The custom URL feature is a game-changer! I share my seller link on Facebook ads and customers land directly on my Bridge profile. Sales increased by 300%.',
    rating: 5,
    color: '#06D6A0',
  },
  {
    name: 'Karim Hassan',
    role: 'Freelancer',
    comment: 'As a video editor, Bridge gives me the perfect platform to showcase my work with watermark protection. The messaging system makes client communication so easy.',
    rating: 5,
    color: '#F59E0B',
  },
  {
    name: 'Nusrat Jahan',
    role: 'Startup Founder',
    comment: 'We got our entire website and app built through Bridge. The escrow payment system ensured quality delivery. Highly recommend for any digital project!',
    rating: 5,
    color: '#EC4899',
  },
];

export const Testimonials: React.FC = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 md:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-bridge-pink/20 to-transparent"></div>
      <div className="absolute inset-0 hero-gradient opacity-30"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-bridge-pink/10 border border-bridge-pink/20 rounded-full text-bridge-pink text-xs font-semibold mb-3 uppercase tracking-wider">
            💬 Testimonials
          </span>
          <h2 className="text-2xl md:text-4xl font-black font-display text-white">
            What Our <span className="gradient-text">Users Say</span>
          </h2>
        </div>

        {/* Featured Testimonial */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="glass-card rounded-3xl p-8 md:p-10 text-center relative overflow-hidden">
            {/* Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-[100px] opacity-20" style={{ background: testimonials[active].color }}></div>

            <Quote className="w-10 h-10 mx-auto mb-6 opacity-20" style={{ color: testimonials[active].color }} />

            <p className="text-base md:text-lg text-white/90 leading-relaxed mb-8 relative z-10">
              "{testimonials[active].comment}"
            </p>

            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ background: testimonials[active].color }}>
                {testimonials[active].name.charAt(0)}
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-white">{testimonials[active].name}</h4>
                <p className="text-xs text-bridge-gray">{testimonials[active].role}</p>
              </div>
              <div className="flex gap-0.5 ml-4">
                {Array.from({ length: testimonials[active].rating }, (_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 text-bridge-gold fill-bridge-gold" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length)} className="p-2 glass rounded-full text-white/50 hover:text-white cursor-pointer transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((t, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="w-10 h-10 rounded-full overflow-hidden border-2 transition-all cursor-pointer"
                style={{ borderColor: active === i ? t.color : 'rgba(255,255,255,0.1)', opacity: active === i ? 1 : 0.5, transform: active === i ? 'scale(1.15)' : 'scale(1)' }}
              >
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs" style={{ background: t.color }}>
                  {t.name.charAt(0)}
                </div>
              </button>
            ))}
          </div>
          <button onClick={() => setActive((prev) => (prev + 1) % testimonials.length)} className="p-2 glass rounded-full text-white/50 hover:text-white cursor-pointer transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
