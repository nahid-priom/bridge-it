export function SoftwarePreviewSkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-[1480px] px-4 pb-16 pt-[calc(var(--header-offset)+0.75rem)] sm:px-6 lg:px-8"
      aria-busy="true"
      aria-label="Loading software"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <div className="h-3 w-24 animate-pulse rounded bg-background-soft" />
          <div className="mt-3 h-9 w-2/3 animate-pulse rounded bg-background-soft" />
          <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded bg-background-soft" />
          <div className="mt-6 flex gap-2">
            <div className="h-12 flex-1 animate-pulse rounded-xl bg-background-soft" />
            <div className="h-12 flex-1 animate-pulse rounded-xl bg-background-soft" />
          </div>
        </div>
        <div className="aspect-[16/10] w-full animate-pulse rounded-2xl bg-background-soft" />
      </div>
      <div className="mt-8 grid grid-cols-2 gap-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[4.75rem] animate-pulse rounded-2xl bg-background-soft" />
        ))}
      </div>
      <div className="mt-4 h-48 animate-pulse rounded-2xl bg-background-soft" />
    </div>
  );
}
