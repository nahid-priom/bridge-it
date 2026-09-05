import { cn } from '@/lib/cn';

export function PackageBadge({
  badge,
  className,
}: {
  badge: string | null | undefined;
  className?: string;
}) {
  const text = badge?.trim();
  if (!text) return null;

  return (
    <span
      className={cn(
        'inline-flex rounded-md bg-[#0f2744] px-2 py-0.5 text-[11px] font-semibold tracking-wide text-white',
        className
      )}
    >
      {text}
    </span>
  );
}
