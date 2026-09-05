'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { SoftwareProjectScreen } from '../types';
import {
  resolveSoftwareScreen,
  withCacheBust,
} from '../utils/resolve-software-asset';
import { SoftwareShowcaseImage } from './SoftwareShowcaseImage';

function screenImageUrl(screen: SoftwareProjectScreen | null | undefined, assetVersion = 1): string | null {
  if (!screen) return null;
  const resolved = resolveSoftwareScreen(screen, 'preview', assetVersion);
  return resolved ? withCacheBust(resolved.url, resolved.assetVersion) : null;
}

function screenThumbUrl(screen: SoftwareProjectScreen | null | undefined, assetVersion = 1): string | null {
  if (!screen) return null;
  const resolved = resolveSoftwareScreen(screen, 'thumb', assetVersion);
  return resolved ? withCacheBust(resolved.url, resolved.assetVersion) : null;
}

export function screenLabel(screen: SoftwareProjectScreen): string {
  return screen.module_name || screen.screen_name;
}

function preloadImage(url: string): void {
  if (!url || typeof window === 'undefined') return;
  const img = new Image();
  img.decoding = 'async';
  img.src = url;
}

export function GalleryLightbox({
  open,
  title,
  imageUrl,
  canPrev,
  canNext,
  onPrev,
  onNext,
  onClose,
}: {
  open: boolean;
  title: string;
  imageUrl: string | null;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}) {
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onPrev();
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        onNext();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, onPrev, onNext]);

  if (!open || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex flex-col bg-black/90"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onPointerDown={(e) => {
        pointerStart.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={(e) => {
        const start = pointerStart.current;
        pointerStart.current = null;
        if (!start) return;
        const dx = e.clientX - start.x;
        const dy = e.clientY - start.y;
        if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
        if (dx < 0) onNext();
        else onPrev();
      }}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 text-white">
        <p className="min-w-0 truncate text-sm font-semibold sm:text-base">{title}</p>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20"
          aria-label="Close fullscreen gallery"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-12 pb-8">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canPrev}
          aria-label="Previous screenshot"
          className={cn(
            'absolute left-2 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl bg-white/10 text-white',
            !canPrev && 'cursor-not-allowed opacity-30'
          )}
        >
          <ChevronLeft className="h-6 w-6" aria-hidden />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt={title} className="max-h-full max-w-full object-contain" />
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          aria-label="Next screenshot"
          className={cn(
            'absolute right-2 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl bg-white/10 text-white',
            !canNext && 'cursor-not-allowed opacity-30'
          )}
        >
          <ChevronRight className="h-6 w-6" aria-hidden />
        </button>
      </div>
    </div>
  );
}

