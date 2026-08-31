'use client';

import { Layers, Award, Clock, Wallet } from 'lucide-react';
import { WHY_BRIDGE_IT_PARK } from '@/data/homeContent';

const ICON_MAP = {
  layers: Layers,
  award: Award,
  clock: Clock,
  wallet: Wallet,
} as const;

export function WhyBridgeItParkSection() {
  return (
    <section className="py-12 md:py-20 bg-surface" aria-labelledby="benefits-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="benefits-heading"
          className="text-2xl md:text-3xl font-black font-display text-text-primary text-center mb-10 md:mb-12"
        >
          Why <span className="text-deshi-green">Bridge IT Park</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {WHY_BRIDGE_IT_PARK.map((benefit) => {
            const Icon = ICON_MAP[benefit.icon];
            return (
              <article key={benefit.title} className="text-center px-2">
                <div
                  className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${benefit.color}18` }}
                >
                  <Icon className="w-7 h-7" style={{ color: benefit.color }} aria-hidden />
                </div>
                <h3 className="text-base font-bold text-text-primary mb-2">{benefit.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{benefit.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
