'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonialsSectionContent } from '@/data/testimonials';
import type { PlatformTestimonial } from '@/types';

type TestimonialsProps = { testimonials: PlatformTestimonial[] };

export const Testimonials: React.FC<TestimonialsProps> = ({ testimonials: items }) => {
  const testimonials = useMemo(() => items, [items]);
  const { badgeEmoji, badgeLabel, title, titleHighlight, subtitle, autoRotateMs } =
    testimonialsSectionContent;

  const [active, setActive] = useState(0);
  const activeTestimonial = testimonials[active];

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, autoRotateMs);
    return () => clearInterval(timer);
  }, [testimonials.length, autoRotateMs]);

  if (!activeTestimonial) return null;

  return (
    <section className="py-8 md:py-16 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-bridge-pink/20 to-transparent"></div>
      <div className="absolute inset-0 hero-gradient opacity-30"></div>

      <div className="relative container  mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-bridge-pink/10 border border-bridge-pink/20 rounded-full text-bridge-pink text-xs font-semibold mb-3 uppercase tracking-wider">
            {badgeEmoji} {badgeLabel}
          </span>
          <h2 className="text-2xl md:text-4xl font-black font-display text-text-primary">
            {title} <span className="gradient-text">{titleHighlight}</span>
          </h2>
          {subtitle ? (
            <p className="text-text-muted text-sm mt-3 max-w-lg mx-auto">{subtitle}</p>
          ) : null}
        </div>

        <div className="max-w-3xl mx-auto mb-8">
          <div className="glass-card rounded-3xl p-8 md:p-10 text-center relative overflow-hidden">
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-[100px] opacity-20"
              style={{ background: activeTestimonial.accentColor }}
            />

            <Quote
              className="w-10 h-10 mx-auto mb-6 opacity-20"
              style={{ color: activeTestimonial.accentColor }}
            />

            <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-8 relative z-10">
              &ldquo;{activeTestimonial.comment}&rdquo;
            </p>

            <div className="flex items-center justify-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-text-primary font-bold text-lg overflow-hidden"
                style={{ background: activeTestimonial.accentColor }}
              >
                {activeTestimonial.avatarUrl ? (
                  <img
                    src={activeTestimonial.avatarUrl}
                    alt={activeTestimonial.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  activeTestimonial.name.charAt(0)
                )}
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-text-primary">{activeTestimonial.name}</h4>
                <p className="text-xs text-text-muted">{activeTestimonial.role}</p>
              </div>
              <div className="flex gap-0.5 ml-4">
                {Array.from({ length: activeTestimonial.rating }, (_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 text-bridge-gold fill-bridge-gold" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {testimonials.length > 1 && (
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() =>
                setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length)
              }
              className="p-2 glass rounded-full text-text-muted hover:text-text-primary cursor-pointer transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                    active !== i ? 'border-border-subtle' : ''
                  }`}
                  style={{
                    borderColor: active === i ? t.accentColor : undefined,
                    opacity: active === i ? 1 : 0.5,
                    transform: active === i ? 'scale(1.15)' : 'scale(1)',
                  }}
                  aria-label={`Show testimonial from ${t.name}`}
                  aria-current={active === i}
                >
                  <div
                    className="w-full h-full flex items-center justify-center text-text-primary font-bold text-xs"
                    style={{ background: t.accentColor }}
                  >
                    {t.name.charAt(0)}
                  </div>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setActive((prev) => (prev + 1) % testimonials.length)}
              className="p-2 glass rounded-full text-text-muted hover:text-text-primary cursor-pointer transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
