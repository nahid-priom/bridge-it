'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/routes';
import type { ShowcaseCategory, ShowcaseChildCategory, ShowcaseMainCategory } from '../types';
import {
  setTaxonomyActive,
  upsertShowcaseCategory,
  upsertShowcaseChild,
  upsertShowcaseMain,
} from './taxonomy-actions';

type Tab = 'main' | 'category' | 'child';

export function ShowcaseTaxonomyAdmin({
  mains,
  categories,
  children,
}: {
  mains: ShowcaseMainCategory[];
  categories: ShowcaseCategory[];
  children: ShowcaseChildCategory[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('category');
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const refresh = () => router.refresh();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Admin</p>
          <h1 className="font-display text-2xl font-black">Showcase Taxonomy</h1>
        </div>
        <Link href={ROUTES.adminSoftwareProjects} className="text-sm font-semibold text-[#2563eb] hover:underline">
          ← Software projects
        </Link>
      </div>

      <div className="flex gap-2">
        {(['main', 'category', 'child'] as Tab[]).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={
              tab === id
                ? 'rounded-full bg-[#0f2744] px-3 py-1.5 text-xs font-semibold text-white'
                : 'rounded-full border border-border-subtle px-3 py-1.5 text-xs font-medium'
            }
          >
            {id === 'main' ? 'Main' : id === 'category' ? 'Category' : 'Child'}
          </button>
        ))}
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {tab === 'main' ? (
        <section className="space-y-4">
          <form
            className="grid gap-3 rounded-2xl border border-border-subtle p-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              fd.set('active', 'true');
              setError(null);
              startTransition(async () => {
                const result = await upsertShowcaseMain(fd);
                if (!result.ok) setError(result.error);
                else {
                  e.currentTarget.reset();
                  refresh();
                }
              });
            }}
          >
            <h2 className="sm:col-span-2 font-display text-lg font-bold">Add main category</h2>
            <input name="name" required placeholder="Name" className="rounded-xl border border-border-subtle px-3 py-2 text-sm" />
            <input name="slug" placeholder="slug" className="rounded-xl border border-border-subtle px-3 py-2 text-sm" />
            <input name="sort_order" type="number" defaultValue={0} className="rounded-xl border border-border-subtle px-3 py-2 text-sm" />
            <button type="submit" disabled={pending} className="rounded-xl bg-[#0f2744] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
              Create
            </button>
          </form>
          <ul className="space-y-2">
            {mains.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-3 rounded-xl border border-border-subtle px-4 py-3">
                <div>
                  <p className="font-semibold">{row.name}</p>
                  <p className="text-xs text-text-muted">{row.slug} · sort {row.sort_order}</p>
                </div>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => {
                    startTransition(async () => {
                      await setTaxonomyActive('showcase_main_categories', row.id, !row.active);
                      refresh();
                    });
                  }}
                  className="text-xs font-semibold"
                >
                  {row.active ? 'Deactivate' : 'Activate'}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {tab === 'category' ? (
        <section className="space-y-4">
          <form
            className="grid gap-3 rounded-2xl border border-border-subtle p-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              fd.set('active', 'true');
              setError(null);
              startTransition(async () => {
                const result = await upsertShowcaseCategory(fd);
                if (!result.ok) setError(result.error);
                else {
                  e.currentTarget.reset();
                  refresh();
                }
              });
            }}
          >
            <h2 className="sm:col-span-2 font-display text-lg font-bold">Add category</h2>
            <select name="main_category_id" required className="rounded-xl border border-border-subtle px-3 py-2 text-sm">
              <option value="">Main…</option>
              {mains.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <input name="name" required placeholder="Name" className="rounded-xl border border-border-subtle px-3 py-2 text-sm" />
            <input name="slug" placeholder="slug" className="rounded-xl border border-border-subtle px-3 py-2 text-sm" />
            <input name="sort_order" type="number" defaultValue={0} className="rounded-xl border border-border-subtle px-3 py-2 text-sm" />
            <button type="submit" disabled={pending} className="rounded-xl bg-[#0f2744] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 sm:col-span-2">
              Create
            </button>
          </form>
          <ul className="space-y-2">
            {categories.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-3 rounded-xl border border-border-subtle px-4 py-3">
                <div>
                  <p className="font-semibold">{row.name}</p>
                  <p className="text-xs text-text-muted">{row.slug} · sort {row.sort_order}</p>
                </div>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => {
                    startTransition(async () => {
                      await setTaxonomyActive('showcase_categories', row.id, !row.active);
                      refresh();
                    });
                  }}
                  className="text-xs font-semibold"
                >
                  {row.active ? 'Deactivate' : 'Activate'}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {tab === 'child' ? (
        <section className="space-y-4">
          <form
            className="grid gap-3 rounded-2xl border border-border-subtle p-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              fd.set('active', 'true');
              setError(null);
              startTransition(async () => {
                const result = await upsertShowcaseChild(fd);
                if (!result.ok) setError(result.error);
                else {
                  e.currentTarget.reset();
                  refresh();
                }
              });
            }}
          >
            <h2 className="sm:col-span-2 font-display text-lg font-bold">Add child category</h2>
            <select name="category_id" required className="rounded-xl border border-border-subtle px-3 py-2 text-sm sm:col-span-2">
              <option value="">Category…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <input name="name" required placeholder="Name" className="rounded-xl border border-border-subtle px-3 py-2 text-sm" />
            <input name="slug" placeholder="slug" className="rounded-xl border border-border-subtle px-3 py-2 text-sm" />
            <input name="sort_order" type="number" defaultValue={0} className="rounded-xl border border-border-subtle px-3 py-2 text-sm" />
            <button type="submit" disabled={pending} className="rounded-xl bg-[#0f2744] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
              Create
            </button>
          </form>
          <ul className="space-y-2">
            {children.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-3 rounded-xl border border-border-subtle px-4 py-3">
                <div>
                  <p className="font-semibold">{row.name}</p>
                  <p className="text-xs text-text-muted">{row.slug} · sort {row.sort_order}</p>
                </div>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => {
                    startTransition(async () => {
                      await setTaxonomyActive('showcase_child_categories', row.id, !row.active);
                      refresh();
                    });
                  }}
                  className="text-xs font-semibold"
                >
                  {row.active ? 'Deactivate' : 'Activate'}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
