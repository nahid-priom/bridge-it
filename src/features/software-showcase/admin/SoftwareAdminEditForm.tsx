'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/routes';
import type {
  ShowcaseCategory,
  ShowcaseChildCategory,
  ShowcaseMainCategory,
  SoftwareProductFeature,
  SoftwareProject,
  SoftwareProjectScreen,
} from '../types';
import { updateSoftwareProjectAdmin } from './actions';
import {
  deleteSoftwareScreen,
  moveSoftwareScreen,
  removeSoftwareCover,
  updateSoftwareScreenMeta,
  uploadSoftwareCover,
  uploadSoftwareScreen,
} from './screen-actions';

type FeatureDraft = {
  key: string;
  title: string;
  short_description: string;
  is_primary: boolean;
};

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 rounded-2xl border border-border-subtle bg-surface p-4 sm:p-5">
      <h2 className="font-display text-lg font-bold text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

export function SoftwareAdminEditForm({
  project,
  taxonomy,
  features,
  screens,
}: {
  project: SoftwareProject;
  taxonomy: {
    mains: ShowcaseMainCategory[];
    categories: ShowcaseCategory[];
    children: ShowcaseChildCategory[];
  };
  features: SoftwareProductFeature[];
  screens: SoftwareProjectScreen[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  const [mainId, setMainId] = useState(project.main_category_id ?? '');
  const [taxId, setTaxId] = useState(project.taxonomy_category_id ?? '');
  const [childId, setChildId] = useState(project.child_category_id ?? '');
  const [featureDrafts, setFeatureDrafts] = useState<FeatureDraft[]>(
    features.map((f) => ({
      key: f.id,
      title: f.title,
      short_description: f.short_description ?? '',
      is_primary: f.is_primary,
    }))
  );

  const filteredCategories = useMemo(
    () => taxonomy.categories.filter((c) => !mainId || c.main_category_id === mainId),
    [taxonomy.categories, mainId]
  );
  const filteredChildren = useMemo(
    () => taxonomy.children.filter((c) => !taxId || c.category_id === taxId),
    [taxonomy.children, taxId]
  );

  return (
    <form
      className="mx-auto max-w-3xl space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        formData.set(
          'features_json',
          JSON.stringify(
            featureDrafts.map((f, index) => ({
              title: f.title,
              short_description: f.short_description,
              is_primary: f.is_primary,
              sort_order: (index + 1) * 10,
            }))
          )
        );
        setError(null);
        setSaved(false);
        startTransition(async () => {
          const result = await updateSoftwareProjectAdmin(project.slug, formData);
          if (!result.ok) {
            setError(result.error);
            return;
          }
          setSaved(true);
          router.refresh();
        });
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Edit software</p>
          <h1 className="font-display text-2xl font-black">{project.title}</h1>
          <p className="text-sm text-text-muted">{project.slug}</p>
        </div>
        <Link href={ROUTES.adminSoftwareProjects} className="text-sm font-semibold text-[#2563eb] hover:underline">
          ← Back
        </Link>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {saved ? <p className="text-sm text-emerald-700">Saved</p> : null}

      <SectionCard title="Basic">
        <label className="block text-sm font-semibold">
          Title
          <input
            name="title"
            required
            defaultValue={project.title}
            className="mt-1 w-full rounded-xl border border-border-subtle bg-background px-3 py-2.5 text-sm font-normal"
          />
        </label>
        <label className="block text-sm font-semibold">
          Short description / outcome
          <textarea
            name="short_description"
            rows={3}
            defaultValue={project.short_description ?? ''}
            className="mt-1 w-full rounded-xl border border-border-subtle bg-background px-3 py-2.5 text-sm font-normal"
          />
        </label>
        <label className="block text-sm font-semibold">
          Feature summary
          <textarea
            name="feature_summary"
            rows={2}
            defaultValue={project.feature_summary ?? ''}
            className="mt-1 w-full rounded-xl border border-border-subtle bg-background px-3 py-2.5 text-sm font-normal"
          />
        </label>
      </SectionCard>

      <SectionCard title="Category">
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block text-sm font-semibold">
            Main
            <select
              name="main_category_id"
              value={mainId}
              onChange={(e) => {
                setMainId(e.target.value);
                setTaxId('');
                setChildId('');
              }}
              className="mt-1 w-full rounded-xl border border-border-subtle bg-background px-3 py-2.5 text-sm font-normal"
            >
              <option value="">—</option>
              {taxonomy.mains.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold">
            Category
            <select
              name="taxonomy_category_id"
              value={taxId}
              onChange={(e) => {
                setTaxId(e.target.value);
                setChildId('');
              }}
              className="mt-1 w-full rounded-xl border border-border-subtle bg-background px-3 py-2.5 text-sm font-normal"
            >
              <option value="">—</option>
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold">
            Child
            <select
              name="child_category_id"
              value={childId}
              onChange={(e) => setChildId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border-subtle bg-background px-3 py-2.5 text-sm font-normal"
            >
              <option value="">—</option>
              {filteredChildren.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </SectionCard>

      <SectionCard title="Features">
        <div className="space-y-3">
          {featureDrafts.map((feature, index) => (
            <div key={feature.key} className="grid gap-2 rounded-xl border border-border-subtle p-3 sm:grid-cols-[1fr_1fr_auto_auto]">
              <input
                value={feature.title}
                onChange={(e) => {
                  const next = [...featureDrafts];
                  next[index] = { ...feature, title: e.target.value };
                  setFeatureDrafts(next);
                }}
                placeholder="Feature title"
                className="rounded-lg border border-border-subtle px-2 py-2 text-sm"
              />
              <input
                value={feature.short_description}
                onChange={(e) => {
                  const next = [...featureDrafts];
                  next[index] = { ...feature, short_description: e.target.value };
                  setFeatureDrafts(next);
                }}
                placeholder="Short description"
                className="rounded-lg border border-border-subtle px-2 py-2 text-sm"
              />
              <label className="flex items-center gap-2 text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={feature.is_primary}
                  onChange={(e) => {
                    const next = [...featureDrafts];
                    next[index] = { ...feature, is_primary: e.target.checked };
                    setFeatureDrafts(next);
                  }}
                />
                Primary
              </label>
              <button
                type="button"
                className="text-xs font-semibold text-red-600"
                onClick={() => setFeatureDrafts(featureDrafts.filter((_, i) => i !== index))}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="rounded-xl border border-border-subtle px-3 py-2 text-sm font-semibold"
            onClick={() =>
              setFeatureDrafts([
                ...featureDrafts,
                { key: `new-${Date.now()}`, title: '', short_description: '', is_primary: featureDrafts.length < 3 },
              ])
            }
          >
            Add feature
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Cover">
        {project.cover_card_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.cover_card_url}
            alt=""
            className="mb-3 h-40 w-full rounded-xl border border-border-subtle object-cover"
          />
        ) : null}
        <div className="flex flex-wrap gap-2">
          <label className="inline-flex cursor-pointer rounded-xl border border-border-subtle px-3 py-2 text-sm font-semibold">
            Upload / replace
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const fd = new FormData();
                fd.set('file', file);
                startTransition(async () => {
                  const result = await uploadSoftwareCover(project.slug, fd);
                  if (!result.ok) setError(result.error);
                  else router.refresh();
                });
              }}
            />
          </label>
          {project.cover_card_url ? (
            <button
              type="button"
              className="rounded-xl border border-border-subtle px-3 py-2 text-sm font-semibold text-red-600"
              onClick={() => {
                startTransition(async () => {
                  const result = await removeSoftwareCover(project.slug);
                  if (!result.ok) setError(result.error);
                  else router.refresh();
                });
              }}
            >
              Remove cover
            </button>
          ) : null}
        </div>
      </SectionCard>

      <SectionCard title="Screens">
        <div className="mb-4 flex flex-wrap items-end gap-2">
          <label className="text-sm font-semibold">
            Upload screen
            <input
              type="file"
              accept="image/*"
              className="mt-1 block w-full text-sm"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const fd = new FormData();
                fd.set('file', file);
                fd.set('screen_name', file.name.replace(/\.[^.]+$/, ''));
                startTransition(async () => {
                  const result = await uploadSoftwareScreen(project.slug, fd);
                  if (!result.ok) setError(result.error);
                  else router.refresh();
                });
              }}
            />
          </label>
        </div>
        <ul className="space-y-3">
          {screens.map((screen) => (
            <li key={screen.id} className="grid gap-3 rounded-xl border border-border-subtle p-3 sm:grid-cols-[96px_1fr_auto]">
              {screen.thumbnail_url || screen.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={screen.thumbnail_url || screen.image_url || ''}
                  alt=""
                  className="h-16 w-24 rounded-lg object-cover object-top"
                />
              ) : (
                <div className="h-16 w-24 rounded-lg bg-background-soft" />
              )}
              <div className="space-y-2">
                <form
                  className="grid gap-2 sm:grid-cols-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    startTransition(async () => {
                      const result = await updateSoftwareScreenMeta(project.slug, screen.id, fd);
                      if (!result.ok) setError(result.error);
                      else router.refresh();
                    });
                  }}
                >
                  <input name="screen_name" defaultValue={screen.screen_name} className="rounded-lg border border-border-subtle px-2 py-1.5 text-sm" />
                  <input name="module_name" defaultValue={screen.module_name ?? ''} placeholder="Module" className="rounded-lg border border-border-subtle px-2 py-1.5 text-sm" />
                  <input name="short_caption" defaultValue={screen.short_caption ?? ''} placeholder="Caption" className="rounded-lg border border-border-subtle px-2 py-1.5 text-sm sm:col-span-2" />
                  <input type="hidden" name="sort_order" value={screen.sort_order} />
                  <label className="flex items-center gap-2 text-xs font-semibold">
                    <input type="checkbox" name="is_featured" defaultChecked={screen.is_featured} /> Featured
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold">
                    <input type="checkbox" name="published" defaultChecked={screen.published} /> Published
                  </label>
                  <button type="submit" className="rounded-lg bg-[#0f2744] px-3 py-1.5 text-xs font-semibold text-white sm:col-span-2">
                    Save screen
                  </button>
                </form>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  className="rounded-lg border border-border-subtle px-2 py-1 text-xs"
                  onClick={() => {
                    startTransition(async () => {
                      await moveSoftwareScreen(project.slug, screen.id, 'up');
                      router.refresh();
                    });
                  }}
                >
                  Up
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-border-subtle px-2 py-1 text-xs"
                  onClick={() => {
                    startTransition(async () => {
                      await moveSoftwareScreen(project.slug, screen.id, 'down');
                      router.refresh();
                    });
                  }}
                >
                  Down
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-border-subtle px-2 py-1 text-xs text-red-600"
                  onClick={() => {
                    startTransition(async () => {
                      await deleteSoftwareScreen(project.slug, screen.id);
                      router.refresh();
                    });
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="SEO">
        <label className="block text-sm font-semibold">
          SEO title
          <input
            name="seo_title"
            defaultValue={project.seo_title ?? ''}
            className="mt-1 w-full rounded-xl border border-border-subtle bg-background px-3 py-2.5 text-sm font-normal"
          />
        </label>
        <label className="block text-sm font-semibold">
          SEO description
          <textarea
            name="seo_description"
            rows={3}
            defaultValue={project.seo_description ?? ''}
            className="mt-1 w-full rounded-xl border border-border-subtle bg-background px-3 py-2.5 text-sm font-normal"
          />
        </label>
        <label className="block text-sm font-semibold">
          SEO keywords (comma-separated)
          <input
            name="seo_keywords"
            defaultValue={project.seo_keywords?.join(', ') ?? ''}
            className="mt-1 w-full rounded-xl border border-border-subtle bg-background px-3 py-2.5 text-sm font-normal"
          />
        </label>
      </SectionCard>

      <SectionCard title="Visibility / Internal">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold">
            Starting price (internal)
            <input
              name="starting_price"
              type="number"
              min={0}
              required
              defaultValue={project.starting_price}
              className="mt-1 w-full rounded-xl border border-border-subtle bg-background px-3 py-2.5 text-sm font-normal"
            />
          </label>
          <label className="block text-sm font-semibold">
            Price suffix
            <input
              name="price_suffix"
              defaultValue={project.price_suffix || '+'}
              className="mt-1 w-full rounded-xl border border-border-subtle bg-background px-3 py-2.5 text-sm font-normal"
            />
          </label>
        </div>
        <label className="block text-sm font-semibold">
          Sort order
          <input
            name="sort_order"
            type="number"
            defaultValue={project.sort_order}
            className="mt-1 w-full rounded-xl border border-border-subtle bg-background px-3 py-2.5 text-sm font-normal"
          />
        </label>
        <div className="flex flex-wrap gap-4 text-sm font-semibold">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="featured" defaultChecked={project.featured} /> Featured
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="popular" defaultChecked={project.popular} /> Popular
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="published" defaultChecked={project.published} /> Published
          </label>
        </div>
      </SectionCard>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-[#2563eb] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1d4ed8] disabled:opacity-50"
      >
        {pending ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  );
}
