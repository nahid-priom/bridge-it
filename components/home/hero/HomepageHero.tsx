import { cn } from '@/lib/cn';
import { HeroDecorations } from '@/components/home/HeroDecorations';
import { HeroActions } from './HeroActions';
import { HeroContent } from './HeroContent';

export function HomepageHero({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        'relative mb-0 overflow-hidden bg-transparent sm:mb-1 lg:mb-2',
        className
      )}
      aria-labelledby="homepage-hero-heading"
    >
      <HeroDecorations />
      <div className="relative z-[1] mx-auto w-full max-w-[1480px] px-4 pt-[calc(var(--header-offset)+1.5rem)] pb-6 sm:px-6 sm:pb-8 lg:px-8 lg:pt-[calc(var(--header-offset)+1.25rem)] lg:pb-10 xl:px-10">
        <div className="mx-auto flex w-full min-w-0 max-w-[48rem] flex-col items-center lg:max-w-[56rem]">
          <HeroContent />
          <HeroActions className="mt-6 w-full sm:mt-7" />
        </div>
      </div>
    </section>
  );
}
