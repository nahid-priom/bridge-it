export default function SolutionDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-16 animate-pulse">
      <div className="h-4 w-48 bg-slate-200 dark:bg-white/10 rounded mb-8" />
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="aspect-video bg-slate-200 dark:bg-white/10 rounded-2xl" />
        <div className="space-y-4">
          <div className="h-8 w-3/4 bg-slate-200 dark:bg-white/10 rounded" />
          <div className="h-4 w-full bg-slate-200 dark:bg-white/10 rounded" />
          <div className="h-4 w-2/3 bg-slate-200 dark:bg-white/10 rounded" />
        </div>
      </div>
    </div>
  );
}
