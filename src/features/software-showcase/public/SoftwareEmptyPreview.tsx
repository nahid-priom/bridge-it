import { cn } from '@/lib/cn';

/** Polished empty state when a software product has no cover or screens. */
export function SoftwareEmptyPreview({
  title = 'Preview coming soon',
  description = 'Screen previews for this solution are being prepared. Request a free demo to see it live.',
  className,
}: {
  title?: string;
  description?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative flex min-h-[220px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-border-subtle bg-gradient-to-br from-[#f0f4f8] via-background-soft to-[#e8eef5] px-6 py-12 text-center dark:from-[#0f2744]/40 dark:via-background-soft dark:to-[#16375f]/30 sm:min-h-[280px] lg:min-h-[360px]',
        className
      )}
      role="img"
      aria-label={title}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(37,99,235,0.12), transparent 45%), radial-gradient(circle at 80% 70%, rgba(15,39,68,0.08), transparent 40%)',
        }}
        aria-hidden
      />
      <div className="relative z-[1] max-w-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border-subtle bg-surface shadow-sm">
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7 text-[#0f2744]/70 dark:text-white/70"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden
          >
            <rect x="3" y="4" width="18" height="14" rx="2" />
            <path d="M8 20h8" strokeLinecap="round" />
            <path d="M12 18v2" strokeLinecap="round" />
          </svg>
        </div>
        <p className="font-display text-lg font-bold text-[#0f2744] dark:text-white sm:text-xl">
          {title}
        </p>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
