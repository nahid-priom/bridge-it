import { Bookmark } from 'lucide-react';
import { cn } from '@/lib/cn';

/** Small featured marker — bookmark, not a decorative yellow star. */
export function FeaturedBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'absolute top-2 right-2 z-10 inline-flex h-9 w-9 items-center justify-center rounded-lg',
        'bg-[#0f2744]/75 text-white backdrop-blur-[2px]',
        className
      )}
      aria-label="Featured"
    >
      <Bookmark className="h-4 w-4 fill-white text-white" aria-hidden />
    </span>
  );
}
