import { CATALOG_LISTING_GRID_CLASS } from '@/src/features/catalog/components/explore/types';

export default function CreativeMarketingLoading() {
  return (
    <div className="mx-auto w-full max-w-[1480px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 h-10 w-72 animate-pulse rounded bg-background-soft" />
      <div className={CATALOG_LISTING_GRID_CLASS}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-border-subtle">
            <div className="aspect-[16/10] animate-pulse bg-background-soft" />
            <div className="space-y-2 p-4">
              <div className="h-3 w-24 animate-pulse rounded bg-background-soft" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-background-soft" />
              <div className="h-10 w-full animate-pulse rounded-xl bg-background-soft" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
