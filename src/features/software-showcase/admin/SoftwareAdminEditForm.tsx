'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/routes';
import type { SoftwareProject } from '../types';
import { updateSoftwareProjectAdmin } from './actions';

export function SoftwareAdminEditForm({ project }: { project: SoftwareProject }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="mx-auto max-w-2xl space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
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

      {project.cover_card_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.cover_card_url}
          alt=""
          className="h-40 w-full rounded-xl border border-border-subtle object-cover"
        />
      ) : null}

      <label className="block text-sm font-semibold">
        Title
        <input
          name="title"
          required
          defaultValue={project.title}
          className="mt-1 w-full rounded-xl border border-border-subtle bg-surface px-3 py-2.5 text-sm font-normal"
        />
      </label>

      <label className="block text-sm font-semibold">
        Short description
        <textarea
          name="short_description"
          rows={3}
          defaultValue={project.short_description ?? ''}
          className="mt-1 w-full rounded-xl border border-border-subtle bg-surface px-3 py-2.5 text-sm font-normal"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          Starting price (BDT)
          <input
            name="starting_price"
            type="number"
            min={0}
            required
            defaultValue={project.starting_price}
            className="mt-1 w-full rounded-xl border border-border-subtle bg-surface px-3 py-2.5 text-sm font-normal"
          />
        </label>
        <label className="block text-sm font-semibold">
          Price suffix
          <input
            name="price_suffix"
            defaultValue={project.price_suffix || '+'}
            className="mt-1 w-full rounded-xl border border-border-subtle bg-surface px-3 py-2.5 text-sm font-normal"
          />
        </label>
      </div>

      <label className="block text-sm font-semibold">
        Sort order
        <input
          name="sort_order"
          type="number"
          defaultValue={project.sort_order}
          className="mt-1 w-full rounded-xl border border-border-subtle bg-surface px-3 py-2.5 text-sm font-normal"
        />
      </label>

      <label className="block text-sm font-semibold">
        SEO title
        <input
          name="seo_title"
          defaultValue={project.seo_title ?? ''}
          className="mt-1 w-full rounded-xl border border-border-subtle bg-surface px-3 py-2.5 text-sm font-normal"
        />
      </label>

      <label className="block text-sm font-semibold">
        SEO description
        <textarea
          name="seo_description"
          rows={3}
          defaultValue={project.seo_description ?? ''}
          className="mt-1 w-full rounded-xl border border-border-subtle bg-surface px-3 py-2.5 text-sm font-normal"
        />
      </label>

      <label className="block text-sm font-semibold">
        SEO keywords (comma-separated)
        <input
          name="seo_keywords"
          defaultValue={(project.seo_keywords ?? []).join(', ')}
          className="mt-1 w-full rounded-xl border border-border-subtle bg-surface px-3 py-2.5 text-sm font-normal"
        />
      </label>

      <div className="flex flex-wrap gap-4 text-sm font-semibold">
        <label className="inline-flex items-center gap-2">
          <input name="featured" type="checkbox" defaultChecked={project.featured} />
          Featured
        </label>
        <label className="inline-flex items-center gap-2">
          <input name="popular" type="checkbox" defaultChecked={project.popular} />
          Popular
        </label>
        <label className="inline-flex items-center gap-2">
          <input name="published" type="checkbox" defaultChecked={project.published} />
          Published
        </label>
      </div>

      <p className="rounded-xl border border-dashed border-border-subtle px-3 py-2 text-xs text-text-muted">
        Cover &amp; screen assets: replace local files under{' '}
        <code>seed-assets/admin-systems/{project.slug}/</code> then run{' '}
        <code>npm run generate:admin-showcase-assets -- --slug={project.slug} --force</code> and{' '}
        <code>npm run seed:admin-showcase -- --force</code>.
      </p>

      {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
      {saved ? <p className="text-sm font-semibold text-emerald-700">Saved.</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#2563eb] px-5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  );
}
