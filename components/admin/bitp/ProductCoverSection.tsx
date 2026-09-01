'use client';

import { useRef, useState, useEffect } from 'react';
import { ImageIcon, Loader2, RefreshCw, Trash2, Upload, Wand2 } from 'lucide-react';
import {
  generateSolutionCoverAction,
  removeSolutionCoverAction,
  uploadSolutionCoverAction,
  updateCoverPromptAction,
} from '@/app/actions/solution-cover';
import { buildSolutionCoverPrompt } from '@/lib/solutions/buildCoverPrompt';
import { SolutionCoverImage } from '@/components/solutions/SolutionCoverImage';
import type { BitpProduct } from '@/types/bitp';

type ProductCoverSectionProps = {
  form: Partial<BitpProduct>;
  categoryName?: string;
  onUpdated: (updates: Partial<BitpProduct>) => void;
};

export function ProductCoverSection({ form, categoryName, onUpdated }: ProductCoverSectionProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState(form.cover_image_prompt ?? '');

  useEffect(() => {
    setPrompt(form.cover_image_prompt ?? '');
  }, [form.id, form.cover_image_prompt]);

  const coverSrc = form.cover_image ?? form.thumbnail ?? null;
  const canManage = Boolean(form.id);

  const refreshPromptPreview = () => {
    if (!form.name) return;
    setPrompt(
      buildSolutionCoverPrompt({
        title: form.name,
        category: categoryName,
        shortDescription: form.short_description,
        productType: form.product_type,
        slug: form.slug,
      })
    );
  };

  const handleGenerate = async (regenerate = false) => {
    if (!form.id) return;
    setGenerating(true);
    setError(null);
    const result = await generateSolutionCoverAction({
      productId: form.id,
      customPrompt: prompt.trim() || undefined,
    });
    setGenerating(false);
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
        cover_image_prompt: result.data.prompt,
        cover_image_updated_at: new Date().toISOString(),
      });
      setPrompt(result.data.prompt);
    }
    if (regenerate) return;
  };

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
        cover_image_prompt: result.data.prompt,
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
    setPrompt('');
  };

  const handleSavePrompt = async () => {
    if (!form.id || !prompt.trim()) return;
    await updateCoverPromptAction({ productId: form.id, prompt: prompt.trim() });
  };

  return (
    <div className="sm:col-span-2 rounded-xl border border-white/10 p-4 space-y-4">
      <div className="flex items-center gap-2">
        <ImageIcon className="w-4 h-4 text-emerald-400" />
        <h3 className="text-sm font-semibold text-white">Cover Image</h3>
      </div>

      <div className="max-w-md rounded-xl overflow-hidden border border-white/10">
        <SolutionCoverImage
          src={coverSrc}
          alt={form.cover_image_alt ?? form.name ?? 'Product cover'}
          categorySlug={form.category?.slug}
          className="group-hover:scale-100"
        />
      </div>

      {!canManage && (
        <p className="text-xs text-white/40">Save the product first to manage cover images.</p>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={!canManage || generating}
          onClick={() => handleGenerate(false)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
          Generate Cover
        </button>
        <button
          type="button"
          disabled={!canManage || generating || !coverSrc}
          onClick={() => handleGenerate(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-white/10 text-white/80 hover:text-white disabled:opacity-50"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Regenerate
        </button>
        <button
          type="button"
          disabled={!canManage || uploading}
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-white/10 text-white/80 hover:text-white disabled:opacity-50"
        >
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          Upload Custom
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
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
            e.target.value = '';
          }}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-white/60">AI Cover Prompt</label>
          <button
            type="button"
            onClick={refreshPromptPreview}
            className="text-[10px] text-emerald-400 hover:text-emerald-300"
          >
            Reset from product
          </button>
        </div>
        <textarea
          className="w-full min-h-[100px] rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white text-xs"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onBlur={handleSavePrompt}
          placeholder="Prompt used for AI cover generation..."
        />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
