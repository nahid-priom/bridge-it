import { ShieldCheck, Smartphone, Zap } from 'lucide-react';
import { cn } from '@/lib/cn';

const CHIPS = [
  {
    id: 'industries',
    icon: ShieldCheck,
    label: (
      <>
        20+ Industries
        <br />
        Covered
      </>
    ),
    className: 'left-[4%] top-[8%] lg:left-[2%] lg:top-[6%]',
  },
  {
    id: 'mobile',
    icon: Smartphone,
    label: (
      <>
        100% Mobile
        <br />
        Responsive
      </>
    ),
    className: 'bottom-[14%] left-[18%] lg:bottom-[12%] lg:left-[16%]',
  },
  {
    id: 'seo',
    icon: Zap,
    label: (
      <>
        Fast & SEO
        <br />
        Optimized
      </>
    ),
    className: 'bottom-[10%] right-[4%] lg:bottom-[8%] lg:right-[2%]',
  },
] as const;

export function EcommerceHeroShowcase({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative mx-auto w-full min-w-0 max-w-xl lg:max-w-none',
        'motion-safe:opacity-0 motion-safe:[animation:hero-fade-scale_0.7s_ease-out_0.1s_forwards]',
        className
      )}
    >
      {/* Dark well so the asset stays premium in light theme */}
      <div className="relative overflow-hidden rounded-2xl bg-[#05080c] ring-1 ring-white/5 lg:overflow-visible lg:rounded-none lg:bg-transparent lg:ring-0">
        {/* Soft Bridge Blue ground ellipse */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[6%] left-1/2 z-0 h-[30%] w-[72%] -translate-x-1/2 rounded-[100%] bg-[#2563eb]/20 blur-3xl"
        />

        <div className="relative z-[1] mx-auto aspect-[3/4] w-full max-w-md lg:aspect-[3/2] lg:max-w-none">
          <picture>
            <source
              media="(max-width: 1023px)"
              srcSet="/images/ecommerce/hero-ecommerce-showcase-mobile.avif"
              type="image/avif"
            />
            <source
              media="(max-width: 1023px)"
              srcSet="/images/ecommerce/hero-ecommerce-showcase-mobile.webp"
              type="image/webp"
            />
            <source srcSet="/images/ecommerce/hero-ecommerce-showcase.avif" type="image/avif" />
            <source srcSet="/images/ecommerce/hero-ecommerce-showcase.webp" type="image/webp" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/ecommerce/hero-ecommerce-showcase.webp"
              alt="Premium responsive E-commerce website design showcase"
              width={1536}
              height={1024}
              decoding="async"
              loading="eager"
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-contain object-center"
              sizes="(min-width: 1024px) 55vw, 92vw"
            />
          </picture>
        </div>

        {/* HTML trust chips — desktop only; mobile asset stays uncluttered */}
        <ul className="pointer-events-none absolute inset-0 z-[2] hidden lg:block" aria-label="Showcase highlights">
          {CHIPS.map((chip, index) => {
            const Icon = chip.icon;
            return (
              <li
                key={chip.id}
                className={cn(
                  'absolute flex items-center gap-2 rounded-xl border border-white/10 bg-[#0b1220]/92 px-3 py-2 text-[11px] font-semibold leading-tight text-white shadow-lg backdrop-blur-sm',
                  'motion-safe:opacity-0 motion-safe:[animation:hero-fade-up_0.5s_ease-out_forwards]',
                  chip.className
                )}
                style={{ animationDelay: `${220 + index * 120}ms` }}
              >
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#2563eb]/15 text-[#60a5fa]">
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                </span>
                <span>{chip.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
