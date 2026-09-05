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

      <ul
        className={cn(
          'mt-5 grid w-full max-w-[28rem] grid-cols-3 items-stretch justify-items-stretch gap-2.5 sm:mt-6 sm:max-w-[40rem] sm:gap-3.5 lg:max-w-[46rem] lg:gap-4',
          'motion-safe:opacity-0 motion-safe:[animation:hero-fade-up_0.55s_ease-out_0.1s_forwards]'
        )}
      >
        {TRUST_POINTS.map(({ label, Icon, tone }) => (
          <li
            key={label}
            className={cn(
              'group flex w-full flex-col items-center gap-1.5 rounded-xl',
              'px-1.5 py-3.5 text-center sm:gap-2 sm:rounded-2xl sm:px-2.5 sm:py-4'
            )}
          >
            <span
              className={cn('hero-benefit-icon shrink-0', `hero-benefit-icon--${tone}`)}
              aria-hidden
            >
              <Icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.75} />
            </span>
            <span className="whitespace-nowrap text-[0.625rem] font-bold leading-none tracking-[-0.02em] text-text-primary sm:text-[0.75rem] lg:text-[0.8125rem]">
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
