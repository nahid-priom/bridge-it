import { Lock, Shield, Database, Headphones } from 'lucide-react';
import { TRUST_SECURITY_ITEMS } from '@/data/homeContent';

const ICONS = {
  lock: Lock,
  shield: Shield,
  database: Database,
  headphones: Headphones,
} as const;

export function TrustSecurityStrip() {
  return (
    <section
      className="border-y border-deshi-green/10 bg-transparent py-6 md:py-12"
      aria-labelledby="trust-strip-heading"
    >
      <h2 id="trust-strip-heading" className="sr-only">
        Trust and security
      </h2>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {TRUST_SECURITY_ITEMS.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <article key={item.title} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-deshi-green/15 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-deshi-green" aria-hidden />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary mb-1">{item.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{item.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
