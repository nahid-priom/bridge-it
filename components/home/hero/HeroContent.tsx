import { Boxes, MonitorPlay, Wallet, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

const TRUST_POINTS: {
  label: string;
  Icon: LucideIcon;
  tone: 'websites' | 'software' | 'marketing';
}[] = [
  { label: 'Custom Solutions', Icon: Boxes, tone: 'websites' },
  { label: '500+ Live Demos', Icon: MonitorPlay, tone: 'software' },
  { label: 'Affordable Prices', Icon: Wallet, tone: 'marketing' },
];

export function HeroContent({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col items-center justify-center text-center',
        'motion-safe:opacity-0 motion-safe:[animation:hero-fade-up_0.55s_ease-out_forwards]',
        className
      )}
    >
      <span
        className={cn(
          'hero-eyebrow-pill inline-flex items-center rounded-full px-3.5 py-1.5',
          'text-xs font-semibold tracking-wide text-white sm:text-[13px]'
        )}
      >
        Everything Your Business Needs
      </span>

      <h1
        id="homepage-hero-heading"
        className={cn(
          'mt-5 max-w-[22rem] font-display font-extrabold tracking-[-0.035em] text-text-primary',
          'sm:mt-6 sm:max-w-[36rem] lg:max-w-[44rem]',
          'text-[clamp(1.85rem,7.2vw,3.35rem)] leading-[1.08]'
        )}
      >
        <span className="block text-text-primary">Websites, Software &amp;</span>
        <span className="hero-solutions-wave mt-0.5 block">Digital Marketing</span>
      </h1>

      <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-text-muted sm:mt-4 sm:text-base">
        Custom solutions built for your business.
      </p>

      <ul
        className={cn(
          'mt-6 grid w-full max-w-[22rem] grid-cols-3 items-start justify-items-center gap-x-2 sm:mt-7 sm:max-w-[32rem] sm:gap-x-4',
          'motion-safe:opacity-0 motion-safe:[animation:hero-fade-up_0.55s_ease-out_0.1s_forwards]'
        )}
      >
        {TRUST_POINTS.map(({ label, Icon, tone }) => (
          <li
            key={label}
            className="group flex w-full max-w-[7.5rem] flex-col items-center gap-2 text-center sm:max-w-[9rem] sm:gap-2.5"
          >
            <span
              className={cn('hero-benefit-icon shrink-0', `hero-benefit-icon--${tone}`)}
              aria-hidden
            >
              <Icon className="h-[1.125rem] w-[1.125rem] sm:h-5 sm:w-5" strokeWidth={2} />
            </span>
            <span className="text-balance text-[0.75rem] font-bold leading-snug tracking-[-0.015em] text-text-primary sm:text-[0.875rem] lg:text-[0.9375rem]">
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
