import { cn } from '@/lib/cn';
import { HeroActions } from './HeroActions';
import { HeroContent } from './HeroContent';

export function HomepageHero({ className }: { className?: string }) {
  return (
    <section
      className={cn('relative mb-0 overflow-hidden bg-transparent sm:mb-1 lg:mb-2', className)}
      aria-labelledby="homepage-hero-heading"
    >
      <div className="relative mx-auto w-full max-w-[1480px] px-4 pt-[calc(var(--header-offset)+0.75rem)] pb-6 sm:px-6 sm:pb-8 lg:px-8 lg:pt-[calc(var(--header-offset)+1.25rem)] lg:pb-10 xl:px-10">
        <div className="mx-auto flex w-full min-w-0 max-w-[40rem] flex-col items-center lg:max-w-[44rem]">
          <HeroContent />
          <HeroActions className="mt-6 w-full sm:mt-7" />
        </div>
      </div>
    </section>
  );
}
