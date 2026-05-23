import { Star } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ProductStarsProps {
  rating: number;
  max?: number;
  size?: 'sm' | 'md';
  className?: string;
  label?: string;
}

export function ProductStars({
  rating,
  max = 5,
  size = 'md',
  className,
  label,
}: ProductStarsProps) {
  const iconClass = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const rounded = Math.round(rating * 2) / 2;

  return (
    <div
      className={cn('inline-flex items-center gap-0.5', className)}
      role="img"
      aria-label={label ?? `${rating} out of ${max} stars`}
    >
      {Array.from({ length: max }).map((_, i) => {
        const filled = i + 1 <= Math.floor(rounded);
        const half = !filled && i + 0.5 === rounded;
        return (
          <Star
            key={i}
            className={cn(
              iconClass,
              filled || half ? 'text-bridge-gold fill-bridge-gold' : 'text-text-muted/40'
            )}
            aria-hidden
          />
        );
      })}
    </div>
  );
}