export function ProjectScreenGallery({
  screens,
  assetVersion = 1,
  productTitle,
  selectedKey,
  onSelectKey,
  className,
  /** When true, omit large “Screenshots” chrome — image is the hero. */
  heroMode = true,
}: {
  screens: SoftwareProjectScreen[];
  assetVersion?: number;
  productTitle: string;
  selectedKey?: string;
  onSelectKey?: (key: string) => void;
  className?: string;
  heroMode?: boolean;
}) {
  const published = screens.filter((s) => s.published !== false);
  const initial =
    published.find((s) => s.screen_key === selectedKey) ??
    published.find((s) => s.is_featured) ??
    published[0] ??
    null;

  const [activeKey, setActiveKey] = useState(initial?.screen_key);
  const [lightbox, setLightbox] = useState(false);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = published.find((s) => s.screen_key === activeKey) ?? initial;
  const selectedIndex = selected
    ? published.findIndex((s) => s.screen_key === selected.screen_key)
    : 0;
  const imageUrl = screenImageUrl(selected, assetVersion);
  const canPrev = selectedIndex > 0;
  const canNext = selectedIndex >= 0 && selectedIndex < published.length - 1;

  const selectScreen = useCallback(
    (screen: SoftwareProjectScreen) => {
      setActiveKey(screen.screen_key);
      onSelectKey?.(screen.screen_key);
      const url = screenImageUrl(screen, assetVersion);
      if (url) preloadImage(url);
    },
    [assetVersion, onSelectKey]
  );

  const goRelative = useCallback(
    (dir: -1 | 1) => {
      const next = published[selectedIndex + dir];
      if (next) selectScreen(next);
    },
    [published, selectScreen, selectedIndex]
  );

  useEffect(() => {
    if (selectedKey && published.some((s) => s.screen_key === selectedKey)) {
      setActiveKey(selectedKey);
    }
  }, [selectedKey, published]);

  useEffect(() => {
    if (!imageUrl) return;
    preloadImage(imageUrl);
    const next = published[selectedIndex + 1];
    const prev = published[selectedIndex - 1];
    const idle = window.setTimeout(() => {
      const nUrl = screenImageUrl(next, assetVersion);
      const pUrl = screenImageUrl(prev, assetVersion);
      if (nUrl) preloadImage(nUrl);
      if (pUrl) preloadImage(pUrl);
    }, 200);
    return () => window.clearTimeout(idle);
  }, [assetVersion, imageUrl, published, selectedIndex]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (lightbox) return;
      const target = event.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (typing) return;
      if (!rootRef.current?.contains(document.activeElement) && document.activeElement !== document.body) {
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goRelative(-1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goRelative(1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goRelative, lightbox]);

  const onPointerDown = (event: ReactPointerEvent) => {
    pointerStart.current = { x: event.clientX, y: event.clientY };
  };
  const onPointerUp = (event: ReactPointerEvent) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) goRelative(1);
    else goRelative(-1);
  };

  if (published.length === 0) return null;

  const title = selected ? screenLabel(selected) : 'Screen';
  const counter = `${Math.max(1, selectedIndex + 1)} / ${published.length}`;

  return (
    <section
      ref={rootRef}
      className={cn('min-w-0', className)}
      aria-labelledby="screens-heading"
    >
      <h2 id="screens-heading" className={heroMode ? 'sr-only' : 'mb-3 font-display text-xl font-black text-text-primary md:text-2xl'}>
        Screens
      </h2>

      {/* Active screenshot — primary hero visual */}
      <button
        type="button"
        className="group relative block w-full overflow-hidden rounded-2xl border border-border-subtle bg-[#0a1628] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
        onClick={() => setLightbox(true)}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        aria-label={`Open ${title} fullscreen`}
      >
        {selected ? (
          <SoftwareShowcaseImage
            kind="preview"
            screen={selected}
            productTitle={productTitle}
            assetVersion={assetVersion}
            eager
            className="w-full"
            sizes="(min-width: 1024px) 55vw, 100vw"
            imgClassName="mx-auto max-h-[min(70vh,32rem)] w-full object-contain lg:max-h-[min(75vh,36rem)]"
          />
        ) : (
          <div className="flex aspect-video items-center justify-center text-sm text-text-muted">
            Preview unavailable
          </div>
        )}
        <span
          className="absolute right-2.5 top-2.5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-black/55 text-white backdrop-blur-sm transition-opacity group-hover:bg-black/70"
          aria-hidden
        >
          <Maximize2 className="h-4 w-4" />
        </span>
      </button>

      {/* Label + counter + compact arrows */}
      <div className="mt-2.5 flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-sm font-semibold text-text-primary">
          {title}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <span className="tabular-nums text-xs text-text-muted sm:text-sm">{counter}</span>
          <button
            type="button"
            onClick={() => goRelative(-1)}
            disabled={!canPrev}
            aria-label="Previous screenshot"
            className={cn(
              'inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border-subtle bg-surface',
              canPrev
                ? 'text-text-primary hover:border-bridge-primary/40'
                : 'cursor-not-allowed text-text-muted opacity-40'
            )}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => goRelative(1)}
            disabled={!canNext}
            aria-label="Next screenshot"
            className={cn(
              'inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border-subtle bg-surface',
              canNext
                ? 'text-text-primary hover:border-bridge-primary/40'
                : 'cursor-not-allowed text-text-muted opacity-40'
            )}
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>

      {/* Thumbnail rail */}
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="list" aria-label="Screenshot thumbnails">
        {published.map((screen) => {
          const thumb = screenThumbUrl(screen, assetVersion);
          const active = screen.screen_key === selected?.screen_key;
          const label = screenLabel(screen);
          return (
            <button
              key={screen.id}
              type="button"
              role="listitem"
              onClick={() => selectScreen(screen)}
              className={cn(
                'relative w-[4.75rem] shrink-0 overflow-hidden rounded-lg border text-left transition-[border-color,opacity] duration-200 sm:w-24',
                active
                  ? 'border-bridge-primary ring-1 ring-bridge-primary/30'
                  : 'border-border-subtle opacity-85 hover:opacity-100'
              )}
              aria-label={label}
              aria-current={active ? 'true' : undefined}
            >
              {thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumb}
                  alt=""
                  className="aspect-video w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <span className="flex aspect-video items-center justify-center bg-background-soft text-[10px] text-text-muted">
                  —
                </span>
              )}
            </button>
          );
        })}
      </div>

      <GalleryLightbox
        open={lightbox}
        title={title}
        imageUrl={imageUrl}
        canPrev={canPrev}
        canNext={canNext}
        onPrev={() => goRelative(-1)}
        onNext={() => goRelative(1)}
        onClose={() => setLightbox(false)}
      />
    </section>
  );
}
