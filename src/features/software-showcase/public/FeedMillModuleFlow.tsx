const FLOW_STEPS = [
  'Raw Purchase',
  'Raw Stock',
  'Formula',
  'Planning',
  'Material Issue',
  'Batch',
  'Finished Feed',
  'Dealer Order',
  'Dispatch',
  'Collection',
  'Accounts',
  'P&L',
] as const;

/** Compact Feed Mill lifecycle — industry page only. */
export function FeedMillModuleFlow() {
  return (
    <section className="mt-10 border-t border-border-subtle pt-8" aria-labelledby="feed-mill-flow">
      <h2 id="feed-mill-flow" className="font-display text-lg font-bold text-[#0f2744] dark:text-white">
        How a Feed Mill runs
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-text-secondary">
        From raw materials to profit — one connected operation flow.
      </p>
      <ol className="mt-5 flex flex-wrap gap-2">
        {FLOW_STEPS.map((step, index) => (
          <li key={step} className="flex items-center gap-2 text-sm">
            <span className="inline-flex items-center rounded-lg border border-border-subtle bg-surface px-2.5 py-1.5 font-medium text-text-primary">
              {step}
            </span>
            {index < FLOW_STEPS.length - 1 ? (
              <span className="text-text-muted" aria-hidden>
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
