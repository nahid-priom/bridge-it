import { cn } from '@/lib/cn';

export function EcommerceHeroShowcase({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative mx-auto w-full min-w-0 max-w-full bg-transparent lg:max-w-none',
        'motion-safe:opacity-0 motion-safe:[animation:hero-fade-scale_0.7s_ease-out_0.1s_forwards]',
        className
      )}
    >
      <div className="relative w-full min-w-0 max-w-full overflow-hidden bg-transparent aspect-[4/3] lg:aspect-[16/10]">
        <picture>
          <source srcSet="/images/ecommerce/hero-ecommerce-showcase.avif" type="image/avif" />
          <source srcSet="/images/ecommerce/hero-ecommerce-showcase.webp" type="image/webp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/ecommerce/hero-ecommerce-showcase.webp"
            alt="Custom e-commerce website designs on laptop and mobile for Bridge IT Park"
            width={1477}
            height={1347}
            decoding="async"
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full bg-transparent object-contain object-center max-lg:object-cover max-lg:object-top lg:object-contain"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </picture>
      </div>
    </div>
  );
}
