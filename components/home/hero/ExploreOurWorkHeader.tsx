import { cn } from '@/lib/cn';

export function ExploreOurWorkHeader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[1480px] px-4 pt-8 text-center sm:px-6 md:pt-10 lg:px-8 xl:px-10',
        className
      )}
    >
      <h2 className="font-display text-xl font-bold tracking-[-0.02em] text-text-primary sm:text-2xl md:text-[1.75rem]">
        Explore Our Work
      </h2>
      <p className="mx-auto mt-2 max-w-lg text-sm text-text-muted sm:text-[0.9375rem]">
        View 500+ live websites, software &amp; marketing projects
      </p>
    </div>
  );
}
