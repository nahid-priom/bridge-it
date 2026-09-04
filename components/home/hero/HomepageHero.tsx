import { cn } from '@/lib/cn';
import { HeroActions } from './HeroActions';
import { HeroContent } from './HeroContent';
import { HeroPlatformVisual } from './HeroPlatformVisual';

export function HomepageHero({ className }: { className?: string }) {
  return (
    <section
      className={cn('relative mb-2 overflow-hidden bg-background sm:mb-4 lg:mb-10', className)}
      aria-labelledby="homepage-hero-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(760px_circle_at_12%_8%,rgba(37,99,235,0.10),transparent_55%),radial-gradient(640px_circle_at_88%_28%,rgba(37,99,235,0.06),transparent_50%)] dark:bg-[radial-gradient(760px_circle_at_12%_8%,rgba(37,99,235,0.14),transparent_55%),radial-gradient(640px_circle_at_88%_28%,rgba(37,99,235,0.08),transparent_50%)]"
      />
      <div className="relative mx-auto w-full max-w-[1480px] px-4 pt-[calc(var(--header-offset)+0.5rem)] pb-1 sm:px-6 sm:pb-2 lg:px-8 lg:pt-[calc(var(--header-offset)+1rem)] lg:pb-4 xl:px-10">
        <div className="grid min-w-0 grid-cols-1 items-center gap-0 lg:grid-cols-2 lg:gap-10 xl:gap-12">
          <div className="mx-auto flex w-full min-w-0 max-w-xl flex-col items-center py-8 sm:py-6 lg:mx-0 lg:max-w-none lg:items-stretch lg:py-0">
            <HeroContent />
            <HeroActions className="mt-6 w-full sm:mt-[22px]" />
          </div>
          <HeroPlatformVisual className="hidden min-w-0 w-full lg:block" />
        </div>
      </div>
    </section>
  );
}
