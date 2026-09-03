'use client';

import { useRef, useState } from 'react';
import { ImageIcon, Loader2, Trash2, Upload } from 'lucide-react';
import { removeSolutionCoverAction, uploadSolutionCoverAction } from '@/app/actions/solution-cover';
import { SolutionCoverImage } from '@/components/solutions/SolutionCoverImage';
import type { BitpProduct } from '@/types/bitp';
import { cn } from '@/lib/cn';

const ACCEPT = 'image/png,image/jpeg,image/webp,image/avif';

type ProductCoverSectionProps = {
  form: Partial<BitpProduct>;
  categoryName?: string;
  onUpdated: (updates: Partial<BitpProduct>) => void;
};

export function ProductCoverSection({ form, onUpdated }: ProductCoverSectionProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const coverSrc = form.cover_image ?? form.thumbnail ?? null;
  const canManage = Boolean(form.id);

  const handleUpload = async (file: File) => {
    if (!form.id) return;
    setUploading(true);
    setError(null);
    const fd = new FormData();
    fd.set('file', file);
    fd.set('productId', form.id);
    const result = await uploadSolutionCoverAction(fd);
    setUploading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.data) {
      onUpdated({
        cover_image: result.data.publicUrl,
        thumbnail: result.data.publicUrl,
        cover_image_path: result.data.storagePath,
        cover_image_alt: result.data.alt,
        cover_image_prompt: null,
        cover_image_updated_at: new Date().toISOString(),
      });
    }
  };

  const handleRemove = async () => {
    if (!form.id) return;
    if (!confirm('Remove cover image?')) return;
    setRemoving(true);
    setError(null);
    const result = await removeSolutionCoverAction(form.id);
    setRemoving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    onUpdated({
      cover_image: null,
      thumbnail: null,
      cover_image_path: null,
      cover_image_alt: null,
      cover_image_prompt: null,
      cover_image_updated_at: null,
    });
  };

  return (
    <div className="sm:col-span-2 rounded-xl border border-white/10 p-4 space-y-4">
      <div className="flex items-center gap-2">
        <ImageIcon className="w-4 h-4 text-emerald-400" />
        <h3 className="text-sm font-semibold text-white">Cover Image</h3>
      </div>

      <div
        className={cn(
          'max-w-md rounded-xl overflow-hidden border border-white/10',
          dragOver && 'ring-2 ring-emerald-500/60'
        )}
        onDragOver={(event) => {
          event.preventDefault();
          if (canManage) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          const file = event.dataTransfer.files[0];
          if (file && canManage) void handleUpload(file);
        }}
      >
        {coverSrc ? (
          <SolutionCoverImage
            src={coverSrc}
            alt={form.cover_image_alt ?? form.name ?? 'Product cover'}
            categorySlug={form.category?.slug}
            className="group-hover:scale-100"
          />
        ) : (
          <div className="aspect-[16/9] flex items-center justify-center bg-white/[0.03] text-sm text-white/50">
            No cover uploaded
          </div>
        )}
      </div>

      {!canManage && (
        <p className="text-xs text-white/40">Save the product first to upload a cover image.</p>
      )}

      <p className="text-xs text-white/40">PNG, JPEG, WebP, or AVIF. Drag and drop onto the preview, or upload below.</p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={!canManage || uploading}
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          {coverSrc ? 'Replace cover' : 'Upload Cover'}
        </button>
        <button
          type="button"
          disabled={!canManage || removing || !coverSrc}
          onClick={handleRemove}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-red-500/30 text-red-300 hover:bg-red-500/10 disabled:opacity-50"
        >
          {removing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          Remove
        </button>
        <input
          ref={fileRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleUpload(file);
            e.target.value = '';
          }}
        />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
