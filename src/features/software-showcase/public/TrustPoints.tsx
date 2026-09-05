'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';

const DEFAULT_POINTS = ['Free consultation', 'No hidden cost', 'Customizable'] as const;

export function TrustPoints({
  points = DEFAULT_POINTS,
  className,
}: {
  points?: readonly string[];
  className?: string;
}) {
  if (points.length === 0) return null;
  return (
    <ul
      className={cn(
        'flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-text-muted sm:text-sm',
        className
      )}
      aria-label="Trust points"
    >
      {points.map((item) => (
        <li key={item} className="inline-flex items-center gap-1.5">
          <Check className="h-3.5 w-3.5 shrink-0 text-bridge-primary" aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  );
}
