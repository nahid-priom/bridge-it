'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

type ShowcaseImageProps = {
  src: string | null | undefined;
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
  showPlaceholder?: boolean;
  onReady?: () => void;
  onError?: () => void;
};

export function ShowcaseImage({
  src,
  fallbackSrc,
  alt,
  width,
  height,
  className,
  imgClassName,
  eager = false,
  priority = false,
  sizes = '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw',
  fit = 'cover',
  showPlaceholder = true,
  onReady,
  onError,
}: ShowcaseImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const onReadyRef = useRef(onReady);
  const onErrorRef = useRef(onError);
  onReadyRef.current = onReady;
  onErrorRef.current = onError;

  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const primary = src ?? fallbackSrc ?? '';
  const fallback = fallbackSrc && fallbackSrc !== primary ? fallbackSrc : null;
  const displaySrc = fallback || primary;
  const isAvif = primary.endsWith('.avif') || primary.includes('.avif?') || primary.includes('image/avif');
  const loadEager = eager || priority;

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [displaySrc]);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete && img.naturalWidth > 0) {
      setLoaded(true);
      onReadyRef.current?.();
    }
  }, [displaySrc]);

  if (!src && !fallbackSrc) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-background-soft text-sm text-text-muted',
          className
        )}
        style={{ aspectRatio: width && height ? `${width} / ${height}` : '16 / 10' }}
      >
        No cover uploaded
      </div>
    );
  }

  if (failed) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-background-soft text-sm text-text-muted',
          className
        )}
        style={{ aspectRatio: width && height ? `${width} / ${height}` : '16 / 10' }}
      >
        Preview unavailable
      </div>
    );
  }

  return (
    <picture className={cn('relative block h-full w-full overflow-hidden bg-background-soft', className)}>
      {showPlaceholder && !loaded ? (
        <span
          aria-hidden
          className="absolute inset-0 animate-pulse bg-background-soft motion-reduce:animate-none dark:bg-white/10"
        />
      ) : null}
      {isAvif ? <source srcSet={primary} type="image/avif" /> : null}
      {fallback ? <source srcSet={fallback} type="image/webp" /> : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={displaySrc}
        ref={imgRef}
        src={displaySrc}
        alt={alt}
        width={width ?? 1600}
        height={height ?? 1000}
        loading={loadEager ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        sizes={sizes}
        onLoad={() => {
          setLoaded(true);
          onReadyRef.current?.();
        }}
        onError={() => {
          setFailed(true);
          onErrorRef.current?.();
        }}
        className={cn(
          'relative h-full w-full transition-opacity duration-200 ease-out motion-reduce:transition-none',
          loaded ? 'opacity-100' : 'opacity-0',
          fit === 'contain' ? 'object-contain object-center' : 'object-cover object-center',
          imgClassName
        )}
      />
    </picture>
  );
}
