'use client';

import { HOW_IT_WORKS_STEPS } from '@/data/homeContent';
import { BRANDING } from '@/lib/config/branding';

export function HowDeshiFiverrWorks() {
  return (
    <section
      id="how-it-works"
      className="py-12 md:py-20 bg-background-soft/50 dark:bg-background-soft/30"
      aria-labelledby="how-it-works-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="how-it-works-heading"
          className="text-2xl md:text-3xl font-black font-display text-text-primary text-center mb-10 md:mb-14"
        >
          How {BRANDING.appName} Works
        </h2>

        <div className="relative max-w-5xl mx-auto">
          <div
            className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-0.5 border-t-2 border-dashed border-deshi-green/30"
            aria-hidden
          />
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <li key={step.num} className="relative flex flex-col items-center text-center">
                <div
                  className="w-12 h-12 rounded-full bg-deshi-green text-white font-black text-lg flex items-center justify-center shadow-lg shadow-deshi-green/30 mb-4 relative z-10"
                  aria-hidden
                >
                  {step.num}
                </div>
                <h3 className="text-sm font-bold text-text-primary mb-2">{step.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed max-w-[200px]">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
