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
    <section
      className="scroll-mt-[calc(var(--header-offset)+0.75rem)] border-t border-border-subtle/70 bg-surface py-16 md:py-24"
      aria-labelledby="benefits-heading"
    >
      <div className="mx-auto w-full max-w-[1480px] px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10">
        <h2
          id="benefits-heading"
          className="mb-10 text-center font-display text-2xl font-bold tracking-[-0.02em] text-text-primary md:mb-14 md:text-3xl"
        >
          Why Businesses Choose Us
        </h2>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 md:gap-10">
          {WHY_BRIDGE_IT_PARK.map((benefit) => {
            const Icon = ICON_MAP[benefit.icon];
            return (
              <article key={benefit.title} className="text-center px-2">
                <div
                  className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${benefit.color}18` }}
                >
                  <Icon className="h-7 w-7" style={{ color: benefit.color }} aria-hidden />
                </div>
                <h3 className="mb-2 text-base font-bold text-text-primary">{benefit.title}</h3>
                <p className="text-sm leading-relaxed text-text-secondary">{benefit.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
