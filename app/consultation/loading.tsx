export default function ConsultationLoading() {
  return (
    <section className="relative w-full overflow-x-hidden pb-12 pt-[calc(var(--header-offset)+1.25rem)] md:pb-14">
      <div className="mx-auto flex w-full max-w-xl animate-pulse flex-col items-center gap-5 px-4 sm:gap-6 sm:px-6">
        <div className="flex w-full flex-col items-center space-y-2">
          <div className="h-7 w-72 max-w-full rounded-lg bg-slate-200 dark:bg-white/10 sm:h-8 sm:w-80" />
          <div className="h-4 w-full max-w-md rounded bg-slate-200 dark:bg-white/10" />
        </div>

        <div className="w-full space-y-4 rounded-2xl border border-slate-200 p-5 dark:border-white/10 sm:p-6">
          <div className="h-3 w-36 rounded bg-slate-200 dark:bg-white/10" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`space-y-2 ${i === 3 ? 'sm:col-span-2' : ''}`}
              >
                <div className="h-3 w-20 rounded bg-slate-200 dark:bg-white/10" />
                <div className="h-11 rounded-xl bg-slate-200 dark:bg-white/10" />
              </div>
            ))}
          </div>
          <div className="h-11 w-full rounded-xl bg-slate-200 dark:bg-white/10" />
        </div>
      </div>
    </section>
  );
}
