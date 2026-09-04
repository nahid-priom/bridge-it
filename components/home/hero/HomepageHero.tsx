import { cn } from '@/lib/cn';
import { HeroActions } from './HeroActions';
import { HeroContent } from './HeroContent';

export function HomepageHero({ className }: { className?: string }) {
  return (
    <section
      className={cn('relative mb-0 overflow-hidden bg-background sm:mb-1 lg:mb-2', className)}
      aria-labelledby="homepage-hero-heading"
    >
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0',
          'bg-[radial-gradient(680px_circle_at_50%_0%,rgba(37,99,235,0.12),transparent_58%),radial-gradient(480px_circle_at_18%_42%,rgba(20,200,230,0.06),transparent_52%),radial-gradient(420px_circle_at_82%_48%,rgba(33,212,123,0.05),transparent_50%)]',
          'dark:bg-[radial-gradient(720px_circle_at_50%_0%,rgba(37,99,235,0.18),transparent_58%),radial-gradient(520px_circle_at_15%_40%,rgba(20,200,230,0.09),transparent_52%),radial-gradient(460px_circle_at_85%_50%,rgba(33,212,123,0.07),transparent_50%)]'
        )}
      />
      <div className="relative mx-auto w-full max-w-[1480px] px-4 pt-[calc(var(--header-offset)+0.75rem)] pb-6 sm:px-6 sm:pb-8 lg:px-8 lg:pt-[calc(var(--header-offset)+1.25rem)] lg:pb-10 xl:px-10">
        <div className="mx-auto flex w-full min-w-0 max-w-[40rem] flex-col items-center lg:max-w-[44rem]">
          <HeroContent />
          <HeroActions className="mt-6 w-full sm:mt-7" />
        </div>
      </div>
    </section>
  );
}
