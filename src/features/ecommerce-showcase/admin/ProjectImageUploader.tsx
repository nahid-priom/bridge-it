'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { deleteCoverAction, uploadCoverAction } from '@/app/actions/ecommerce-showcase';
import { SHOWCASE_IMAGE_ACCEPT } from '../config/constants';
import { ShowcaseImage } from '../public/ShowcaseImage';
import { cn } from '@/lib/cn';
import { cmsMuted, cmsSection } from './ui';

export function ProjectImageUploader({
  projectId,
  coverUrl,
  fallbackUrl,
  previewUrl,
  canEdit,
  onEnsureProject,
  onPreview,
  onComplete,
}: {
  projectId: string | null;
  coverUrl: string | null;
  fallbackUrl: string | null;
  previewUrl?: string | null;
  canEdit: boolean;
  onEnsureProject: () => Promise<string | null>;
  onPreview: (url: string | null) => void;
  onComplete: () => Promise<void>;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [pending, startTransition] = useTransition();
  const displaySrc = previewUrl || coverUrl;

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const onFile = async (file: File) => {
    setError(null);
    const localUrl = URL.createObjectURL(file);
    onPreview(localUrl);
    setProgress('Uploading cover…');
    const id = await onEnsureProject();
    if (!id) {
      setProgress(null);
      setError('Could not create a draft project for this upload.');
      return;
    }
    const form = new FormData();
    form.set('projectId', id);
    form.set('file', file);
    startTransition(async () => {
      const result = await uploadCoverAction(form);
      setProgress(null);
      if (result.error) {
        setError(result.error);
        return;
      }
      await onComplete();
    });
  };

  return (
    <section className={cmsSection}>
      <div>
        <h2 className="font-display font-bold">Cover Image</h2>
        <p className={cmsMuted}>Upload the main mockup image shown in website listings.</p>
      </div>
      <div
        className={cn(
          'rounded-xl overflow-hidden border border-border-subtle aspect-card bg-background-soft',
          dragOver && 'ring-2 ring-emerald-500/50'
        )}
        onDragOver={(event) => {
          event.preventDefault();
          if (canEdit) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          const file = event.dataTransfer.files[0];
          if (file && canEdit) void onFile(file);
        }}
      >
        {displaySrc ? (
          <ShowcaseImage
            src={displaySrc}
            fallbackSrc={previewUrl ? undefined : fallbackUrl}
            alt="Project cover"
            fit="contain"
            className="h-full"
          />
        ) : (
          <div className="h-full flex items-center justify-center px-6 text-center text-sm text-text-muted">
            Upload the main mockup image shown in website listings.
          </div>
        )}
      </div>
      {canEdit ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-xl bg-emerald-600 text-white px-4 py-2 text-sm font-semibold"
            onClick={() => fileRef.current?.click()}
            aria-label={displaySrc ? 'Replace cover image' : 'Upload cover image'}
          >
            {displaySrc ? 'Replace Cover' : 'Upload Cover'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept={SHOWCASE_IMAGE_ACCEPT}
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void onFile(file);
              event.target.value = '';
            }}
          />
          {displaySrc ? (
            <button
              type="button"
              disabled={pending}
              aria-label="Remove cover image"
              onClick={() =>
                startTransition(async () => {
                  if (!projectId) {
                    onPreview(null);
                    return;
                  }
                  const result = await deleteCoverAction(projectId);
                  if (result.error) setError(result.error);
                  else {
                    onPreview(null);
                    await onComplete();
                  }
                })
              }
              className="rounded-xl border border-red-500/30 text-red-500 px-4 py-2 text-sm font-semibold"
            >
              Remove
            </button>
          ) : null}
        </div>
      ) : null}
      {progress ? <p className="text-sm text-emerald-600">{progress}</p> : null}
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </section>
  );
}
