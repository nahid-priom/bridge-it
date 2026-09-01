export default function DemoLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0e1a] animate-pulse">
      <div className="h-20 bg-[#0f2744]" />
      <div className="container mx-auto px-4 py-8 space-y-4">
        <div className="h-8 w-48 bg-slate-200 dark:bg-white/10 rounded" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square bg-slate-200 dark:bg-white/10 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
