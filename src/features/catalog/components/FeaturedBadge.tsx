'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/cn';

export function FeaturedBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'absolute top-2.5 right-2.5 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full',
        'bg-[#0f2744]/92 text-white shadow-sm backdrop-blur-[2px]',
        className
      )}
      aria-label="Featured"
    >
      <span className="relative inline-flex h-3.5 w-3.5 items-center justify-center" aria-hidden>
        <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300 motion-safe:animate-[featured-star-pulse_1.8s_ease-in-out_infinite]" />
        <Star className="absolute -right-1 -top-1 h-2 w-2 fill-amber-200 text-amber-200 motion-safe:animate-[featured-star-twinkle_1.4s_ease-in-out_infinite]" />
      </span>
    </span>
  );
}
