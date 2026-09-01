export default function EcommerceShowroomLoading() {
  return (
    <div className="pb-16 animate-pulse">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="h-10 w-64 bg-slate-200 dark:bg-white/10 rounded-lg mb-4" />
        <div className="h-5 w-96 max-w-full bg-slate-200 dark:bg-white/10 rounded mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
              <div className="aspect-[16/10] bg-slate-200 dark:bg-white/10" />
              <div className="p-5 space-y-3">
                <div className="h-6 w-24 bg-slate-200 dark:bg-white/10 rounded" />
                <div className="h-5 w-full bg-slate-200 dark:bg-white/10 rounded" />
                <div className="h-4 w-3/4 bg-slate-200 dark:bg-white/10 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
