'use client';

import { useState, useTransition } from 'react';
import type { CatalogIndustry } from '../types';
import { updateCatalogIndustryAction } from './industry-actions';

export function CatalogIndustriesAdmin({ industries }: { industries: CatalogIndustry[] }) {
  const [selectedId, setSelectedId] = useState(industries[0]?.id ?? '');
  const selected = industries.find((i) => i.id === selectedId) ?? null;
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: selected?.name ?? '',
    slug: selected?.slug ?? '',
    short_description: selected?.short_description ?? '',
    seo_title: selected?.seo_title ?? '',
    seo_description: selected?.seo_description ?? '',
    seo_h1: selected?.seo_h1 ?? '',
    seo_intro: selected?.seo_intro ?? '',
    sort_order: selected?.sort_order ?? 0,
    active: selected?.active ?? true,
  });

  const selectIndustry = (id: string) => {
    const ind = industries.find((i) => i.id === id);
    if (!ind) return;
    setSelectedId(id);
    setForm({
      name: ind.name,
      slug: ind.slug,
      short_description: ind.short_description ?? '',
      seo_title: ind.seo_title ?? '',
      seo_description: ind.seo_description ?? '',
      seo_h1: ind.seo_h1 ?? '',
      seo_intro: ind.seo_intro ?? '',
      sort_order: ind.sort_order,
      active: ind.active,
    });
    setMessage(null);
    setError(null);
  };

  const save = () => {
    if (!selected) return;
    if (form.slug !== selected.slug) {
      const ok = window.confirm(
        `Changing slug from "${selected.slug}" to "${form.slug}" will create permanent redirects. Continue?`
      );
      if (!ok) return;
    }
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await updateCatalogIndustryAction({
        id: selected.id,
        ...form,
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      setMessage('Industry saved. Reload if list looks stale.');
    });
  };

  const byRoot = {
    software: industries.filter((i) => i.category_root === 'software'),
    websites: industries.filter((i) => i.category_root === 'websites'),
    marketing: industries.filter((i) => i.category_root === 'marketing'),
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="space-y-4 rounded-2xl border border-border-subtle bg-surface p-4">
        {(['software', 'websites', 'marketing'] as const).map((root) => (
          <div key={root}>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-text-muted">{root}</h3>
            <ul className="space-y-1">
              {byRoot[root].map((ind) => (
                <li key={ind.id}>
                  <button
                    type="button"
                    onClick={() => selectIndustry(ind.id)}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                      ind.id === selectedId
                        ? 'bg-[#0f2744] text-white'
                        : 'hover:bg-background-soft'
                    }`}
                  >
                    {ind.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      {selected ? (
        <div className="rounded-2xl border border-border-subtle bg-surface p-5">
          <h2 className="font-display text-xl font-black text-text-primary">
            Edit {selected.name}
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            Path: /{selected.category_root}/{form.slug || selected.slug}
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {(
              [
                ['name', 'Name'],
                ['slug', 'Slug'],
                ['seo_h1', 'SEO H1'],
                ['seo_title', 'SEO Title'],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block text-sm">
                <span className="mb-1 block font-medium">{label}</span>
                <input
                  className="w-full rounded-xl border border-border-subtle bg-background px-3 py-2"
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                />
              </label>
            ))}
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1 block font-medium">Short description</span>
              <textarea
                className="w-full rounded-xl border border-border-subtle bg-background px-3 py-2"
                rows={2}
                value={form.short_description}
                onChange={(e) => setForm((f) => ({ ...f, short_description: e.target.value }))}
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1 block font-medium">SEO description</span>
              <textarea
                className="w-full rounded-xl border border-border-subtle bg-background px-3 py-2"
                rows={2}
                value={form.seo_description}
                onChange={(e) => setForm((f) => ({ ...f, seo_description: e.target.value }))}
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1 block font-medium">SEO intro</span>
              <textarea
                className="w-full rounded-xl border border-border-subtle bg-background px-3 py-2"
                rows={3}
                value={form.seo_intro}
                onChange={(e) => setForm((f) => ({ ...f, seo_intro: e.target.value }))}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Sort order</span>
              <input
                type="number"
                className="w-full rounded-xl border border-border-subtle bg-background px-3 py-2"
                value={form.sort_order}
                onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) || 0 }))}
              />
            </label>
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              />
              Active / published
            </label>
          </div>
          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
          {message ? <p className="mt-3 text-sm text-emerald-700">{message}</p> : null}
          <button
            type="button"
            disabled={pending}
            onClick={save}
            className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-[#0f2744] px-5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {pending ? 'Saving…' : 'Save industry'}
          </button>
        </div>
      ) : (
        <p className="text-sm text-text-muted">No industries found. Run the catalog migration first.</p>
      )}
    </div>
  );
}
