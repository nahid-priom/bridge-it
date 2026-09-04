import { SoftwareCardSkeleton } from '@/src/features/software-showcase/public/SoftwareCard';

export default function SoftwareLoading() {
  return (
    <div className="mx-auto w-full max-w-[1480px] px-4 pb-16 pt-3 sm:px-6 sm:pt-4 lg:px-8 xl:px-10">
      <div className="mb-6 md:mb-8">
        <div className="h-9 w-72 max-w-full animate-pulse rounded-lg bg-slate-200/80 dark:bg-white/10" />
        <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded bg-slate-200/60 dark:bg-white/8" />
      </div>
      <div className="mb-5 h-11 max-w-xl animate-pulse rounded-xl bg-slate-200/70 dark:bg-white/10" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-8 w-20 animate-pulse rounded-full bg-slate-200/70 dark:bg-white/10"
          />
        ))}
      </div>
      <div
        className="mt-6 grid grid-cols-1 gap-5 md:mt-8 md:grid-cols-2 md:gap-6 lg:grid-cols-3"
        aria-busy="true"
        aria-label="Loading software"
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <SoftwareCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
