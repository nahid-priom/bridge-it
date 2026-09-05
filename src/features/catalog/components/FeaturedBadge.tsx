import { Star } from 'lucide-react';
import { cn } from '@/lib/cn';

export function FeaturedBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'absolute top-2.5 right-2.5 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full',
        'bg-[#0f2744]/92 text-white shadow-sm backdrop-blur-[2px]',
        className
      )}
      aria-label="Featured"
    >
      <Star className="h-5 w-5 fill-amber-300 text-amber-300" aria-hidden />
    </span>
  );
}
