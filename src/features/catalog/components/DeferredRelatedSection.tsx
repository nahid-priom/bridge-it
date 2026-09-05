import { Suspense, type ReactNode } from 'react';
import { CatalogGridSkeleton } from '@/src/components/skeletons/CatalogCardSkeleton';

/** Below-fold related rail — skeleton while streaming, hero stays SSR. */
export function DeferredRelatedSection({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1480px] px-4 pb-12 sm:px-6 lg:px-8 xl:px-10">
      <Suspense
        fallback={
          <div className="mt-8" aria-busy="true" aria-label="Loading related products">
            <div className="mb-4 h-6 w-48 animate-pulse rounded bg-background-soft motion-reduce:animate-none" />
            <CatalogGridSkeleton count={4} className="xl:grid-cols-4" />
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  );
}
