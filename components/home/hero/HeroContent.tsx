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
          'mt-6 flex w-full max-w-[36rem] flex-row items-center justify-center gap-0 sm:mt-7 sm:max-w-[44rem] lg:max-w-[52rem]',
          'motion-safe:opacity-0 motion-safe:[animation:hero-fade-up_0.55s_ease-out_0.1s_forwards]'
        )}
      >
        {TRUST_POINTS.map(({ label, Icon, tone }, index) => (
          <li
            key={label}
            className={cn(
              'group flex min-w-0 flex-1 items-center justify-center gap-2 px-2.5 py-1 sm:gap-2.5 sm:px-4',
              index > 0 && 'border-l border-border-subtle'
            )}
          >
            <span
              className={cn('hero-benefit-icon shrink-0', `hero-benefit-icon--${tone}`)}
              aria-hidden
            >
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
            </span>
            <span className="whitespace-nowrap text-left text-[0.8125rem] font-bold leading-none tracking-[-0.015em] text-text-primary sm:text-[0.9375rem] lg:text-base">
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
