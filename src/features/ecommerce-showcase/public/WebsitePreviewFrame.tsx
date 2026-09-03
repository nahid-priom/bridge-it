'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { PreviewContentSkeleton } from '@/src/components/skeletons/PreviewSkeleton';
import { DEVICE_VIEWPORTS, type DeviceViewport } from '../config/constants';
import { getPageType } from '../config/page-types';
import type { EcommerceProjectPage } from '../types';
import { ShowcaseImage } from './ShowcaseImage';

export function WebsitePreviewFrame({
  page,
  device,
  chromeLabel,
  empty,
  busy = false,
  showContentSkeleton = false,
  subdued = false,
  fillWidth = false,
  projectTitle,
  onImageReady,
  onImageError,
}: {
  page?: Pick<
    EcommerceProjectPage,
    'image_url' | 'fallback_url' | 'page_name' | 'page_type' | 'image_width' | 'image_height'
  > | null;
  device: DeviceViewport;
  chromeLabel?: string;
  empty?: ReactNode;
  busy?: boolean;
  showContentSkeleton?: boolean;
  subdued?: boolean;
  fillWidth?: boolean;
  projectTitle?: string;
  onImageReady?: () => void;
  onImageError?: () => void;
}) {
  const frameWidth = DEVICE_VIEWPORTS[device].width;
  const src = page?.image_url || page?.fallback_url;
  const label =
    chromeLabel || (page ? page.page_name || getPageType(page.page_type).label : 'Website Preview');

  return (
    <div
      className={cn(
        'min-w-0 max-w-full overflow-hidden rounded-2xl border border-border-subtle bg-background-soft transition-opacity duration-200 motion-reduce:transition-none',
        subdued && 'opacity-60'
      )}
      aria-busy={busy || undefined}
    >
      <div className="flex items-center gap-2 bg-[#111827] px-3 py-2 text-xs text-white">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </span>
        <span className="truncate opacity-80">{label}</span>
      </div>
      {src ? (
        <div className="relative overflow-x-auto">
          {showContentSkeleton ? (
            <div className="absolute inset-0 z-10 overflow-hidden bg-background-soft/90">
              <PreviewContentSkeleton className="max-h-[75vh]" />
            </div>
          ) : null}
          <div
            className={cn(
              'mx-auto overflow-y-auto bg-white',
              fillWidth ? 'max-h-[min(70vh,40rem)] lg:max-h-[calc(100vh-14rem)]' : 'max-h-[75vh]',
              device === 'desktop' && !fillWidth ? 'w-full md:w-[68%]' : 'w-full'
            )}
            style={device === 'desktop' ? undefined : { width: `min(100%, ${frameWidth}px)` }}
          >
            <ShowcaseImage
              src={page?.image_url}
              fallbackSrc={page?.fallback_url}
              alt={
                page?.page_name
                  ? `${projectTitle ? `${projectTitle} ` : ''}${page.page_name} page`
                  : projectTitle
                    ? `${projectTitle} website page`
                    : 'Custom e-commerce website page'
              }
              width={page?.image_width ?? frameWidth}
              height={page?.image_height ?? 1800}
              eager
              priority
              sizes={`${frameWidth}px`}
              fit="contain"
              className="w-full"
              imgClassName="h-auto w-full object-contain object-top"
              showPlaceholder={!showContentSkeleton}
              onReady={onImageReady}
              onError={onImageError}
            />
          </div>
        </div>
      ) : (
        <div className="flex max-h-[65vh] min-h-[280px] items-center justify-center p-6 text-center">
          {empty}
        </div>
      )}
    </div>
  );
}

export function DeviceToggle({
  device,
  onChange,
}: {
  device: DeviceViewport;
  onChange: (device: DeviceViewport) => void;
}) {
  return (
    <div
      className="inline-flex rounded-xl border border-border-subtle bg-surface p-1"
      role="group"
      aria-label="Device preview"
    >
      {(Object.keys(DEVICE_VIEWPORTS) as DeviceViewport[]).map((key) => (
        <button
          key={key}
          type="button"
          aria-pressed={device === key}
          onClick={() => onChange(key)}
          className={cn(
            'rounded-lg px-3 py-1.5 text-sm font-semibold',
            device === key
              ? 'bg-text-primary text-background'
              : 'text-text-secondary hover:text-text-primary'
          )}
        >
          {DEVICE_VIEWPORTS[key].label}
        </button>
      ))}
    </div>
  );
}
