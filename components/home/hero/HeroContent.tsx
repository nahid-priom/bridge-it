import { Boxes, MonitorPlay, Wallet, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

const TRUST_POINTS: {
  lines: [string, string];
  Icon: LucideIcon;
  tone: 'websites' | 'software' | 'marketing';
}[] = [
  { lines: ['Custom', 'Solutions'], Icon: Boxes, tone: 'websites' },
  { lines: ['500+', 'Live Demos'], Icon: MonitorPlay, tone: 'software' },
  { lines: ['Affordable', 'Prices'], Icon: Wallet, tone: 'marketing' },
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
          'inline-flex items-center rounded-full px-3.5 py-1.5',
          'bg-gradient-to-r from-[#146BFF] via-[#14C8E6] to-[#21D47B]',
          'text-[11px] font-semibold tracking-wide text-white sm:text-xs'
        )}
      >
        Everything Your Business Needs
      </span>

      <h1
        id="homepage-hero-heading"
        className={cn(
          'mt-5 max-w-[22rem] font-display font-extrabold tracking-[-0.035em] text-text-primary',
          'sm:mt-6 sm:max-w-[34rem] lg:max-w-[40rem]',
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
          'mt-6 flex w-full max-w-[22rem] flex-row items-stretch gap-0 sm:mt-7 sm:max-w-[32rem]',
          'motion-safe:opacity-0 motion-safe:[animation:hero-fade-up_0.55s_ease-out_0.1s_forwards]'
        )}
      >
        {TRUST_POINTS.map(({ lines, Icon, tone }, index) => (
          <li
            key={lines.join(' ')}
            className={cn(
              'group flex min-w-0 flex-1 flex-col items-center gap-1.5 px-2 text-center sm:gap-2 sm:px-4',
              index > 0 && 'border-l border-border-subtle'
            )}
          >
            <span
              className={cn('hero-benefit-icon', `hero-benefit-icon--${tone}`)}
              aria-hidden
            >
              <Icon className="h-[1.125rem] w-[1.125rem] sm:h-6 sm:w-6" strokeWidth={2} />
            </span>
            <span className="text-[0.8125rem] font-bold leading-tight tracking-[-0.015em] text-text-primary sm:text-[1.0625rem]">
              {lines[0]}
              <br />
              {lines[1]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
