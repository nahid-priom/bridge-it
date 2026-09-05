import Link from 'next/link';
import { cn } from '@/lib/cn';

export function CatalogEmptyState({
  title = 'Nothing here yet',
  description = 'Check back soon, or browse other solutions.',
  actionHref,
  actionLabel,
  className,
}: {
  title?: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-dashed border-border-subtle bg-background-soft/60 px-6 py-12 text-center',
        className
      )}
    >
      <h2 className="font-display text-lg font-bold text-[#0f2744] dark:text-white">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">{description}</p>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-[#0f2744] px-4 text-sm font-semibold text-white hover:bg-[#16375f]"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
