'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  BarChart3,
  Boxes,
  Globe,
  LayoutGrid,
  Megaphone,
  Package,
  ShoppingCart,
  Smartphone,
  Store,
  Truck,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/cn';

type CategoryPlaceholderConfig = {
  icon: LucideIcon;
  gradient: string;
};

const CATEGORY_PLACEHOLDERS: Record<string, CategoryPlaceholderConfig> = {
  'software-solutions': {
    icon: LayoutGrid,
    gradient: 'from-[#0f2744] via-[#132f52] to-emerald-900/40',
  },
  'ecommerce-solutions': {
    icon: ShoppingCart,
    gradient: 'from-[#0f2744] via-teal-900/50 to-emerald-900/30',
  },
  'web-app-solutions': {
    icon: Globe,
    gradient: 'from-[#0f2744] via-[#1e3a5f] to-teal-900/40',
  },
  'digital-marketing': {
    icon: Megaphone,
    gradient: 'from-[#0f2744] via-violet-900/30 to-emerald-900/30',
  },
  'graphics-creative': {
    icon: BarChart3,
    gradient: 'from-[#0f2744] via-rose-900/20 to-teal-900/40',
  },
  'software-development': {
    icon: LayoutGrid,
    gradient: 'from-[#0f2744] via-[#132f52] to-emerald-900/40',
  },
  'web-development': {
    icon: Globe,
    gradient: 'from-[#0f2744] via-[#1e3a5f] to-teal-900/40',
  },
  'app-development': {
    icon: Smartphone,
    gradient: 'from-[#0f2744] via-indigo-900/30 to-teal-900/40',
  },
  'ai-automations': {
    icon: BarChart3,
    gradient: 'from-[#0f2744] via-violet-900/40 to-emerald-900/30',
  },
  logistics: {
    icon: Truck,
    gradient: 'from-[#0f2744] via-slate-800 to-teal-900/40',
  },
  inventory: {
    icon: Boxes,
    gradient: 'from-[#0f2744] via-emerald-900/30 to-teal-900/40',
  },
};

const DEFAULT_PLACEHOLDER: CategoryPlaceholderConfig = {
  icon: Store,
  gradient: 'from-[#0f2744] via-[#132f52] to-emerald-900/30',
};

export function getCategoryPlaceholder(categorySlug?: string | null): CategoryPlaceholderConfig {
  if (!categorySlug) return DEFAULT_PLACEHOLDER;
  return CATEGORY_PLACEHOLDERS[categorySlug] ?? DEFAULT_PLACEHOLDER;
}

type SolutionCoverImageProps = {
  src?: string | null;
  alt: string;
  title?: string;
  categorySlug?: string | null;
  aspectClassName?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
  badge?: React.ReactNode;
  overlay?: React.ReactNode;
};

export function SolutionCoverImage({
  src,
  alt,
  categorySlug,
  aspectClassName = 'aspect-[16/9]',
  className,
  imageClassName,
  priority = false,
  sizes = '(max-width: 640px) 100vw, 400px',
  badge,
  overlay,
}: SolutionCoverImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const placeholder = getCategoryPlaceholder(categorySlug);
  const PlaceholderIcon = placeholder.icon;
  const showImage = Boolean(src) && !failed;

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-slate-950',
        aspectClassName,
        className
      )}
    >
      {showImage ? (
        <>
          {!loaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-800 to-slate-900" />
          )}
          <Image
            src={src!}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className={cn(
              'object-cover transition-opacity duration-300',
              imageClassName,
              loaded ? 'opacity-100' : 'opacity-0'
            )}
            loading={priority ? undefined : 'lazy'}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        </>
      ) : (
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center bg-gradient-to-br',
            placeholder.gradient
          )}
        >
          <div className="flex flex-col items-center gap-2 opacity-90">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm border border-white/10">
              <PlaceholderIcon className="w-10 h-10 text-emerald-300" aria-hidden />
            </div>
            <Package className="w-5 h-5 text-white/20 absolute top-1/4 right-1/4" aria-hidden />
          </div>
        </div>
      )}
      {badge}
      {overlay}
    </div>
  );
}
