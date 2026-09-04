import Link from 'next/link';
import { Boxes, Code2, LayoutTemplate, Megaphone, MonitorPlay, Wallet } from 'lucide-react';
import { cn } from '@/lib/cn';
import { ROUTES } from '@/lib/routes';

const TRUST_POINTS = [
  { label: 'Custom Solutions', Icon: Boxes },
  { label: '500+ Live Demo', Icon: MonitorPlay },
  { label: 'Affordable Prices', Icon: Wallet },
] as const;

const CATEGORY_PILLS = [
  {
    label: 'Websites',
    href: `${ROUTES.explore}?type=websites`,
    Icon: LayoutTemplate,
    className:
      'border-bridge-primary/25 bg-[#DBEAFE] text-bridge-primary-dark hover:border-bridge-primary/50 hover:bg-[#BFDBFE] dark:border-bridge-primary/40 dark:bg-bridge-primary/20 dark:text-blue-200 dark:hover:bg-bridge-primary/30',
  },
  {
    label: 'Software',
    href: `${ROUTES.explore}?type=software`,
    Icon: Code2,
    className:
      'border-bridge-cyan/30 bg-[#CFFAFE] text-cyan-800 hover:border-bridge-cyan/55 hover:bg-[#A5F3FC] dark:border-bridge-cyan/40 dark:bg-bridge-cyan/20 dark:text-cyan-200 dark:hover:bg-bridge-cyan/30',
  },
  {
    label: 'Digital Marketing',
    href: `${ROUTES.explore}?type=marketing`,
    Icon: Megaphone,
    className:
      'border-bridge-secondary/30 bg-[#D1FAE5] text-emerald-800 hover:border-bridge-secondary/55 hover:bg-[#A7F3D0] dark:border-bridge-secondary/40 dark:bg-bridge-secondary/20 dark:text-emerald-200 dark:hover:bg-bridge-secondary/30',
  },
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
      <nav aria-label="Solution categories">
        <ul className="flex w-full flex-wrap items-center justify-center gap-1.5 lg:justify-start">
          {CATEGORY_PILLS.map(({ label, href, Icon, className: chipClass }) => (
            <li key={label}>
              <Link
                href={href}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-[-0.01em] shadow-[0_1px_0_rgba(15,23,42,0.04)] transition-colors sm:text-xs',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  chipClass
                )}
              >
                <Icon className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" strokeWidth={2.25} aria-hidden />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <h1
        id="homepage-hero-heading"
        className="mt-3 max-w-[22rem] font-display font-extrabold tracking-[-0.03em] text-text-primary sm:mt-2.5 sm:max-w-none lg:max-w-none"
      >
        <span className="block text-[clamp(1.55rem,5.2vw,1.85rem)] font-semibold leading-snug tracking-[-0.015em] text-text-secondary lg:text-[1.75rem]">
          Build Your Business with
        </span>
        <span className="hero-solutions-wave mt-2 block text-[clamp(2.25rem,8.5vw,2.85rem)] leading-[1.1] lg:mt-2 lg:text-[clamp(2.35rem,2.9vw,2.95rem)] lg:leading-[1.08]">
          Complete Digital Solutions
        </span>
      </h1>

      <ul
        className={cn(
          'mt-6 flex w-full max-w-[22rem] flex-row items-stretch gap-0 sm:mt-5 sm:max-w-[34rem]',
          'motion-safe:opacity-0 motion-safe:[animation:hero-fade-up_0.55s_ease-out_0.12s_forwards]'
        )}
      >
        {TRUST_POINTS.map(({ label, Icon }, index) => (
          <li
            key={label}
            className={cn(
              'flex min-w-0 flex-1 flex-col items-center gap-2 px-2 text-center sm:px-4 sm:first:pl-0 sm:last:pr-0',
              index > 0 && 'border-l border-border-subtle'
            )}
          >
            <span className={cn('hero-trust-icon', `hero-trust-icon--${index + 1}`)} aria-hidden>
              <Icon className="hero-trust-icon__glyph h-4 w-4" strokeWidth={2.25} />
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
