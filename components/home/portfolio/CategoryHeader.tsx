import Link from 'next/link';
import { cn, focusVisibleRing } from '@/lib/cn';

export function CategoryHeader({
  title,
  description,
  viewAllHref,
  viewAllLabel,
  headingId,
}: {
  title: string;
  description?: string;
  viewAllHref: string;
  viewAllLabel: string;
  headingId: string;
}) {
  return (
    <div className="mb-5 flex flex-col gap-2 md:mb-7 md:flex-row md:items-end md:justify-between md:gap-6">
      <div className="min-w-0 text-left">
        <h3
          id={headingId}
          className="font-display font-bold tracking-[-0.02em] text-text-primary"
          style={{ fontSize: 'clamp(1.35rem, 3vw, 2.4rem)', lineHeight: 1.2 }}
        >
          {title}
        </h3>
        {description ? (
          <p className="mt-2 hidden max-w-xl text-sm leading-relaxed text-text-muted md:mt-2.5 md:block md:text-[0.9375rem]">
            {description}
          </p>
        ) : null}
      </div>
      <Link
        href={viewAllHref}
        className={cn(
          'shrink-0 self-start text-sm font-semibold text-[#2563eb] md:self-auto',
          'inline-flex min-h-11 items-center transition-colors hover:text-[#1d4ed8]',
          'dark:text-[#60a5fa] dark:hover:text-white',
          focusVisibleRing
        )}
      >
        {viewAllLabel} →
      </Link>
    </div>
  );
}
