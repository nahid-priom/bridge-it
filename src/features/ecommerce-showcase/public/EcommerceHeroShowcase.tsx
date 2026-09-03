import { cn } from '@/lib/cn';

export function EcommerceHeroShowcase({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative mx-auto flex w-full min-w-0 items-center justify-center py-8 lg:max-w-none lg:py-6',
        'motion-safe:opacity-0 motion-safe:[animation:hero-fade-scale_0.7s_ease-out_0.1s_forwards]',
        className
      )}
    >
      <div className="relative flex w-full items-center justify-center">
        <div className="relative mx-auto flex w-full max-w-md items-center justify-center overflow-hidden sm:max-w-lg lg:max-w-none lg:aspect-[16/10]">
          <picture>
            <source srcSet="/images/ecommerce/hero-ecommerce-showcase.avif" type="image/avif" />
            <source srcSet="/images/ecommerce/hero-ecommerce-showcase.webp" type="image/webp" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/ecommerce/hero-ecommerce-showcase.webp"
              alt="Custom e-commerce website designs on laptop and mobile for Bridge IT Park"
              width={1536}
              height={1536}
              decoding="async"
              loading="eager"
              fetchPriority="high"
              className="h-auto w-full object-contain object-center lg:absolute lg:inset-0 lg:h-full lg:object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </picture>
        </div>
      </div>
    </div>
  );
}
