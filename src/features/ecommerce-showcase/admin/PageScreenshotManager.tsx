'use client';

import { useRef, useState, useTransition, type RefObject } from 'react';
import {
  deletePageAction,
  reorderPagesAction,
  updatePageRecordAction,
  uploadPageScreenshotAction,
} from '@/app/actions/ecommerce-showcase';
import { SHOWCASE_IMAGE_ACCEPT } from '../config/constants';
import { SLOT_PAGE_TYPES, getPageType, pageHasImage } from '../config/page-types';
import { slugifyTitle } from '../schemas/project';
import type { EcommerceProjectPage } from '../types';
import { ShowcaseImage } from '../public/ShowcaseImage';
import { cmsInput, cmsMuted, cmsSection } from './ui';

function pageForType(pages: EcommerceProjectPage[], typeId: string) {
  return pages.find((page) => page.page_type === typeId);
}

export function PageScreenshotManager({
  projectId,
  pages,
  previews,
  canEdit,
  onEnsureProject,
  onPreview,
  onSelectPreview,
  onComplete,
  homepageInputRef,
}: {
  projectId: string | null;
  pages: EcommerceProjectPage[];
  previews: Record<string, string>;
  canEdit: boolean;
  onEnsureProject: () => Promise<string | null>;
  onPreview: (key: string, url: string | null) => void;
  onSelectPreview: (pageId: string) => void;
  onComplete: () => Promise<void>;
  homepageInputRef: RefObject<HTMLInputElement | null>;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [customName, setCustomName] = useState('Custom Page');
  const [pending, startTransition] = useTransition();
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const customPages = pages.filter((page) => page.page_type === 'custom');
  const leftoverPages = pages.filter((page) => !getPageType(page.page_type).selectable);

  const upload = async (file: File, pageType: string, pageId?: string, pageName?: string) => {
    const key = pageId ?? pageType;
    setError(null);
    onPreview(key, URL.createObjectURL(file));
    setPendingKey(key);
    const id = await onEnsureProject();
    if (!id) {
      setPendingKey(null);
      setError('Could not create a draft project for this upload.');
      return;
    }
    const form = new FormData();
    form.set('projectId', id);
    form.set('pageType', pageType);
    form.set('pageName', pageName || getPageType(pageType).label);
    if (pageId) form.set('pageId', pageId);
    form.set('file', file);
    startTransition(async () => {
      const result = await uploadPageScreenshotAction(form);
      setPendingKey(null);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.data?.id) onSelectPreview(result.data.id);
      await onComplete();
    });
  };

  const removePage = (page: EcommerceProjectPage) => {
    startTransition(async () => {
      const result = await deletePageAction(page.id);
      if (result.error) setError(result.error);
      else {
        onPreview(page.page_type, null);
        onPreview(page.id, null);
        await onComplete();
      }
    });
  };

  const move = (index: number, direction: -1 | 1) => {
    if (!projectId) return;
    const next = [...pages];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    if (next.some((page) => page.id.startsWith('local-'))) return;
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    startTransition(async () => {
      await reorderPagesAction(
        projectId,
        next.map((page) => page.id)
      );
      await onComplete();
    });
  };

  return (
    <section className={cmsSection}>
      <div>
        <h2 className="font-display font-bold">Website Page Screenshots</h2>
        <p className={cmsMuted}>Upload screenshots for each website page. Homepage is selected by default.</p>
      </div>

      <div className="space-y-2">
        {SLOT_PAGE_TYPES.map((type) => {
          const page = pageForType(pages, type.id);
          const preview = previews[page?.id ?? ''] || previews[type.id] || page?.thumbnail_url;
          const uploaded = Boolean(preview) || (page ? pageHasImage(page) : false);
          const slotIndex = page ? pages.findIndex((item) => item.id === page.id) : -1;
          const inputRefCallback = (node: HTMLInputElement | null) => {
            fileRefs.current[type.id] = node;
            if (type.id === 'homepage') homepageInputRef.current = node;
          };
          return (
            <div
              key={type.id}
              className="flex items-center gap-3 rounded-xl border border-border-subtle px-3 py-2 min-w-0"
            >
              {preview ? (
                <ShowcaseImage
                  src={preview}
                  fallbackSrc={previews[type.id] ? undefined : page?.fallback_url}
                  alt={`${type.label} thumbnail`}
                  className="h-12 w-20 rounded-md shrink-0"
                  fit="cover"
                />
              ) : (
                <div className="h-12 w-20 rounded-md bg-background-soft shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">{type.label}</p>
                <p className="text-xs text-text-muted">
                  {pendingKey === (page?.id ?? type.id) ? 'Uploading…' : uploaded ? 'Uploaded' : 'Not uploaded'}
                </p>
              </div>
              {canEdit ? (
                <div className="flex flex-wrap gap-1.5 justify-end">
                  <input
                    ref={inputRefCallback}
                    type="file"
                    accept={SHOWCASE_IMAGE_ACCEPT}
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void upload(file, type.id, page?.id, type.label);
                      event.target.value = '';
                    }}
                  />
                  {uploaded && page ? (
                    <>
                      <button
                        type="button"
                        className="rounded-lg border border-border-subtle px-2.5 py-1 text-xs font-semibold"
                        onClick={() => onSelectPreview(page.id)}
                        aria-label={`Preview ${type.label}`}
                      >
                        Preview
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-border-subtle px-2.5 py-1 text-xs font-semibold"
                        onClick={() => fileRefs.current[type.id]?.click()}
                        aria-label={`Replace ${type.label} screenshot`}
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-red-500/30 text-red-500 px-2.5 py-1 text-xs font-semibold"
                        onClick={() => removePage(page)}
                        aria-label={`Remove ${type.label} screenshot`}
                      >
                        Remove
                      </button>
                      {slotIndex >= 0 ? (
                        <>
                          <button
                            type="button"
                            className="text-xs text-text-muted"
                            disabled={slotIndex === 0 || pending}
                            onClick={() => move(slotIndex, -1)}
                          >
                            Up
                          </button>
                          <button
                            type="button"
                            className="text-xs text-text-muted"
                            disabled={slotIndex === pages.length - 1 || pending}
                            onClick={() => move(slotIndex, 1)}
                          >
                            Down
                          </button>
                        </>
                      ) : null}
                    </>
                  ) : (
                    <button
                      type="button"
                      className="rounded-lg bg-emerald-600 text-white px-2.5 py-1 text-xs font-semibold"
                      onClick={() => fileRefs.current[type.id]?.click()}
                      aria-label={`Upload ${type.label} screenshot`}
                    >
                      Upload
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold">Custom Page</p>
        {customPages.map((page, index) => {
          const slotIndex = pages.findIndex((item) => item.id === page.id);
          const preview = previews[page.id] || page.thumbnail_url;
          return (
            <div key={page.id} className="flex items-center gap-3 rounded-xl border border-border-subtle px-3 py-2">
              {preview ? (
                <ShowcaseImage src={preview} alt={`${page.page_name} thumbnail`} className="h-12 w-20 rounded-md shrink-0" />
              ) : (
                <div className="h-12 w-20 rounded-md bg-background-soft shrink-0" />
              )}
              <input
                defaultValue={page.page_name}
                disabled={!canEdit}
                aria-label="Custom page name"
                onBlur={(event) => {
                  const name = event.target.value.trim();
                  if (!name || name === page.page_name) return;
                  startTransition(async () => {
                    await updatePageRecordAction(page.id, { page_name: name, slug: slugifyTitle(name) || 'custom' });
                    await onComplete();
                  });
                }}
                className={`${cmsInput} max-w-[160px]`}
              />
              {canEdit ? (
                <div className="flex flex-wrap gap-1.5 ml-auto">
                  <input
                    ref={(node) => {
                      fileRefs.current[page.id] = node;
                    }}
                    type="file"
                    accept={SHOWCASE_IMAGE_ACCEPT}
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void upload(file, 'custom', page.id, page.page_name);
                      event.target.value = '';
                    }}
                  />
                  {pageHasImage(page) || previews[page.id] ? (
                    <button
                      type="button"
                      className="rounded-lg border border-border-subtle px-2.5 py-1 text-xs font-semibold"
                      onClick={() => onSelectPreview(page.id)}
                    >
                      Preview
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="rounded-lg border border-border-subtle px-2.5 py-1 text-xs font-semibold"
                    onClick={() => fileRefs.current[page.id]?.click()}
                  >
                    {pageHasImage(page) ? 'Replace' : 'Upload'}
                  </button>
                  <button type="button" className="text-xs text-text-muted" onClick={() => move(slotIndex, -1)} disabled={index === 0 || pending}>
                    Up
                  </button>
                  <button type="button" className="text-xs text-text-muted" onClick={() => move(slotIndex, 1)} disabled={pending}>
                    Down
                  </button>
                  <button type="button" className="text-xs text-red-500 font-semibold" onClick={() => removePage(page)}>
                    Remove
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}
        {canEdit ? (
          <div className="flex flex-wrap gap-2">
            <input
              value={customName}
              onChange={(event) => setCustomName(event.target.value)}
              className={`${cmsInput} max-w-[200px]`}
              aria-label="New custom page name"
            />
            <button
              type="button"
              className="rounded-xl border border-border-subtle px-3 py-2 text-sm font-semibold"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = SHOWCASE_IMAGE_ACCEPT;
                input.onchange = () => {
                  const file = input.files?.[0];
                  if (file) void upload(file, 'custom', undefined, customName || 'Custom Page');
                };
                input.click();
              }}
            >
              Add custom page
            </button>
          </div>
        ) : null}
      </div>

      {leftoverPages.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm font-semibold">Other pages</p>
          {leftoverPages.map((page) => {
            const slotIndex = pages.findIndex((item) => item.id === page.id);
            const preview = previews[page.id] || page.thumbnail_url;
            const type = getPageType(page.page_type);
            return (
              <div key={page.id} className="flex items-center gap-3 rounded-xl border border-border-subtle px-3 py-2">
                {preview ? (
                  <ShowcaseImage src={preview} alt={`${page.page_name} thumbnail`} className="h-12 w-20 rounded-md shrink-0" />
                ) : (
                  <div className="h-12 w-20 rounded-md bg-background-soft shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{page.page_name || type.label}</p>
                  <p className="text-xs text-text-muted">{type.label}</p>
                </div>
                {canEdit ? (
                  <div className="flex flex-wrap gap-1.5">
                    <input
                      ref={(node) => {
                        fileRefs.current[page.id] = node;
                      }}
                      type="file"
                      accept={SHOWCASE_IMAGE_ACCEPT}
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) void upload(file, page.page_type, page.id, page.page_name);
                        event.target.value = '';
                      }}
                    />
                    {pageHasImage(page) || previews[page.id] ? (
                      <button
                        type="button"
                        className="rounded-lg border border-border-subtle px-2.5 py-1 text-xs font-semibold"
                        onClick={() => onSelectPreview(page.id)}
                      >
                        Preview
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="rounded-lg border border-border-subtle px-2.5 py-1 text-xs font-semibold"
                      onClick={() => fileRefs.current[page.id]?.click()}
                    >
                      {pageHasImage(page) ? 'Replace' : 'Upload'}
                    </button>
                    <button type="button" className="text-xs text-text-muted" onClick={() => move(slotIndex, -1)} disabled={slotIndex <= 0 || pending}>
                      Up
                    </button>
                    <button type="button" className="text-xs text-text-muted" onClick={() => move(slotIndex, 1)} disabled={pending}>
                      Down
                    </button>
                    <button type="button" className="text-xs text-red-500 font-semibold" onClick={() => removePage(page)}>
                      Remove
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}

      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </section>
  );
}
