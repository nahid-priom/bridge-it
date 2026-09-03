'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { FieldSelect } from '@/components/ui/FieldSelect';
import { InlineSpinner } from '@/src/components/loading/InlineSpinner';
import { PreviewError } from '@/src/components/skeletons/section-errors';
import { useDelayedLoading } from '@/src/components/skeletons/useDelayedLoading';
import { STALE_PUBLIC_LISTING } from '@/lib/query/client';
import type { DeviceViewport } from '../config/constants';
import { defaultPreviewPage, getPageType, pageHasImage } from '../config/page-types';
import type { EcommerceProjectPage } from '../types';
import {
  pageImageUrl,
  preloadImage,
  projectPageImageQueryKey,
} from '../utils/preload-image';
import { DeviceToggle, WebsitePreviewFrame } from '../public/WebsitePreviewFrame';

const IMAGE_STALE = STALE_PUBLIC_LISTING * 30;

export function AdminLivePreview({
  pages,
  selectedPageId,
  onSelectPage,
  device,
  onDeviceChange,
  onUploadHomepage,
  canEdit,
  projectId,
}: {
  pages: EcommerceProjectPage[];
  selectedPageId?: string;
  onSelectPage: (id: string) => void;
  device: DeviceViewport;
  onDeviceChange: (device: DeviceViewport) => void;
  onUploadHomepage?: () => void;
  canEdit: boolean;
  projectId?: string;
}) {
  const queryClient = useQueryClient();
  const uploaded = useMemo(() => pages.filter(pageHasImage), [pages]);
  const selected =
    uploaded.find((page) => page.id === selectedPageId) ?? defaultPreviewPage(uploaded);
  const resolvedProjectId = projectId || selected?.project_id || pages[0]?.project_id || 'unknown';
  const homepageMissing = !pages.some((page) => page.page_type === 'homepage' && pageHasImage(page));

  const [displayedId, setDisplayedId] = useState<string | undefined>(selected?.id);
  const [imageError, setImageError] = useState(false);
  const [initialReady, setInitialReady] = useState(false);
  const requestId = useRef(0);
  const selectedIdRef = useRef(selected?.id);
  selectedIdRef.current = selected?.id;

  const displayed = uploaded.find((page) => page.id === displayedId) ?? selected ?? null;
  const pending = Boolean(selected?.id && displayedId && selected.id !== displayedId);
  const waitingInitial = Boolean(displayed && pageImageUrl(displayed) && !initialReady && !pending);
  const busy = pending || waitingInitial;
  const showSkeleton = useDelayedLoading(busy, 150);

  useEffect(() => {
    const id = selected?.id;
    if (!id) {
      setDisplayedId(undefined);
      return;
    }

    const page = uploaded.find((p) => p.id === id) ?? selected;
    const url = pageImageUrl(page);
    const seq = ++requestId.current;
    setImageError(false);

    if (!url) {
      setDisplayedId(id);
      setInitialReady(true);
      return;
    }

    // Already showing this page and ready — skip
    if (id === displayedId && initialReady) return;

    void queryClient
      .fetchQuery({
        queryKey: projectPageImageQueryKey(resolvedProjectId, id),
        queryFn: () => preloadImage(url),
        staleTime: IMAGE_STALE,
      })
      .then(() => {
        if (seq === requestId.current && selectedIdRef.current === id) {
          setDisplayedId(id);
          setInitialReady(true);
        }
      })
      .catch(() => {
        if (seq === requestId.current && selectedIdRef.current === id) {
          setImageError(true);
        }
      });
    // Intentionally depend on selected id only — not displayed/ready (avoids loops)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id, queryClient, resolvedProjectId]);

  const handleSelect = useCallback(
    (id: string) => {
      if (id === selectedPageId) return;
      setInitialReady(false);
      onSelectPage(id);
    },
    [onSelectPage, selectedPageId]
  );

  return (
    <section className="min-w-0 max-w-full space-y-4 overflow-hidden rounded-2xl border border-border-subtle bg-surface p-5">
      <div>
        <h2 className="font-display font-bold">Live Preview</h2>
        <p className="mt-1 text-sm text-text-muted">Preview how this website page will appear to visitors.</p>
        <p className="text-sm text-text-muted">আপলোড করা Website Page এখানে Live Preview দেখুন।</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <label className="min-w-0 flex-1 text-sm font-semibold">
          Preview Page
          <span className="mt-1 flex items-center gap-2">
            <FieldSelect
              className="flex-1"
              aria-label="Preview page"
              value={selected?.id ?? ''}
              disabled={uploaded.length === 0}
              onChange={(event) => handleSelect(event.target.value)}
            >
              {uploaded.length === 0 ? <option value="">No pages uploaded</option> : null}
              {uploaded.map((page) => (
                <option key={page.id} value={page.id}>
                  {page.page_name || getPageType(page.page_type).label}
                </option>
              ))}
            </FieldSelect>
            {pending ? <InlineSpinner size={18} /> : null}
          </span>
        </label>
        <DeviceToggle device={device} onChange={onDeviceChange} />
      </div>

      {imageError ? (
        <PreviewError
          onRetry={() => {
            setImageError(false);
            setInitialReady(false);
            setDisplayedId(undefined);
            if (selected?.id) handleSelect(selected.id);
          }}
        />
      ) : (
        <WebsitePreviewFrame
          page={displayed}
          device={device}
          busy={busy}
          subdued={pending && !showSkeleton}
          showContentSkeleton={showSkeleton}
          onImageReady={() => setInitialReady(true)}
          onImageError={() => {
            if (!pending) setImageError(true);
          }}
          empty={
            <div className="space-y-3">
              <p className="font-display font-bold text-text-primary">Homepage Preview</p>
              <p className="text-sm text-text-muted">
                {homepageMissing ? 'Homepage preview not uploaded yet.' : 'No screenshot uploaded yet.'}
              </p>
              {canEdit && onUploadHomepage ? (
                <button
                  type="button"
                  onClick={onUploadHomepage}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Upload Homepage
                </button>
              ) : null}
            </div>
          }
        />
      )}
    </section>
  );
}
