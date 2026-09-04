import { cn } from '@/lib/cn';

export function HeroPlatformVisual({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative mx-auto w-full min-w-0 max-w-full bg-transparent',
        'motion-safe:opacity-0 motion-safe:[animation:hero-fade-scale_0.7s_ease-out_0.12s_forwards]',
        className
      )}
    >
      {/* Soft professional stage — mobile only, no card chrome */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-4 inset-y-2 rounded-[2rem] bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.08),transparent_68%)] lg:hidden dark:bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.14),transparent_68%)]"
      />

      <div
        className={cn(
          'relative mx-auto w-full min-w-0 max-w-full overflow-hidden bg-transparent',
          'aspect-[5/4] max-h-[min(52vw,320px)]',
          'sm:aspect-[4/3] sm:max-h-none',
          'lg:max-h-none'
        )}
      >
        <picture>
          <source
            media="(max-width: 1023px)"
            srcSet="/assets/hero/bridge-it-hero-platform-mobile.avif"
            type="image/avif"
          />
          <source
            media="(max-width: 1023px)"
            srcSet="/assets/hero/bridge-it-hero-platform-mobile.webp"
            type="image/webp"
          />
          <source srcSet="/assets/hero/bridge-it-hero-platform.avif" type="image/avif" />
          <source srcSet="/assets/hero/bridge-it-hero-platform.webp" type="image/webp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/hero/bridge-it-hero-platform.webp"
            alt="Custom website, business software and mobile solution showcase"
            width={1700}
            height={1275}
            decoding="async"
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full bg-transparent object-contain object-center"
            sizes="(min-width: 1024px) 55vw, 100vw"
          />
        </picture>
      </div>
    </div>
  );
}
