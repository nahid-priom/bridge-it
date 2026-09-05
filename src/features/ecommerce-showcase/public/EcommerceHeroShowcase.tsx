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
      <div className="relative w-full min-w-0 max-w-full overflow-hidden bg-transparent aspect-card">
        <picture>
          <source
            media="(max-width: 1023px)"
            srcSet="/assets/hero/hero-platform-showcase-mobile.avif"
            type="image/avif"
          />
          <source
            media="(max-width: 1023px)"
            srcSet="/assets/hero/hero-platform-showcase-mobile.webp"
            type="image/webp"
          />
          <source srcSet="/assets/hero/hero-platform-showcase.avif" type="image/avif" />
          <source srcSet="/assets/hero/hero-platform-showcase.webp" type="image/webp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/hero/hero-platform-showcase.webp"
            alt="Websites and software solutions — ecommerce storefront and enterprise dashboard for Bridge IT Park"
            width={1800}
            height={1012}
            decoding="async"
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full bg-transparent object-contain object-center"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </picture>
      </div>
    </div>
  );
}
