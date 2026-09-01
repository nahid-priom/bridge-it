export default function ClientDashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-slate-200 dark:bg-white/10 rounded" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-slate-200 dark:bg-white/10" />
        ))}
      </div>
      <div className="h-48 rounded-2xl bg-slate-200 dark:bg-white/10" />
    </div>
  );
}
