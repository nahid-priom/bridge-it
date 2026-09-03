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
        <span className="block text-[clamp(1.9rem,5.2vw,3.15rem)] font-bold leading-[1.12] text-[#3b82f6]">
          Custom E-commerce
        </span>
        <span className="mt-1 block text-[clamp(2.35rem,7.2vw,4.35rem)] font-extrabold leading-[0.98] text-text-primary">
          Websites &amp; Apps
        </span>
        <span className="mt-2 block text-[clamp(1.35rem,3.2vw,2.1rem)] font-semibold leading-snug tracking-[-0.02em] text-[#eab308]">
          for Your Business
        </span>
      </h1>

      <p className="mt-5 max-w-[36rem] text-[15px] leading-relaxed text-text-secondary sm:text-base">
        <span className="font-bold text-text-primary">100+ Custom Premium</span> e-commerce website and app designs. Choose the storefront that fits your brand.
      </p>

      <HeroSearch className="mt-6" />
      <HeroActions className="mt-4" />
    </div>
  );
}
