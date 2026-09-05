'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

export type CatalogCoverImageProps = {
  src: string | null | undefined;
  /** Optional format fallback (e.g. WebP when src is AVIF). Not used as a load-failure retry src. */
  fallbackSrc?: string | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
  priority?: boolean;
  sizes?: string;
  fit?: 'cover' | 'contain';
  /** When false, skip the in-box pulse (e.g. parent already showed a grid skeleton). Default true. */
  showPlaceholder?: boolean;
  /** Branded empty/error treatment. Default 'branded'. */
  emptyVariant?: 'branded' | 'muted';
  emptyTitle?: string;
};

type CoverStatus = 'empty' | 'loading' | 'loaded' | 'error';

function CoverPlaceholder({
  title,
  className,
  variant,
}: {
  title?: string;
  className?: string;
  variant: 'branded' | 'muted';
}) {
  const initial = (title?.trim().charAt(0) || '·').toUpperCase();
  if (variant === 'muted') {
    return (
      <div
        className={cn(
          'flex aspect-card w-full items-center justify-center bg-background-soft text-sm text-text-muted',
          className
        )}
        role="img"
        aria-label={title ? `${title} — preview unavailable` : 'Preview unavailable'}
      >
        {title ? 'Preview unavailable' : 'No cover'}
      </div>
    );
  }
  return (
    <div
      className={cn(
        'relative flex aspect-card w-full overflow-hidden',
        'bg-gradient-to-br from-[#0f2744] via-[#132f52] to-[#1a3a5c]',
        className
      )}
      role="img"
      aria-label={title ? `${title} — preview unavailable` : 'Preview unavailable'}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(37,99,235,0.35), transparent 45%), radial-gradient(circle at 80% 70%, rgba(59,130,246,0.2), transparent 40%)',
        }}
      />
      <div className="relative z-[1] flex w-full flex-col items-center justify-center gap-2 px-4 py-5 text-center">
        <span className="font-display text-3xl font-bold text-white/85">{initial}</span>
        <p className="text-xs font-medium tracking-wide text-white/55">Preview unavailable</p>
      </div>
    </div>
  );
}

/**
 * Single catalog cover renderer with a stable aspect box and one-way load state machine.
 * Never swaps img src on error; never treats "not loaded yet" as failure.
 */
export function CatalogCoverImage({
  src,
  fallbackSrc,
  alt,
  width = 800,
  height = 600,
  className,
  imgClassName,
  eager = false,
  priority = false,
  sizes = '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw',
  fit = 'cover',
  showPlaceholder = true,
  emptyVariant = 'branded',
  emptyTitle,
}: CatalogCoverImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [status, setStatus] = useState<CoverStatus>(() => (src?.trim() ? 'loading' : 'empty'));
  const [activeSrc, setActiveSrc] = useState(() => src?.trim() || '');

  const primary = src?.trim() || '';
  const formatFallback =
    fallbackSrc?.trim() && fallbackSrc.trim() !== primary ? fallbackSrc.trim() : null;
  /** Prefer WebP/img src when dual-format; AVIF stays as <source>. Src itself never swaps on error. */
  const displaySrc = formatFallback || primary;
  const isAvif =
    primary.endsWith('.avif') || primary.includes('.avif?') || primary.includes('image/avif');
  const loadEager = eager || priority;

  useEffect(() => {
    const next = src?.trim() || '';
    setActiveSrc(next);
    if (!next) {
      setStatus('empty');
      return;
    }
    setStatus('loading');
  }, [src]);

  useEffect(() => {
    if (!activeSrc || status === 'empty' || status === 'error') return;
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      setStatus('loaded');
    }
  }, [activeSrc, status]);

  if (status === 'empty' || !activeSrc) {
    return (
      <CoverPlaceholder title={emptyTitle} className={className} variant={emptyVariant} />
    );
  }

  if (status === 'error') {
    return (
      <CoverPlaceholder title={emptyTitle} className={className} variant={emptyVariant} />
    );
  }

  return (
    <div
      className={cn(
        'relative aspect-card w-full overflow-hidden bg-background-soft',
        className
      )}
    >
      {showPlaceholder && status === 'loading' ? (
        <span
          aria-hidden
          className="absolute inset-0 z-[1] animate-pulse bg-background-soft motion-reduce:animate-none dark:bg-white/10"
        />
      ) : null}
      <picture className="relative block h-full w-full">
        {isAvif ? <source srcSet={primary} type="image/avif" /> : null}
        {formatFallback ? <source srcSet={formatFallback} type="image/webp" /> : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={displaySrc}
          alt={alt}
          width={width}
          height={height}
          loading={loadEager ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          sizes={sizes}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={cn(
            'relative h-full w-full transition-opacity duration-200 ease-out motion-reduce:transition-none',
            status === 'loaded' ? 'opacity-100' : 'opacity-0',
            fit === 'contain' ? 'object-contain object-center' : 'object-cover object-center',
            imgClassName
          )}
        />
      </picture>
    </div>
  );
}
