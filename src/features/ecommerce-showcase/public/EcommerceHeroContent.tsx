import { cn } from '@/lib/cn';
import { HeroActions } from './HeroActions';
import { HeroSearch } from './HeroSearch';

export function EcommerceHeroContent({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col justify-center motion-safe:opacity-0 motion-safe:[animation:hero-fade-up_0.55s_ease-out_forwards]',
        className
      )}
    >
      <h1 className="font-display tracking-[-0.035em] text-text-primary">
        <span className="block text-[clamp(1.35rem,3.4vw,2rem)] font-bold leading-[1.15] text-[#3b82f6]">
          Bridge IT Park
        </span>
        <span className="mt-1.5 block text-[clamp(1.65rem,4.8vw,2.85rem)] font-extrabold leading-[1.08] text-text-primary">
          Websites · Software · Marketing
        </span>
        <span className="mt-1 block text-[clamp(1.2rem,3.2vw,1.75rem)] font-bold leading-[1.15] text-text-secondary">
          Creative Design + Performance Marketing
        </span>
      </h1>

      <p className="mt-5 max-w-[36rem] text-[15px] leading-relaxed text-text-secondary sm:text-base">
        <span className="font-bold text-text-primary">Custom Websites</span>,{' '}
        <span className="font-bold text-text-primary">Software Solutions</span> and{' '}
        <span className="font-bold text-text-primary">Creative &amp; Digital Marketing</span> —
        three pillars for your business growth.
      </p>

      <div className="mt-6 flex w-full min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:gap-3">
        <HeroSearch className="min-w-0 flex-1" />
        <HeroActions className="w-full shrink-0 lg:w-auto" />
      </div>
    </div>
  );
}
