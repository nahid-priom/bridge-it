import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/cn';
import { ROUTES } from '@/lib/routes';
import { HeroSearch } from '@/src/features/ecommerce-showcase/public/HeroSearch';

export function HeroActions({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex w-full min-w-0 flex-col items-center gap-3.5 sm:gap-4',
        'motion-safe:opacity-0 motion-safe:[animation:hero-fade-up_0.55s_ease-out_0.16s_forwards]',
        className
      )}
    >
      <HeroSearch
        className="w-full"
        variant="premium"
      />

      <Link
        href={`${ROUTES.explore}?type=websites`}
        className={cn(
          'hero-cta group inline-flex h-14 w-full items-center justify-center gap-2 rounded-[1.125rem]',
          'bg-bridge-primary px-5 text-[0.9375rem] font-semibold text-white sm:h-[3.75rem] sm:text-base',
          'shadow-[0_10px_28px_-10px_rgba(37,99,235,0.55)]',
          'transition-[background-color,box-shadow,transform] duration-200',
          'hover:bg-bridge-primary-dark hover:shadow-[0_12px_32px_-10px_rgba(37,99,235,0.65)]',
          'active:translate-y-px',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]',
          'motion-reduce:transition-none motion-reduce:hover:shadow-none'
        )}
      >
        Explore 500+ Live Demos
        <ArrowRight
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
          aria-hidden
        />
      </Link>

      <p className="flex items-center justify-center gap-1.5 text-xs text-text-muted sm:text-[0.8125rem]">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-deshi-green" aria-hidden />
        <span>Trusted by 500+ Businesses</span>
      </p>
    </div>
  );
}
