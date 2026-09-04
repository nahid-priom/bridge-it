import { Boxes, MonitorPlay, Wallet } from 'lucide-react';
import { cn } from '@/lib/cn';

const TRUST_POINTS = [
  { label: 'Custom Solutions', Icon: Boxes, iconTone: 'websites' },
  { label: '500+ Live Demo', Icon: MonitorPlay, iconTone: 'software' },
  { label: 'Affordable Prices', Icon: Wallet, iconTone: 'marketing' },
] as const;

export function HeroContent({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col justify-center',
        'items-center text-center lg:items-start lg:text-left',
        'motion-safe:opacity-0 motion-safe:[animation:hero-fade-up_0.55s_ease-out_forwards]',
        className
      )}
    >
      <h1
        id="homepage-hero-heading"
        className="max-w-[22rem] font-display font-extrabold tracking-[-0.03em] text-text-primary sm:max-w-none lg:max-w-none"
      >
        <span className="block text-[clamp(1.55rem,5.2vw,1.85rem)] font-semibold leading-snug tracking-[-0.015em] text-slate-500 dark:text-slate-200/90 lg:text-[1.75rem]">
          Build Your Business with
        </span>
        <span className="hero-solutions-wave mt-1.5 block text-[clamp(2.25rem,8.5vw,2.85rem)] leading-[1.1] lg:mt-1.5 lg:text-[clamp(2.35rem,2.9vw,2.95rem)] lg:leading-[1.08]">
          Complete Digital Solutions
        </span>
      </h1>

      <ul
        className={cn(
          'mt-6 flex w-full max-w-[22rem] flex-row items-stretch gap-0 sm:mt-5 sm:max-w-[34rem]',
          'motion-safe:opacity-0 motion-safe:[animation:hero-fade-up_0.55s_ease-out_0.12s_forwards]'
        )}
      >
        {TRUST_POINTS.map(({ label, Icon, iconTone }, index) => (
          <li
            key={label}
            className={cn(
              'group flex min-w-0 flex-1 flex-col items-center gap-2 px-2 text-center sm:px-4 sm:first:pl-0 sm:last:pr-0',
              index > 0 && 'border-l border-border-subtle'
            )}
          >
            <span
              className={cn('main-category-icon', `main-category-icon--${iconTone}`)}
              aria-hidden
            >
              <span className="main-category-icon__spark main-category-icon__spark--a" />
              <span className="main-category-icon__spark main-category-icon__spark--b" />
              <Icon className="main-category-icon__glyph h-4 w-4" strokeWidth={2.35} />
            </span>
            <span className="text-[12px] font-semibold tracking-[-0.01em] text-text-primary sm:text-sm">
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
