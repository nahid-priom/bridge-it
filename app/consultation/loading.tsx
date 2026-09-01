export default function ConsultationLoading() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-xl animate-pulse">
      <div className="h-8 w-2/3 bg-slate-200 dark:bg-white/10 rounded mb-4" />
      <div className="h-4 w-full bg-slate-200 dark:bg-white/10 rounded mb-8" />
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 bg-slate-200 dark:bg-white/10 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
