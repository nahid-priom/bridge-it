'use client';

import { Star, Quote } from 'lucide-react';
import type { PlatformTestimonial } from '@/types';
import { mergeTestimonials } from '@/data/homeContent';

type ClientTestimonialsProps = {
  testimonials: PlatformTestimonial[];
};

export function ClientTestimonials({ testimonials }: ClientTestimonialsProps) {
  const items = mergeTestimonials(testimonials);

  return (
    <section className="bg-transparent py-12 md:py-16" aria-labelledby="testimonials-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="testimonials-heading"
          className="text-2xl md:text-3xl font-black font-display text-text-primary text-center mb-10"
        >
          What Our Clients Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 max-w-5xl mx-auto">
          {items.slice(0, 3).map((t) => (
            <article
              key={t.id}
              className="rounded-2xl bg-surface border border-slate-100 dark:border-white/10 p-6 shadow-sm"
            >
              <Quote className="w-8 h-8 text-deshi-green/30 mb-4" aria-hidden />
              <p className="text-sm text-text-secondary leading-relaxed mb-6">
                &ldquo;{t.comment}&rdquo;
              </p>
              <div className="flex gap-0.5 mb-3" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                  />
                ))}
              </div>
              <p className="text-sm font-bold text-text-primary">{t.name}</p>
              <p className="text-xs text-text-muted">{t.role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
