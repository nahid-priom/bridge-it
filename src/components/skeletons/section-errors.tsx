'use client';

import { cn } from '@/lib/cn';

type SectionErrorProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
};

function SectionError({
  title = 'Could not load this section',
  message = 'Something went wrong. Please try again.',
  onRetry,
  className,
}: SectionErrorProps) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-2xl border border-dashed border-border-subtle px-6 py-6 text-center md:py-10',
        className
      )}
    >
      <h3 className="font-display text-lg font-bold text-text-primary">{title}</h3>
      <p className="mt-2 text-sm text-text-secondary">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#0f2744] px-4 py-2 text-sm font-semibold text-white hover:bg-[#16375f]"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}

export function DataSectionError(props: SectionErrorProps) {
  return <SectionError {...props} />;
}

export function ProjectGridError(props: SectionErrorProps) {
  return (
    <SectionError
      title={props.title ?? 'Unable to load projects'}
      message={props.message ?? 'We could not load website designs. Please try again.'}
      onRetry={props.onRetry}
      className={props.className}
    />
  );
}

export function PreviewError(props: SectionErrorProps) {
  return (
    <SectionError
      title={props.title ?? 'Preview unavailable'}
      message={props.message ?? 'Could not load this preview.'}
      onRetry={props.onRetry}
      className={props.className}
    />
  );
}
