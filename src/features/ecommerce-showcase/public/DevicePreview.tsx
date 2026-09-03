'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Expand, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { InlineSpinner } from '@/src/components/loading/InlineSpinner';
import { PreviewError } from '@/src/components/skeletons/section-errors';
import { TabRowSkeleton } from '@/src/components/skeletons/TabRowSkeleton';
import { useDelayedLoading } from '@/src/components/skeletons/useDelayedLoading';
import { STALE_PUBLIC_LISTING } from '@/lib/query/client';
import type { DeviceViewport } from '../config/constants';
import { defaultPreviewPage, getPageType, sortPreviewPages } from '../config/page-types';
import type { EcommerceProjectPage } from '../types';
import {
  pageImageUrl,
  preloadImage,
  projectPageImageQueryKey,
} from '../utils/preload-image';
import { DeviceToggle, WebsitePreviewFrame } from './WebsitePreviewFrame';

const PREFETCH_TYPES = new Set(['homepage', 'product_details', 'product', 'cart']);
const IMAGE_STALE = STALE_PUBLIC_LISTING * 30;

function prefetchPageImage(
  queryClient: ReturnType<typeof useQueryClient>,
  projectId: string,
  page: EcommerceProjectPage
) {
  const url = pageImageUrl(page);
  if (!url) return Promise.resolve();
  return queryClient.prefetchQuery({
    queryKey: projectPageImageQueryKey(projectId, page.id),
    queryFn: () => preloadImage(url),
    staleTime: IMAGE_STALE,
  });
}

