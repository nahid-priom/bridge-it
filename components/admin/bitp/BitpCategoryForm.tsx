'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { slugify } from '@/lib/catalog/slugify';
import { upsertBitpCategoryAction, deleteBitpCategoryAction } from '@/app/actions/bitp-admin';
import type { BitpCategory } from '@/types/bitp';
import { cn } from '@/lib/cn';

type BitpCategoryFormProps = {
  category?: BitpCategory | null;
  onClose: () => void;
  onSaved: () => void;
};

export function BitpCategoryForm({ category, onClose, onSaved }: BitpCategoryFormProps) {
  const [form, setForm] = useState({
    id: category?.id,
    name: category?.name ?? '',
    slug: category?.slug ?? '',
    description: category?.description ?? '',
    icon: category?.icon ?? '📦',
    sort_order: category?.sort_order ?? 0,
    is_active: category?.is_active ?? true,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    const payload = {
      ...form,
      slug: form.slug.trim() || slugify(form.name),
    };
    const result = await upsertBitpCategoryAction(payload);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    onSaved();
    onClose();
  };

  const handleDelete = async () => {
    if (!category?.id) return;
    if (!confirm(`Delete category "${category.name}"?`)) return;
    setLoading(true);
    const result = await deleteBitpCategoryAction(category.id);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/60" onClick={onClose} aria-label="Close" />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-bridge-dark p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">{category ? 'Edit Category' : 'Add Category'}</h3>
          <button type="button" onClick={onClose} className="p-1 text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

        <div className="space-y-3">
          <label className="block text-xs text-white/60">
            Icon
            <input
              className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
            />
          </label>
          <label className="block text-xs text-white/60">
            Name
            <input
              className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                  slug: category ? form.slug : slugify(e.target.value),
                })
              }
            />
          </label>
          <label className="block text-xs text-white/60">
            Slug
            <input
              className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white font-mono text-sm"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </label>
          <label className="block text-xs text-white/60">
            Description
            <textarea
              className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white min-h-[80px]"
              value={form.description ?? ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>
          <label className="block text-xs text-white/60">
            Sort order
            <input
              type="number"
              className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-white/80">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            />
            Active
          </label>
        </div>

        <div className="mt-6 flex gap-2 justify-end">
          {category?.id && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-sm text-red-400 border border-red-400/30 hover:bg-red-400/10"
            >
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm text-white/70 border border-white/10"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-500',
              loading && 'opacity-60'
            )}
          >
            {loading ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
