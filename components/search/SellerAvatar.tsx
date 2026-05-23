'use client';

import { cn } from '@/lib/cn';

export function sellerHue(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h + name.charCodeAt(i) * 17) % 360;
  return h;
}

type SellerAvatarProps = {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  hue?: number;
  className?: string;
};

const SIZE = { sm: 'w-7 h-7 text-[10px]', md: 'w-9 h-9 text-xs', lg: 'w-14 h-14 text-base' };

export function SellerAvatar({ name, size = 'md', hue, className }: SellerAvatarProps) {
  const h = hue ?? sellerHue(name);
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full font-bold text-white shrink-0 border-2 border-white dark:border-slate-800 shadow-sm',
        SIZE[size],
        className
      )}
      style={{ background: `hsl(${h} 65% 45%)` }}
      aria-hidden
    >
      {initials}
    </span>
  );
}
