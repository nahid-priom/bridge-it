import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/cn';

export function InlineSpinner({
  className,
  size = 22,
  label,
}: {
  className?: string;
  size?: number;
  /** When set, spinner is announced; otherwise decorative (aria-hidden). */
  label?: string;
}) {
  const decorative = !label;
  return (
    <LoaderCircle
      aria-hidden={decorative}
      aria-label={label}
      role={decorative ? undefined : 'status'}
      className={cn(
        'shrink-0 animate-spin text-emerald-600 dark:text-emerald-400 motion-reduce:animate-none',
        className
      )}
      style={{ width: size, height: size }}
    />
  );
}
