export default function SoftwareShowroomLoading() {
  return (
    <div className="container mx-auto px-4 py-16 animate-pulse">
      <div className="h-10 bg-slate-200 dark:bg-white/10 rounded-lg max-w-md mx-auto mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-80 bg-slate-200 dark:bg-white/10 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
