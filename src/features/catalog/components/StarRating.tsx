import { Star } from 'lucide-react';
import { cn } from '@/lib/cn';

export function StarRating({
  rating,
  reviewCount,
  size = 'sm',
  className,
  showValue = true,
}: {
  rating: number;
  reviewCount?: number | null;
  size?: 'sm' | 'md';
  className?: string;
  showValue?: boolean;
}) {
  const safe = Math.max(0, Math.min(5, Number(rating) || 0));
  const starSize = size === 'md' ? 'h-4 w-4' : 'h-3.5 w-3.5';
  const label =
    typeof reviewCount === 'number' && reviewCount > 0
      ? `${safe.toFixed(1)} out of 5 from ${reviewCount} reviews`
      : `${safe.toFixed(1)} out of 5`;

  return (
    <div className={cn('inline-flex items-center gap-1.5', className)} title={label}>
      <div className="inline-flex items-center gap-0.5" aria-hidden>
        {[1, 2, 3, 4, 5].map((index) => {
          const full = safe >= index;
          const half = !full && safe >= index - 0.5;
          return (
            <span key={index} className="relative inline-flex h-[1em] w-[1em] items-center justify-center">
              <Star className={cn(starSize, 'fill-transparent text-amber-400/35')} />
              {full || half ? (
                <Star
                  className={cn(starSize, 'absolute inset-0 fill-amber-400 text-amber-400')}
                  style={half ? { clipPath: 'inset(0 50% 0 0)' } : undefined}
                />
              ) : null}
            </span>
          );
        })}
      </div>
      {showValue ? (
        <span
          className={cn('font-semibold text-text-primary', size === 'md' ? 'text-sm' : 'text-xs')}
        >
          {safe.toFixed(1)}
          {typeof reviewCount === 'number' && reviewCount > 0 ? (
            <span className="ml-1 font-normal text-text-muted">({reviewCount})</span>
          ) : null}
        </span>
      ) : null}
      <span className="sr-only">{label}</span>
    </div>
  );
}