export function DevicePreview({
  pages,
  projectId,
  initialPageId,
  fillWidth = false,
  projectTitle,
}: {
  pages: EcommerceProjectPage[];
  projectId?: string;
  initialPageId?: string;
  fillWidth?: boolean;
  projectTitle?: string;
}) {
  const queryClient = useQueryClient();
  const resolvedProjectId = projectId || pages[0]?.project_id || 'unknown';

  const visible = useMemo(
    () => sortPreviewPages(pages.filter((page) => page.published && (page.image_url || page.fallback_url))),
    [pages]
  );
  const allPublished = useMemo(
    () => sortPreviewPages(pages.filter((page) => page.published)),
    [pages]
  );
  const fallback = defaultPreviewPage(visible);
  const initialId = initialPageId ?? fallback?.id;

  const [selectedId, setSelectedId] = useState<string | undefined>(initialId);
  const [displayedId, setDisplayedId] = useState<string | undefined>(initialId);
  const [device, setDevice] = useState<DeviceViewport>('desktop');
  const [fullscreen, setFullscreen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [initialReady, setInitialReady] = useState(false);
  const tabListRef = useRef<HTMLDivElement>(null);
  const requestId = useRef(0);
  const selectedIdRef = useRef(selectedId);
  selectedIdRef.current = selectedId;

  const selected =
    visible.find((page) => page.id === selectedId) ??
    allPublished.find((page) => page.id === selectedId) ??
    defaultPreviewPage(visible) ??
    defaultPreviewPage(allPublished);

  const displayed =
    visible.find((page) => page.id === displayedId) ??
    allPublished.find((page) => page.id === displayedId) ??
    selected ??
    null;

  const pending = Boolean(selectedId && displayedId && selectedId !== displayedId);
  const waitingInitial = Boolean(displayed && pageImageUrl(displayed) && !initialReady && !pending);
  const busy = pending || waitingInitial;
  const showSkeleton = useDelayedLoading(busy, 150);

  useEffect(() => {
    const exists =
      visible.some((page) => page.id === selectedId) ||
      allPublished.some((page) => page.id === selectedId);
    if (exists) return;
    const nextId = defaultPreviewPage(visible)?.id ?? defaultPreviewPage(allPublished)?.id;
    if (nextId) {
      setSelectedId(nextId);
      setDisplayedId(nextId);
      setInitialReady(false);
      setImageError(false);
    }
  }, [visible, allPublished, selectedId]);

  useEffect(() => {
    const list = tabListRef.current;
    if (!list || !selected?.id) return;
    const active = list.querySelector<HTMLElement>(`[data-page-id="${selected.id}"]`);
    active?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [selected?.id]);

  useEffect(() => {
    if (!resolvedProjectId || resolvedProjectId === 'unknown') return;
    const targets = visible.filter(
      (page) => PREFETCH_TYPES.has(page.page_type) || page.id === selectedId
    );
    for (const page of targets.slice(0, 3)) {
      void prefetchPageImage(queryClient, resolvedProjectId, page);
    }
  }, [queryClient, resolvedProjectId, visible, selectedId]);

  const selectPage = useCallback(
    async (id: string) => {
      if (id === selectedId) return;
      const seq = ++requestId.current;
      setSelectedId(id);
      setImageError(false);

      const page = visible.find((p) => p.id === id) ?? allPublished.find((p) => p.id === id);
      if (!page) return;

      const url = pageImageUrl(page);
      if (!url) {
        if (seq === requestId.current) {
          setDisplayedId(id);
          setInitialReady(true);
        }
        return;
      }

      try {
        await queryClient.fetchQuery({
          queryKey: projectPageImageQueryKey(resolvedProjectId, page.id),
          queryFn: () => preloadImage(url),
          staleTime: IMAGE_STALE,
        });
        if (seq === requestId.current && selectedIdRef.current === id) {
          setDisplayedId(id);
          setInitialReady(true);
        }
      } catch {
        if (seq === requestId.current && selectedIdRef.current === id) {
          setImageError(true);
        }
      }
    },
    [selectedId, visible, allPublished, queryClient, resolvedProjectId]
  );

  const retry = () => {
    if (!selected) return;
    const id = selected.id;
    setImageError(false);
    setInitialReady(false);
    setDisplayedId(id);
    void queryClient
      .fetchQuery({
        queryKey: projectPageImageQueryKey(resolvedProjectId, id),
        queryFn: () => preloadImage(pageImageUrl(selected)!),
        staleTime: 0,
      })
      .then(() => {
        if (selectedIdRef.current === id) {
          setDisplayedId(id);
          setInitialReady(true);
        }
      })
      .catch(() => {
        if (selectedIdRef.current === id) setImageError(true);
      });
  };

  if (pages.length === 0) {
    return <TabRowSkeleton count={4} />;
  }

  if (!displayed && !selected) {
    return (
      <div className="rounded-2xl border border-dashed border-border-subtle p-10 text-center text-text-secondary">
        Screenshots for this website are being prepared.
      </div>
    );
  }

  const framePage = displayed ?? selected;
  const selectedMissingImage = selected && !pageImageUrl(selected) && selectedId === selected.id && !pending;

  let viewer: ReactNode;
  if (imageError) {
    viewer = <PreviewError onRetry={retry} />;
  } else if (selectedMissingImage && !pending) {
    viewer = (
      <WebsitePreviewFrame
        page={null}
        device={device}
        chromeLabel={selected.page_name || getPageType(selected.page_type).label}
        fillWidth={fillWidth}
        projectTitle={projectTitle}
        empty={
          <div className="space-y-2">
            <p className="font-display font-bold text-text-primary">Preview not available for this page.</p>
            <p className="text-sm text-text-muted">No screenshot has been uploaded yet.</p>
          </div>
        }
      />
    );
  } else if (framePage) {
    viewer = (
      <WebsitePreviewFrame
        page={framePage}
        device={device}
        busy={busy}
        subdued={pending && !showSkeleton}
        showContentSkeleton={showSkeleton}
        fillWidth={fillWidth}
        projectTitle={projectTitle}
        onImageReady={() => setInitialReady(true)}
        onImageError={() => {
          if (!pending) setImageError(true);
        }}
      />
    );
  } else {
    viewer = null;
  }

  return (
    <div>
      <div className="mb-3 flex flex-col gap-3">
        <div
          ref={tabListRef}
          className="-mx-1 flex gap-2 overflow-x-auto overscroll-x-contain px-1 pb-1 scrollbar-none"
          role="tablist"
          aria-label="Preview page"
        >
          {visible.map((page) => {
            const isSelected = page.id === selected?.id;
            const isPending = isSelected && pending;
            return (
              <button
                key={page.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => void selectPage(page.id)}
                onMouseEnter={() => void prefetchPageImage(queryClient, resolvedProjectId, page)}
                onFocus={() => void prefetchPageImage(queryClient, resolvedProjectId, page)}
                data-page-id={page.id}
                className={cn(
                  'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border px-3 py-1.5 text-sm font-semibold',
                  isSelected
                    ? 'border-text-primary bg-text-primary text-background'
                    : 'border-border-subtle text-text-secondary'
                )}
              >
                {page.page_name || getPageType(page.page_type).label}
                {isPending ? <InlineSpinner size={14} className="text-current" /> : null}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <DeviceToggle device={device} onChange={setDevice} />
          <button
            type="button"
            onClick={() => setFullscreen(true)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563eb] dark:text-[#60a5fa]"
          >
            <Expand className="h-4 w-4" />
            Full screen
          </button>
        </div>
      </div>

      <div aria-busy={busy || undefined}>{viewer}</div>

      {fullscreen ? (
        <div className="fixed inset-0 z-[80] overflow-auto bg-black/80 p-3 sm:p-6">
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white"
            aria-label="Close preview"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="mx-auto mt-10 max-w-6xl" aria-busy={busy || undefined}>
            {viewer}
          </div>
        </div>
      ) : null}
    </div>
  );
}
