'use client';

import { useState } from 'react';
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
          ? '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw'
          : '100vw'),
      aspect: cover.kind === 'card' ? 'aspect-[4/3]' : 'aspect-[16/10]',
      className: cover.className,
      imgClassName: cover.imgClassName,
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
  };
}

/**
 * Shared Software showcase image — card / detail / thumb / preview / mobile.
 * Missing canonical asset → skeleton. Never silently shows legacy assets.
 */
export function SoftwareShowcaseImage(props: (CoverProps | ScreenProps) & Common) {
  const [failed, setFailed] = useState(false);
  const { resolved, alt, eager, priority, sizes, aspect, className, imgClassName } =
    resolveProps(props);

  if (!resolved || failed) {
    return (
      <div
        className={cn('relative overflow-hidden bg-background-soft', aspect, className)}
        aria-hidden={!resolved}
        role={resolved ? undefined : 'img'}
        aria-label={resolved ? undefined : 'Image unavailable'}
      >
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-background-soft via-border-subtle/40 to-background-soft" />
      </div>
    );
  }

  const src = withCacheBust(resolved.url, resolved.assetVersion);

  return (
    <div className={cn('relative overflow-hidden bg-background-soft', aspect, className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={resolved.width}
        height={resolved.height}
        loading={eager || priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        sizes={sizes}
        onError={() => setFailed(true)}
        className={cn('h-full w-full object-cover object-top', imgClassName)}
      />
    </div>
  );
}

export type { SoftwareAssetKind };
