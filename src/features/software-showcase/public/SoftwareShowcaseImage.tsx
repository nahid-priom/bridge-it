'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import {
  resolveSoftwareCover,
  resolveSoftwareScreen,
  withCacheBust,
  type ResolvedSoftwareAsset,
  type SoftwareAssetKind,
} from '../utils/resolve-software-asset';
import type { SoftwareProject, SoftwareProjectScreen } from '../types';

type CoverProps = {
  kind: 'card' | 'detail';
  project: Pick<SoftwareProject, 'title' | 'cover_card_url' | 'cover_detail_url'> & {
    asset_version?: number | null;
  };
  className?: string;
  imgClassName?: string;
  eager?: boolean;
  priority?: boolean;
  sizes?: string;
};

type ScreenProps = {
  kind: 'thumb' | 'preview' | 'mobile';
  screen: Pick<
    SoftwareProjectScreen,
    'screen_name' | 'image_url' | 'thumbnail_url' | 'mobile_image_url'
  >;
  productTitle?: string;
  assetVersion?: number;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
  sizes?: string;
};

type Common = {
  alt?: string;
};

function resolveProps(props: (CoverProps | ScreenProps) & Common): {
  resolved: ResolvedSoftwareAsset | null;
  alt: string;
  eager: boolean;
  priority: boolean;
  sizes: string;
  aspect: string;
  className?: string;
  imgClassName?: string;
  fallbackTitle: string;
} {
  if (props.kind === 'card' || props.kind === 'detail') {
    const cover = props;
    return {
      resolved: resolveSoftwareCover(cover.project, cover.kind),
      alt: cover.alt ?? `${cover.project.title} cover`,
      eager: Boolean(cover.eager) || cover.kind === 'detail',
      priority: Boolean(cover.priority),
      sizes:
        cover.sizes ??
        (cover.kind === 'card'
          ? '(min-width: 1280px) 28vw, (min-width: 768px) 45vw, 100vw'
          : '100vw'),
      aspect: 'aspect-card',
      className: cover.className,
      imgClassName: cover.imgClassName,
      fallbackTitle: cover.project.title,
    };
  }

  const screen = props as ScreenProps & Common;
  return {
    resolved: resolveSoftwareScreen(screen.screen, screen.kind, screen.assetVersion ?? 1),
    alt:
      screen.alt ??
      `${screen.productTitle ? `${screen.productTitle} — ` : ''}${screen.screen.screen_name}`,
    eager: Boolean(screen.eager) || screen.kind === 'preview',
    priority: false,
    sizes: screen.sizes ?? (screen.kind === 'thumb' ? '120px' : '100vw'),
    aspect: screen.kind === 'mobile' ? 'aspect-[420/860]' : 'aspect-[16/10]',
    className: screen.className,
    imgClassName: screen.imgClassName,
    fallbackTitle: screen.productTitle || screen.screen.screen_name,
  };
}

function PremiumFallback({
  title,
  aspect,
  className,
  compact,
}: {
  title: string;
  aspect: string;
  className?: string;
  compact?: boolean;
}) {
  const initial = title.trim().charAt(0).toUpperCase() || 'S';
  return (
    <div
      className={cn(
        'relative flex overflow-hidden',
        compact ? 'aspect-card' : aspect,
        'bg-gradient-to-br from-[#0f2744] via-[#132f52] to-[#1a3a5c]',
        className
      )}
      role="img"
      aria-label={`${title} — preview unavailable`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(37,99,235,0.35), transparent 45%), radial-gradient(circle at 80% 70%, rgba(59,130,246,0.2), transparent 40%)',
        }}
      />
      <div className="relative z-[1] flex w-full flex-col items-center justify-center gap-2 px-4 py-5 text-center">
        <span
          className={cn(
            'inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 font-display font-bold text-white/90',
            compact ? 'h-10 w-10 text-lg' : 'h-12 w-12 text-xl'
          )}
          aria-hidden
        >
          {initial}
        </span>
        <p className="text-xs font-medium tracking-wide text-white/55">Preview unavailable</p>
      </div>
    </div>
  );
}

/**
 * Shared Software showcase image — card / detail / thumb / preview / mobile.
 * Missing canonical asset → compact premium fallback. Never silently shows legacy assets.
 */
export function SoftwareShowcaseImage(props: (CoverProps | ScreenProps) & Common) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const { resolved, alt, eager, priority, sizes, aspect, className, imgClassName, fallbackTitle } =
    resolveProps(props);

  const isCover = props.kind === 'card' || props.kind === 'detail';
  const src = resolved ? withCacheBust(resolved.url, resolved.assetVersion) : '';

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  useEffect(() => {
    if (!src || failed) return;
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [src, failed]);

  if (!resolved || failed) {
    return (
      <PremiumFallback
        title={fallbackTitle}
        aspect={aspect}
        className={className}
        compact={isCover && props.kind === 'card'}
      />
    );
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        isCover ? 'bg-[#0b1220]' : 'bg-background-soft',
        aspect,
        className
      )}
    >
      {!loaded ? (
        <span
          aria-hidden
          className="absolute inset-0 z-[1] animate-pulse bg-background-soft motion-reduce:animate-none dark:bg-white/10"
        />
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={resolved.width}
        height={resolved.height}
        loading={eager || priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={cn(
          'relative transition-opacity duration-200 ease-out motion-reduce:transition-none',
          loaded ? 'opacity-100' : 'opacity-0',
          isCover
            ? 'h-full w-full object-contain object-center'
            : 'h-full w-full object-cover object-top',
          imgClassName
        )}
      />
    </div>
  );
}

export type { SoftwareAssetKind };
