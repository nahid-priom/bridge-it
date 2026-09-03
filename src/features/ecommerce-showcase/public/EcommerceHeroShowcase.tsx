import { cn } from '@/lib/cn';

export function EcommerceHeroShowcase({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative mx-auto w-full min-w-0 max-w-md lg:max-w-none',
        'motion-safe:opacity-0 motion-safe:[animation:hero-fade-scale_0.7s_ease-out_0.1s_forwards]',
        className
      )}
    >
      <div className="relative overflow-hidden rounded-2xl bg-[#05080c] ring-1 ring-white/5 lg:rounded-3xl">
        <div className="relative mx-auto aspect-[16/10] w-full lg:aspect-[16/10]">
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
              sizes="(min-width: 1024px) 56vw, 92vw"
            />
          </picture>
        </div>
      </div>
    </div>
  );
}
